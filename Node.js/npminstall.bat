@echo off
rd /s /q IRISModules
git clone https://github.com/Intersystems-jp/IRISModules.git
copy IRISModules\node\intersystems-iris-native\package.json %CD%\
call npm install --save IRISModules\node\intersystems-iris-native

call npm install express --save
