@echo off
echo win10settings is cleaning...

if EXIST bin\win10settings.exe (
    del /f bin\win10settings.exe
)

if EXIST bin (
    rmdir bin
)

echo win10settings binaries are cleaned!