from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'exams', views.ExamViewSet, basename='exam')
router.register(r'student-exams', views.StudentExamViewSet, basename='student-exam')

urlpatterns = [
    path('', include(router.urls)),
]
