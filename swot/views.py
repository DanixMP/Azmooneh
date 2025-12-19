from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import SWOTQuestion, SWOTAnalysis, SWOTAnswer
from .serializers import (
    SWOTQuestionSerializer,
    SWOTAnalysisSerializer,
    SWOTAnalysisCreateSerializer
)


class SWOTQuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """Get all active SWOT questions"""
    queryset = SWOTQuestion.objects.filter(is_active=True)
    serializer_class = SWOTQuestionSerializer
    permission_classes = [IsAuthenticated]


class SWOTAnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = SWOTAnalysisSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return SWOTAnalysis.objects.filter(student=user)
        elif user.role == 'professor':
            # Professors can see all analyses
            return SWOTAnalysis.objects.all()
        return SWOTAnalysis.objects.none()
    
    @action(detail=False, methods=['post'])
    def submit(self, request):
        """Submit a complete SWOT analysis"""
        serializer = SWOTAnalysisCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create analysis
        analysis = SWOTAnalysis.objects.create(
            student=request.user,
            is_completed=True,
            completed_at=timezone.now()
        )
        
        # Create answers
        for answer_data in serializer.validated_data['answers']:
            try:
                question = SWOTQuestion.objects.get(id=answer_data['question_id'])
                SWOTAnswer.objects.create(
                    analysis=analysis,
                    question=question,
                    answer_text=answer_data['answer_text']
                )
            except SWOTQuestion.DoesNotExist:
                continue
        
        return Response(
            SWOTAnalysisSerializer(analysis).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def my_analyses(self, request):
        """Get current student's SWOT analyses"""
        analyses = SWOTAnalysis.objects.filter(
            student=request.user,
            is_completed=True
        )
        serializer = self.get_serializer(analyses, many=True)
        return Response(serializer.data)
