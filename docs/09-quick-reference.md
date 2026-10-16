# راهنمای سریع

## دستورات پرکاربرد

### Backend (Django)

```bash
# اجرای سرور
python manage.py runserver

# مهاجرت‌ها
python manage.py makemigrations
python manage.py migrate

# ایجاد سوپریوزر
python manage.py createsuperuser

# پر کردن سوالات SWOT
python manage.py populate_swot_questions

# تست
python manage.py test
python test_new_ai.py

# Shell
python manage.py shell

# جمع‌آوری فایل‌های استاتیک
python manage.py collectstatic
```

### Frontend (React)

```bash
# اجرای development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Test
npm run test
```

### Git

```bash
# ایجاد branch جدید
git checkout -b feature/feature-name

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/feature-name

# Pull latest
git pull origin main
```

## API Endpoints

### احراز هویت

```http
POST /api/auth/student/signup/
POST /api/auth/student/login/
POST /api/auth/professor/login/
```

### آزمون‌ها

```http
GET    /api/exams/
POST   /api/exams/
GET    /api/exams/{id}/
PUT    /api/exams/{id}/
DELETE /api/exams/{id}/
POST   /api/exams/{id}/publish/
```

### SWOT

```http
GET  /api/swot/questions/
POST /api/swot/analyses/submit/
GET  /api/swot/analyses/
POST /api/swot/analyses/{id}/analyze/
```

## تنظیمات AI

### Ollama (محلی)

```bash
# نصب
# Windows: دانلود از ollama.ai
# Linux: curl -fsSL https://ollama.ai/install.sh | sh

# دانلود مدل
ollama pull gemma3:1b
ollama pull qwen3:8b

# لیست مدل‌ها
ollama list

# حذف مدل
ollama rm model-name
```

**تنظیم config**:
```json
{
  "active_provider": "local_llm",
  "providers": {
    "local_llm": {
      "base_url": "http://localhost:11434",
      "model": "gemma3:1b",
      "api_type": "ollama"
    }
  }
}
```

### OpenRouter (ابری)

**دریافت API Key**: https://openrouter.ai/keys

**تنظیم config**:
```json
{
  "active_provider": "openrouter",
  "providers": {
    "openrouter": {
      "api_key": "sk-or-v1-YOUR_KEY",
      "model": "meta-llama/llama-3.3-70b-instruct"
    }
  }
}
```

## مدل‌های پیشنهادی

### Ollama

| مدل | حجم | سرعت | کیفیت | استفاده |
|-----|------|------|--------|----------|
| gemma3:1b | 815 MB | ⚡⚡⚡ | ⭐⭐ | Development |
| qwen3:4b | 2.5 GB | ⚡⚡ | ⭐⭐⭐ | متعادل |
| qwen3:8b | 5.2 GB | ⚡ | ⭐⭐⭐⭐ | Production |
| gemma3:12b | 8.1 GB | ⚡ | ⭐⭐⭐⭐⭐ | کیفیت بالا |

### OpenRouter

| مدل | هزینه | کیفیت | استفاده |
|-----|--------|--------|----------|
| llama-3.3-70b | $0.50/1M | ⭐⭐⭐⭐ | ارزان |
| gemini-pro | $1/1M | ⭐⭐⭐⭐ | متعادل |
| claude-3.5 | $15/1M | ⭐⭐⭐⭐⭐ | کیفیت بالا |
| gpt-4 | $30/1M | ⭐⭐⭐⭐⭐ | بهترین |

## عیب‌یابی سریع

### Backend کار نمی‌کند

```bash
# بررسی خطاها
python manage.py check

# بررسی مهاجرت‌ها
python manage.py showmigrations

# ریست database (احتیاط!)
python manage.py flush
```

### Frontend کار نمی‌کند

```bash
# پاک کردن cache
rm -rf node_modules
rm package-lock.json
npm install

# بررسی خطاها
npm run lint
```

### AI کار نمی‌کند

```bash
# تست Ollama
ollama list
curl http://localhost:11434/api/tags

# تست AI Service
python test_new_ai.py

# بررسی config
cat ai_config.json
```

## متغیرهای محیطی

### Development

```env
DEBUG=True
SECRET_KEY=dev-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Production

```env
DEBUG=False
SECRET_KEY=your-very-secret-key
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@localhost/db
```

## پورت‌های پیش‌فرض

| سرویس | پورت | URL |
|--------|------|-----|
| Django | 8000 | http://localhost:8000 |
| React | 5173 | http://localhost:5173 |
| Ollama | 11434 | http://localhost:11434 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

## فایل‌های مهم

| فایل | توضیح |
|------|--------|
| `backend/settings.py` | تنظیمات Django |
| `ai_config.json` | تنظیمات AI |
| `requirements.txt` | وابستگی‌های Python |
| `package.json` | وابستگی‌های Node |
| `.env` | متغیرهای محیطی |
| `db.sqlite3` | پایگاه داده |

## لینک‌های مفید

### مستندات

- [Django](https://docs.djangoproject.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Ollama](https://ollama.ai/docs)
- [OpenRouter](https://openrouter.ai/docs)

### ابزارها

- [Django REST Framework](https://www.django-rest-framework.org/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## کدهای وضعیت HTTP

| کد | معنی |
|----|------|
| 200 | موفق |
| 201 | ایجاد شد |
| 400 | درخواست نامعتبر |
| 401 | نیاز به احراز هویت |
| 403 | عدم دسترسی |
| 404 | یافت نشد |
| 500 | خطای سرور |

## نکات سریع

### عملکرد

- از `select_related` برای ForeignKey استفاده کنید
- از `prefetch_related` برای ManyToMany استفاده کنید
- Query های N+1 را اجتناب کنید
- از React.memo برای کامپوننت‌های سنگین استفاده کنید

### امنیت

- هرگز `DEBUG=True` در production
- API keys را در `.env` نگه دارید
- از JWT برای احراز هویت استفاده کنید
- Input validation را فراموش نکنید

### بهترین روش‌ها

- کد تمیز بنویسید
- تست بنویسید
- مستندات به‌روز کنید
- از Git به درستی استفاده کنید

---

**برای جزئیات بیشتر، مستندات کامل را مطالعه کنید.**
