@echo off
title Saint Augustin - Admin Panel
echo.
echo ============================================================
echo   Saint Augustin - Lancement du serveur + panneau admin
echo ============================================================
echo.

cd /d "%~dp0server"

if not exist node_modules (
    echo Installation des dependances... (une seule fois)
    call npm install
    echo.
)

echo Debut du serveur...
start "" cmd /k "cd /d "%~dp0server" && npm start"

echo.
echo Attente du demarrage du serveur...
timeout /t 5 /nobreak >nul

echo Ouverture du panneau admin dans votre navigateur...
start "" "http://localhost:3000/admin"

echo.
echo Le panneau va s'ouvrir. Si rien ne s'affiche, attendez 2 secondes
echo et saisissez cette adresse dans votre navigateur :
echo     http://localhost:3000/admin
echo.
pause