@echo off
rem Navigate to the directory containing the batch file
cd /d "%~dp0backend"
::cd /d D:\uRecipe-main\uRecipe\backend

rem Open the Node.js website in the default web browser
start https://nodejs.org/en

rem Install all dependencies
echo Installing dependencies...
npm install

pause
