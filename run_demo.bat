@echo off
echo ========================================================
echo Launching FairGov AI Fullstack Environment
echo ========================================================
cd /d "%~dp0"
start "FairGov AI Backend (Port 8000)" cmd /k run_backend.bat
start "FairGov AI Frontend (Port 5173)" cmd /k run_frontend.bat
echo Both services launched!
echo Access the web application at http://localhost:5173
echo Backend API documentation at http://127.0.0.1:8000/docs
