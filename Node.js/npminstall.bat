@echo off
git clone https://github.com/intersystems/quickstarts-nodejs.git
copy %CD%\src\package.json %CD%\
xcopy /E /Y quickstarts-nodejs\Solutions\intersystems-iris-native %CD%\intersystems-iris-native\
npm install --save intersystems-iris-native

npm install express --save
