from django.contrib import admin
from .models import Exam, Question, Choice, StudentExam, Answer


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['title', 'professor', 'duration_minutes', 'total_marks', 'is_published', 'created_at']
    list_filter = ['is_published', 'created_at']
    search_fields = ['title', 'professor__username']
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['exam', 'question_type', 'marks', 'order']
    list_filter = ['question_type', 'exam']
    inlines = [ChoiceInline]


@admin.register(StudentExam)
class StudentExamAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'status', 'score', 'started_at', 'submitted_at']
    list_filter = ['status', 'exam']
    search_fields = ['student__username', 'exam__title']


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['student_exam', 'question', 'marks_obtained']
    list_filter = ['student_exam__exam']
