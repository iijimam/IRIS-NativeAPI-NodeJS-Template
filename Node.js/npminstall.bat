@echo off

npm install express --save

git clone https://github.com/intersystems/quickstarts-nodejs.git
xcopy /E /Y quickstarts-nodejs\Solutions\intersystems-iris-native %CD%\intersystems-iris-native
copy %CD%\src\package.json %CD%
npm install --save intersystems-iris-native