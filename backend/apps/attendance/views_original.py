from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count
from django.http import HttpResponse
import pandas as pd
import io
import qrcode
import uuid
from datetime import datetime, timedelta
from .models import AttendanceSession, Attendance, AttendanceSummary
from .serializers import (
    AttendanceSessionSerializer, AttendanceSessionCreateSerializer,
    AttendanceSerializer, AttendanceCreateSerializer, AttendanceBulkCreateSerializer,
    AttendanceSummarySerializer, QRCodeSerializer
)


class AttendanceSessionListCreateView(generics.ListCreateAPIView):
    """List and create attendance sessions"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AttendanceSessionCreateSerializer
        return AttendanceSessionSerializer
    
    def get_queryset(self):
        queryset = AttendanceSession.objects.all()
        
        # Filter by teacher if not admin
        if self.request.user.role != 'admin':
            queryset = queryset.filter(class_obj__teacher=self.request.user)
        
        # Apply filters
        class_id = self.request.query_params.get('class_id', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if class_id:
            queryset = queryset.filter(class_obj_id=class_id)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('-session_date', '-start_time')
    
    def perform_create(self, serializer):
        # Generate QR code
        qr_code = str(uuid.uuid4())
        serializer.save(qr_code=qr_code)


class AttendanceSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an attendance session"""
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    permission_classes = [permissions.IsAuthenticated]


class AttendanceListCreateView(generics.ListCreateAPIView):
    """List and create attendance records"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AttendanceCreateSerializer
        return AttendanceSerializer
    
    def get_queryset(self):
        queryset = Attendance.objects.all()
        
        # Filter by teacher if not admin
        if self.request.user.role != 'admin':
            queryset = queryset.filter(session__class_obj__teacher=self.request.user)
        
        # Apply filters
        session_id = self.request.query_params.get('session_id', None)
        student_id = self.request.query_params.get('student_id', None)
        status = self.request.query_params.get('status', None)
        
        if session_id:
            queryset = queryset.filter(session_id=session_id)
        if student_id:
            queryset = queryset.filter(student__student_id=student_id)
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset.order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_create_attendance(request):
    """Bulk create attendance records"""
    serializer = AttendanceBulkCreateSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        session_id = data['session_id']
        attendances_data = data['attendances']
        
        created_attendances = []
        errors = []
        
        for attendance_data in attendances_data:
            try:
                from apps.students.models import Student
                from apps.attendance.models import AttendanceSession
                
                student = Student.objects.get(student_id=attendance_data['student_id'])
                session = AttendanceSession.objects.get(id=session_id)
                
                # Check if attendance already exists
                if Attendance.objects.filter(
                    session=session, student=student
                ).exists():
                    errors.append(f"Điểm danh của sinh viên {attendance_data['student_id']} đã tồn tại")
                    continue
                
                attendance = Attendance.objects.create(
                    session=session,
                    student=student,
                    status=attendance_data['status'],
                    notes=attendance_data.get('notes', ''),
                    check_in_time=datetime.now() if attendance_data['status'] == 'present' else None
                )
                created_attendances.append(AttendanceSerializer(attendance).data)
                
            except Exception as e:
                errors.append(f"Lỗi khi tạo điểm danh cho sinh viên {attendance_data['student_id']}: {str(e)}")
        
        response_data = {
            'created_attendances': created_attendances,
            'created_count': len(created_attendances),
            'errors': errors
        }
        
        if errors:
            response_data['message'] = f"Đã tạo {len(created_attendances)} điểm danh, có {len(errors)} lỗi"
            return Response(response_data, status=status.HTTP_207_MULTI_STATUS)
        else:
            response_data['message'] = f"Đã tạo thành công {len(created_attendances)} điểm danh"
            return Response(response_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def generate_qr_code(request, session_id):
    """Generate QR code for attendance session"""
    try:
        session = AttendanceSession.objects.get(id=session_id)
        
        # Check permission
        if request.user.role != 'admin' and session.class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền tạo QR code cho buổi điểm danh này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate QR code if not exists
        if not session.qr_code:
            session.qr_code = str(uuid.uuid4())
            session.save()
        
        # Create QR code image
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(session.qr_code)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to BytesIO
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        response = HttpResponse(img_buffer.getvalue(), content_type='image/png')
        response['Content-Disposition'] = f'attachment; filename="qr_code_{session.session_name}.png"'
        
        return response
        
    except AttendanceSession.DoesNotExist:
        return Response({'error': 'Không tìm thấy buổi điểm danh'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def check_in_with_qr(request):
    """Check in using QR code"""
    qr_code = request.data.get('qr_code')
    student_id = request.data.get('student_id')
    
    if not qr_code or not student_id:
        return Response(
            {'error': 'QR code và mã sinh viên là bắt buộc'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        from apps.students.models import Student
        
        session = AttendanceSession.objects.get(qr_code=qr_code, is_active=True)
        student = Student.objects.get(student_id=student_id)
        
        # Check if student is in the class
        if not session.class_obj.students.filter(id=student.id, is_active=True).exists():
            return Response(
                {'error': 'Sinh viên không thuộc lớp này'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already attended
        attendance, created = Attendance.objects.get_or_create(
            session=session,
            student=student,
            defaults={
                'status': 'present',
                'check_in_time': datetime.now()
            }
        )
        
        if not created:
            if attendance.status == 'present':
                return Response(
                    {'error': 'Bạn đã điểm danh rồi'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Update existing attendance
                attendance.status = 'present'
                attendance.check_in_time = datetime.now()
                attendance.save()
        
        return Response({
            'message': 'Điểm danh thành công',
            'attendance': AttendanceSerializer(attendance).data
        })
        
    except AttendanceSession.DoesNotExist:
        return Response({'error': 'QR code không hợp lệ'}, status=status.HTTP_404_NOT_FOUND)
    except Student.DoesNotExist:
        return Response({'error': 'Mã sinh viên không tồn tại'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def attendance_summary(request, class_id):
    """Get attendance summary for a class"""
    try:
        from apps.classes.models import Class
        
        class_obj = Class.objects.get(id=class_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền xem điểm danh của lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get attendance summaries
        summaries = AttendanceSummary.objects.filter(
            class_obj=class_obj
        ).select_related('student')
        
        # Calculate statistics
        total_students = class_obj.students.filter(is_active=True).count()
        students_with_attendance = summaries.count()
        
        # Average attendance rate
        avg_attendance_rate = summaries.aggregate(
            avg=Count('attendance_rate')
        )['avg'] or 0
        
        # Prepare response
        summary_data = AttendanceSummarySerializer(summaries, many=True).data
        
        return Response({
            'class': {
                'id': class_obj.id,
                'class_id': class_obj.class_id,
                'class_name': class_obj.class_name
            },
            'statistics': {
                'total_students': total_students,
                'students_with_attendance': students_with_attendance,
                'avg_attendance_rate': round(avg_attendance_rate, 2)
            },
            'summaries': summary_data
        })
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def calculate_attendance_summary(request, class_id):
    """Calculate attendance summary for all students in a class"""
    try:
        from apps.classes.models import Class
        
        class_obj = Class.objects.get(id=class_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền tính điểm danh của lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get all students in the class
        students = class_obj.students.filter(is_active=True)
        
        updated_summaries = []
        
        for student in students:
            # Get all attendance records for this student in this class
            attendances = Attendance.objects.filter(
                student=student, session__class_obj=class_obj
            )
            
            # Count by status
            present_count = attendances.filter(status='present').count()
            absent_count = attendances.filter(status='absent').count()
            late_count = attendances.filter(status='late').count()
            excused_count = attendances.filter(status='excused').count()
            total_sessions = attendances.count()
            
            # Calculate attendance rate
            if total_sessions > 0:
                attendance_rate = round(((present_count + excused_count) / total_sessions) * 100, 2)
            else:
                attendance_rate = 0.00
            
            # Create or update attendance summary
            summary, created = AttendanceSummary.objects.update_or_create(
                student=student,
                class_obj=class_obj,
                defaults={
                    'total_sessions': total_sessions,
                    'present_count': present_count,
                    'absent_count': absent_count,
                    'late_count': late_count,
                    'excused_count': excused_count,
                    'attendance_rate': attendance_rate
                }
            )
            
            updated_summaries.append(AttendanceSummarySerializer(summary).data)
        
        return Response({
            'message': f'Đã tính điểm danh cho {len(updated_summaries)} sinh viên',
            'summaries': updated_summaries
        })
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_attendance_excel(request, class_id):
    """Export attendance to Excel file"""
    try:
        from apps.classes.models import Class
        
        class_obj = Class.objects.get(id=class_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền xuất điểm danh của lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get attendance summaries
        summaries = AttendanceSummary.objects.filter(
            class_obj=class_obj
        ).select_related('student')
        
        # Prepare data
        data = []
        for summary in summaries:
            data.append({
                'Mã sinh viên': summary.student.student_id,
                'Họ tên': summary.student.full_name,
                'Tổng buổi học': summary.total_sessions,
                'Có mặt': summary.present_count,
                'Vắng mặt': summary.absent_count,
                'Đi muộn': summary.late_count,
                'Có phép': summary.excused_count,
                'Tỷ lệ điểm danh (%)': summary.attendance_rate,
            })
        
        # Create Excel file
        df = pd.DataFrame(data)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Bảng điểm danh', index=False)
        
        output.seek(0)
        response = HttpResponse(
            output.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="bang_diem_danh_{class_obj.class_id}.xlsx"'
        
        return response
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)
