#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Delete existing admin user if exists
User.objects.filter(username='admin').delete()

# Create superuser
try:
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin@123'
    )
    print(f'✅ Superuser created: {admin.username}')
    print(f'   Username: admin')
    print(f'   Password: admin@123')
except Exception as e:
    print(f'❌ Error: {e}')
