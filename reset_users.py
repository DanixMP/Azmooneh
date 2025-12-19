#!/usr/bin/env python
"""
Reset all users and create a new professor account
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def reset_users():
    """Delete all users and create new professor"""
    
    # Delete all existing users
    user_count = User.objects.count()
    print(f"Deleting {user_count} existing users...")
    User.objects.all().delete()
    print("All users deleted successfully!")
    
    # Create new professor
    print("\nCreating new professor account...")
    professor = User.objects.create_user(
        username='Tagepour',
        password='T@1171313',
        role='professor',
        first_name='استاد',
        last_name='تاج‌پور',
        email='tagepour@example.com'
    )
    professor.is_staff = True
    professor.save()
    
    print(f"✓ Professor created successfully!")
    print(f"  Username: Tagepour")
    print(f"  Password: T@1171313")
    print(f"  Role: professor")
    print(f"\nDatabase reset complete!")

if __name__ == '__main__':
    reset_users()
