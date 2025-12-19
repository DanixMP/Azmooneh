# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend
```bash
# Make sure you're in the project root
python manage.py runserver
```
✅ Backend running at http://localhost:8000

### Step 2: Start Frontend
```bash
# In a new terminal
npm run dev
```
✅ Frontend running at http://localhost:5173

### Step 3: Test the App

#### As Professor:
1. Open http://localhost:5173
2. Click "استاد" (Professor)
3. Login: `prof_test` / `prof123`
4. Click "مدیریت آزمون‌ها" (Manage Exams)
5. Click "ایجاد آزمون جدید" (Create New Exam)
6. Create an exam with questions
7. Publish the exam

#### As Student:
1. Open http://localhost:5173 (in incognito/new browser)
2. Click "دانشجو" (Student)
3. Login: `STU001` / `student123` (or signup)
4. Click "آزمون‌های فعال" (Active Exams)
5. Click "شروع آزمون" (Start Exam)
6. Answer questions
7. Click "ارسال آزمون" (Submit Exam)
8. See your score!

## 📝 Sample Exam Already Created

A sample exam "Python Programming Basics" is already in the database with:
- 1 Single choice question (5 marks)
- 1 Multiple choice question (10 marks)
- 1 True/False question (5 marks)
- 1 Long answer question (15 marks)

Total: 35 marks, 60 minutes

## 🔧 Troubleshooting

### Backend Issues
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python create_test_users.py
python create_sample_exam.py
```

### Frontend Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Make sure backend is running on port 8000 and frontend on port 5173.
Check `backend/settings.py` CORS_ALLOWED_ORIGINS.

### Authentication Issues
Clear browser localStorage and try again.

## 📚 API Endpoints

### Auth
- POST `/api/auth/student/signup/` - Student signup
- POST `/api/auth/professor/login/` - Professor login
- GET `/api/auth/me/` - Get current user

### Exams (Professor)
- GET `/api/exams/` - List exams
- POST `/api/exams/` - Create exam
- POST `/api/exams/{id}/publish/` - Publish exam
- DELETE `/api/exams/{id}/` - Delete exam

### Exams (Student)
- GET `/api/exams/` - List published exams
- POST `/api/student-exams/start_exam/` - Start exam
- POST `/api/student-exams/{id}/submit_answer/` - Submit answer
- POST `/api/student-exams/{id}/submit_exam/` - Submit exam
- GET `/api/student-exams/` - View my exams

## 🎯 What's Working

✅ User authentication (Professor & Student)
✅ Student signup
✅ Create exams with 4 question types
✅ Publish/unpublish exams
✅ Delete exams
✅ View available exams
✅ Take exams with timer
✅ Submit answers
✅ Auto-grading (single, multiple, true/false)
✅ View scores
✅ Persistent sessions (JWT tokens)

## 🔜 Coming Soon

- Professor grading interface for long answers
- Detailed results view
- Student exam history
- Analytics dashboard
- Export results to CSV/PDF
- Exam scheduling
- Question bank
- Randomize questions/choices

## 💡 Tips

- Use Chrome DevTools Network tab to see API calls
- Check browser console for errors
- Backend logs show in terminal
- Use Django admin at http://localhost:8000/admin/ (admin/admin123)
