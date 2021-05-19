const irisnativeapi = require('intersystems-iris-native');

// ユーザからのキーボード入力を取得する Promise を生成する
function readUserInput(question) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve, reject) => {
        readline.question(question, (answer) => {
          resolve(answer);
          readline.close();
        });
      });
}

// 指定の登場人物の関係者を取得する
function getTagets(irisNative,source,count) {
    if (count>3) {
        return;
    }
    var result=[]
    console.log("\n"+source+" の関係者を探します");

    let ite1=irisNative.iterator("Correlation",source);
    for ([target] of ite1) {
        console.log("   関係者：",target);
        result.push(target);
    }

    for (const element of result) {
        getTagets(irisNative,element,count+1);
    }
}

//環境変数 process.env.xxx
//ホスト実行時以下環境変数を利用している
hostname = process.env.IRISHOSTNAME;
if (!hostname) {
    hostname="nativeapi-iris";
}

//接続
let connectionInfo = {
    "host": hostname,
    "port": 1972,
    "ns":"USER",
    "user":"_SYSTEM",
    "pwd":"SYS"
};

console.log(connectionInfo);
//IRISへ接続
const connection = irisnativeapi.createConnection(connectionInfo);

//IRISインスタンス生成
const irisNative = connection.createIris();

// ^Correlationが存在するとき
if  (irisNative.isDefined("Correlation")==1) {

    //グローバル変数を消去
    System.out.println("^Correlation を消去します\n");
    irisNative.kill("Correlation");        
}

//set ^Correlation("Eren")="主人公（エレン）
irisNative.set("主人公（エレン）","Correlation","Eren");
irisNative.set("エレンの幼馴染（アルミン）","Correlation","Armin");
irisNative.set("エレンの幼馴染（ミカサ）","Correlation","Mikasa");
irisNative.set("エレンのお父さん（グリシャ）","Correlation","Grisha");
irisNative.set("エレンの異母兄弟（ジーク）","Correlation","Zeke");
irisNative.set("鎧の巨人（ライナー）","Correlation","Reiner");
irisNative.set("超大型の巨人（ベルトルト）","Correlation","Bertolt");
irisNative.set("エレンのお母さん（カルラ）：ダイナに捕食","Correlation","Carla");
irisNative.set("ジークのお母さん（ダイナ）：レイス王家[フリッツ家]","Correlation","Dina");
irisNative.set("人類最強の兵士（リヴァイ）","Correlation","Levi");

//関係性を設定
//set ^Correlation("Eren","Mikasa")=""
irisNative.set("","Correlation","Eren","Mikasa");
irisNative.set("","Correlation","Eren","Armin");
irisNative.set("","Correlation","Armin","Mikasa");
irisNative.set("","Correlation","Mikasa","Armin");
irisNative.set("","Correlation","Armin","Eren");
irisNative.set("","Correlation","Mikasa","Eren");
irisNative.set("","Correlation","Grisha","Eren");
irisNative.set("","Correlation","Grisha","Zeke");
irisNative.set("","Correlation","Eren","Zeke");
irisNative.set("","Correlation","Zeke","Eren");
irisNative.set("","Correlation","Grisha","Dina");
irisNative.set("","Correlation","Dina","Grisha");            
irisNative.set("","Correlation","Grisha","Carla");
irisNative.set("","Correlation","Carla","Grisha");
irisNative.set("","Correlation","Dina","Carla");
irisNative.set("","Correlation","Armin","Bertolt");
irisNative.set("","Correlation","Reiner","Bertolt");
irisNative.set("","Correlation","Bertolt","Reiner");
irisNative.set("","Correlation","Levi","Zeke");


console.log("\n****　第1ノードに登録された人の関係者を全件表示します　****");

let ite1=irisNative.iterator("Correlation");
for ([source,data] of ite1) {
    console.log("source"+"-"+data);
    let ite2=irisNative.iterator("Correlation",source);
    for ([target] of ite2) {
        console.log("   関係者：",target);
    }
}

console.log("==================================================================");
console.log("管理ポータル > システムエクスプローラー > グローバル \n 接続したネームスペースに切り替え ^Correlation を参照してください");
console.log("==================================================================");

(async function main() {
    const name = await readUserInput('\n指定した人物の関係者を探します。人物名を入力（Armin、Levi、Zeke など） >>');
    getTagets(irisNative,name,1);

    console.log("\n **** 終わり ****\n");
    //接続断
    connection.close()
})();
