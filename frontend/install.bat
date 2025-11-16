@echo off
echo ========================================
echo    Nava AI - Installation Helper
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org/
    echo 2. Download the LTS version
    echo 3. Run the installer
    echo 4. Restart this command prompt
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed!
node --version

echo.
echo Checking if npm is available...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo ✅ npm is available!
npm --version

echo.
echo ========================================
echo    Installing Dependencies
echo ========================================
echo.

echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo ✅ All dependencies installed successfully!
echo.
echo To start the application:
echo 1. Run: npm run dev (for frontend)
echo 2. Run: cd server && npm start (for backend)
echo.
echo The language switcher will be visible in the header!
echo.
pause
