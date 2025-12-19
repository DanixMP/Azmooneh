#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import authenticate
from accounts.models import CustomUser

# Check if user exists
try:
    user = CustomUser.objects.get(username='403663934')
    print(f'✅ User found: {user.username}, role: {user.role}')
    print(f'   Is active: {user.is_active}')
    print(f'   Has password: {user.has_usable_password()}')
    
    # Try to authenticate
    auth_user = authenticate(username='403663934', password='student123')
    if auth_user:
        print('✅ Authentication successful!')
    else:
        print('❌ Authentication failed - password incorrect')
        
except CustomUser.DoesNotExist:
    print('❌ User not found')
