@echo off
:: Navigate to the front-end directory
::cd /d D:\uRecipe-main\uRecipe\front-end
cd /d "%~dp0front-end"

start http://127.0.0.1:8080/landing_page.html

:: Start the server using Node.js
::node server.js
npx http-server

:: Pause to keep the command window open
pause