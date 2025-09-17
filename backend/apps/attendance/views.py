from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from .models import Attendance, AttendanceSession
from .serializers import AttendanceSerializer, AttendanceSessionSerializer


class AttendanceListCreateView(generics.ListCreateAPIView):
    """List and create attendance records"""
    queryset = Attendance.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        queryset = Attendance.objects.all()
        session_id = self.request.query_params.get('session_id', None)
        student_id = self.request.query_params.get('student_id', None)
        
        if session_id is not None:
            queryset = queryset.filter(session_id=session_id)
        if student_id is not None:
            queryset = queryset.filter(student_id=student_id)
            
        return queryset.order_by('-created_at')


class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an attendance record"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]


class AttendanceSessionListCreateView(generics.ListCreateAPIView):
    """List and create attendance sessions"""
    queryset = AttendanceSession.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AttendanceSessionSerializer
    
    def get_queryset(self):
        queryset = AttendanceSession.objects.all()
        class_id = self.request.query_params.get('class_id', None)
        
        if class_id is not None:
            queryset = queryset.filter(class_instance_id=class_id)
            
        return queryset.order_by('-date', '-start_time')


class AttendanceSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an attendance session"""
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def attendance_statistics(request):
    """Get attendance statistics"""
    total_sessions = AttendanceSession.objects.count()
    total_attendances = Attendance.objects.count()
    present_count = Attendance.objects.filter(status='present').count()
    
    return Response({
        'total_sessions': total_sessions,
        'total_attendances': total_attendances,
        'present_count': present_count,
        'attendance_rate': round((present_count / total_attendances * 100), 2) if total_attendances > 0 else 0,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_attendance(request):
    """Export attendance (placeholder - needs pandas)"""
    return Response({
        'success': False,
        'message': 'Excel export requires pandas. Please install: pip install pandas openpyxl'
    }, status=status.HTTP_501_NOT_IMPLEMENTED)
