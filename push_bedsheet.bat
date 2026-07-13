@echo off
:: Navigate to project directory
cd /d "%~dp0"

echo [1/5] Initializing Git repository...
git init

echo.
echo [2/5] Adding README.md...
:: If you want to add ALL files instead of just README.md, change "README.md" to "." below
git add README.md

echo.
echo [3/5] Committing changes...
git commit -m "first commit"

echo.
echo [4/5] Setting branch and remote...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/trendleapinfo-blip/BEDSHEET.git

echo.
echo [5/5] Pushing to GitHub...
git push -u origin main

echo.
echo ====================================================
echo Push completed!
echo ====================================================
pause
