from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from django.http import HttpResponse
# import pandas as pd  # Comment out for basic setup
# import io
from .models import Subject, Grade, GradeSummary
from .serializers import (
    SubjectSerializer, SubjectCreateSerializer, GradeSerializer, 
    GradeCreateSerializer, GradeSummarySerializer, GradeBulkCreateSerializer
)


class SubjectListCreateView(generics.ListCreateAPIView):
    """List and create subjects"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubjectCreateSerializer
        return SubjectSerializer
    
    def get_queryset(self):
        queryset = Subject.objects.all()
        search = self.request.query_params.get('search', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if search:
            queryset = queryset.filter(
                Q(subject_id__icontains=search) |
                Q(subject_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('subject_id')


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a subject"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class GradeListCreateView(generics.ListCreateAPIView):
    """List and create grades"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return GradeCreateSerializer
        return GradeSerializer
    
    def get_queryset(self):
        queryset = Grade.objects.all()
        
        # Filter by teacher if not admin
        if self.request.user.role != 'admin':
            queryset = queryset.filter(class_obj__teacher=self.request.user)
        
        # Apply filters
        class_id = self.request.query_params.get('class_id', None)
        subject_id = self.request.query_params.get('subject_id', None)
        student_id = self.request.query_params.get('student_id', None)
        grade_type = self.request.query_params.get('grade_type', None)
        
        if class_id:
            queryset = queryset.filter(class_obj_id=class_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if student_id:
            queryset = queryset.filter(student__student_id=student_id)
        if grade_type:
            queryset = queryset.filter(grade_type=grade_type)
        
        return queryset.order_by('-created_at')


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a grade"""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_create_grades(request):
    """Bulk create grades"""
    serializer = GradeBulkCreateSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        class_id = data['class_id']
        subject_id = data['subject_id']
        grade_type = data['grade_type']
        grades_data = data['grades']
        
        created_grades = []
        errors = []
        
        for grade_data in grades_data:
            try:
                from apps.students.models import Student
                from apps.classes.models import Class
                from apps.grades.models import Subject
                
                student = Student.objects.get(student_id=grade_data['student_id'])
                class_obj = Class.objects.get(id=class_id)
                subject = Subject.objects.get(id=subject_id)
                
                # Check if grade already exists
                if Grade.objects.filter(
                    student=student, class_obj=class_obj, 
                    subject=subject, grade_type=grade_type
                ).exists():
                    errors.append(f"Điểm {grade_type} của sinh viên {grade_data['student_id']} đã tồn tại")
                    continue
                
                grade = Grade.objects.create(
                    student=student,
                    class_obj=class_obj,
                    subject=subject,
                    grade_type=grade_type,
                    score=grade_data['score'],
                    max_score=grade_data.get('max_score', 10.00),
                    comment=grade_data.get('comment', ''),
                    created_by=request.user
                )
                created_grades.append(GradeSerializer(grade).data)
                
            except Exception as e:
                errors.append(f"Lỗi khi tạo điểm cho sinh viên {grade_data['student_id']}: {str(e)}")
        
        response_data = {
            'created_grades': created_grades,
            'created_count': len(created_grades),
            'errors': errors
        }
        
        if errors:
            response_data['message'] = f"Đã tạo {len(created_grades)} điểm, có {len(errors)} lỗi"
            return Response(response_data, status=status.HTTP_207_MULTI_STATUS)
        else:
            response_data['message'] = f"Đã tạo thành công {len(created_grades)} điểm"
            return Response(response_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def grade_summary(request, class_id, subject_id):
    """Get grade summary for a class and subject"""
    try:
        from apps.classes.models import Class
        from apps.grades.models import Subject
        
        class_obj = Class.objects.get(id=class_id)
        subject = Subject.objects.get(id=subject_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền xem điểm của lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all students in the class
        students = class_obj.students.filter(is_active=True)
        
        # Get grade summaries
        summaries = GradeSummary.objects.filter(
            class_obj=class_obj, subject=subject
        ).select_related('student')
        
        # Calculate statistics
        total_students = students.count()
        students_with_grades = summaries.count()
        passed_students = summaries.filter(is_passed=True).count()
        
        # Average scores
        avg_final_grade = summaries.aggregate(
            avg=Avg('final_grade')
        )['avg'] or 0
        
        # Grade distribution
        grade_distribution = summaries.values('letter_grade').annotate(
            count=Count('letter_grade')
        ).order_by('letter_grade')
        
        # Prepare response
        summary_data = GradeSummarySerializer(summaries, many=True).data
        
        return Response({
            'class': {
                'id': class_obj.id,
                'class_id': class_obj.class_id,
                'class_name': class_obj.class_name
            },
            'subject': {
                'id': subject.id,
                'subject_id': subject.subject_id,
                'subject_name': subject.subject_name
            },
            'statistics': {
                'total_students': total_students,
                'students_with_grades': students_with_grades,
                'passed_students': passed_students,
                'failed_students': students_with_grades - passed_students,
                'pass_rate': round((passed_students / students_with_grades * 100) if students_with_grades > 0 else 0, 2),
                'avg_final_grade': round(float(avg_final_grade), 2)
            },
            'grade_distribution': list(grade_distribution),
            'summaries': summary_data
        })
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)
    except Subject.DoesNotExist:
        return Response({'error': 'Không tìm thấy môn học'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def calculate_final_grades(request, class_id, subject_id):
    """Calculate final grades for all students in a class and subject"""
    try:
        from apps.classes.models import Class
        from apps.grades.models import Subject
        
        class_obj = Class.objects.get(id=class_id)
        subject = Subject.objects.get(id=subject_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền tính điểm của lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all students in the class
        students = class_obj.students.filter(is_active=True)
        
        updated_summaries = []
        
        for student in students:
            # Get all grades for this student in this class and subject
            grades = Grade.objects.filter(
                student=student, class_obj=class_obj, subject=subject
            )
            
            # Calculate averages for each grade type
            midterm_avg = grades.filter(grade_type='midterm').aggregate(avg=Avg('score'))['avg']
            final_avg = grades.filter(grade_type='final').aggregate(avg=Avg('score'))['avg']
            assignment_avg = grades.filter(grade_type='assignment').aggregate(avg=Avg('score'))['avg']
            quiz_avg = grades.filter(grade_type='quiz').aggregate(avg=Avg('score'))['avg']
            
            # Calculate final grade (weighted average)
            # You can adjust these weights based on your requirements
            final_grade = 0
            if midterm_avg is not None:
                final_grade += midterm_avg * 0.3
            if final_avg is not None:
                final_grade += final_avg * 0.5
            if assignment_avg is not None:
                final_grade += assignment_avg * 0.1
            if quiz_avg is not None:
                final_grade += quiz_avg * 0.1
            
            # Determine letter grade and pass status
            letter_grade = 'F'
            is_passed = False
            
            if final_grade >= 8.5:
                letter_grade = 'A+'
                is_passed = True
            elif final_grade >= 8.0:
                letter_grade = 'A'
                is_passed = True
            elif final_grade >= 7.5:
                letter_grade = 'B+'
                is_passed = True
            elif final_grade >= 7.0:
                letter_grade = 'B'
                is_passed = True
            elif final_grade >= 6.5:
                letter_grade = 'C+'
                is_passed = True
            elif final_grade >= 6.0:
                letter_grade = 'C'
                is_passed = True
            elif final_grade >= 5.5:
                letter_grade = 'D+'
                is_passed = True
            elif final_grade >= 5.0:
                letter_grade = 'D'
                is_passed = True
            
            # Create or update grade summary
            summary, created = GradeSummary.objects.update_or_create(
                student=student,
                class_obj=class_obj,
                subject=subject,
                defaults={
                    'midterm_score': midterm_avg,
                    'final_score': final_avg,
                    'assignment_avg': assignment_avg,
                    'quiz_avg': quiz_avg,
                    'final_grade': round(final_grade, 2) if final_grade > 0 else None,
                    'letter_grade': letter_grade,
                    'is_passed': is_passed
                }
            )
            
            updated_summaries.append(GradeSummarySerializer(summary).data)
        
        return Response({
            'message': f'Đã tính điểm cho {len(updated_summaries)} sinh viên',
            'summaries': updated_summaries
        })
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)
    except Subject.DoesNotExist:
        return Response({'error': 'Không tìm thấy môn học'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_grades_excel(request, class_id, subject_id):
    """Export grades to Excel file"""
    try:
        from apps.classes.models import Class
        from apps.grades.models import Subject
        
        class_obj = Class.objects.get(id=class_id)
        subject = Subject.objects.get(id=subject_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền xuất điểm của lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get grade summaries
        summaries = GradeSummary.objects.filter(
            class_obj=class_obj, subject=subject
        ).select_related('student')
        
        # Prepare data
        data = []
        for summary in summaries:
            data.append({
                'Mã sinh viên': summary.student.student_id,
                'Họ tên': summary.student.full_name,
                'Điểm giữa kỳ': summary.midterm_score or '',
                'Điểm cuối kỳ': summary.final_score or '',
                'Điểm bài tập TB': summary.assignment_avg or '',
                'Điểm kiểm tra TB': summary.quiz_avg or '',
                'Điểm tổng kết': summary.final_grade or '',
                'Xếp loại': summary.letter_grade or '',
                'Kết quả': 'Đạt' if summary.is_passed else 'Không đạt',
            })
        
        # Create Excel file
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Bảng điểm', index=False)
        
        output.seek(0)
        response = HttpResponse(
            output.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="bang_diem_{class_obj.class_id}_{subject.subject_id}.xlsx"'
        
        return response
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)
    except Subject.DoesNotExist:
        return Response({'error': 'Không tìm thấy môn học'}, status=status.HTTP_404_NOT_FOUND)
