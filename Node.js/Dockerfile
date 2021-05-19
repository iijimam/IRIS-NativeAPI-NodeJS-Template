FROM node:12

WORKDIR /usr/projects

# git の準備
RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/intersystems/quickstarts-nodejs.git && \
    cp -r quickstarts-nodejs/Solutions/intersystems-iris-native . && \
    npm install --save intersystems-iris-native

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY src .

#RUN npm install --save intersystems-iris-native
# 本番用にコードを作成している場合
# RUN npm install --only=production

COPY ./run.sh ./run1.sh
# Windows上でコンテナをビルドする場合の対応
RUN sed -e 's/\r//g' -e "s///" run1.sh > run.sh && \
 chmod 755 ./run.sh

ENTRYPOINT ["/usr/projects/run.sh"]