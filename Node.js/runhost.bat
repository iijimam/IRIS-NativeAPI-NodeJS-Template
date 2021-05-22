@echo off
call host-params.bat
node ./src/NativeAPITest.js
node ./src/Server.js