from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SWOTQuestionViewSet, SWOTAnalysisViewSet

router = DefaultRouter()
router.register(r'questions', SWOTQuestionViewSet, basename='swot-questions')
router.register(r'analyses', SWOTAnalysisViewSet, basename='swot-analyses')

urlpatterns = [
    path('', include(router.urls)),
]
