#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.models import SWOTQuestion

# Delete all existing questions
count = SWOTQuestion.objects.count()
SWOTQuestion.objects.all().delete()
print(f'✅ Deleted {count} old SWOT questions')
