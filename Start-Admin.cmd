@echo off
title Saint Augustin - Admin Panel
echo.
echo ============================================================
echo   Saint Augustin - Start server + admin panel
echo ============================================================
echo.

cd /d "%~dp0server"

if not exist node_modules (
    echo Installing dependencies... (one time only)
    call npm install
    echo.
)

echo Starting the server...
start "" cmd /k "cd /d "%~dp0server" && npm start"

echo.
echo Waiting for the server to start...
timeout /t 5 /nobreak >nul

echo Opening the admin panel in your browser...
start "" "http://localhost:3000/admin"

echo.
echo The admin panel opens automatically. If blank, wait 2 seconds
echo and type this address in your browser:
echo     http://localhost:3000/admin
echo.
pause