@echo off
rem Startet eine lokale Vorschau der Website im Browser (wie online, inkl. YouTube).
rem Einfach doppelt anklicken. Zum Beenden das Fenster schliessen.
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Bitte von https://nodejs.org installieren und erneut starten.
  pause
  exit /b 1
)

node tools\vorschau.mjs
