from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('superuser', 'Superuser'),
        ('professor', 'Professor'),
        ('student', 'Student'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    # Student-specific fields (for signup)
    student_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    class Meta:
        db_table = 'users'
