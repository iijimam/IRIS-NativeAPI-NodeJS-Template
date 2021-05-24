@echo off
git clone https://github.com/Intersystems-jp/IRISModules.git
copy %CD%\src\package.json %CD%\
call npm install --save IRISModules\node\intersystems-iris-native

call npm install express --save
