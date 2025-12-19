from rest_framework import serializers
from .models import Exam, Question, Choice, StudentExam, Answer


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'choice_text', 'is_correct']
        
    def to_representation(self, instance):
        """Show is_correct only to professors"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # Hide is_correct from students
            if request.user.role == 'student':
                data.pop('is_correct', None)
        return data


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, required=False)
    
    class Meta:
        model = Question
        fields = ['id', 'question_type', 'question_text', 'marks', 'order', 'choices']
    
    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        question = Question.objects.create(**validated_data)
        
        for choice_data in choices_data:
            Choice.objects.create(question=question, **choice_data)
        
        return question


class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    professor_name = serializers.CharField(source='professor.username', read_only=True)
    
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'professor', 'professor_name', 
                  'duration_minutes', 'total_marks', 'is_published', 
                  'created_at', 'updated_at', 'questions']
        read_only_fields = ['professor', 'created_at', 'updated_at']


class ExamCreateSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    
    class Meta:
        model = Exam
        fields = ['title', 'description', 'duration_minutes', 'is_published', 'questions']
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        exam = Exam.objects.create(**validated_data)
        
        total_marks = 0
        for idx, question_data in enumerate(questions_data):
            choices_data = question_data.pop('choices', [])
            question = Question.objects.create(
                exam=exam,
                order=idx + 1,
                **question_data
            )
            total_marks += question.marks
            
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        
        exam.total_marks = total_marks
        exam.save()
        
        return exam


class AnswerSerializer(serializers.ModelSerializer):
    selected_choices = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Choice.objects.all(),
        required=False
    )
    
    class Meta:
        model = Answer
        fields = ['id', 'question', 'selected_choices', 'text_answer', 'marks_obtained']


class StudentExamSerializer(serializers.ModelSerializer):
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudentExam
        fields = ['id', 'student', 'student_name', 'exam', 'exam_title', 
                  'status', 'started_at', 'submitted_at', 'score', 'answers']
        read_only_fields = ['student', 'started_at', 'submitted_at', 'score']


class StudentExamDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for professors to view student submissions"""
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudentExam
        fields = ['id', 'student', 'student_name', 'exam', 'exam_title', 
                  'status', 'started_at', 'submitted_at', 'score', 'answers']
        read_only_fields = ['student', 'started_at', 'submitted_at']
