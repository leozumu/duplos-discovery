@echo off
ECHO =======================================
ECHO       SINCRONIZACION RAPIDA DE GIT
ECHO =======================================

REM Pide al usuario que ingrese el mensaje de commit
SET /P MESSAGE="-> Escribe el mensaje de commit (ej: 'ACTUALIZAR'): "

ECHO.
ECHO [1/3] Añadiendo todos los archivos...
git add .

ECHO.
ECHO [2/3] Creando commit con el mensaje: "%MESSAGE%"
git commit -m "%MESSAGE%"

ECHO.
ECHO [3/3] Enviando cambios a GitHub...
git push

ECHO.
ECHO Sincronización finalizada.
ECHO Vercel ha detectado los cambios y esta reconstruyendo la app.
PAUSE