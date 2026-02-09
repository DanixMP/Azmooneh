# مستندات API

## احراز هویت

همه endpoint‌ها به جز ورود/ثبت‌نام نیاز به JWT token دارند.

### ارسال Token
```http
Authorization: Bearer <access_token>
```

## Endpoints احراز هویت

### ثبت‌نام دانشجو
```http
POST /api/auth/student/signup/
Content-Type: application/json

{
  "student_id": "STU001",
  "full_name": "علی احمدی",
  "password": "password123"
}
```

**پاسخ موفق (201):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "STU001",
    "full_name": "علی احمدی",
    "user_type": "student"
  }
}
```

### ورود دانشجو
```http
POST /api/auth/student/login/
Content-Type: application/json

{
  "student_id": "STU001",
  "password": "password123"
}
```

### ورود استاد
```http
POST /api/auth/professor/login/
Content-Type: application/json

{
  "username": "prof_test",
  "password": "prof123"
}
```

## Endpoints آزمون

### لیست آزمون‌ها
```http
GET /api/exams/
Authorization: Bearer <token>
```

**برای دانشجو:** فقط آزمون‌های منتشر شده
**برای استاد:** آزمون‌های خودش

### ایجاد آزمون (استاد)
```http
POST /api/exams/
Authorization: Bearer <professor_token>
Content-Type: application/json

{
  "title": "آزمون پایتون",
  "description": "آزمون مبانی پایتون",
  "duration_minutes": 60,
  "is_published": false,
  "questions": [
    {
      "question_type": "single_choice",
      "question_text": "2+2 چند است؟",
      "marks": 5,
      "choices": [
        {"choice_text": "3", "is_correct": false},
        {"choice_text": "4", "is_correct": true},
        {"choice_text": "5", "is_correct": false}
      ]
    }
  ]
}
```

### شروع آزمون (دانشجو)
```http
POST /api/student-exams/start_exam/
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "exam_id": 1
}
```

### ثبت پاسخ
```http
POST /api/student-exams/{student_exam_id}/submit_answer/
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "question_id": 1,
  "selected_choices": [2]
}
```

### ثبت آزمون
```http
POST /api/student-exams/{student_exam_id}/submit_exam/
Authorization: Bearer <student_token>
```

## Endpoints SWOT

### دریافت سوالات
```http
GET /api/swot/questions/
Authorization: Bearer <token>
```

**پاسخ:**
```json
[
  {
    "id": 1,
    "category": "strength",
    "question_text": "نقاط قوت شما چیست؟",
    "order": 1,
    "is_active": true
  }
]
```

### ثبت تحلیل SWOT
```http
POST /api/swot/analyses/submit/
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "answers": [
    {
      "question_id": 1,
      "answer_text": "من در حل مسئله خوب هستم"
    },
    {
      "question_id": 2,
      "answer_text": "مدیریت زمان من ضعیف است"
    }
  ]
}
```

**پاسخ (201):**
```json
{
  "id": 1,
  "student": 5,
  "created_at": "2024-01-08T10:00:00Z",
  "ai_analyzed": true,
  "personality_type": "متفکر استراتژیک",
  "overall_score": 85,
  "ai_summary": "شما فردی با خودآگاهی بالا...",
  "ai_results": {
    "personality_type": "متفکر استراتژیک",
    "overall_score": 85,
    "traits": {
      "confidence": 80,
      "self_awareness": 90,
      "growth_mindset": 85,
      "resilience": 75,
      "strategic_thinking": 88
    },
    "key_strengths": [
      "حل مسئله عالی",
      "کار تیمی قوی",
      "سازماندهی خوب"
    ],
    "areas_for_improvement": [
      "مدیریت زمان",
      "سخنرانی عمومی"
    ],
    "recommendations": [
      "شرکت در کارگاه مدیریت زمان",
      "تمرین سخنرانی"
    ],
    "career_suggestions": [
      "مدیر محصول",
      "تحلیلگر کسب‌وکار"
    ]
  }
}
```

### لیست تحلیل‌ها
```http
GET /api/swot/analyses/
Authorization: Bearer <token>
```

**برای دانشجو:** تحلیل‌های خودش
**برای استاد:** همه تحلیل‌ها

### تحلیل مجدد با AI
```http
POST /api/swot/analyses/{id}/analyze/
Authorization: Bearer <token>
```

## کدهای وضعیت

- `200 OK`: موفق
- `201 Created`: ایجاد شد
- `400 Bad Request`: داده نامعتبر
- `401 Unauthorized`: نیاز به ورود
- `403 Forbidden`: عدم دسترسی
- `404 Not Found`: یافت نشد
- `500 Internal Server Error`: خطای سرور

## خطاها

### فرمت خطا
```json
{
  "error": "توضیح خطا",
  "detail": "جزئیات بیشتر"
}
```

### خطاهای رایج

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**400 Bad Request:**
```json
{
  "answers": ["This field is required."]
}
```

## محدودیت‌ها

- حداکثر اندازه request: 10MB
- Rate limit: 100 request/minute
- Token expiry: 24 hours
