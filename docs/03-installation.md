# راهنمای نصب

## پیش‌نیازها

### نرم‌افزارهای مورد نیاز
- Python 3.8 یا بالاتر
- Node.js 16 یا بالاتر
- npm یا yarn
- Git

### بررسی نسخه‌ها
```bash
python --version
node --version
npm --version
```

## مراحل نصب

### 1. دریافت کد

```bash
# کلون کردن مخزن
git clone <repository-url>
cd AzmoonehApp
```

### 2. نصب Backend

#### ایجاد محیط مجازی
```bash
# Windows
python -m venv env
env\Scripts\activate

# Linux/Mac
python3 -m venv env
source env/bin/activate
```

#### نصب وابستگی‌ها
```bash
pip install -r requirements.txt
```

#### تنظیم پایگاه داده
```bash
# اجرای مهاجرت‌ها
python manage.py migrate

# ایجاد سوپریوزر
python manage.py createsuperuser

# پر کردن سوالات SWOT
python manage.py populate_swot_questions
```

### 3. نصب Frontend

```bash
# نصب وابستگی‌ها
npm install

# یا با yarn
yarn install
```

### 4. تنظیم هوش مصنوعی

#### گزینه A: Ollama (محلی - رایگان)

**نصب Ollama:**
```bash
# Windows
# دانلود از: https://ollama.ai/download

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Mac
brew install ollama
```

**دانلود مدل:**
```bash
# مدل سریع (815 MB)
ollama pull gemma3:1b

# مدل با کیفیت بهتر (5.2 GB)
ollama pull qwen3:8b
```

**تنظیم config:**
```bash
# کپی فایل نمونه
cp ai_config.example.json ai_config.json
```

ویرایش `ai_config.json`:
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

#### گزینه B: OpenRouter (ابری)

**دریافت API Key:**
1. ثبت‌نام در https://openrouter.ai
2. دریافت API key از https://openrouter.ai/keys

**تنظیم config:**
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

### 5. تست نصب

```bash
# تست سرویس AI
python test_new_ai.py

# باید خروجی مشابه زیر را ببینید:
# ✅ Analysis Successful!
# Personality Type: متفکر تحلیلی
```

## اجرای سیستم

### حالت Development

#### Terminal 1: Backend
```bash
python manage.py runserver
```
سرور در http://localhost:8000 اجرا می‌شود

#### Terminal 2: Frontend
```bash
npm run dev
```
سرور در http://localhost:5173 اجرا می‌شود

### حالت Production

#### Build Frontend
```bash
npm run build
```

#### اجرا با Gunicorn
```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## تنظیمات اضافی

### متغیرهای محیطی

ایجاد فایل `.env`:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### CORS Settings

در `backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## عیب‌یابی

### مشکل: مهاجرت‌ها اجرا نمی‌شوند
```bash
# حذف فایل‌های مهاجرت قدیمی
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# ایجاد مجدد
python manage.py makemigrations
python manage.py migrate
```

### مشکل: Ollama کار نمی‌کند
```bash
# بررسی وضعیت
ollama list

# راه‌اندازی مجدد
# Windows: از system tray
# Linux: sudo systemctl restart ollama
```

### مشکل: Frontend build نمی‌شود
```bash
# پاک کردن cache
rm -rf node_modules
rm package-lock.json
npm install
```

## مراحل بعدی

پس از نصب موفق:
1. مطالعه [راهنمای استفاده](./04-usage.md)
2. بررسی [مستندات API](./05-api-docs.md)
3. آشنایی با [تحلیل AI](./06-ai-analysis.md)
