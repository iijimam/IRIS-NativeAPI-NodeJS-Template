#!/bin/bash

# irisnativeモジュールインストールのため、git clone
git clone https://github.com/Intersystems-jp/IRISModules.git
cp -r IRISModules/node/intersystems-iris-native .
cp ./src/package.json .
npm install --save intersystems-iris-native

# サンプルで使用するモジュールをインストール
npm install express --save

