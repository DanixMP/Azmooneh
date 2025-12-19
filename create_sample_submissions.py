"""
Create sample exam with student submissions for testing
Run: python create_sample_submissions.py
"""
import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User
from exams.models import Exam, Question, Choice, StudentExam, Answer

print('Creating sample data...\n')

# Get or create professor
professor = User.objects.filter(role='professor').first()
if not professor:
    professor = User.objects.create_user(
        username='prof1',
        password='prof123',
        role='professor',
        full_name='Dr. Ahmad Rezaei'
    )
    print(f'✓ Created professor: {professor.username}')
else:
    print(f'✓ Using existing professor: {professor.username}')

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
        print(f'✓ Created student: {student.full_name} ({student.student_id})')
    else:
        print(f'✓ Using existing student: {student.full_name}')
    students.append(student)

# Create exam
exam = Exam.objects.create(
    title='Python Programming Basics',
    description='Test your knowledge of Python fundamentals',
    professor=professor,
    duration_minutes=60,
    is_published=True
)
print(f'\n✓ Created exam: {exam.title}')

# Single Choice Question
q1 = Question.objects.create(
    exam=exam,
    question_type='single_choice',
    question_text='What is the output of print(2 ** 3)?',
    marks=5,
    order=1
)
c1_1 = Choice.objects.create(question=q1, choice_text='6', is_correct=False)
c1_2 = Choice.objects.create(question=q1, choice_text='8', is_correct=True)
c1_3 = Choice.objects.create(question=q1, choice_text='9', is_correct=False)
c1_4 = Choice.objects.create(question=q1, choice_text='5', is_correct=False)

# Multiple Choice Question
q2 = Question.objects.create(
    exam=exam,
    question_type='multiple_choice',
    question_text='Which of the following are mutable data types in Python?',
    marks=10,
    order=2
)
c2_1 = Choice.objects.create(question=q2, choice_text='List', is_correct=True)
c2_2 = Choice.objects.create(question=q2, choice_text='Tuple', is_correct=False)
c2_3 = Choice.objects.create(question=q2, choice_text='Dictionary', is_correct=True)
c2_4 = Choice.objects.create(question=q2, choice_text='String', is_correct=False)

# True/False Question
q3 = Question.objects.create(
    exam=exam,
    question_type='true_false',
    question_text='Python is a compiled language.',
    marks=5,
    order=3
)
c3_1 = Choice.objects.create(question=q3, choice_text='True', is_correct=False)
c3_2 = Choice.objects.create(question=q3, choice_text='False', is_correct=True)

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

print(f'  - Questions: {exam.questions.count()}')
print(f'  - Total marks: {exam.total_marks}')

# Create student submissions
print('\n✓ Creating student submissions...')

# Student 1 - Completed with good answers
se1 = StudentExam.objects.create(
    student=students[0],
    exam=exam,
    status='submitted',
    started_at=timezone.now(),
    submitted_at=timezone.now(),
    score=30
)
# Correct answer for q1
a1_1 = Answer.objects.create(student_exam=se1, question=q1, marks_obtained=5)
a1_1.selected_choices.add(c1_2)
# Correct answer for q2
a1_2 = Answer.objects.create(student_exam=se1, question=q2, marks_obtained=10)
a1_2.selected_choices.add(c2_1, c2_3)
# Correct answer for q3
a1_3 = Answer.objects.create(student_exam=se1, question=q3, marks_obtained=5)
a1_3.selected_choices.add(c3_2)
# Long answer for q4
a1_4 = Answer.objects.create(
    student_exam=se1, 
    question=q4, 
    text_answer='Lists are mutable, meaning they can be modified after creation. Tuples are immutable and cannot be changed once created. Lists use square brackets [] while tuples use parentheses ().',
    marks_obtained=10
)
print(f'  - {students[0].full_name}: Submitted (Score: 30/35)')

# Student 2 - Completed with some wrong answers
se2 = StudentExam.objects.create(
    student=students[1],
    exam=exam,
    status='submitted',
    started_at=timezone.now(),
    submitted_at=timezone.now(),
    score=15
)
# Wrong answer for q1
a2_1 = Answer.objects.create(student_exam=se2, question=q1, marks_obtained=0)
a2_1.selected_choices.add(c1_1)
# Partially correct for q2 (only selected List, missed Dictionary)
a2_2 = Answer.objects.create(student_exam=se2, question=q2, marks_obtained=0)
a2_2.selected_choices.add(c2_1)
# Correct answer for q3
a2_3 = Answer.objects.create(student_exam=se2, question=q3, marks_obtained=5)
a2_3.selected_choices.add(c3_2)
# Long answer for q4 (needs grading)
a2_4 = Answer.objects.create(
    student_exam=se2, 
    question=q4, 
    text_answer='Lists can be changed but tuples cannot.',
    marks_obtained=10
)
print(f'  - {students[1].full_name}: Submitted (Score: 15/35)')

# Student 3 - In progress
se3 = StudentExam.objects.create(
    student=students[2],
    exam=exam,
    status='in_progress',
    started_at=timezone.now()
)
# Only answered q1
a3_1 = Answer.objects.create(student_exam=se3, question=q1)
a3_1.selected_choices.add(c1_2)
print(f'  - {students[2].full_name}: In Progress')

print('\n✅ Sample data created successfully!')
print(f'\nYou can now:')
print(f'1. Login as professor: username=prof1, password=prof123')
print(f'2. Go to "مدیریت آزمون‌ها" (Exams Management)')
print(f'3. Click the Users icon (👥) to view submissions')
print(f'4. Click "مشاهده پاسخ‌ها" to see student answers')
