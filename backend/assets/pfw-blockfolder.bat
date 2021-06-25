@echo off

net session >nul 2>&1
if %errorLevel% == 0 (
    goto gotAdmin
) else (
    echo Administrativen Privilegien werden beantragt...
    powershell.exe Start-Process -Verb runAs -FilePath %0 -ArgumentList %1
    exit /B
)


:gotAdmin

@setlocal enableextensions
@setlocal EnableDelayedExpansion

color 06
title Firewall

set location=%1
@cd /d "%location%"

echo.
echo. ========================================================
echo.  Firewall 1.0
echo.  Homepage: https://gist.github.com/otsmr/d8c03ce64e9d6753f74766007ba736f6
echo. ========================================================
echo.
echo. Folgenden Anwendungen
echo. in %location%
echo. mithilfe der Firewall blockieren.
echo.
echo. ------------------------------------------
FOR /r %%B in (*.exe) do (echo.   %%~nxB)
echo. ------------------------------------------
echo.

CHOICE /C jn /M "> Anwendungen blockieren"
IF Errorlevel 2 goto EXIT
IF Errorlevel 1 goto ADD

:ADD
echo. 
set /p add="> Name der Regel: "

:block
set c=0
echo.
echo.  Eingehende Regeln:
echo. ------------------------------------------
FOR /r %%B in (*.exe) do (
    set /a c=!c!+1
    echo.  !c!. '%%~nxB' wird blockiert... 
    netsh advfirewall firewall add rule name="%add% (%%~nxB)" dir=in action=block program="%%~dpfnxB"
)
echo. ------------------------------------------
echo. 
echo.  Ausgehende Regeln:
echo. ------------------------------------------
set c=0
FOR /r %%B in (*.exe) do (
    set /a c=!c!+1
    echo.  !c!. '%%~nxB' wird blockiert...
    netsh advfirewall firewall add rule name="%add% (%%~nxB)" dir=out action=block program="%%~dpfnxB"
)
echo. ------------------------------------------
echo. 
CHOICE /C jn /M "> Windows Firewall oeffnen?
IF Errorlevel 2 goto EXIT
IF Errorlevel 1 goto OPEN


:OPEN
start "C:\Windows\System32" rundll32.exe shell32.dll,Control_RunDLL firewall.cpl
Goto EXIT


:EXIT
exit
        