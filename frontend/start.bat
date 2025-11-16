@echo off
echo ========================================
echo    Starting Nava AI Application
echo ========================================
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    Application Started!
echo ========================================
echo.
echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:5173
echo.
echo The language switcher is in the header!
echo You can switch between 7 languages:
echo - English, Hindi, Telugu, Kannada, Tamil, Bengali, Spanish
echo.
echo Press any key to close this window...
pause >nul
