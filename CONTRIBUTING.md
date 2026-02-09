# راهنمای مشارکت

## خوش آمدید!

از علاقه شما به مشارکت در این پروژه سپاسگزاریم. این راهنما به شما کمک می‌کند تا به بهترین شکل مشارکت کنید.

## فهرست مطالب

1. [نحوه مشارکت](#نحوه-مشارکت)
2. [راه‌اندازی محیط توسعه](#راه-اندازی-محیط-توسعه)
3. [استانداردهای کد](#استانداردهای-کد)
4. [فرآیند Pull Request](#فرآیند-pull-request)
5. [گزارش باگ](#گزارش-باگ)
6. [پیشنهاد ویژگی](#پیشنهاد-ویژگی)

## نحوه مشارکت

### انواع مشارکت

- 🐛 گزارش و رفع باگ
- ✨ پیشنهاد و پیاده‌سازی ویژگی جدید
- 📝 بهبود مستندات
- 🎨 بهبود رابط کاربری
- ⚡ بهینه‌سازی عملکرد
- 🧪 نوشتن تست

## راه‌اندازی محیط توسعه

### 1. Fork و Clone

```bash
# Fork کردن پروژه در GitHub
# سپس clone کردن

git clone https://github.com/DanixMP/AzmoonehApp.git
cd AzmoonehApp
```


### 2. نصب وابستگی‌ها

```bash
# Backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt

# Frontend
npm install

# AI (Ollama)
ollama pull gemma3:1b
```

### 3. تنظیم پایگاه داده

```bash
python manage.py migrate
python manage.py populate_swot_questions
python manage.py createsuperuser
```

### 4. اجرای سرور

```bash
# Terminal 1: Backend
python manage.py runserver

# Terminal 2: Frontend
npm run dev
```

## استانداردهای کد

### Python (Backend)

**استایل کد**:
- PEP 8
- حداکثر طول خط: 100 کاراکتر
- استفاده از type hints

**مثال**:
```python
def analyze_swot_answers(
    answers_data: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    تحلیل پاسخ‌های SWOT
    
    Args:
        answers_data: لیست پاسخ‌ها
        
    Returns:
        نتایج تحلیل
    """
    pass
```


### TypeScript (Frontend)

**استایل کد**:
- ESLint rules
- استفاده از TypeScript strict mode
- نام‌گذاری: camelCase برای متغیرها، PascalCase برای کامپوننت‌ها

**مثال**:
```typescript
interface SWOTAnalysisProps {
  onComplete: (analysis: SWOTAnalysis) => void;
  questions: SWOTQuestion[];
}

const SWOTAnalysis: React.FC<SWOTAnalysisProps> = ({
  onComplete,
  questions
}) => {
  // Implementation
};
```

### کامیت‌ها

**فرمت پیام کامیت**:
```
<type>: <subject>

<body>

<footer>
```

**انواع**:
- `feat`: ویژگی جدید
- `fix`: رفع باگ
- `docs`: تغییر مستندات
- `style`: تغییرات فرمت کد
- `refactor`: بازنویسی کد
- `test`: افزودن تست
- `chore`: تغییرات ابزارها

**مثال**:
```
feat: add AI personality analysis

- Implement Ollama integration
- Add Persian language support
- Create results display component

Closes #123
```


## فرآیند Pull Request

### 1. ایجاد Branch

```bash
git checkout -b feature/your-feature-name
# یا
git checkout -b fix/bug-description
```

### 2. توسعه

- کد خود را بنویسید
- تست‌ها را اضافه کنید
- مستندات را به‌روز کنید

### 3. تست

```bash
# Backend tests
python manage.py test

# Frontend tests
npm run test

# AI service test
python test_new_ai.py

# Lint
npm run lint
```

### 4. Commit و Push

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### 5. ایجاد Pull Request

- به GitHub بروید
- Pull Request ایجاد کنید
- توضیحات کامل بدهید
- منتظر بررسی باشید

### چک‌لیست PR

- [ ] کد تست شده است
- [ ] تست‌های جدید اضافه شده
- [ ] مستندات به‌روز شده
- [ ] استانداردهای کد رعایت شده
- [ ] کامیت‌ها واضح هستند
- [ ] تغییرات در CHANGELOG ثبت شده


## گزارش باگ

### قبل از گزارش

- جستجو کنید که قبلاً گزارش نشده باشد
- آخرین نسخه را امتحان کنید
- مشکل را بازتولید کنید

### فرمت گزارش

```markdown
**توضیح باگ**
توضیح واضح و مختصر

**مراحل بازتولید**
1. برو به '...'
2. کلیک کن روی '...'
3. اسکرول کن به '...'
4. خطا را ببین

**رفتار مورد انتظار**
چه اتفاقی باید بیفتد

**اسکرین‌شات**
در صورت امکان

**محیط**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Python: [e.g. 3.11]
- Node: [e.g. 18.0]

**اطلاعات اضافی**
هر چیز دیگری که مفید باشد
```

## پیشنهاد ویژگی

### قبل از پیشنهاد

- بررسی کنید که قبلاً پیشنهاد نشده
- مطمئن شوید با اهداف پروژه همخوانی دارد

### فرمت پیشنهاد

```markdown
**مشکل مرتبط**
این ویژگی چه مشکلی را حل می‌کند؟

**راه‌حل پیشنهادی**
توضیح دهید چگونه باید کار کند

**جایگزین‌ها**
راه‌حل‌های دیگری که در نظر گرفته‌اید

**اطلاعات اضافی**
اسکرین‌شات، مثال‌ها، و غیره
```


## راهنمای توسعه

### ساختار پروژه

```
AzmoonehApp/
├── backend/          # Django settings
├── accounts/         # User management
├── exams/           # Exam system
├── swot/            # SWOT & AI
├── src/             # React frontend
└── docs/            # Documentation
```

### افزودن ویژگی جدید

#### Backend (Django)

1. **ایجاد مدل**:
```python
# در models.py
class NewModel(models.Model):
    field = models.CharField(max_length=100)
    
    class Meta:
        verbose_name = "مدل جدید"
```

2. **ایجاد Serializer**:
```python
# در serializers.py
class NewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewModel
        fields = '__all__'
```

3. **ایجاد View**:
```python
# در views.py
class NewModelViewSet(viewsets.ModelViewSet):
    queryset = NewModel.objects.all()
    serializer_class = NewModelSerializer
    permission_classes = [IsAuthenticated]
```

4. **افزودن URL**:
```python
# در urls.py
router.register(r'new-models', NewModelViewSet)
```

5. **مهاجرت**:
```bash
python manage.py makemigrations
python manage.py migrate
```


#### Frontend (React)

1. **ایجاد کامپوننت**:
```typescript
// در src/components/NewComponent.tsx
interface NewComponentProps {
  data: string;
}

export const NewComponent: React.FC<NewComponentProps> = ({ data }) => {
  return (
    <div>
      {data}
    </div>
  );
};
```

2. **افزودن به API Service**:
```typescript
// در src/services/api.ts
async getNewData(): Promise<NewData[]> {
  const response = await this.client.get('/api/new-data/');
  return response.data;
}
```

3. **استفاده در کامپوننت**:
```typescript
const [data, setData] = useState<NewData[]>([]);

useEffect(() => {
  api.getNewData().then(setData);
}, []);
```

### نوشتن تست

#### Backend Test

```python
# در tests.py
from django.test import TestCase

class NewModelTestCase(TestCase):
    def setUp(self):
        self.model = NewModel.objects.create(
            field="test"
        )
    
    def test_model_creation(self):
        self.assertEqual(self.model.field, "test")
```

#### Frontend Test

```typescript
// در __tests__/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from '../NewComponent';

describe('NewComponent', () => {
  it('renders data', () => {
    render(<NewComponent data="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```


## بهترین روش‌ها

### کد تمیز

1. **نام‌گذاری معنادار**:
```python
# بد
def f(x):
    return x * 2

# خوب
def calculate_double_score(score: int) -> int:
    return score * 2
```

2. **توابع کوچک**:
```python
# هر تابع یک کار انجام دهد
def validate_answer(answer: str) -> bool:
    return len(answer) > 0

def save_answer(answer: str) -> None:
    if validate_answer(answer):
        Answer.objects.create(text=answer)
```

3. **کامنت‌های مفید**:
```python
# بد: کامنت واضح
x = x + 1  # افزایش x

# خوب: توضیح چرایی
# افزایش تعداد تلاش‌ها برای جلوگیری از حمله brute force
attempt_count += 1
```

### عملکرد

1. **Query Optimization**:
```python
# بد: N+1 query
for exam in Exam.objects.all():
    print(exam.professor.name)

# خوب: select_related
for exam in Exam.objects.select_related('professor'):
    print(exam.professor.name)
```

2. **Lazy Loading**:
```typescript
// استفاده از React.lazy
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### امنیت

1. **Input Validation**:
```python
from django.core.validators import validate_email

def validate_user_input(email: str) -> bool:
    try:
        validate_email(email)
        return True
    except ValidationError:
        return False
```

2. **SQL Injection Prevention**:
```python
# بد: raw SQL
User.objects.raw(f"SELECT * FROM users WHERE id = {user_id}")

# خوب: ORM
User.objects.filter(id=user_id)
```


## سوالات متداول

### چگونه شروع کنم؟

1. مستندات را بخوانید
2. Issue های "good first issue" را ببینید
3. محیط توسعه را راه‌اندازی کنید
4. یک باگ کوچک را رفع کنید

### چقدر طول می‌کشد تا PR من بررسی شود؟

معمولاً 2-3 روز کاری. اگر فوری است، در PR ذکر کنید.

### آیا باید تست بنویسم؟

بله، برای هر ویژگی یا رفع باگ، تست الزامی است.

### آیا می‌توانم روی چند Issue همزمان کار کنم؟

بهتر است روی یک Issue تمرکز کنید تا کیفیت بالاتر باشد.

### کد من رد شد، چه کنم؟

- بازخوردها را بخوانید
- تغییرات لازم را اعمال کنید
- سوال بپرسید اگر چیزی واضح نیست
- دوباره push کنید

## منابع

### مستندات

- [راهنمای نصب](./docs/03-installation.md)
- [معماری سیستم](./docs/02-architecture.md)
- [API مستندات](./docs/05-api-docs.md)

### ابزارها

- [Django Docs](https://docs.djangoproject.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Ollama Docs](https://ollama.ai/docs)

## تماس با ما

- GitHub Issues: برای باگ و پیشنهاد
- GitHub Discussions: برای سوالات عمومی
- Email: برای موارد خصوصی

## قدردانی

از همه مشارکت‌کنندگان این پروژه تشکر می‌کنیم! 🙏

---

**با مشارکت شما، این پروژه بهتر می‌شود! 🚀**
