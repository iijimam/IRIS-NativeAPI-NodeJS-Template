@echo off
git clone https://github.com/Intersystems-jp/IRISModules.git
copy %CD%\src\package.json %CD%\
xcopy /E /Y IRISModules\node\intersystems-iris-native %CD%\intersystems-iris-native\
call npm install --save intersystems-iris-native

call npm install express --save
