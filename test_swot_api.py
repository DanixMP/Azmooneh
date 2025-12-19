#!/usr/bin/env python
import requests
import json

# Login as student
login_url = 'http://localhost:8000/api/auth/student/login/'
login_data = {'username': '403663934', 'password': 'student123'}
response = requests.post(login_url, json=login_data)
print('Login response:', response.status_code)

if response.status_code == 200:
    token = response.json()['access']
    print('✅ Token obtained successfully')
    
    # Get SWOT questions
    swot_url = 'http://localhost:8000/api/swot/questions/'
    headers = {'Authorization': f'Bearer {token}'}
    swot_response = requests.get(swot_url, headers=headers)
    print('SWOT API response:', swot_response.status_code)
    
    if swot_response.status_code == 200:
        questions = swot_response.json()
        print(f'✅ Found {len(questions)} questions')
        for q in questions[:3]:
            cat = q['category']
            text = q['question_text'][:60]
            print(f'  - {cat}: {text}...')
    else:
        print('❌ Error:', swot_response.text)
else:
    print('❌ Login failed:', response.text)
