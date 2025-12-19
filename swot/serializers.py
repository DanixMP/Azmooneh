from rest_framework import serializers
from .models import SWOTQuestion, SWOTAnalysis, SWOTAnswer


class SWOTQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SWOTQuestion
        fields = ['id', 'question_text', 'category', 'order']


class SWOTAnswerSerializer(serializers.ModelSerializer):
    question = SWOTQuestionSerializer(read_only=True)
    question_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = SWOTAnswer
        fields = ['id', 'question', 'question_id', 'answer_text', 'created_at']


class SWOTAnalysisSerializer(serializers.ModelSerializer):
    answers = SWOTAnswerSerializer(many=True, read_only=True)
    student_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SWOTAnalysis
        fields = ['id', 'student', 'student_name', 'created_at', 'completed_at', 'is_completed', 'answers']
        read_only_fields = ['student', 'created_at', 'completed_at']
    
    def get_student_name(self, obj):
        """Get student name from full_name field or username"""
        if obj.student.full_name:
            return obj.student.full_name
        elif obj.student.first_name and obj.student.last_name:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return obj.student.username


class SWOTAnalysisCreateSerializer(serializers.Serializer):
    """Serializer for submitting complete SWOT analysis"""
    answers = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    
    def validate_answers(self, value):
        """Ensure all answers have question_id and answer_text"""
        for answer in value:
            if 'question_id' not in answer or 'answer_text' not in answer:
                raise serializers.ValidationError("Each answer must have question_id and answer_text")
        return value
