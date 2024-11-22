@echo off

:: Navigate to the backend directory
rem Navigate to the directory containing the batch file
cd /d "%~dp0backend"
::cd /d D:\uRecipe-main\uRecipe\backend

rem Run the server using node
echo Starting server...
::node server.js
nodemon server.js

:: Pause to keep the command window open
pause
