# راهنمای استقرار

## مقدمه

این راهنما مراحل استقرار سیستم در محیط Production را شرح می‌دهد.

## پیش‌نیازها

### سرور
- Ubuntu 20.04+ یا Windows Server
- حداقل 4GB RAM
- 20GB فضای دیسک
- Python 3.8+
- Node.js 16+

### دامنه و SSL
- دامنه اختصاصی
- گواهی SSL (Let's Encrypt)

## گزینه‌های استقرار

### گزینه 1: استقرار با Ollama (محلی)

**مزایا:**
- ✅ رایگان
- ✅ حریم خصوصی کامل
- ✅ بدون محدودیت

**معایب:**
- ⚠️ نیاز به سخت‌افزار قوی
- ⚠️ مدیریت سرویس

### گزینه 2: استقرار با OpenRouter (ابری)

**مزایا:**
- ✅ بدون نیاز به سخت‌افزار قوی
- ✅ مقیاس‌پذیر
- ✅ همیشه در دسترس

**معایب:**
- ⚠️ هزینه API
- ⚠️ نیاز به اینترنت


## مرحله 1: آماده‌سازی سرور

### نصب وابستگی‌ها

```bash
# به‌روزرسانی سیستم
sudo apt update
sudo apt upgrade -y

# نصب Python و pip
sudo apt install python3 python3-pip python3-venv -y

# نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# نصب Nginx
sudo apt install nginx -y

# نصب PostgreSQL (اختیاری)
sudo apt install postgresql postgresql-contrib -y
```

### ایجاد کاربر
```bash
sudo adduser azmooneh
sudo usermod -aG sudo azmooneh
su - azmooneh
```


## مرحله 2: کلون پروژه

```bash
cd /home/azmooneh
git clone <repository-url> AzmoonehApp
cd AzmoonehApp
```

## مرحله 3: تنظیم Backend

### ایجاد محیط مجازی
```bash
python3 -m venv venv
source venv/bin/activate
```

### نصب وابستگی‌ها
```bash
pip install -r requirements.txt
pip install gunicorn
```

### تنظیم متغیرهای محیطی
```bash
nano .env
```

محتوای `.env`:
```env
SECRET_KEY=your-very-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:pass@localhost/dbname
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```


### اجرای مهاجرت‌ها
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py populate_swot_questions
python manage.py createsuperuser
```

## مرحله 4: تنظیم AI

### گزینه A: نصب Ollama

```bash
# نصب Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# دانلود مدل
ollama pull qwen3:8b

# تنظیم سرویس
sudo systemctl enable ollama
sudo systemctl start ollama
```

تنظیم `ai_config.json`:
```json
{
  "active_provider": "local_llm",
  "providers": {
    "local_llm": {
      "base_url": "http://localhost:11434",
      "model": "qwen3:8b",
      "api_type": "ollama"
    }
  }
}
```


### گزینه B: استفاده از OpenRouter

تنظیم `ai_config.json`:
```json
{
  "active_provider": "openrouter",
  "providers": {
    "openrouter": {
      "api_key": "YOUR_API_KEY",
      "model": "meta-llama/llama-3.3-70b-instruct"
    }
  }
}
```

## مرحله 5: تنظیم Frontend

```bash
# نصب وابستگی‌ها
npm install

# Build
npm run build
```

فایل‌های build در پوشه `dist` قرار می‌گیرند.


## مرحله 6: تنظیم Gunicorn

### ایجاد فایل سرویس
```bash
sudo nano /etc/systemd/system/azmooneh.service
```

محتوا:
```ini
[Unit]
Description=Azmooneh Django App
After=network.target

[Service]
User=azmooneh
Group=www-data
WorkingDirectory=/home/azmooneh/AzmoonehApp
Environment="PATH=/home/azmooneh/AzmoonehApp/venv/bin"
ExecStart=/home/azmooneh/AzmoonehApp/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/home/azmooneh/AzmoonehApp/azmooneh.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### فعال‌سازی سرویس
```bash
sudo systemctl start azmooneh
sudo systemctl enable azmooneh
sudo systemctl status azmooneh
```


## مرحله 7: تنظیم Nginx

### ایجاد فایل تنظیمات
```bash
sudo nano /etc/nginx/sites-available/azmooneh
```

محتوا:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        alias /home/azmooneh/AzmoonehApp/staticfiles/;
    }

    location /media/ {
        alias /home/azmooneh/AzmoonehApp/media/;
    }

    location /api/ {
        proxy_pass http://unix:/home/azmooneh/AzmoonehApp/azmooneh.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /home/azmooneh/AzmoonehApp/dist;
        try_files $uri $uri/ /index.html;
    }
}
```


### فعال‌سازی سایت
```bash
sudo ln -s /etc/nginx/sites-available/azmooneh /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

## مرحله 8: نصب SSL

```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx -y

# دریافت گواهی
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# تست تمدید خودکار
sudo certbot renew --dry-run
```

## مرحله 9: تنظیمات امنیتی

### فایروال
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### تنظیمات Django
در `backend/settings.py`:
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```


## مرحله 10: پشتیبان‌گیری

### اسکریپت پشتیبان
```bash
nano ~/backup.sh
```

محتوا:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/azmooneh/backups"

# پشتیبان پایگاه داده
python /home/azmooneh/AzmoonehApp/manage.py dumpdata > $BACKUP_DIR/db_$DATE.json

# پشتیبان فایل‌ها
tar -czf $BACKUP_DIR/media_$DATE.tar.gz /home/azmooneh/AzmoonehApp/media/

# حذف پشتیبان‌های قدیمی (بیش از 7 روز)
find $BACKUP_DIR -type f -mtime +7 -delete
```

### اجرای خودکار
```bash
chmod +x ~/backup.sh
crontab -e
```

اضافه کردن:
```
0 2 * * * /home/azmooneh/backup.sh
```

## مانیتورینگ

### لاگ‌ها
```bash
# لاگ Django
sudo journalctl -u azmooneh -f

# لاگ Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# لاگ Ollama
sudo journalctl -u ollama -f
```


## به‌روزرسانی

```bash
cd /home/azmooneh/AzmoonehApp

# دریافت تغییرات
git pull

# فعال‌سازی محیط مجازی
source venv/bin/activate

# نصب وابستگی‌های جدید
pip install -r requirements.txt

# اجرای مهاجرت‌ها
python manage.py migrate

# جمع‌آوری فایل‌های استاتیک
python manage.py collectstatic --noinput

# Build frontend
npm install
npm run build

# راه‌اندازی مجدد سرویس
sudo systemctl restart azmooneh
sudo systemctl restart nginx
```

## عیب‌یابی

### سرویس اجرا نمی‌شود
```bash
sudo systemctl status azmooneh
sudo journalctl -u azmooneh -n 50
```

### Nginx خطا می‌دهد
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### AI کار نمی‌کند
```bash
# بررسی Ollama
ollama list
sudo systemctl status ollama

# تست
python test_new_ai.py
```


## بهینه‌سازی عملکرد

### PostgreSQL
برای عملکرد بهتر از PostgreSQL استفاده کنید:

```bash
# نصب
sudo apt install postgresql postgresql-contrib

# ایجاد دیتابیس
sudo -u postgres psql
CREATE DATABASE azmooneh_db;
CREATE USER azmooneh_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE azmooneh_db TO azmooneh_user;
\q
```

در `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'azmooneh_db',
        'USER': 'azmooneh_user',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Redis (Cache)
```bash
sudo apt install redis-server
pip install django-redis
```

در `settings.py`:
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```


## چک‌لیست نهایی

### قبل از استقرار
- [ ] تست کامل در محیط Development
- [ ] بررسی تنظیمات امنیتی
- [ ] آماده‌سازی پشتیبان
- [ ] تست AI Service
- [ ] بررسی متغیرهای محیطی

### بعد از استقرار
- [ ] تست ورود کاربران
- [ ] تست ایجاد آزمون
- [ ] تست تحلیل SWOT
- [ ] بررسی SSL
- [ ] تست پشتیبان‌گیری
- [ ] مانیتورینگ لاگ‌ها

## هزینه‌ها

### با Ollama (محلی)
- سرور: $20-50/ماه
- دامنه: $10/سال
- SSL: رایگان (Let's Encrypt)
- **جمع: ~$25-55/ماه**

### با OpenRouter (ابری)
- سرور: $10-20/ماه (نیاز کمتر)
- دامنه: $10/سال
- SSL: رایگان
- API: $50-100/ماه (1000 کاربر)
- **جمع: ~$60-120/ماه**

## پشتیبانی

برای مشکلات:
1. بررسی لاگ‌ها
2. مطالعه مستندات
3. تست با `test_new_ai.py`
4. بررسی وضعیت سرویس‌ها
