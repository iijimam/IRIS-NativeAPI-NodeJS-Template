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

    let ite1=irisNative.iterator("Relation",source);
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

//IRISへ接続
const connection = irisnativeapi.createConnection(connectionInfo);

//IRISインスタンス生成
const irisNative = connection.createIris();

// ^Relationが存在するとき
if  (irisNative.isDefined("Relation")==1) {

    //グローバル変数を消去
    System.out.println("^Relation を消去します\n");
    irisNative.kill("Relation");        
}

//set ^Relation("Eren")="主人公（エレン）
irisNative.set("主人公（エレン）","Relation","Eren");
irisNative.set("エレンの幼馴染（アルミン）","Relation","Armin");
irisNative.set("エレンの幼馴染（ミカサ）","Relation","Mikasa");
irisNative.set("エレンのお父さん（グリシャ）","Relation","Grisha");
irisNative.set("エレンの異母兄弟（ジーク）","Relation","Zeke");
irisNative.set("鎧の巨人（ライナー）","Relation","Reiner");
irisNative.set("超大型の巨人（ベルトルト）","Relation","Bertolt");
irisNative.set("エレンのお母さん（カルラ）：ダイナに捕食","Relation","Carla");
irisNative.set("ジークのお母さん（ダイナ）：レイス王家[フリッツ家]","Relation","Dina");
irisNative.set("人類最強の兵士（リヴァイ）","Relation","Levi");

//関係性を設定
//set ^Relation("Eren","Mikasa")=""
irisNative.set(null,"Relation","Eren","Mikasa");
irisNative.set(null,"Relation","Eren","Armin");
irisNative.set(null,"Relation","Armin","Mikasa");
irisNative.set(null,"Relation","Mikasa","Armin");
irisNative.set(null,"Relation","Armin","Eren");
irisNative.set(null,"Relation","Mikasa","Eren");
irisNative.set(null,"Relation","Grisha","Eren");
irisNative.set(null,"Relation","Grisha","Zeke");
irisNative.set(null,"Relation","Eren","Zeke");
irisNative.set(null,"Relation","Zeke","Eren");
irisNative.set(null,"Relation","Grisha","Dina");
irisNative.set(null,"Relation","Dina","Grisha");            
irisNative.set(null,"Relation","Grisha","Carla");
irisNative.set(null,"Relation","Carla","Grisha");
irisNative.set(null,"Relation","Dina","Carla");
irisNative.set(null,"Relation","Armin","Bertolt");
irisNative.set(null,"Relation","Reiner","Bertolt");
irisNative.set(null,"Relation","Bertolt","Reiner");
irisNative.set(null,"Relation","Levi","Zeke");


console.log("\n****　第1ノードに登録された人の関係者を全件表示します　****");

let ite1=irisNative.iterator("Relation");
for ([source,data] of ite1) {
    console.log("source"+"-"+data);
    let ite2=irisNative.iterator("Relation",source);
    for ([target] of ite2) {
        console.log("   関係者：",target);
    }
}

console.log("==================================================================");
console.log("管理ポータル > システムエクスプローラー > グローバル \n 接続したネームスペースに切り替え ^Relation を参照してください");
console.log("==================================================================");

(async function main() {
    const name = await readUserInput('\n指定した人物の関係者を探します。人物名を入力（Armin、Levi、Zeke など） >>');
    getTagets(irisNative,name,1);

    console.log("\n **** 終わり ****\n");
    //接続断
    connection.close()
})();
