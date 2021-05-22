const express = require('express');
const port = 8080;

const app=express();

// 8080番ポートで待ちうける
app.listen(port, () => {

  console.log('Running at Port 8080...');
  console.log(`\nhttp://localhost:${port}/ にアクセスするとグラフ構造をHTMLで確認できます。`);
  console.log(`※ ホスト名は環境に合わせて変更してください ※`);
  console.log("\nCtrl + C で終了します。")

});

// ファイルモジュールを読み込む
var fs = require('fs');

// 静的ファイルのルーティング
app.use(express.static(__dirname));

app.get('/graph',(req,res) => {
  // ファイルを読み込んだら、コールバック関数を実行する。
  fs.readFile('./graph.html', 'utf-8' , doReard );
  // コンテンツを表示する。
  function doReard(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
  }
});

// その他のリクエストに対する404エラー
app.use((req, res) => {
  res.sendStatus(404);
});
