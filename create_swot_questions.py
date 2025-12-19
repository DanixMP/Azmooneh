#!/usr/bin/env python
"""Create SWOT questions for the application"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.models import SWOTQuestion

# Create SWOT questions
questions = [
    # Strengths
    {'category': 'strength', 'question_text': 'What are your strongest academic subjects?'},
    {'category': 'strength', 'question_text': 'What skills do you excel at?'},
    {'category': 'strength', 'question_text': 'What positive feedback have you received from teachers?'},
    
    # Weaknesses
    {'category': 'weakness', 'question_text': 'Which subjects do you find most challenging?'},
    {'category': 'weakness', 'question_text': 'What areas need improvement in your studies?'},
    {'category': 'weakness', 'question_text': 'What study habits would you like to change?'},
    
    # Opportunities
    {'category': 'opportunity', 'question_text': 'What resources are available to help you improve?'},
    {'category': 'opportunity', 'question_text': 'What new learning opportunities interest you?'},
    {'category': 'opportunity', 'question_text': 'How can you leverage your strengths for better results?'},
    
    # Threats
    {'category': 'threat', 'question_text': 'What obstacles might prevent you from achieving your goals?'},
    {'category': 'threat', 'question_text': 'What external factors affect your academic performance?'},
    {'category': 'threat', 'question_text': 'What distractions do you need to manage?'},
]

for q in questions:
    SWOTQuestion.objects.get_or_create(
        category=q['category'],
        question_text=q['question_text']
    )

print(f'✅ Created {SWOTQuestion.objects.count()} SWOT questions')
for cat in ['strength', 'weakness', 'opportunity', 'threat']:
    count = SWOTQuestion.objects.filter(category=cat).count()
    print(f'  {cat.capitalize()}: {count} questions')
