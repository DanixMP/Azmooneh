from django.db import models
from django.conf import settings


class Exam(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    professor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exams')
    duration_minutes = models.IntegerField(help_text="Exam duration in minutes")
    total_marks = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


class Question(models.Model):
    QUESTION_TYPES = (
        ('multiple_choice', 'Multiple Choice'),
        ('single_choice', 'Single Choice'),
        ('true_false', 'True/False'),
        ('long_answer', 'Long Answer'),
    )
    
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    question_text = models.TextField()
    marks = models.DecimalField(max_digits=5, decimal_places=2)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.exam.title} - Q{self.order}"
    
    class Meta:
        ordering = ['order']


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    
    def __str__(self):
        return self.choice_text


class StudentExam(models.Model):
    STATUS_CHOICES = (
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
    )
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_exams')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='student_exams')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    started_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
    class Meta:
        unique_together = ['student', 'exam']
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.exam.title}"


class Answer(models.Model):
    student_exam = models.ForeignKey(StudentExam, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choices = models.ManyToManyField(Choice, blank=True)
    text_answer = models.TextField(blank=True)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    class Meta:
        unique_together = ['student_exam', 'question']
    
    def __str__(self):
        return f"{self.student_exam.student.username} - {self.question}"
