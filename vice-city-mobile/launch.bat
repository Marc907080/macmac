@echo off
:: VICE CITY: STREET LIFE - Windows Launch Script
:: This script starts a local server to run the game

echo ============================================
echo VICE CITY: STREET LIFE
echo ============================================
echo.
echo Starting local development server...
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python's built-in HTTP server...
    python -m http.server 3000
) else (
    :: Check if Node.js is available
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo Using Node.js with live-server...
        npx live-server --port=3000
    ) else (
        echo.
        echo ERROR: Neither Python nor Node.js found!
        echo.
        echo Please install one of them:
        echo - Python: https://www.python.org/downloads/
        echo - Node.js: https://nodejs.org/
        echo.
        echo Alternatively, you can open index.html directly in Chrome.
        pause
        exit /b 1
    )
)

echo.
echo Server started! Open your browser and navigate to:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server.
