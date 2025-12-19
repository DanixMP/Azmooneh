from django.urls import path
from . import views

urlpatterns = [
    path('student/signup/', views.student_signup, name='student_signup'),
    path('professor/login/', views.professor_login, name='professor_login'),
    path('me/', views.get_current_user, name='current_user'),
    path('student-count/', views.get_student_count, name='student_count'),
    path('students/', views.get_all_students, name='all_students'),
]
