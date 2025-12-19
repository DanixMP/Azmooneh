#!/usr/bin/env python
"""Reset user passwords to known values"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User

# Reset professor password
try:
    prof = User.objects.get(username='Tagepour')
    prof.set_password('T1171313')
    prof.save()
    print(f'✅ Professor password reset: Tagepour / T1171313')
except User.DoesNotExist:
    print('❌ Professor not found')

# Reset student password
try:
    student = User.objects.get(username='403663934')
    student.set_password('student123')
    student.save()
    print(f'✅ Student password reset: 403663934 / student123')
except User.DoesNotExist:
    print('❌ Student not found')

# Check for admin
try:
    admin = User.objects.get(username='admin')
    admin.set_password('admin@123')
    admin.is_superuser = True
    admin.is_staff = True
    admin.save()
    print(f'✅ Admin password reset: admin / admin@123')
except User.DoesNotExist:
    # Create admin if doesn't exist
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin@123',
        role='superuser'
    )
    print(f'✅ Admin created: admin / admin@123')

print('\n📋 All Users:')
for user in User.objects.all():
    print(f'   {user.username} ({user.role}) - Active: {user.is_active}')
