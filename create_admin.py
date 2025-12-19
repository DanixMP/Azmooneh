#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create superuser
try:
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123'
    )
    print(f'✅ Superuser created: {admin.username}')
except Exception as e:
    print(f'❌ Error: {e}')
    print('Superuser might already exist')
