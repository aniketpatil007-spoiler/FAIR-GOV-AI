@echo off
echo ========================================================
echo Running FairGov AI Complete Automated Test Suite (Pytest)
echo ========================================================
cd /d "%~dp0"
call .venv\Scripts\activate
pytest -v
pause
