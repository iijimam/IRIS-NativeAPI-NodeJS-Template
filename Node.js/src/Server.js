const http = require('http');
const hostname = 'localhost';
const port = 8080;

var server = http.createServer();
server.on('request', doRequest);

// ファイルモジュールを読み込む
var fs = require('fs');

// リクエストの処理
function doRequest(req, res) {
    
    // ファイルを読み込んだら、コールバック関数を実行する。
    fs.readFile('./graph.html', 'utf-8' , doReard );
    //fs.readFile('./test.html', 'utf-8' , doReard );
    
    // コンテンツを表示する。
    function doReard(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    }
    
}

server.listen(port, hostname, () => {
  console.log(`http://${hostname}:${port}/ にアクセスするとグラフ構造をHTMLで確認できます。`);
  console.log("\n特定の登場人物の関係者を探す場合は、クエリ文字列に人物名を指定してください（Levi, Armin etc..）。");
  console.log(`例）\n http://${hostname}:${port}?Levi`);
  console.log("\nCtrl + C で終了します。")
});