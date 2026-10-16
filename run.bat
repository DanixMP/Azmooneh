@echo off
setlocal enabledelayedexpansion
echo Starting Azmooneh System...
echo.

REM Check if virtual environment exists, create if not
if not exist "env" (
    echo Creating virtual environment...
    py -m venv env
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created.
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call env\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Check and install Python dependencies
echo Checking Python dependencies...
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo Python dependencies ready.
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
    echo.
)

REM Start backend in a new window
echo Starting Django backend on port 8000...
start "Backend Server" cmd /k "call env\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in a new window
echo Starting Vite frontend on port 5173...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Waiting for servers to initialize...
timeout /t 5 /nobreak
echo.
echo Opening frontend in browser...
start http://localhost:5173
echo.
pause
