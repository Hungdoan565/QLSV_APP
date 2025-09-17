from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from django.http import HttpResponse, JsonResponse
from .models import Grade
from .serializers import GradeSerializer, GradeCreateSerializer


class GradeListCreateView(generics.ListCreateAPIView):
    """List and create grades"""
    queryset = Grade.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return GradeCreateSerializer
        return GradeSerializer
    
    def get_queryset(self):
        queryset = Grade.objects.all()
        student_id = self.request.query_params.get('student_id', None)
        class_id = self.request.query_params.get('class_id', None)
        
        if student_id is not None:
            queryset = queryset.filter(student_id=student_id)
        if class_id is not None:
            queryset = queryset.filter(class_instance_id=class_id)
            
        return queryset.order_by('-date_graded')


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a grade"""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def grade_statistics(request):
    """Get grade statistics"""
    total_grades = Grade.objects.count()
    avg_score = Grade.objects.aggregate(avg_score=Avg('score'))['avg_score']
    
    return Response({
        'total_grades': total_grades,
        'average_score': round(avg_score, 2) if avg_score else 0,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_grades(request):
    """Export grades (placeholder - needs pandas)"""
    return Response({
        'success': False,
        'message': 'Excel export requires pandas. Please install: pip install pandas openpyxl'
    }, status=status.HTTP_501_NOT_IMPLEMENTED)
