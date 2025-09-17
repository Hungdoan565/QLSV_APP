from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from apps.accounts.models import User
from apps.students.models import Student
from .models import Class, ClassStudent
from .serializers import (
    ClassSerializer, ClassCreateSerializer, ClassDetailSerializer, ClassStudentSerializer
)


class ClassListCreateView(generics.ListCreateAPIView):
    """List and create classes"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ClassCreateSerializer
        return ClassSerializer
    
    def get_queryset(self):
        queryset = Class.objects.all()
        
        # Filter by teacher if not admin
        if self.request.user.role != 'admin':
            queryset = queryset.filter(teacher=self.request.user)
        
        # Apply search filter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(class_id__icontains=search) |
                Q(class_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Apply active filter
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('class_id')
    
    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class ClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a class"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ClassDetailSerializer
        return ClassSerializer
    
    def get_queryset(self):
        queryset = Class.objects.all()
        
        # Filter by teacher if not admin
        if self.request.user.role != 'admin':
            queryset = queryset.filter(teacher=self.request.user)
        
        return queryset


class ClassStudentListCreateView(generics.ListCreateAPIView):
    """List and add students to a class"""
    serializer_class = ClassStudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        class_id = self.kwargs['class_id']
        return ClassStudent.objects.filter(class_obj_id=class_id, is_active=True)
    
    def perform_create(self, serializer):
        class_id = self.kwargs['class_id']
        try:
            class_obj = Class.objects.get(id=class_id)
            # Check if user has permission to add students to this class
            if self.request.user.role != 'admin' and class_obj.teacher != self.request.user:
                raise PermissionError("Bạn không có quyền thêm sinh viên vào lớp này")
            
            # Check if class is full
            if class_obj.is_full:
                raise ValueError("Lớp đã đầy")
            
            serializer.save(class_obj=class_obj)
        except Class.DoesNotExist:
            raise ValueError("Không tìm thấy lớp học")


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_student_from_class(request, class_id, student_id):
    """Remove a student from a class"""
    try:
        class_obj = Class.objects.get(id=class_id)
        
        # Check permission
        if request.user.role != 'admin' and class_obj.teacher != request.user:
            return Response(
                {'error': 'Bạn không có quyền xóa sinh viên khỏi lớp này'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        class_student = ClassStudent.objects.get(
            class_obj=class_obj,
            student__student_id=student_id,
            is_active=True
        )
        class_student.is_active = False
        class_student.save()
        
        return Response({'message': 'Đã xóa sinh viên khỏi lớp thành công'})
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)
    except ClassStudent.DoesNotExist:
        return Response({'error': 'Không tìm thấy sinh viên trong lớp'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def class_statistics(request):
    """Get class statistics"""
    queryset = Class.objects.all()
    
    # Filter by teacher if not admin
    if request.user.role != 'admin':
        queryset = queryset.filter(teacher=request.user)
    
    total_classes = queryset.count()
    active_classes = queryset.filter(is_active=True).count()
    
    # Get average students per class
    classes_with_students = queryset.filter(class_students__is_active=True).distinct()
    total_students_in_classes = sum(
        class_obj.current_students_count for class_obj in classes_with_students
    )
    avg_students_per_class = (
        total_students_in_classes / active_classes if active_classes > 0 else 0
    )
    
    return Response({
        'total_classes': total_classes,
        'active_classes': active_classes,
        'inactive_classes': total_classes - active_classes,
        'total_students_in_classes': total_students_in_classes,
        'avg_students_per_class': round(avg_students_per_class, 2),
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_students(request, class_id):
    """Get students not in the specified class"""
    try:
        class_obj = Class.objects.get(id=class_id)
        
        # Get students already in this class
        enrolled_student_ids = ClassStudent.objects.filter(
            class_obj=class_obj, is_active=True
        ).values_list('student_id', flat=True)
        
        # Get available students
        available_students = Student.objects.filter(
            is_active=True
        ).exclude(id__in=enrolled_student_ids)
        
        serializer = StudentSerializer(available_students, many=True)
        return Response(serializer.data)
        
    except Class.DoesNotExist:
        return Response({'error': 'Không tìm thấy lớp học'}, status=status.HTTP_404_NOT_FOUND)
