"""
Production settings for deployment
"""
from .settings import *
import os

# Security Settings
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', SECRET_KEY)

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'roydadapp.ir,www.roydadapp.ir,api.roydadapp.ir').split(',')

# CORS Settings for production
CORS_ALLOWED_ORIGINS = [
    "https://roydadapp.ir",
    "https://www.roydadapp.ir",
    "http://roydadapp.ir",
    "http://www.roydadapp.ir",
]

CORS_ALLOW_CREDENTIALS = True

# Security Headers (only enable SSL redirect when SSL is ready)
SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'False') == 'True'
SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False') == 'True'
CSRF_COOKIE_SECURE = os.environ.get('CSRF_COOKIE_SECURE', 'False') == 'True'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Static and Media Files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Database - Using SQLite for simplicity (can switch to PostgreSQL later)
# SQLite is fine for small to medium applications
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Optional: PostgreSQL configuration (uncomment to use)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('DB_NAME', 'azmooneh_db'),
#         'USER': os.environ.get('DB_USER', 'azmooneh_user'),
#         'PASSWORD': os.environ.get('DB_PASSWORD', ''),
#         'HOST': os.environ.get('DB_HOST', 'localhost'),
#         'PORT': os.environ.get('DB_PORT', '5432'),
#     }
# }

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_errors.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
