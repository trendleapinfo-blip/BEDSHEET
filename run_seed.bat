@echo off
cd /d "%~dp0"
echo Seeding MongoDB database...
node seed-script.js
pause
