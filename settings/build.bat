@echo off
echo win10settings is being built...

if EXIST bin\win10settings.exe (
    del /f bin\win10settings.exe 
)

g++  -std=gnu++17 -lstdc++fs -fconcepts -I src/log.cpp src/main.cpp src/settings.cpp src/requestparser.cpp src/serverlistener.cpp src/functions.cpp src/core/computer/computer.cpp src/core/filesystem/filesystem.cpp src/core/os/os.cpp src/router.cpp src/auth/authbasic.cpp src/ping/ping.cpp src/core/storage/storage.cpp src/core/debug/debug.cpp src/core/app/app.cpp src/cloud/privileges.cpp src/webv.cpp -lws2_32 -static-libgcc -static-libstdc++ -Wl,-Bstatic -lstdc++ -lpthread -Wl,-Bdynamic -mwindows -Wconversion-null -DWEBVIEW_WINAPI=1 -lole32 -lcomctl32 -loleaut32 -luuid -lgdiplus -mwindows -o bin/win10settings

if EXIST bin\win10settings.exe (
    echo win10settings binary is compiled in to bin/netralino.exe
)

if NOT EXIST bin\win10settings.exe (
    echo ERR : win10settings binary is not compiled
)

@REM TODO: xcopy ../settings/web/build ./bin/app
