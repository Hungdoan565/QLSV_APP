from django.urls import path
from . import views

urlpatterns = [
    # Grades
    path('', views.GradeListCreateView.as_view(), name='grade_list_create'),
    path('<int:pk>/', views.GradeDetailView.as_view(), name='grade_detail'),
    path('statistics/', views.grade_statistics, name='grade_statistics'),
    path('export/', views.export_grades, name='export_grades'),
]
