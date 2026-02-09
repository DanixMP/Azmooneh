# معماری سیستم

## ساختار کلی پروژه

```
AzmoonehApp/
├── backend/              # تنظیمات Django
├── accounts/             # مدیریت کاربران
├── exams/               # سیستم آزمون
├── swot/                # تحلیل SWOT
├── student_messages/    # پیام‌های دانشجویان
├── src/                 # Frontend React
├── docs/                # مستندات
└── requirements.txt     # وابستگی‌های Python
```

## معماری Backend

### ساختار Django Apps

#### 1. accounts
مدیریت کاربران و احراز هویت
- مدل‌های User (استاد و دانشجو)
- ثبت‌نام و ورود
- مدیریت پروفایل

#### 2. exams
سیستم آزمون‌ها
- مدل‌های Exam, Question, Choice
- ایجاد و ویرایش آزمون
- شرکت در آزمون
- نمره‌دهی خودکار

#### 3. swot
تحلیل SWOT با AI
- مدل‌های SWOTAnalysis, SWOTQuestion, SWOTAnswer
- سرویس هوش مصنوعی
- تحلیل شخصیت
- پیشنهادات شغلی

#### 4. student_messages
سیستم پیام‌رسانی
- ارتباط دانشجو-استاد
- اعلان‌ها

## معماری Frontend

### ساختار React Components

```
src/
├── components/
│   ├── Header.tsx           # هدر سایت
│   ├── Footer.tsx           # فوتر سایت
│   ├── LoginPage.tsx        # صفحه ورود
│   ├── StudentDashboard.tsx # داشبورد دانشجو
│   ├── ProfessorDashboard.tsx # داشبورد استاد
│   ├── SWOTAnalysis.tsx     # فرم SWOT
│   ├── AIPersonalityResults.tsx # نتایج AI
│   └── ui/                  # کامپوننت‌های UI
├── contexts/
│   └── AuthContext.tsx      # مدیریت احراز هویت
├── services/
│   └── api.ts              # سرویس‌های API
└── App.tsx                 # کامپوننت اصلی
```

## سرویس هوش مصنوعی

### معماری AI Service

```
swot/
├── ai_service_new.py        # سرویس اصلی AI
└── ai_providers/
    ├── base.py             # رابط پایه
    ├── local_llm.py        # Ollama
    └── openrouter.py       # OpenRouter
```

### جریان تحلیل AI

```
1. دانشجو پرسشنامه را تکمیل می‌کند
   ↓
2. پاسخ‌ها به Backend ارسال می‌شود
   ↓
3. AI Service فراخوانی می‌شود
   ↓
4. Prompt ساخته می‌شود
   ↓
5. مدل AI تحلیل می‌کند
   ↓
6. نتایج Parse می‌شود
   ↓
7. در Database ذخیره می‌شود
   ↓
8. به Frontend برگردانده می‌شود
   ↓
9. نمایش نتایج به دانشجو
```

## پایگاه داده

### مدل‌های اصلی

#### User
```python
- id
- username
- email
- user_type (student/professor)
- full_name
```

#### Exam
```python
- id
- title
- description
- professor
- duration_minutes
- is_published
```

#### SWOTAnalysis
```python
- id
- student
- created_at
- ai_analyzed
- personality_type
- overall_score
- ai_results (JSON)
```

## API Architecture

### REST Endpoints

```
/api/auth/
  POST /student/signup/
  POST /student/login/
  POST /professor/login/

/api/exams/
  GET  /
  POST /
  GET  /{id}/
  PUT  /{id}/
  DELETE /{id}/

/api/swot/
  GET  /questions/
  POST /analyses/submit/
  GET  /analyses/
  POST /analyses/{id}/analyze/
```

## امنیت

### احراز هویت
- JWT Token-based
- Access & Refresh Tokens
- Token در localStorage

### مجوزها
- Role-based (Student/Professor)
- Object-level permissions
- API endpoint protection

## مقیاس‌پذیری

### Backend
- استفاده از Django ORM
- Caching با Redis (اختیاری)
- Background tasks با Celery (اختیاری)

### Frontend
- Code splitting
- Lazy loading
- Optimized builds

### AI Service
- مدل‌های محلی برای سرعت
- مدل‌های ابری برای کیفیت
- Fallback mechanism
