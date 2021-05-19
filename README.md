# **キーバリュー形式**で Node.js から IRIS にアクセスできる実行環境テンプレート（**Native API for Node.js**）

このテンプレートでは、Node.js 用コンテナから InterSystems IRIS のコンテナへ接続し、**レコードでもオブジェくでもない、キーバリュー形式**でのデータ更新／取得を体験できます。

テンプレートの中では、以下の人物相関図のイメージを IRIS に登録しています。

**人物相関図のイメージ**
![](https://github.com/iijimam/doc-images/blob/master/IRIS-NativeAPI-Template/Correlation.gif)

人物相関図と言えば、グラフデータベースをイメージされると思います。

IRIS はグラフデータベースではないのですが、IRIS ネイティブのデータの「**グローバル**」を利用することで、グラフデータベースと似たような構造を表現することができます。

> IRIS の高パフォーマンスを支える **「グローバル」** は 40 年以上前（＝ InterSystems 創業）から InterSystems のコア技術であるデータベースとして提供されてきました。 **「グローバル」** に対する操作方法は、現代のカテゴリに合わせるとしたら NoSQL データベースと言えます。

では、どのようにグラフデータベースのような構造を表現しているか？についてですが、グラフ構造は、ノードと辺から構成されていて、辺は 2 つのノードを結び付けるものです。

SNS の「友達」で考えると、ノードは「ユーザ」、辺は「友達関係」で表現できます。

テンプレートで使用している人物相関図では、ノードは「登場人物」、辺は「登場人物との関係」を表現しています。

**人物相関図のノードと辺（エッジ）**
![](https://github.com/iijimam/doc-images/blob/master/IRIS-NativeAPI-Template/Edge-Node.gif)


ノードと辺を、どのようにグローバル変数に設定しているでしょうか。


ノードは以下の通りです（配列には、画面表示に利用するノードの ID を設定し、右辺に人物名を登録しています）。
```
^Correlation("Eren")="主人公（エレン）"
```

辺（エッジ）は以下の通りです（グローバル変数の配列を利用して、登場人物→関係のある人[ソース→ターゲット]を設定しています）。
>主人公エレンは、アルミン、ミカサ、ジークと関係がある。を表現しています。

```
^Correlation("Eren","Armin")="" 
^Correlation("Eren","Mikasa")=""
^Correlation("Eren","Zeke")=""
```

両者で関係がある場合は、さらに以下のような配列を追加します。

```
^Correlation("Mikasa")="エレンの幼馴染（ミカサ）"
^Correlation("Mikasa","Armin")=""
^Correlation("Mikasa","Eren")=""
```

実際に、IRIS サーバ側で記述する場合には、[ObjectScript](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_objectscript) の SET コマンドを使用してグローバル変数を設定します。

```
set ^Correlation("Eren")="主人公（エレン）"
set ^Correlation("Eren","Mikasa")=""
set ^Correlation("Eren","Armin")=""
set ^Correlation("Eren","Zeke")=""
set ^Correlation("Mikasa")="エレンの幼馴染（ミカサ）"
set ^Correlation("Mikasa","Armin")=""
set ^Correlation("Mikasa","Eren")=""
```

配列のサブスクリプト（括弧の中身）は、配列のノード（例では、第 1 番目と第 2 番目）毎に Unicode 昇順でソートされます。

実行後、管理ポータルなどからグローバル変数一覧を参照すると、実行順に関係なく Unicode 昇順にソートされていることを確認できます。
> 管理ポータルは、[http://localhost:52779/csp/sys/UtilHome.csp](http://localhost:52779/csp/sys/UtilHome.csp) でアクセスできます（ユーザ名：_system　、パスワード：SYS）。

管理ポータル > [システムエクスプローラ] > [グローバル] > 左画面で「ネームスペース」USER を選択 > ^Correlation の「表示」をクリック
![](https://github.com/iijimam/doc-images/blob/master/IRIS-NativeAPI-Template/MP-Global.gif)


ここまでのグローバル変数を Java から設定する場合のコードは以下の通りです。コード全体については [TryNativeAPI-host.py](/Python/TryNativeAPI-host.py) をご参照ください。
```
iris_native.set("主人公（エレン）","Correlation","Eren")
iris_native.set("","Correlation","Eren","Mikasa")
iris_native.set("","Correlation","Eren","Armin")
iris_native.set("","Correlation","Eren","Zeke")

iris_native.set("エレンの幼馴染（ミカサ）","Correlation","Mikasa")
iris_native.set("","Correlation","Mikasa","Armin")
iris_native.set("","Correlation","Mikasa","Eren")
```


## 1) テンプレートの処理概要

開発環境テンプレートでは、Node.js 用コンテナから IRIS 用コンテナへ、レコードでもオブジェクトでもないキーバリュー形式でのアクセスを行うため、[Native API](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_dbnative) を使用しています。

Node.js から [Native API](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_dbnative) を使用するためには、irisnative モジュールのインポートが必要です。

irisnative 用モジュールは、[git](https://github.com/intersystems/quickstarts-nodejs) からダウンロードいただけますが、テンプレートでは手続きをまとめたコンテナとシェル（または batファイル）を用意しています。


## 2) [Native API](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_dbnative) について

Native API は、IRIS 内部のネイティブデータ（＝グローバル変数）を直接操作できる API で [Java](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_dbnative)、[.NET](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_netnative)、[Python](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_pynative)、[Node.js](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_nodenative) からアクセスできます。
> グローバル変数の操作には、IRIS サーバーサイドプログラミングで使用する [ObjectScript](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_objectscript) を利用しますが、Native API を利用することで、[ObjectScript](https://docs.intersystems.com/irislatestj/csp/docbook/Doc.View.cls?KEY=AFL_objectscript) を使用せずにお好みの言語からアクセスすることができます。

また、Native API は、グローバル変数の設定／取得の他にも、クラスメソッド、ルーチン、関数を実行することができます。



## 3) テンプレートの使用方法

テンプレートはコンテナを利用しています。実行に必要なドライバは、コンテナビルド時に準備しています。

Docker、docker-compose、git が利用できる環境でお試しください。

**使用するコンテナのイメージ**
![](https://github.com/iijimam/doc-images2/blob/master/IRIS-NativeAPI-Template/conatiner-python.gif)

データ登録後 [Cytoscape.js](https://js.cytoscape.org/) を利用した HTML でも人物相関を視覚的に確認できるようにしています。

[http://localhost:3000](http://localhost:3000)

> REST 経由でグローバル変数を取得しています。IRIS で作成する REST サーバについてご興味ある方は、ぜひ [こちらの記事](https://jp.community.intersystems.com/node/479546) もご参照ください。

HTML で特定の登場人物の関係者を探す場合は、クエリ文字列に人物名を指定してください（人物名は大小文字を区別します。先頭文字が大文字後は小文字で登録しています）。

 - 例1 [http://localhost:3000?Levi](http://localhost:3000?Levi)

 - 例2 [http://localhost:3000?Armin](http://localhost:3000?Armin)



サンプル実行までの手順は以下の通りです。

- [3-1) ダウンロード (git clone)](#3-1-ダウンロード-git-clone)
- [3-2) Node.js 用コンテナを使う場合](#3-2-Node.js-用コンテナを使う場合)

Node.js の実行をコンテナではなくてホストで行う場合は、以下手順をご参照ください。
- [4-1) Linuxの場合](#4-1-linuxの場合)
- [4-2) Windowsの場合](#4-2-windows-の場合)


### 3-1) ダウンロード (git clone)

```
git clone https://github.com/Intersystems-jp/IRIS-NativeAPI-NodeJS-Template.git
```


### 3-2) Node.js 用コンテナを使う場合

1) コンテナをビルドする方法

    ※ IRIS のイメージのダウンロードや Node.js 用コンテナのイメージのダウンロードやモジュールのインストールを行うため、少し時間がかかります。
    ```
    docker-compose build
    ```

2) コンテナを開始する方法

    ```
    docker-compose up -d
    ```

    
    - 停止したコンテナを再開する方法
        ```
        docker-compose start
        ```

3) サンプルを動かす方法
        ```
        docker-compose run nodejs
        ```

    データを登録した後、登場人物の全関係者一覧します。
    
    その後、特定の登場人物の関係者一覧します。

    **実行例（Jupyter）**
    ![](https://github.com/iijimam/doc-images2/blob/master/IRIS-NativeAPI-Template/Jupyter.gif)

   
4) コンテナを停止する方法
    

    ```
    docker-compose stop
    ```

    コンテナを**破棄したい場合**は **down** を指定して実行します。

    ```
    docker-compose down
    ```

5) Node.js 用コンテナのリビルド

    ※ [ソースコード](./Node.js)を修正した場合、コンテナのリビルドを行ってください。
    
    ```
    docker-compose build nodejs
    ```


## 4) Node.js の実行をホストで行う場合  ≪修正必要！！≫

ホストに、Node.js がインストールされている状態でお試し下さい。

ソースコードは、[TryNativeAPI.js](./Node.js/TryNativeAPI.js) にあります。

Node.js の 接続先 IRIS はコンテナの IRIS を使用しています。

IRIS の接続情報としてホスト名の指定があり、デフォルトは **localhost** が指定されていますが、実行環境に合わせて変更できるようにしています。

詳しくは [4-1) Linuxの場合](#4-1-linux%E3%81%AE%E5%A0%B4%E5%90%88)
 または [4-2) Windowsの場合](#4-2-windows-%E3%81%AE%E5%A0%B4%E5%90%88) ご参照ください。


### 4-1) Linuxの場合

最初に、サンプルコードで使用しているモジュール（networkx、matplotlib、irisnative）をインストールするため、[pipinstall-linux.sh](./Python/pipinstall-linux.sh) を実行します。

```
~/IRIS-NativeAPI-Python-Template$ cd Python
~/IRIS-NativeAPI-Python-Template/Python$ ./pipinstall-linux.sh
```

Python の実行には、[runhost.sh](./Python/runhost.sh) を使用します。

**≪実行前にホスト名を確認してください≫**

Python から IRIS へ接続するときのホスト名に **localhost** を指定しています。

実行環境に合わせてホスト名を変更できるように、[host-params.sh](./Python/host-params.sh) にホスト名を指定し、環境変数に設定しています。

localhost 以外の場合は、[runhost.sh](./Python/runhost.sh) を実行する前に [host-params.sh](./Python/host-params.sh) の以下の行を環境に合わせて変更してください。

```
IRISHOSTNAME="localhost"
```

またサンプルでは、日本語表示を行うため、フォントに **TakaoPGothic** を指定しています。
他のフォントを指定する場合は、[host-params.sh](./Python/host-params.sh) の以下の行を修正してください。

```
SAMPLEFONT="TakaoPGothic"
```

事前準備ができたら、[runhost.sh](./Python/runhost.sh) を実行します。

実行例）
データ登録後、登場人物の全関係者を文字で出力します。その後、特定の登場人物の関係者を networkx を使用
した表示で確認できます（ファイル出力します）。

```
~/IRIS-NativeAPI-Python-Template/Python$ ./runhost.sh
Armin - エレンの幼馴染
（アルミン）
  関係者： Bertolt
  関係者： Eren
  関係者： Mikasa
Bertolt - 超大型の巨人
（ベルトルト）
  関係者： Reiner
  ＜省略＞
******************************
Leviに関連する人物を探します
******************************

networkxの表示を sample1.jpg　に出力しました
----------------------
** 処理終了しました **
----------------------
~IRIS-NativeAPI-Python-Template/Python$
```


### 4-2) Windows の場合

最初に、サンプルコードで使用しているモジュール（networkx、matplotlib、irisnative）をインストールするため、[pipinstall.bat](./Python/pipinstall.bat) を実行します。

```
~/IRIS-NativeAPI-Python-Template> cd Python
~/IRIS-NativeAPI-Python-Template/Python> pipinstall.bat
```

Python の実行には、[runhost.bat](./Python/runhost.bat) を使用します。

**≪実行前にホスト名を確認してください≫**

Python から IRIS へ接続するときのホスト名に **localhost** を指定しています。

実行環境に合わせてホスト名を変更できるように、[host-params.bat](./Python/host-params.bat) にホスト名を指定し、環境変数に設定しています。

localhost 以外の場合は、[runhost.bat](./Python/runhost.bat) を実行する前に [host-params.bat](./Python/host-params.bat) の以下行を環境に合わせて変更してください。

```
SET IRISHOSTNAME=localhost
```

またサンプルでは、日本語表示を行うため、フォントに **MS Gothic** を指定しています。
他のフォントを指定する場合は、[host-params.bat](./Python/host-params.bat) の以下の行を修正してください。

```
SET SAMPLEFONT=MS Gothic
```

事前準備ができたら、[runhost.bat](./Python/runhost.bat) を実行します。

実行例）
データ登録後、登場人物の全関係者を文字で出力します。その後、特定の登場人物の関係者を networkx を使用
した表示で確認できます（ファイル出力します）。

```
~/IRIS-NativeAPI-Python-Template/Python> runhost.bat
Armin - エレンの幼馴染
（アルミン）
  関係者： Bertolt
  関係者： Eren
  関係者： Mikasa
Bertolt - 超大型の巨人
（ベルトルト）
  関係者： Reiner
    ＜省略＞

******************************
Leviに関連する人物を探します
******************************

networkxの表示を sample1.jpg　に出力しました
-----------------------
 ** completed !! **
-----------------------

>
```


**READY SET CODE!!**