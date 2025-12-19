"""
Create sample messages for testing
Run: python create_sample_messages.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User
from student_messages.models import Message

print('Creating sample messages...\n')

# Get professor
professor = User.objects.filter(role='professor').first()
if not professor:
    print('No professor found!')
    exit()

# Get students
students = User.objects.filter(role='student')[:3]
if not students:
    print('No students found!')
    exit()

# Sample messages
sample_messages = [
    {
        'student': students[0],
        'title': 'سوال درباره آزمون میان‌ترم',
        'message': 'سلام استاد، می‌خواستم بدانم آزمون میان‌ترم چه زمانی برگزار می‌شود؟ آیا امکان تمدید مهلت وجود دارد؟',
        'is_read': False,
    },
    {
        'student': students[1],
        'title': 'درخواست راهنمایی برای پروژه',
        'message': 'استاد محترم، در مورد پروژه پایانی نیاز به راهنمایی دارم. آیا امکان ملاقات حضوری وجود دارد؟',
        'is_read': False,
    },
    {
        'student': students[2],
        'title': 'مشکل در دسترسی به مطالب درس',
        'message': 'سلام، متاسفانه نمی‌توانم به برخی از فایل‌های درسی دسترسی پیدا کنم. لطفا راهنمایی بفرمایید.',
        'is_read': True,
    },
    {
        'student': students[0],
        'title': 'پرسش درباره نمرات',
        'message': 'استاد گرامی، می‌خواستم در مورد نمره آزمون قبلی سوال بپرسم. آیا امکان بازبینی وجود دارد؟',
        'is_read': True,
    },
    {
        'student': students[1],
        'title': 'درخواست تمدید مهلت تکلیف',
        'message': 'با سلام، به دلیل مشکلات شخصی، امکان تمدید مهلت تکلیف هفته جاری وجود دارد؟',
        'is_read': False,
    },
]

# Create messages
for msg_data in sample_messages:
    Message.objects.create(
        student=msg_data['student'],
        professor=professor,
        title=msg_data['title'],
        message=msg_data['message'],
        is_read=msg_data['is_read']
    )
    print(f'✓ Created message from {msg_data["student"].full_name}: {msg_data["title"]}')

print(f'\n✅ Created {len(sample_messages)} sample messages!')
print(f'\nUnread messages: {Message.objects.filter(is_read=False).count()}')
print(f'Total messages: {Message.objects.count()}')
