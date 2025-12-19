"""
Create a sample exam for testing
Run: python create_sample_exam.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User
from exams.models import Exam, Question, Choice

# Get professor
professor = User.objects.filter(role='professor').first()
if not professor:
    print('No professor found. Run create_test_users.py first.')
    exit()

# Create exam
exam = Exam.objects.create(
    title='Python Programming Basics',
    description='Test your knowledge of Python fundamentals',
    professor=professor,
    duration_minutes=60,
    is_published=True
)

# Single Choice Question
q1 = Question.objects.create(
    exam=exam,
    question_type='single_choice',
    question_text='What is the output of print(2 ** 3)?',
    marks=5,
    order=1
)
Choice.objects.create(question=q1, choice_text='6', is_correct=False)
Choice.objects.create(question=q1, choice_text='8', is_correct=True)
Choice.objects.create(question=q1, choice_text='9', is_correct=False)
Choice.objects.create(question=q1, choice_text='5', is_correct=False)

# Multiple Choice Question
q2 = Question.objects.create(
    exam=exam,
    question_type='multiple_choice',
    question_text='Which of the following are mutable data types in Python?',
    marks=10,
    order=2
)
Choice.objects.create(question=q2, choice_text='List', is_correct=True)
Choice.objects.create(question=q2, choice_text='Tuple', is_correct=False)
Choice.objects.create(question=q2, choice_text='Dictionary', is_correct=True)
Choice.objects.create(question=q2, choice_text='String', is_correct=False)

# True/False Question
q3 = Question.objects.create(
    exam=exam,
    question_type='true_false',
    question_text='Python is a compiled language.',
    marks=5,
    order=3
)
Choice.objects.create(question=q3, choice_text='True', is_correct=False)
Choice.objects.create(question=q3, choice_text='False', is_correct=True)

# Long Answer Question
q4 = Question.objects.create(
    exam=exam,
    question_type='long_answer',
    question_text='Explain the difference between a list and a tuple in Python.',
    marks=15,
    order=4
)

# Update total marks
exam.total_marks = 35
exam.save()

print(f'✓ Sample exam created: {exam.title}')
print(f'  - Total marks: {exam.total_marks}')
print(f'  - Questions: {exam.questions.count()}')
print(f'  - Duration: {exam.duration_minutes} minutes')
