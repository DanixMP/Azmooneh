"""
Create sample SWOT analyses for testing
Run: python create_sample_swot.py
"""
import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User
from swot.models import SWOTQuestion, SWOTAnalysis, SWOTAnswer

print('Creating sample SWOT data...\n')

# Get or create students
students = []
for i in range(1, 4):
    student = User.objects.filter(student_id=f'40123456{i}').first()
    if not student:
        student = User.objects.create_user(
            username=f'student{i}',
            password='student123',
            role='student',
            student_id=f'40123456{i}',
            full_name=f'Student {i}'
        )
        print(f'✓ Created student: {student.full_name}')
    else:
        print(f'✓ Using existing student: {student.full_name}')
    students.append(student)

# Get or create SWOT questions
questions = {
    'strength': [],
    'weakness': [],
    'opportunity': [],
    'threat': []
}

# Create questions if they don't exist
if SWOTQuestion.objects.count() == 0:
    print('\n✓ Creating SWOT questions...')
    
    # Strength questions
    questions['strength'].append(SWOTQuestion.objects.create(
        question_text='مهارت‌های فنی و تخصصی شما چیست؟',
        category='strength',
        order=1
    ))
    questions['strength'].append(SWOTQuestion.objects.create(
        question_text='در چه زمینه‌هایی عملکرد خوبی دارید؟',
        category='strength',
        order=2
    ))
    
    # Weakness questions
    questions['weakness'].append(SWOTQuestion.objects.create(
        question_text='چه مهارت‌هایی نیاز به بهبود دارند؟',
        category='weakness',
        order=3
    ))
    questions['weakness'].append(SWOTQuestion.objects.create(
        question_text='چه چالش‌هایی در یادگیری دارید؟',
        category='weakness',
        order=4
    ))
    
    # Opportunity questions
    questions['opportunity'].append(SWOTQuestion.objects.create(
        question_text='چه فرصت‌های شغلی یا تحصیلی پیش رو دارید؟',
        category='opportunity',
        order=5
    ))
    questions['opportunity'].append(SWOTQuestion.objects.create(
        question_text='چه منابعی برای رشد در اختیار دارید؟',
        category='opportunity',
        order=6
    ))
    
    # Threat questions
    questions['threat'].append(SWOTQuestion.objects.create(
        question_text='چه موانعی ممکن است مانع پیشرفت شما شود؟',
        category='threat',
        order=7
    ))
    questions['threat'].append(SWOTQuestion.objects.create(
        question_text='چه رقبایی در مسیر شغلی خود دارید؟',
        category='threat',
        order=8
    ))
else:
    print('\n✓ Using existing SWOT questions')
    for category in questions.keys():
        questions[category] = list(SWOTQuestion.objects.filter(category=category))

# Sample answers for each student
sample_answers = [
    {
        'student': 0,
        'answers': {
            'strength': [
                'مهارت برنامه‌نویسی پایتون و جاوااسکریپت',
                'توانایی حل مسئله و تفکر منطقی'
            ],
            'weakness': [
                'نیاز به تقویت مهارت‌های کار تیمی',
                'مدیریت زمان در پروژه‌های بزرگ'
            ],
            'opportunity': [
                'دوره‌های آنلاین رایگان برای یادگیری',
                'پروژه‌های متن‌باز برای مشارکت'
            ],
            'threat': [
                'رقابت شدید در بازار کار',
                'تغییرات سریع تکنولوژی'
            ]
        }
    },
    {
        'student': 1,
        'answers': {
            'strength': [
                'مهارت طراحی UI/UX',
                'خلاقیت در حل مسائل'
            ],
            'weakness': [
                'دانش محدود در بک‌اند',
                'نیاز به تمرین بیشتر در الگوریتم‌ها'
            ],
            'opportunity': [
                'رشد بازار طراحی وب',
                'فرصت‌های فریلنسری'
            ],
            'threat': [
                'ابزارهای هوش مصنوعی برای طراحی',
                'کاهش بودجه پروژه‌ها'
            ]
        }
    },
    {
        'student': 2,
        'answers': {
            'strength': [
                'مهارت تحلیل داده',
                'دانش ریاضی قوی'
            ],
            'weakness': [
                'کمبود تجربه عملی',
                'مهارت ارائه و سخنرانی'
            ],
            'opportunity': [
                'تقاضای بالا برای تحلیلگران داده',
                'دسترسی به ابزارهای رایگان'
            ],
            'threat': [
                'نیاز به مدرک تخصصی',
                'رقابت با افراد باتجربه‌تر'
            ]
        }
    }
]

# Create analyses
print('\n✓ Creating SWOT analyses...')
for i, student_data in enumerate(sample_answers):
    student = students[student_data['student']]
    
    # Check if analysis already exists
    if SWOTAnalysis.objects.filter(student=student).exists():
        print(f'  - {student.full_name}: Already has analysis')
        continue
    
    # Create analysis
    analysis = SWOTAnalysis.objects.create(
        student=student,
        is_completed=True,
        completed_at=timezone.now()
    )
    
    # Create answers
    answer_count = 0
    for category, answers_list in student_data['answers'].items():
        category_questions = questions[category]
        for idx, answer_text in enumerate(answers_list):
            if idx < len(category_questions):
                SWOTAnswer.objects.create(
                    analysis=analysis,
                    question=category_questions[idx],
                    answer_text=answer_text
                )
                answer_count += 1
    
    print(f'  - {student.full_name}: Created with {answer_count} answers')

print('\n✅ Sample SWOT data created successfully!')
print(f'\nTotal SWOT analyses: {SWOTAnalysis.objects.count()}')
print(f'\nYou can now:')
print(f'1. Login as professor: username=prof_test, password=prof123')
print(f'2. Go to "تحلیل‌های SWOT" from the sidebar')
print(f'3. View student SWOT analyses')
