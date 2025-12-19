#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.models import SWOTQuestion

# Get all SWOT questions
questions = SWOTQuestion.objects.filter(is_active=True)
print(f'✅ Found {questions.count()} active SWOT questions')

for q in questions[:3]:
    print(f'  - {q.category}: {q.question_text[:60]}...')
