"""
Production settings for deployment
"""
from .settings import *
import os

# Security Settings
DEBUG = False
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', SECRET_KEY)

ALLOWED_HOSTS = [
    'roydadapp.ir',
    'www.roydadapp.ir',
    'api.roydadapp.ir',
    '193.151.154.135',
]

# CORS Settings for production
CORS_ALLOWED_ORIGINS = [
    "https://roydadapp.ir",
    "https://www.roydadapp.ir",
    "http://roydadapp.ir",
    "http://www.roydadapp.ir",
]

# Security Headers
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Static and Media Files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Database - PostgreSQL for production (recommended)
# Uncomment and configure if using PostgreSQL
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
