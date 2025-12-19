"""
Quick script to create test users for development
Run: python create_test_users.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        password='admin123',
        email='admin@example.com',
        role='superuser'
    )
    print('✓ Superuser created: admin / admin123')

# Create test professor
if not User.objects.filter(username='prof_test').exists():
    User.objects.create_user(
        username='prof_test',
        password='prof123',
        email='prof@example.com',
        role='professor'
    )
    print('✓ Professor created: prof_test / prof123')

# Create test student
if not User.objects.filter(username='STU001').exists():
    User.objects.create_user(
        username='STU001',
        password='student123',
        student_id='STU001',
        full_name='Test Student',
        role='student'
    )
    print('✓ Student created: STU001 / student123')

print('\nAll test users created successfully!')
