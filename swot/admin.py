from django.contrib import admin
from .models import SWOTQuestion, SWOTAnalysis, SWOTAnswer


@admin.register(SWOTQuestion)
class SWOTQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    ordering = ['order']


class SWOTAnswerInline(admin.TabularInline):
    model = SWOTAnswer
    extra = 0
    readonly_fields = ['question', 'answer_text', 'created_at']


@admin.register(SWOTAnalysis)
class SWOTAnalysisAdmin(admin.ModelAdmin):
    list_display = ['student', 'created_at', 'is_completed']
    list_filter = ['is_completed', 'created_at']
    search_fields = ['student__username', 'student__full_name']
    inlines = [SWOTAnswerInline]
    readonly_fields = ['created_at', 'completed_at']
