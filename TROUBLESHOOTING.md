# 🔧 Troubleshooting Connection Issues

## Quick Diagnosis

### 1. Check Backend is Running
```bash
# Should see: Starting development server at http://127.0.0.1:8000/
python manage.py runserver
```

### 2. Test Backend API Directly
Open `test_connection.html` in your browser and click the test buttons.

### 3. Check Frontend Port
The frontend should run on port **5173** (default Vite) or **3000** (configured in vite.config.ts).

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Browser console shows "CORS policy" error

**Solution**: Update `backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # Vite config
]
```

### Issue 2: Wrong Port
**Symptom**: Frontend runs on different port than expected

**Solution A**: Update vite.config.ts to use port 5173:
```typescript
server: {
  port: 5173,  // Change from 3000
  open: true,
},
```

**Solution B**: Or add your port to Django CORS settings.

### Issue 3: API URL Mismatch
**Symptom**: Network errors, 404 responses

**Check**: `src/services/api.ts` line 1:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Issue 4: Authentication Not Working
**Symptom**: "Authentication credentials were not provided"

**Solution**: Clear browser localStorage and login again:
```javascript
// In browser console:
localStorage.clear();
```

### Issue 5: Backend Not Responding
**Symptom**: Connection refused, ERR_CONNECTION_REFUSED

**Check**:
1. Backend is running: `python manage.py runserver`
2. No firewall blocking port 8000
3. Try: `http://127.0.0.1:8000/api/` instead of `localhost`

## Step-by-Step Connection Test

### 1. Test Backend Directly
```bash
# Windows PowerShell
$body = @{username='prof_test'; password='prof123'} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/auth/professor/login/" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

Expected: Status 200, JSON with access token

### 2. Test CORS
Open browser console on `http://localhost:5173` and run:
```javascript
fetch('http://localhost:8000/api/auth/professor/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'prof_test', password: 'prof123' })
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e));
```

### 3. Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login in the app
4. Look for requests to `localhost:8000`
5. Check response status and headers

## Configuration Checklist

### Backend (`backend/settings.py`)
- [ ] `CORS_ALLOWED_ORIGINS` includes your frontend URL
- [ ] `CORS_ALLOW_CREDENTIALS = True`
- [ ] `'corsheaders'` in `INSTALLED_APPS`
- [ ] `'corsheaders.middleware.CorsMiddleware'` in `MIDDLEWARE` (before CommonMiddleware)

### Frontend (`src/services/api.ts`)
- [ ] `API_BASE_URL = 'http://localhost:8000/api'`
- [ ] Token stored in localStorage
- [ ] Headers include Authorization when needed

### Vite (`vite.config.ts`)
- [ ] Server port matches CORS settings
- [ ] No proxy configuration conflicting

## Debug Mode

### Enable Verbose Logging

**Backend** - Add to `backend/settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

**Frontend** - Add to `src/services/api.ts`:
```typescript
private async request(url: string, options: RequestInit) {
  console.log('🔵 API Request:', url, options);
  const response = await fetch(url, options);
  console.log('🟢 API Response:', response.status, response.statusText);
  return response;
}
```

## Still Not Working?

### Nuclear Option: Fresh Start
```bash
# Backend
rm db.sqlite3
rm -rf accounts/migrations/0*.py
rm -rf exams/migrations/0*.py
python manage.py makemigrations
python manage.py migrate
python create_test_users.py
python create_sample_exam.py

# Frontend
rm -rf node_modules package-lock.json
npm install
```

### Check Ports in Use
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# If port is blocked, kill the process or use different port
```

## Working Configuration

### Confirmed Working Setup:
- Backend: `http://localhost:8000` (Django)
- Frontend: `http://localhost:5173` (Vite)
- CORS: Configured for both ports
- JWT: Stored in localStorage
- API calls: Using fetch with Bearer token

### Test Credentials:
- Professor: `prof_test` / `prof123`
- Student: `STU001` / `student123`

## Get Help

1. Check browser console for errors
2. Check Django terminal for request logs
3. Use `test_connection.html` to isolate issue
4. Review `FRONTEND_GUIDE.md` for API usage
5. Check `backend/API_DOCS.md` for endpoint details
