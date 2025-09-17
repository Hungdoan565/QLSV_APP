from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer


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
        if search is not None:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(student_id__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a student"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_create_students(request):
    """Bulk create students (simplified version without Excel import)"""
    try:
        students_data = request.data.get('students', [])
        created_students = []
        errors = []
        
        for student_data in students_data:
            serializer = StudentCreateSerializer(data=student_data)
            if serializer.is_valid():
                student = serializer.save()
                created_students.append(StudentSerializer(student).data)
            else:
                errors.append(serializer.errors)
        
        return Response({
            'success': True,
            'created_count': len(created_students),
            'created_students': created_students,
            'errors': errors
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def import_excel(request):
    """Import students from Excel (placeholder - needs pandas)"""
    return Response({
        'success': False,
        'message': 'Excel import requires pandas. Please install: pip install pandas openpyxl'
    }, status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_excel(request):
    """Export students to Excel (placeholder - needs pandas)"""
    return Response({
        'success': False,
        'message': 'Excel export requires pandas. Please install: pip install pandas openpyxl'
    }, status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def student_statistics(request):
    """Get student statistics"""
    total_students = Student.objects.count()
    active_students = Student.objects.filter(is_active=True).count()
    inactive_students = Student.objects.filter(is_active=False).count()
    
    return Response({
        'total_students': total_students,
        'active_students': active_students,
        'inactive_students': inactive_students,
    })
