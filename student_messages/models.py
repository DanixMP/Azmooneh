from django.db import models
from accounts.models import User


class Message(models.Model):
    """Messages from students to professors"""
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sent_messages',
        limit_choices_to={'role': 'student'}
    )
    professor = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='received_messages',
        limit_choices_to={'role': 'professor'},
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.title}"
