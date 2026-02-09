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
from .ai_service_new import get_ai_analyzer


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
        
        # Create answers and prepare data for AI analysis
        answers_for_ai = []
        for answer_data in serializer.validated_data['answers']:
            try:
                question = SWOTQuestion.objects.get(id=answer_data['question_id'])
                SWOTAnswer.objects.create(
                    analysis=analysis,
                    question=question,
                    answer_text=answer_data['answer_text']
                )
                
                # Prepare data for AI
                answers_for_ai.append({
                    'category': question.category,
                    'question': question.question_text,
                    'answer': answer_data['answer_text']
                })
            except SWOTQuestion.DoesNotExist:
                continue
        
        # Trigger AI analysis
        try:
            ai_analyzer = get_ai_analyzer()
            ai_results = ai_analyzer.analyze_swot_answers(answers_for_ai)
            
            # Save AI results
            analysis.ai_analyzed = True
            analysis.personality_type = ai_results.get('personality_type', '')
            analysis.overall_score = ai_results.get('overall_score', 0)
            analysis.ai_summary = ai_results.get('summary', '')
            analysis.ai_results = ai_results
            analysis.save()
        except Exception as e:
            # Log error but don't fail the submission
            print(f"AI Analysis failed: {e}")
        
        return Response(
            SWOTAnalysisSerializer(analysis).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        """Manually trigger AI analysis for an existing SWOT analysis"""
        analysis = self.get_object()
        
        # Check permissions
        if request.user.role == 'student' and analysis.student != request.user:
            return Response(
                {'error': 'Not authorized'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Prepare answers for AI
        answers_for_ai = []
        for answer in analysis.answers.all():
            answers_for_ai.append({
                'category': answer.question.category,
                'question': answer.question.question_text,
                'answer': answer.answer_text
            })
        
        # Run AI analysis
        try:
            ai_analyzer = get_ai_analyzer()
            ai_results = ai_analyzer.analyze_swot_answers(answers_for_ai)
            
            # Save results
            analysis.ai_analyzed = True
            analysis.personality_type = ai_results.get('personality_type', '')
            analysis.overall_score = ai_results.get('overall_score', 0)
            analysis.ai_summary = ai_results.get('summary', '')
            analysis.ai_results = ai_results
            analysis.save()
            
            return Response(SWOTAnalysisSerializer(analysis).data)
        
        except Exception as e:
            return Response(
                {'error': f'AI Analysis failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
