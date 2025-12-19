#!/usr/bin/env python
"""Create SWOT questions for the application"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from swot.models import SWOTQuestion

# Create SWOT questions (Persian)
questions = [
    # نقاط قوت (Strengths)
    {'category': 'strength', 'question_text': 'نقاط قوت شما چیست؟ توانایی‌ها یا مهارت‌هایی که شما را از دیگران متمایز می‌کند؟'},
    {'category': 'strength', 'question_text': 'چه مهارت‌های برجسته‌ای دارید؟'},
    {'category': 'strength', 'question_text': 'نظر دیگران درباره نقاط قوت شما چیست؟'},
    
    # نقاط ضعف (Weaknesses)
    {'category': 'weakness', 'question_text': 'نقاط ضعف یا محدودیت‌های خود را لیست کنید.'},
    {'category': 'weakness', 'question_text': 'آیا عادات نامطلوبی دارید؟ اگر بله، کدام‌ها؟'},
    {'category': 'weakness', 'question_text': 'نظر دیگران درباره نقاط ضعف شما چیست؟'},
    
    # فرصت‌ها (Opportunities)
    {'category': 'opportunity', 'question_text': 'چه فرصت‌هایی در محیط یا اطراف شما وجود دارد که می‌توانید از آن‌ها برای رشد استفاده کنید؟'},
    {'category': 'opportunity', 'question_text': 'چه مهارت‌های جدیدی می‌توانید یاد بگیرید تا مزیت رقابتی پیدا کنید؟'},
    
    # تهدیدها (Threats)
    {'category': 'threat', 'question_text': 'چه تهدیدهایی ممکن است مانع پیشرفت شما شوند؟'},
    {'category': 'threat', 'question_text': 'آیا ویژگی‌های شخصی شما ممکن است رسیدن به اهداف را محدود کنند؟'},
    {'category': 'threat', 'question_text': 'چه موانع خارجی (مثل رقابت یا تغییرات تکنولوژی) ممکن است شما را تهدید کنند؟'},
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
