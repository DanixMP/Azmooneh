from django.db import models
from accounts.models import User


class SWOTQuestion(models.Model):
    """Predefined SWOT questions"""
    CATEGORY_CHOICES = [
        ('strength', 'نقاط قوت'),
        ('weakness', 'نقاط ضعف'),
        ('opportunity', 'فرصت‌ها'),
        ('threat', 'تهدیدها'),
    ]
    
    question_text = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.get_category_display()} - {self.question_text[:50]}"


class SWOTAnalysis(models.Model):
    """A student's SWOT analysis session"""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='swot_analyses')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'SWOT Analyses'
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.created_at.strftime('%Y-%m-%d')}"


class SWOTAnswer(models.Model):
    """Individual answer to a SWOT question"""
    analysis = models.ForeignKey(SWOTAnalysis, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(SWOTQuestion, on_delete=models.CASCADE)
    answer_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['question__order']
    
    def __str__(self):
        return f"{self.analysis.student.get_full_name()} - {self.question.category}"
