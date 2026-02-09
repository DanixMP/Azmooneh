# خلاصه کدبیس

## نمای کلی پروژه

این پروژه یک سیستم آموزشی جامع است که شامل دو بخش اصلی می‌باشد:
1. سیستم مدیریت آزمون‌های آنلاین
2. سیستم تحلیل SWOT با هوش مصنوعی

## ساختار پروژه

```
AzmoonehApp/
├── backend/              # تنظیمات اصلی Django
├── accounts/             # مدیریت کاربران
├── exams/               # سیستم آزمون
├── swot/                # تحلیل SWOT و AI
├── student_messages/    # پیام‌رسانی
├── src/                 # Frontend React
├── docs/                # مستندات فارسی
├── dist/                # Build شده Frontend
└── env/                 # محیط مجازی Python
```

## بخش Backend (Django)

### 1. ماژول accounts

**مسئولیت**: مدیریت کاربران و احراز هویت

**فایل‌های کلیدی**:
- `models.py`: مدل User با دو نوع (استاد/دانشجو)
- `views.py`: ثبت‌نام و ورود
- `serializers.py`: سریالایز داده‌های کاربر
- `urls.py`: مسیرهای API

**ویژگی‌ها**:
- ثبت‌نام دانشجو با شناسه دانشجویی
- ورود استاد با نام کاربری
- احراز هویت JWT
- مدیریت پروفایل

### 2. ماژول exams

**مسئولیت**: مدیریت آزمون‌ها و سوالات

**مدل‌های اصلی**:
```python
Exam:
  - title: عنوان آزمون
  - description: توضیحات
  - professor: استاد سازنده
  - duration_minutes: مدت زمان
  - is_published: وضعیت انتشار

Question:
  - exam: آزمون مربوطه
  - question_type: نوع سوال
  - question_text: متن سوال
  - marks: نمره

Choice:
  - question: سوال مربوطه
  - choice_text: متن گزینه
  - is_correct: صحیح/غلط

StudentExam:
  - student: دانشجو
  - exam: آزمون
  - status: وضعیت (در حال انجام/تمام شده)
  - score: نمره نهایی
```

**انواع سوالات**:
1. `single_choice`: تک گزینه‌ای
2. `multiple_choice`: چند گزینه‌ای
3. `true_false`: صحیح/غلط
4. `long_answer`: تشریحی

**قابلیت‌ها**:
- ایجاد آزمون توسط استاد
- شرکت دانشجو در آزمون
- نمره‌دهی خودکار (سوالات تستی)
- نمره‌دهی دستی (سوالات تشریحی)


### 3. ماژول swot

**مسئولیت**: تحلیل SWOT و هوش مصنوعی

**مدل‌های اصلی**:
```python
SWOTQuestion:
  - category: دسته (strength/weakness/opportunity/threat)
  - question_text: متن سوال
  - order: ترتیب نمایش
  - is_active: فعال/غیرفعال

SWOTAnalysis:
  - student: دانشجو
  - created_at: تاریخ ایجاد
  - is_completed: تکمیل شده؟
  - ai_analyzed: تحلیل AI انجام شده؟
  - personality_type: نوع شخصیت
  - overall_score: امتیاز کلی (0-100)
  - ai_summary: خلاصه تحلیل
  - ai_results: نتایج کامل (JSON)

SWOTAnswer:
  - analysis: تحلیل مربوطه
  - question: سوال
  - answer_text: پاسخ دانشجو
```

**سرویس هوش مصنوعی**:

**فایل**: `swot/ai_service_new.py`

```python
class AIAnalyzer:
    def analyze_swot_answers(answers_data):
        """
        تحلیل پاسخ‌های SWOT با AI
        
        ورودی: لیست پاسخ‌ها
        خروجی: {
            personality_type: نوع شخصیت
            overall_score: امتیاز کلی
            traits: {
                confidence: اعتماد به نفس
                self_awareness: خودآگاهی
                growth_mindset: ذهنیت رشد
                resilience: انعطاف‌پذیری
                strategic_thinking: تفکر استراتژیک
            }
            key_strengths: نقاط قوت
            areas_for_improvement: زمینه‌های بهبود
            recommendations: توصیه‌ها
            career_suggestions: پیشنهادات شغلی
        }
        """
```

**ارائه‌دهندگان AI** (`swot/ai_providers/`):

1. **LocalLLMProvider** (`local_llm.py`):
   - استفاده از Ollama
   - اجرای محلی مدل‌ها
   - رایگان و خصوصی

2. **OpenRouterProvider** (`openrouter.py`):
   - دسترسی به 400+ مدل
   - API ابری
   - مقیاس‌پذیر

**جریان تحلیل**:
```
1. دانشجو پاسخ‌ها را ارسال می‌کند
   ↓
2. Backend پاسخ‌ها را ذخیره می‌کند
   ↓
3. AI Service فراخوانی می‌شود
   ↓
4. Prompt فارسی ساخته می‌شود
   ↓
5. مدل AI تحلیل می‌کند
   ↓
6. نتایج Parse و Validate می‌شود
   ↓
7. در Database ذخیره می‌شود
   ↓
8. به Frontend برگردانده می‌شود
```


### 4. ماژول backend

**فایل‌های کلیدی**:

**`settings.py`**: تنظیمات اصلی Django
```python
# Apps نصب شده
INSTALLED_APPS = [
    'django.contrib.admin',
    'rest_framework',
    'corsheaders',
    'accounts',
    'exams',
    'swot',
    'student_messages',
]

# تنظیمات REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# تنظیمات CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

**`urls.py`**: مسیریابی اصلی
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/exams/', include('exams.urls')),
    path('api/swot/', include('swot.urls')),
    path('api/messages/', include('student_messages.urls')),
]
```

## بخش Frontend (React)

### ساختار کامپوننت‌ها

```
src/
├── components/
│   ├── Header.tsx              # هدر سایت
│   ├── Footer.tsx              # فوتر
│   ├── LoginPage.tsx           # صفحه ورود
│   ├── StudentDashboard.tsx    # داشبورد دانشجو
│   ├── ProfessorDashboard.tsx  # داشبورد استاد
│   ├── StudentExamsView.tsx    # لیست آزمون‌ها
│   ├── TakeExamModal.tsx       # شرکت در آزمون
│   ├── SWOTAnalysis.tsx        # فرم SWOT
│   ├── SWOTSuccessModal.tsx    # پنجره موفقیت
│   ├── AIPersonalityResults.tsx # نتایج AI
│   ├── SWOTResults.tsx         # نمایش نتایج
│   └── ui/                     # کامپوننت‌های UI
├── contexts/
│   └── AuthContext.tsx         # مدیریت احراز هویت
├── services/
│   └── api.ts                  # سرویس‌های API
└── App.tsx                     # کامپوننت اصلی
```

### کامپوننت‌های کلیدی

#### 1. AuthContext
**مسئولیت**: مدیریت وضعیت احراز هویت

```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

#### 2. StudentDashboard
**مسئولیت**: داشبورد اصلی دانشجو

**بخش‌ها**:
- آزمون‌های من
- تحلیل SWOT
- پیام‌ها
- پروفایل

#### 3. SWOTAnalysis
**مسئولیت**: فرم تکمیل SWOT

**جریان کار**:
```typescript
1. دریافت سوالات از API
2. نمایش سوالات به تفکیک دسته
3. جمع‌آوری پاسخ‌ها
4. اعتبارسنجی
5. ارسال به Backend
6. نمایش Modal موفقیت
```


#### 4. AIPersonalityResults
**مسئولیت**: نمایش نتایج تحلیل AI

**بخش‌های نمایش**:
```typescript
1. هدر شخصیت:
   - نوع شخصیت
   - امتیاز کلی با نوار پیشرفت
   - خلاصه تحلیل

2. ویژگی‌های شخصیتی:
   - 5 نوار انیمیشن‌دار
   - رنگ‌بندی بر اساس امتیاز

3. نقاط قوت کلیدی:
   - لیست 3 نقطه قوت
   - آیکون و رنگ سبز

4. زمینه‌های بهبود:
   - لیست موارد نیازمند توسعه
   - رنگ نارنجی

5. توصیه‌ها:
   - پیشنهادات عملی
   - رنگ زرد

6. پیشنهادات شغلی:
   - مسیرهای شغلی مناسب
   - رنگ آبی
```

**انیمیشن‌ها**:
- Fade in برای کارت‌ها
- Slide up برای محتوا
- Progress bar animation
- Spring animation برای آیکون‌ها

#### 5. SWOTSuccessModal
**مسئولیت**: نمایش پیام موفقیت بعد از ثبت

```typescript
interface Props {
  isOpen: boolean;
  onClose: () => void;
  analysis: SWOTAnalysis;
  onViewDetails: () => void;
}
```

**ویژگی‌ها**:
- انیمیشن ورود
- نمایش خلاصه نتایج
- دکمه مشاهده جزئیات
- بستن با کلیک بیرون یا ESC

### سرویس API

**فایل**: `src/services/api.ts`

```typescript
class APIService {
  // احراز هویت
  studentSignup(data): Promise<AuthResponse>
  studentLogin(data): Promise<AuthResponse>
  professorLogin(data): Promise<AuthResponse>
  
  // آزمون‌ها
  getExams(): Promise<Exam[]>
  createExam(data): Promise<Exam>
  startExam(examId): Promise<StudentExam>
  submitAnswer(data): Promise<void>
  submitExam(id): Promise<void>
  
  // SWOT
  getSWOTQuestions(): Promise<SWOTQuestion[]>
  submitSWOTAnalysis(data): Promise<SWOTAnalysis>
  getMySWOTAnalyses(): Promise<SWOTAnalysis[]>
  triggerSWOTAnalysis(id): Promise<SWOTAnalysis>
}
```

**مدیریت Token**:
```typescript
// ذخیره در localStorage
localStorage.setItem('access_token', token);

// افزودن به headers
headers: {
  'Authorization': `Bearer ${token}`
}
```


## تنظیمات و پیکربندی

### 1. فایل ai_config.json

```json
{
  "active_provider": "local_llm",
  "providers": {
    "local_llm": {
      "base_url": "http://localhost:11434",
      "model": "gemma3:1b",
      "api_type": "ollama"
    },
    "openrouter": {
      "api_key": "sk-or-v1-...",
      "model": "meta-llama/llama-3.3-70b-instruct",
      "site_url": "http://localhost:8000",
      "site_name": "SWOT Analysis System"
    }
  }
}
```

### 2. فایل requirements.txt

**وابستگی‌های اصلی**:
```
Django==6.0
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0
requests==2.31.0
```

### 3. فایل package.json

**وابستگی‌های Frontend**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.5"
  }
}
```

## جریان داده

### 1. ثبت‌نام و ورود

```
Frontend → POST /api/auth/student/signup/
         ← {access, refresh, user}
         
Frontend → localStorage.setItem('access_token')
         → Navigate to Dashboard
```

### 2. شرکت در آزمون

```
Frontend → GET /api/exams/
         ← [Exam list]
         
Frontend → POST /api/student-exams/start_exam/
         ← {student_exam_id, questions}
         
Frontend → POST /api/student-exams/{id}/submit_answer/
         (برای هر سوال)
         
Frontend → POST /api/student-exams/{id}/submit_exam/
         ← {score, status}
```

### 3. تحلیل SWOT

```
Frontend → GET /api/swot/questions/
         ← [Questions by category]
         
Frontend → Collect answers
         
Frontend → POST /api/swot/analyses/submit/
         ↓
Backend  → Save to Database
         → Call AI Service
         ↓
AI       → Build Prompt
         → Call Model (Ollama/OpenRouter)
         → Parse Response
         ↓
Backend  → Save AI Results
         ← Return Complete Analysis
         ↓
Frontend → Show Success Modal
         → Display AI Results
```


## پایگاه داده

### Schema اصلی

```sql
-- کاربران
User:
  id, username, email, password, user_type, full_name

-- آزمون‌ها
Exam:
  id, title, description, professor_id, duration_minutes, 
  is_published, created_at

Question:
  id, exam_id, question_type, question_text, marks, order

Choice:
  id, question_id, choice_text, is_correct

StudentExam:
  id, student_id, exam_id, status, started_at, 
  submitted_at, score

Answer:
  id, student_exam_id, question_id, selected_choices, 
  text_answer, marks_obtained

-- SWOT
SWOTQuestion:
  id, category, question_text, order, is_active

SWOTAnalysis:
  id, student_id, created_at, completed_at, is_completed,
  ai_analyzed, personality_type, overall_score, 
  ai_summary, ai_results (JSON)

SWOTAnswer:
  id, analysis_id, question_id, answer_text, created_at
```

### روابط

```
User (1) ─── (N) Exam
User (1) ─── (N) StudentExam
User (1) ─── (N) SWOTAnalysis

Exam (1) ─── (N) Question
Question (1) ─── (N) Choice

StudentExam (1) ─── (N) Answer

SWOTAnalysis (1) ─── (N) SWOTAnswer
SWOTQuestion (1) ─── (N) SWOTAnswer
```

## امنیت

### 1. احراز هویت
- JWT Token-based
- Access Token (24 ساعت)
- Refresh Token (7 روز)
- ذخیره در localStorage

### 2. مجوزها
```python
# در ViewSets
permission_classes = [IsAuthenticated]

# بررسی نقش
if request.user.user_type != 'professor':
    return Response(status=403)
```

### 3. CORS
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### 4. محافظت از API
- Rate limiting
- Input validation
- SQL injection prevention (ORM)
- XSS protection

## بهینه‌سازی

### Backend
1. **Database Indexing**:
```python
class Meta:
    indexes = [
        models.Index(fields=['student', 'created_at']),
    ]
```

2. **Query Optimization**:
```python
# استفاده از select_related
exams = Exam.objects.select_related('professor').all()

# استفاده از prefetch_related
analyses = SWOTAnalysis.objects.prefetch_related('answers').all()
```

3. **Caching** (اختیاری):
```python
from django.core.cache import cache

result = cache.get('swot_questions')
if not result:
    result = SWOTQuestion.objects.filter(is_active=True)
    cache.set('swot_questions', result, 3600)
```

### Frontend
1. **Code Splitting**:
```typescript
const SWOTAnalysis = lazy(() => import('./components/SWOTAnalysis'));
```

2. **Memoization**:
```typescript
const memoizedValue = useMemo(() => 
  computeExpensiveValue(a, b), 
  [a, b]
);
```

3. **Lazy Loading**:
```typescript
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
```


## تست

### Backend Tests

**فایل**: `swot/tests.py`

```python
class SWOTAnalysisTestCase(TestCase):
    def test_create_analysis(self):
        """تست ایجاد تحلیل SWOT"""
        
    def test_ai_analysis(self):
        """تست سرویس AI"""
        
    def test_permissions(self):
        """تست مجوزها"""
```

**اجرا**:
```bash
python manage.py test
python manage.py test swot
python manage.py test swot.tests.SWOTAnalysisTestCase
```

### Frontend Tests

**فایل**: `src/components/__tests__/SWOTAnalysis.test.tsx`

```typescript
describe('SWOTAnalysis', () => {
  it('renders questions', () => {
    // تست
  });
  
  it('submits answers', () => {
    // تست
  });
});
```

### تست AI

**فایل**: `test_new_ai.py`

```python
def test_ai_service():
    """تست کامل سرویس AI"""
    analyzer = get_ai_analyzer()
    
    sample_answers = [
        {
            'category': 'strength',
            'question': 'نقاط قوت شما؟',
            'answer': 'من در حل مسئله خوب هستم'
        }
    ]
    
    result = analyzer.analyze_swot_answers(sample_answers)
    
    assert result['personality_type']
    assert 0 <= result['overall_score'] <= 100
```

## خطایابی

### Backend Debugging

```python
# در settings.py
DEBUG = True

# لاگ‌گیری
import logging
logger = logging.getLogger(__name__)
logger.debug('Debug message')
logger.error('Error message')
```

### Frontend Debugging

```typescript
// Console logging
console.log('Data:', data);
console.error('Error:', error);

// React DevTools
// Chrome Extension: React Developer Tools
```

### AI Debugging

```python
# در ai_service_new.py
print(f"Prompt: {prompt}")
print(f"Response: {response}")
print(f"Parsed: {parsed_result}")
```

## مدیریت خطا

### Backend Error Handling

```python
try:
    result = analyzer.analyze_swot_answers(answers)
except Exception as e:
    logger.error(f"AI analysis failed: {e}")
    # Fallback to local analysis
    result = generate_fallback_analysis(answers)
```

### Frontend Error Handling

```typescript
try {
  const result = await api.submitSWOTAnalysis(data);
  setAnalysis(result);
} catch (error) {
  console.error('Submission failed:', error);
  toast.error('خطا در ارسال تحلیل');
}
```

## دستورات مفید

### Django Management Commands

```bash
# ایجاد سوپریوزر
python manage.py createsuperuser

# پر کردن سوالات SWOT
python manage.py populate_swot_questions

# ایجاد مهاجرت
python manage.py makemigrations

# اجرای مهاجرت
python manage.py migrate

# جمع‌آوری فایل‌های استاتیک
python manage.py collectstatic

# اجرای shell
python manage.py shell
```

### NPM Scripts

```bash
# اجرای development
npm run dev

# Build برای production
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```
