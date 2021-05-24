FROM node:12

WORKDIR /usr/projects

COPY src .

# git で必要なモジュールダウンロード＋npm install
RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/Intersystems-jp/IRISModules.git && \
    cp -r IRISModules/node/intersystems-iris-native . && \
    npm install --save intersystems-iris-native && \
    npm install express --save

EXPOSE 8080
CMD ["node","Server.js"]