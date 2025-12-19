from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Exam, Question, StudentExam, Answer
from .serializers import (
    ExamSerializer, ExamCreateSerializer, QuestionSerializer,
    StudentExamSerializer, StudentExamDetailSerializer, AnswerSerializer
)


class ExamViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'professor':
            return Exam.objects.filter(professor=user).prefetch_related('questions__choices')
        elif user.role == 'student':
            return Exam.objects.filter(is_published=True).prefetch_related('questions__choices')
        return Exam.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ExamCreateSerializer
        return ExamSerializer
    
    def get_serializer_context(self):
        """Pass request context to serializers"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_create(self, serializer):
        if self.request.user.role != 'professor':
            raise PermissionError("Only professors can create exams")
        serializer.save(professor=self.request.user)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        exam = self.get_object()
        if exam.professor != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        exam.is_published = True
        exam.save()
        return Response({'status': 'Exam published'})
    
    @action(detail=True, methods=['post'])
    def unpublish(self, request, pk=None):
        exam = self.get_object()
        if exam.professor != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        exam.is_published = False
        exam.save()
        return Response({'status': 'Exam unpublished'})


class StudentExamViewSet(viewsets.ModelViewSet):
    serializer_class = StudentExamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return StudentExam.objects.filter(student=user).select_related('exam', 'student').prefetch_related('answers__selected_choices')
        elif user.role == 'professor':
            return StudentExam.objects.filter(exam__professor=user).select_related('exam', 'student').prefetch_related('answers__selected_choices', 'answers__question')
        return StudentExam.objects.none()
    
    def get_serializer_class(self):
        """Use detailed serializer for retrieve action (professors viewing submissions)"""
        if self.action == 'retrieve' and self.request.user.role == 'professor':
            return StudentExamDetailSerializer
        return StudentExamSerializer
    
    def get_serializer_context(self):
        """Pass request context to serializers"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def partial_update(self, request, *args, **kwargs):
        """Allow professors to update marks for answers"""
        student_exam = self.get_object()
        
        # Only professors can update marks
        if request.user.role != 'professor' or student_exam.exam.professor != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        # Update answer marks if provided
        answers_data = request.data.get('answers', [])
        for answer_data in answers_data:
            answer_id = answer_data.get('id')
            marks = answer_data.get('marks_obtained')
            
            try:
                answer = Answer.objects.get(id=answer_id, student_exam=student_exam)
                answer.marks_obtained = marks
                answer.save()
            except Answer.DoesNotExist:
                continue
        
        # Recalculate total score
        total_score = sum(
            answer.marks_obtained or 0 
            for answer in student_exam.answers.all()
        )
        student_exam.score = total_score
        student_exam.status = 'graded'
        student_exam.save()
        
        serializer = self.get_serializer(student_exam)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def start_exam(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can start exams'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        exam_id = request.data.get('exam_id')
        try:
            exam = Exam.objects.get(id=exam_id, is_published=True)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)
        
        student_exam, created = StudentExam.objects.get_or_create(
            student=request.user,
            exam=exam,
            defaults={'status': 'in_progress', 'started_at': timezone.now()}
        )
        
        if not created and student_exam.status == 'submitted':
            return Response({'error': 'Exam already submitted'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(student_exam)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        student_exam = self.get_object()
        
        if student_exam.student != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        if student_exam.status == 'submitted':
            return Response({'error': 'Exam already submitted'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        question_id = request.data.get('question_id')
        selected_choices = request.data.get('selected_choices', [])
        text_answer = request.data.get('text_answer', '')
        
        try:
            question = Question.objects.get(id=question_id, exam=student_exam.exam)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        
        answer, created = Answer.objects.get_or_create(
            student_exam=student_exam,
            question=question
        )
        
        answer.text_answer = text_answer
        answer.selected_choices.set(selected_choices)
        answer.save()
        
        return Response({'status': 'Answer saved'})
    
    @action(detail=True, methods=['post'])
    def submit_exam(self, request, pk=None):
        student_exam = self.get_object()
        
        if student_exam.student != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        if student_exam.status == 'submitted':
            return Response({'error': 'Exam already submitted'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        student_exam.status = 'submitted'
        student_exam.submitted_at = timezone.now()
        student_exam.save()
        
        # Auto-grade objective questions
        self._auto_grade(student_exam)
        
        return Response({'status': 'Exam submitted', 'score': student_exam.score})
    
    def _auto_grade(self, student_exam):
        total_score = 0
        
        for answer in student_exam.answers.all():
            question = answer.question
            
            if question.question_type in ['single_choice', 'true_false']:
                correct_choice = question.choices.filter(is_correct=True).first()
                selected = answer.selected_choices.first()
                
                if selected and selected == correct_choice:
                    answer.marks_obtained = question.marks
                else:
                    answer.marks_obtained = 0
                answer.save()
                total_score += answer.marks_obtained
            
            elif question.question_type == 'multiple_choice':
                correct_choices = set(question.choices.filter(is_correct=True))
                selected_choices = set(answer.selected_choices.all())
                
                if correct_choices == selected_choices:
                    answer.marks_obtained = question.marks
                else:
                    answer.marks_obtained = 0
                answer.save()
                total_score += answer.marks_obtained
        
        student_exam.score = total_score
        student_exam.status = 'graded'
        student_exam.save()
