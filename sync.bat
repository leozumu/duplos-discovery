@echo off
REM Guarda el Code Page original
FOR /F "tokens=1,2 delims=:" %%a IN ('chcp') DO SET original_cp=%%b

REM CRÍTICO: Cambia a UTF-8 (65001) para soportar ñ, tildes, etc.
chcp 65001 > nul

ECHO =======================================
ECHO       SINCRONIZACION RAPIDA DE GIT
ECHO =======================================

REM Pide al usuario que ingrese el mensaje de commit
SET /P MESSAGE=^> Escribe el mensaje de commit (ej: 'Mejora de diseño'): 

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
ECHO Proceso de sincronización completado.

REM Restaura el Code Page original al terminar
chcp %original_cp% > nul
PAUSE