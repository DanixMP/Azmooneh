from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'student', 'student_name', 'professor', 'title', 'message', 'is_read', 'created_at', 'time_ago']
        read_only_fields = ['student', 'created_at']
    
    def get_student_name(self, obj):
        """Get student name"""
        if obj.student.full_name:
            return obj.student.full_name
        elif obj.student.first_name and obj.student.last_name:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return obj.student.username
    
    def get_time_ago(self, obj):
        """Calculate time ago in Persian"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(minutes=1):
            return 'همین الان'
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f'{minutes} دقیقه پیش'
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f'{hours} ساعت پیش'
        elif diff < timedelta(days=7):
            days = diff.days
            return f'{days} روز پیش'
        elif diff < timedelta(days=30):
            weeks = diff.days // 7
            return f'{weeks} هفته پیش'
        else:
            months = diff.days // 30
            return f'{months} ماه پیش'


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['title', 'message', 'professor']
