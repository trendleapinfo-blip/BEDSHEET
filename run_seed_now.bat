@echo off
cd /d "%~dp0"
echo Seeding MongoDB database via API endpoint...
node seed_now.mjs
pause
