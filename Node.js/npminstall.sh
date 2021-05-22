#!/bin/bash

# サンプルで使用するモジュールをインストール
npm install express --save

# irisnativeモジュールインストールのため、git clone
git clone https://github.com/intersystems/quickstarts-nodejs.git
cp -r quickstarts-nodejs/Solutions/intersystems-iris-native .
cp ./src/package.json .
npm install --save intersystems-iris-native