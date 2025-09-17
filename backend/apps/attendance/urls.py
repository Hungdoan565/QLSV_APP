from django.urls import path
from . import views

urlpatterns = [
    # Attendance sessions
    path('sessions/', views.AttendanceSessionListCreateView.as_view(), name='attendance_session_list_create'),
    path('sessions/<int:pk>/', views.AttendanceSessionDetailView.as_view(), name='attendance_session_detail'),
    
    # Attendance records
    path('', views.AttendanceListCreateView.as_view(), name='attendance_list_create'),
    path('<int:pk>/', views.AttendanceDetailView.as_view(), name='attendance_detail'),
    
    # Statistics and export
    path('statistics/', views.attendance_statistics, name='attendance_statistics'),

    path('export/', views.export_attendance, name='export_attendance'),
]
