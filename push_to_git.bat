@echo off
:: Navigate to the project directory
cd /d "i:\New folder (3)\closerush_new"

echo [1/6] Initializing Git repository...
git init

echo.
echo [2/6] Adding all project files...
:: Using 'git add .' to add all code files in the directory
git add .

echo.
echo [3/6] Committing changes...
git commit -m "first commit"

echo.
echo [4/6] Setting branch to main...
git branch -M main

echo.
echo [5/6] Adding remote origin...
:: Safely remove the origin if it already exists before adding
git remote remove origin >nul 2>&1
git remote add origin https://github.com/trendleapinfo-blip/BEDSHEET.git

echo.
echo [6/6] Pushing to GitHub...
git push -u origin main

echo.
echo ====================================================
echo Git initialization and push completed!
echo ====================================================
pause
