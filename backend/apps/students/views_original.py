from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from django.db.models import Q
# import pandas as pd  # Comment out for basic setup
# import io
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer, StudentBulkCreateSerializer


class StudentListCreateView(generics.ListCreateAPIView):
    """List and create students"""
    queryset = Student.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentSerializer
    
    def get_queryset(self):
        queryset = Student.objects.all()
        search = self.request.query_params.get('search', None)
        gender = self.request.query_params.get('gender', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if search:
            queryset = queryset.filter(
                Q(student_id__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        
        if gender:
            queryset = queryset.filter(gender=gender)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('student_id')


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a student"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def import_students_excel(request):
    """Import students from Excel file"""
    if 'file' not in request.FILES:
        return Response({'error': 'Không tìm thấy file'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    if not file.name.endswith(('.xlsx', '.xls')):
        return Response({'error': 'File phải có định dạng Excel'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Read Excel file
        df = pd.read_excel(file)
        
        # Validate required columns
        required_columns = ['student_id', 'first_name', 'last_name', 'email', 'gender', 'date_of_birth']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return Response({
                'error': f'Thiếu các cột bắt buộc: {", ".join(missing_columns)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Process data
        students_data = []
        errors = []
        
        for index, row in df.iterrows():
            try:
                student_data = {
                    'student_id': str(row['student_id']).strip(),
                    'first_name': str(row['first_name']).strip(),
                    'last_name': str(row['last_name']).strip(),
                    'email': str(row['email']).strip(),
                    'phone': str(row.get('phone', '')).strip() if pd.notna(row.get('phone')) else '',
                    'gender': str(row['gender']).strip().lower(),
                    'date_of_birth': pd.to_datetime(row['date_of_birth']).date(),
                    'address': str(row.get('address', '')).strip() if pd.notna(row.get('address')) else '',
                }
                
                # Validate student data
                serializer = StudentCreateSerializer(data=student_data)
                if serializer.is_valid():
                    students_data.append(serializer.validated_data)
                else:
                    errors.append(f"Dòng {index + 2}: {serializer.errors}")
                    
            except Exception as e:
                errors.append(f"Dòng {index + 2}: {str(e)}")
        
        if errors:
            return Response({
                'error': 'Có lỗi trong quá trình xử lý file',
                'details': errors[:10]  # Show first 10 errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create students
        created_students = []
        for student_data in students_data:
            student = Student.objects.create(**student_data)
            created_students.append(StudentSerializer(student).data)
        
        return Response({
            'message': f'Đã import thành công {len(created_students)} sinh viên',
            'students': created_students
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Lỗi khi xử lý file: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_students_excel(request):
    """Export students to Excel file"""
    queryset = Student.objects.all()
    
    # Apply filters
    search = request.query_params.get('search', None)
    gender = request.query_params.get('gender', None)
    is_active = request.query_params.get('is_active', None)
    
    if search:
        queryset = queryset.filter(
            Q(student_id__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(email__icontains=search)
        )
    
    if gender:
        queryset = queryset.filter(gender=gender)
    
    if is_active is not None:
        queryset = queryset.filter(is_active=is_active.lower() == 'true')
    
    # Prepare data
    data = []
    for student in queryset:
        data.append({
            'Mã sinh viên': student.student_id,
            'Họ': student.last_name,
            'Tên': student.first_name,
            'Email': student.email,
            'Số điện thoại': student.phone or '',
            'Giới tính': student.get_gender_display(),
            'Ngày sinh': student.date_of_birth.strftime('%d/%m/%Y'),
            'Địa chỉ': student.address or '',
            'Trạng thái': 'Hoạt động' if student.is_active else 'Không hoạt động',
        })
    
    # Create Excel file
    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Danh sách sinh viên', index=False)
    
    output.seek(0)
    response = HttpResponse(
        output.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="danh_sach_sinh_vien.xlsx"'
    
    return response


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def student_statistics(request):
    """Get student statistics"""
    total_students = Student.objects.count()
    active_students = Student.objects.filter(is_active=True).count()
    male_students = Student.objects.filter(gender='male').count()
    female_students = Student.objects.filter(gender='female').count()
    
    return Response({
        'total_students': total_students,
        'active_students': active_students,
        'inactive_students': total_students - active_students,
        'male_students': male_students,
        'female_students': female_students,
        'other_gender_students': total_students - male_students - female_students,
    })
