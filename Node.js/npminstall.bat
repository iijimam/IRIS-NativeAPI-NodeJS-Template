@echo off

npm install express --save

git clone https://github.com/Intersystems-jp/IRISModules.git
copy %CD%\src\package.json %CD%\
xcopy /E /Y IRISModules\node\intersystems-iris-native %CD%\intersystems-iris-native\
npm install --save intersystems-iris-native

