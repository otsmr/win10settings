cd frontend

cmd /c "npm run build"
cd ..

rmdir webpage\demo /s /q
mkdir webpage\demo
xcopy /E /I /y frontend\build webpage\demo

rmdir backend\public /s /q
mkdir backend\public
xcopy /E /I /y frontend\build backend\public