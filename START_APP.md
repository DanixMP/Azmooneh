# 🚀 Start Application

## Prerequisites
- Python 3.x installed
- Node.js installed
- Backend dependencies installed: `pip install -r requirements.txt`
- Frontend dependencies installed: `npm install`

## Start Both Servers

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
python manage.py runserver
```
✅ Backend running at: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend running at: http://localhost:5173

### Option 2: Background Process (Windows)

**Start Backend:**
```powershell
Start-Process python -ArgumentList "manage.py","runserver" -WindowStyle Minimized
```

**Start Frontend:**
```bash
npm run dev
```

## Verify Connection

1. Open http://localhost:5173 in your browser
2. You should see a "Connection Test" button in the bottom-right corner
3. Click it to test the backend connection
4. If successful, you'll see ✅ SUCCESS message

## Test Login

### Professor Login:
- Username: `prof_test`
- Password: `prof123`

### Student Login:
- Student ID: `STU001`
- Password: `student123`

Or create a new student account via signup.

## Troubleshooting

### Backend Not Starting?
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# If database issues
python manage.py migrate
```

### Frontend Not Starting?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Connection Test Fails?
1. Make sure backend is running on port 8000
2. Make sure frontend is running on port 5173
3. Check browser console for CORS errors
4. See `TROUBLESHOOTING.md` for detailed help

### CORS Errors?
Backend `settings.py` should have:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## Quick Test Workflow

1. **Start Backend** → Wait for "Starting development server"
2. **Start Frontend** → Browser opens automatically
3. **Click Connection Test** → Should see ✅ SUCCESS
4. **Login as Professor** → Create an exam
5. **Publish Exam** → Click status button
6. **Login as Student** (new browser/incognito) → Take exam
7. **Submit Exam** → See score!

## Ports Used

- **8000** - Django Backend API
- **5173** - Vite Frontend Dev Server

## API Endpoints

All endpoints are at: `http://localhost:8000/api/`

- `/auth/student/signup/` - Student registration
- `/auth/professor/login/` - Professor login  
- `/exams/` - Exam management
- `/student-exams/` - Student exam taking

See `backend/API_DOCS.md` for complete API reference.

## Stop Servers

**Backend**: Press `Ctrl+C` in terminal

**Frontend**: Press `Ctrl+C` in terminal

## Database Reset (if needed)

```bash
rm db.sqlite3
python manage.py migrate
python create_test_users.py
python create_sample_exam.py
```

## Success Indicators

✅ Backend: "Starting development server at http://127.0.0.1:8000/"
✅ Frontend: "Local: http://localhost:5173/"
✅ Connection Test: Shows ✅ SUCCESS with user data
✅ Login: Redirects to dashboard
✅ Exams: Can create/view/take exams

## Need Help?

1. Check `TROUBLESHOOTING.md`
2. Open `test_connection.html` in browser
3. Check browser console (F12)
4. Check Django terminal for errors
5. Verify all dependencies installed
