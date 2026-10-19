@echo off
echo ========================================================
echo Starting FairGov AI FastAPI Backend Server on port 8000
echo ========================================================
cd /d "%~dp0"
call .venv\Scripts\activate
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
pause
