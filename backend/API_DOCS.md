# Exam API Documentation

## Authentication
All endpoints require JWT authentication except login/signup.
Include token in header: `Authorization: Bearer <access_token>`

---

## Exam Management (Professor)

### Create Exam
```http
POST /api/exams/
Content-Type: application/json
Authorization: Bearer <professor_token>

{
  "title": "Python Basics",
  "description": "Test your Python knowledge",
  "duration_minutes": 60,
  "is_published": false,
  "questions": [
    {
      "question_type": "single_choice",
      "question_text": "What is 2+2?",
      "marks": 5,
      "choices": [
        {"choice_text": "3", "is_correct": false},
        {"choice_text": "4", "is_correct": true},
        {"choice_text": "5", "is_correct": false}
      ]
    },
    {
      "question_type": "multiple_choice",
      "question_text": "Select all even numbers:",
      "marks": 10,
      "choices": [
        {"choice_text": "2", "is_correct": true},
        {"choice_text": "3", "is_correct": false},
        {"choice_text": "4", "is_correct": true}
      ]
    },
    {
      "question_type": "true_false",
      "question_text": "Python is interpreted.",
      "marks": 5,
      "choices": [
        {"choice_text": "True", "is_correct": true},
        {"choice_text": "False", "is_correct": false}
      ]
    },
    {
      "question_type": "long_answer",
      "question_text": "Explain OOP concepts.",
      "marks": 15
    }
  ]
}
```

### List Professor's Exams
```http
GET /api/exams/
Authorization: Bearer <professor_token>
```

### Get Exam Details
```http
GET /api/exams/{exam_id}/
Authorization: Bearer <professor_token>
```

### Update Exam
```http
PUT /api/exams/{exam_id}/
PATCH /api/exams/{exam_id}/
Authorization: Bearer <professor_token>
```

### Delete Exam
```http
DELETE /api/exams/{exam_id}/
Authorization: Bearer <professor_token>
```

### Publish Exam
```http
POST /api/exams/{exam_id}/publish/
Authorization: Bearer <professor_token>
```

### Unpublish Exam
```http
POST /api/exams/{exam_id}/unpublish/
Authorization: Bearer <professor_token>
```

---

## Student Exam Taking

### List Available Exams
```http
GET /api/exams/
Authorization: Bearer <student_token>

Response: Only published exams
```

### Start Exam
```http
POST /api/student-exams/start_exam/
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "exam_id": 1
}

Response:
{
  "id": 1,
  "student": 3,
  "student_name": "John Doe",
  "exam": 1,
  "exam_title": "Python Basics",
  "status": "in_progress",
  "started_at": "2024-12-18T10:00:00Z",
  "submitted_at": null,
  "score": null
}
```

### Submit Answer
```http
POST /api/student-exams/{student_exam_id}/submit_answer/
Authorization: Bearer <student_token>
Content-Type: application/json

For Single/True-False:
{
  "question_id": 1,
  "selected_choices": [2]
}

For Multiple Choice:
{
  "question_id": 2,
  "selected_choices": [1, 3]
}

For Long Answer:
{
  "question_id": 4,
  "text_answer": "OOP stands for Object-Oriented Programming..."
}
```

### Submit Exam
```http
POST /api/student-exams/{student_exam_id}/submit_exam/
Authorization: Bearer <student_token>

Response:
{
  "status": "Exam submitted",
  "score": 20.00
}

Note: Auto-grades objective questions (single, multiple, true/false)
Long answers need manual grading by professor
```

### View My Exams
```http
GET /api/student-exams/
Authorization: Bearer <student_token>
```

---

## Professor Grading

### View Student Submissions
```http
GET /api/student-exams/
Authorization: Bearer <professor_token>

Returns all submissions for professor's exams
```

### View Specific Submission
```http
GET /api/student-exams/{student_exam_id}/
Authorization: Bearer <professor_token>
```

### Grade Long Answer (Manual)
```http
PATCH /api/student-exams/{student_exam_id}/
Authorization: Bearer <professor_token>
Content-Type: application/json

{
  "answers": [
    {
      "id": 5,
      "marks_obtained": 12.5
    }
  ]
}
```

---

## Question Types

1. **single_choice**: One correct answer
2. **multiple_choice**: Multiple correct answers
3. **true_false**: True or False
4. **long_answer**: Text response (manual grading)

---

## Response Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Invalid/missing token
- `403 Forbidden`: No permission
- `404 Not Found`: Resource not found
