#!/bin/bash
rm -rf IRISModules
# irisnativeモジュールインストールのため、git clone
git clone https://github.com/Intersystems-jp/IRISModules.git
npm install --save IRISModules/node/intersystems-iris-native

# サンプルで使用するモジュールをインストール
npm install express --save
