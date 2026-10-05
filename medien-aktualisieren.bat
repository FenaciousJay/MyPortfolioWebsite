@echo off
rem Bereitet die Bilder und Videos aus "media-original" fuer die Website auf.
rem Einfach doppelt anklicken.
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Bitte von https://nodejs.org installieren und erneut starten.
  pause
  exit /b 1
)

if not exist "tools\node_modules\sharp" (
  echo Erstmalige Einrichtung: Bildbibliothek wird heruntergeladen ...
  call npm install --prefix tools --no-audit --no-fund
  echo.
)

node tools\medien.mjs
echo.
pause
