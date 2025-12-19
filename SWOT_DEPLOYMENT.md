# SWOT Questions Deployment Guide

## Current Status
- Persian SWOT questions are ready in `create_swot_questions.py`
- Delete script is ready in `delete_swot_questions.py`
- Frontend has SWOT API integration in `src/services/api.ts`

## Deployment Steps

### 1. Connect to VPS
```bash
ssh root@193.151.154.135
# Password: @7Vw*#Fd03Ef
```

### 2. Navigate to Project Directory
```bash
cd /var/www/azmooneh
```

### 3. Pull Latest Code
```bash
git pull origin main
```

### 4. Delete Old Questions
```bash
python delete_swot_questions.py
```

### 5. Create Persian Questions
```bash
python create_swot_questions.py
```

### 6. Verify Questions in Database
```bash
sqlite3 db.sqlite3 "SELECT id, category, question_text FROM swot_swotquestion WHERE is_active=1;"
```

### 7. Restart Gunicorn
```bash
systemctl restart gunicorn
systemctl status gunicorn
```

### 8. Test API Endpoint
First, login as student to get token:
```bash
curl -X POST http://localhost:8000/api/auth/student/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"403663934","password":"student123"}'
```

Then test SWOT questions endpoint (replace TOKEN with the access token from login):
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/swot/questions/
```

### 9. Test in Browser
1. Go to https://roydadapp.ir
2. Login as student: 403663934 / student123
3. Click on SWOT tab
4. Check browser console (F12) for any errors
5. Verify Persian questions are displayed

## Expected Results
- 11 Persian SWOT questions should be created
- Categories: 3 strength, 3 weakness, 2 opportunity, 3 threat
- Questions should appear in the SWOT tab for students
- API should return JSON with Persian text

## Troubleshooting

### If questions don't appear:
1. Check browser console for errors
2. Verify API endpoint returns data: `/api/swot/questions/`
3. Check authentication token is being sent
4. Verify CORS settings in `backend/settings_production.py`

### If API returns 401 Unauthorized:
- Token might be expired, try logging in again
- Check if Authorization header is being sent

### If API returns empty array:
- Run the create script again
- Check database: `sqlite3 db.sqlite3 "SELECT COUNT(*) FROM swot_swotquestion;"`
