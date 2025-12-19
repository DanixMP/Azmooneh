
# Azmooneh Exam App

Full-stack Exam and Test App with Django REST backend and React frontend.

## 🚀 Quick Start

**Backend** (Terminal 1):
```bash
python manage.py runserver
```
✅ Backend is currently running!

**Frontend** (Terminal 2):
```bash
npm run dev
```

**Open**: http://localhost:5173

**Important**: Clear browser storage first!
```javascript
// In browser console (F12):
localStorage.clear();
```

**✅ Authentication Fixed**: Now uses real API validation (no more hardcoded logins)
**✅ UI Improved**: One question at a time, better navigation, fixed scrolling

**Test Connection**: Click the "Connection Test" button in bottom-right corner

See `UI_IMPROVEMENTS.md` for UI changes and `EXAM_NAVIGATION_GUIDE.md` for how to use.

## Features

### User Roles
- **Superuser**: Admin access (development)
- **Professor**: Create exams, manage questions, grade submissions
- **Student**: Take exams, view results

### Question Types
1. **Single Choice** - One correct answer
2. **Multiple Choice** - Multiple correct answers  
3. **True/False** - Boolean questions
4. **Long Answer** - Text responses (manual grading)

### Auto-Grading
Objective questions (single, multiple, true/false) are auto-graded instantly.
Long answers require manual grading by professors.

---

## Backend (Django)

### Quick Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create test users and sample exam
python create_test_users.py
python create_sample_exam.py

# Start server
python manage.py runserver
```

### Test Users
- **Superuser**: admin / admin123
- **Professor**: prof_test / prof123
- **Student**: STU001 / student123

### API Endpoints
- `POST /api/auth/student/signup/` - Student registration
- `POST /api/auth/professor/login/` - Professor login
- `POST /api/exams/` - Create exam (professor)
- `POST /api/student-exams/start_exam/` - Start exam (student)
- `POST /api/student-exams/{id}/submit_answer/` - Submit answer
- `POST /api/student-exams/{id}/submit_exam/` - Submit exam

See `backend/README.md` and `backend/API_DOCS.md` for complete documentation.

### Test API
```bash
# Make sure server is running first
python test_api.py
```

---

## Frontend (React + TypeScript)

### Quick Start
```bash
# Install dependencies
npm i

# Start development server (make sure backend is running first)
npm run dev
```

### Features
- ✅ Professor login and exam management
- ✅ Student signup/login and exam taking
- ✅ Create exams with 4 question types
- ✅ Real-time exam timer
- ✅ Auto-grading for objective questions
- ✅ Responsive Persian (RTL) UI

### Test Credentials
**Professor**: prof_test / prof123  
**Student**: STU001 / student123

See `FRONTEND_GUIDE.md` for detailed documentation.

Original design: https://www.figma.com/design/Fa5eY7F4urS4ULR7BKBkn0/Azmooneh-Exam-App-Design

---

## Project Structure

```
├── backend/              # Django project settings
├── accounts/             # User authentication & roles
├── exams/                # Exam management & grading
├── src/                  # React frontend
├── create_test_users.py  # Setup test users
├── create_sample_exam.py # Create sample exam
├── test_api.py           # API testing script
└── requirements.txt      # Python dependencies
```
  