# Exam and Test App - Django Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create test users:
```bash
python create_test_users.py
python create_sample_exam.py
```

4. Run server:
```bash
python manage.py runserver
```

## Features

### User Roles
- **Superuser**: Django admin access (dev only)
- **Professor**: Create and manage exams, grade submissions
- **Student**: Take exams, view results

### Question Types
1. **Single Choice**: One correct answer
2. **Multiple Choice**: Multiple correct answers
3. **True/False**: Boolean question
4. **Long Answer**: Text response (requires manual grading)

### Auto-Grading
- Single choice, multiple choice, and true/false questions are auto-graded
- Long answer questions require manual grading by professors

## Quick Start

### Test Users
- **Superuser**: admin / admin123
- **Professor**: prof_test / prof123
- **Student**: STU001 / student123

### Sample Exam
A sample "Python Programming Basics" exam is created with all question types.

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API reference.

### Quick Examples

**Student Signup:**
```bash
POST /api/auth/student/signup/
{"student_id": "STU002", "full_name": "Jane Doe", "password": "pass123"}
```

**Professor Login:**
```bash
POST /api/auth/professor/login/
{"username": "prof_test", "password": "prof123"}
```

**Create Exam:**
```bash
POST /api/exams/
Authorization: Bearer <professor_token>
```

**Start Exam:**
```bash
POST /api/student-exams/start_exam/
Authorization: Bearer <student_token>
{"exam_id": 1}
```

## Admin Panel

Access at http://localhost:8000/admin/
- Manage users, exams, questions, and submissions
- Grade long answer questions
- View all exam statistics
