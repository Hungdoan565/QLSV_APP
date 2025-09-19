from django.urls import path
from . import views

urlpatterns = [
    # Grades
    path('', views.GradeListCreateView.as_view(), name='grade_list_create'),
    path('<int:pk>/', views.GradeDetailView.as_view(), name='grade_detail'),
    
    # Grade calculations and summaries
    path('statistics/', views.grade_statistics, name='grade_statistics'),
    path('student/<str:student_id>/summary/', views.student_grade_summary, name='student_grade_summary'),
    path('class/<int:class_id>/summary/', views.class_grade_summary, name='class_grade_summary'),
    
    # Export - Commented out until function is implemented
    # path('export/', views.export_grades, name='export_grades'),
]
