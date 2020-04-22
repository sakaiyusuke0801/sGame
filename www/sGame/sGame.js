// sakai.y
const sGame = (function () {
    /*************** 定数 ****************/
    // フレームレート
    const FRAME_LATE = 1000 / 30;
    // フォント・サイズ
    const FONT_SIZE = "20px monospace";
    // Box2dの1mに相当するピクセル数
    const BOX2D_MET_PIX = 30.0;
    /*************************************/

    /************ グローバル *************/
    // 定数じゃないけど大文字
    // 仮想画面サイズ（86:9）：横
    let V_WIDTH = 360;
    // 仮想画面サイズ（86:9）：縦
    let V_HEIGHT = 640;
    // フォント
    const FONT = "monospace";

    // cordovaかどうか
    const isCordova = window.cordova ? true : false;
    // 起動時イベントの文字列
    let startEventStr = "deviceready";
    if (!isCordova) {
        startEventStr = "DOMContentLoaded";
    }

    // 描画画面
    let gDScreen = null;
    // 描画画面コンテキスト
    let gDCon = null;
    // メイン画面
    let gMScreen = null;
    // メイン画面コンテキスト
    let gMCon = null;
    // 描画画面：横
    let gDWidth = 0;
    // 描画画面：縦
    let gDHeight = 0;
    // 描画画面の左上x
    let gDPosX = 0;
    // 描画画面の左上y
    let gDPosY = 0;
    // 描画画面と仮想画面の拡縮率x
    let gDVScaleRateX = 0;
    // 描画画面と仮想画面の拡縮率y
    let gDVScaleRateY = 0;
    // シーンスタック
    let gSceneStack = [];
    // タッチorマウスオン判定
    let gTouchOn = false;
    // タッチorマウスオンオフ判定
    let gTouchOnOff = false;
    // タッチorマウス座標x
    let gTouchX = 0;
    // タッチorマウス座標y
    let gTouchY = 0;
    // タッチorマウス移動座標x
    let gTouchMoveX = 0;
    // タッチorマウス移動座標y
    let gTouchMoveY = 0;
    // タッチorマウスで離したときの座標x
    let gTouchOffX = 0;
    // タッチorマウスで離したときの座標y
    let gTouchOffY = 0;
    // フレームカウンター
    let gFrame = 0;
    // シーンデバッグモード
    let gSceneDebugMode = false;

    // Box2dの剛体タイプ
    let sBox2dBodyType = {
        "StaticBody": 0,
        "KinematicBody": 1,
        "DynamicBody": 2,
    };

    /*************************************/

    /************* リソース **************/

    /*************************************/

    /************** クラス ***************/
    // シーンクラス
    // デモをまとめて管理をする
    class Scene {
        constructor(_name) {
            // シーン名
            this.name = _name;
            // シーン起動からのフレーム数
            this.frame = 0;
            // 描画領域
            this.canvas = document.createElement("canvas");;
            // 描画コンテキスト
            this.context = this.canvas.getContext("2d");
            // サイズ設定
            this.canvas.width = V_WIDTH;
            this.canvas.height = V_HEIGHT;
            // リソースオブジェクト
            this.res = null;
            // データオブジェクト
            this.data = null;
            // データのコピー（作成時の状態）
            this.data_copy = null;
            // デモオブジェクト
            this.demo = {};
            // 開始処理
            this.start = null;
            // 更新処理
            this.update = null;
            // スタート処理終了フラグ
            this.started = false;
            // 物理世界
            this.world = null;
        }
        // 初期化処理
        init() {
            // フレーム数初期化
            this.frame = 0;
            // 開始完了フラグ初期化
            this.started = false;
        }
        // データの初期化 ※別のシーンでもデータを共有する場合があるため初期化にはいれない。任意でデータは初期化してもらう。
        initData(_data) {
            // 対象の参照されているデータを直接受け取り初期化
            if (this.data_copy != null) {
                _data = Object.assign({}, this.data_copy);
            }
        }
        // リソースの取得
        getRes(_name) {
            if (this.res != null) {
                return this.res.res["_name"];
            }
            return null;
        }
        // 起動時処理
        startFunc() {
            // リソースのロードが完了していなければロードを呼び出す
            if (this.res != null && this.res.isLoaded == false) {
                this.res.load();
            }
            // 開始処理起動
            if (this.start != null) {
                this.start(this);
            }
            // スタート処理終了フラグON
            this.started = true;
        }
        // 描画キャンバスの取得
        getCanvas() {
            return this.canvas;
        }
        // デモの追加
        addDemo(_demo) {
            // デモ配列にデモを追加
            //this.demo.push(_demo);
            this.demo[_demo.name] = _demo;

            // 世界がONなら
            if (this.world != null) {
                // デモを世界に登録
                this.worldAddDemo(_demo);
            }
        }
        // デモの削除
        delDemo(_name) {
            delete this.demo[_name];
        }
        // リソースのセット
        setRes(_res) {
            this.res = _res;
        }
        // データのセット
        setData(_data) {
            this.data = _data;
            // データのコピーをとっておく
            this.data_copy = Object.assign({}, _data);
        }
        // スタート処理のセット
        setStart(_start) {
            this.start = _start;
        }
        // 更新処理のセット
        setUpdate(_update) {
            this.update = _update;
        }
        // BGM再生
        startBGM(_media) {
            try {
                // cordovaの場合
                if (isCordova) {
                    // 再生開始（ループ再生）
                    _media.play({ numberOfLoops: "infinite" });
                }
                // cordovaではない場合
                else {
                    // ループ属性付与
                    _media.loop = true;
                    // 時間0
                    _media.currentTime = 0;
                    // 再生
                    _media.play();
                }
            }
            catch (e) {
                console.log("BGM再生失敗");
            }
        }
        // BGM停止
        stopBGM(_media) {
            try {
                // 再生開始
                _media.stop();
            }
            catch (e) {
                console.log("BGM停止失敗");
            }
        }
        // フレーム処理
        updateFunc() {

            // 開始処理が行われていなければ行う
            if (!this.started) {
                this.startFunc();
            }

            // フレーム加算
            this.frame++;

            // リソースのロードチェックを毎フレーム行う
            if (this.res != null) {
                try {
                    // チェック関数呼び出し
                    this.res.chkLoad();
                }
                catch (e) {
                    // リソースが正しく設定されていない
                    console.log("リソースが正しく設定されていません");
                }
            }

            // ロードが完了していなければ行わない
            if (this.res == null || this.res.isLoaded) {
                // シーンのフレーム処理
                if (this.update != null) {
                    this.update(this, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY);
                }

                // デモのフレーム処理
                if (Object.keys(this.demo).length != 0) {
                    for (let key in this.demo) {
                        this.demo[key].updateFunc(this);

                        // 世界が設定されていれば世界の更新をデモに反映させる
                        if (this.world != null) {
                            // 世界に設定されているボディの取得
                            for (let body = this.world.GetBodyList(); body; body = body.GetNext()) {
                                // 動的なボディ
                                if (body.GetType() == sBox2dBodyType.DynamicBody) {
                                    // 位置の取得
                                    let position = body.GetPosition();
                                    // ユーザーデータの取得
                                    let userData = body.GetUserData();
                                    try {
                                        // ユーザーデータでアクセスして位置を反映
                                        this.demo[userData].pos_x = position.x * BOX2D_MET_PIX;
                                        this.demo[userData].pos_y = position.y * BOX2D_MET_PIX;
                                    } catch (e) {
                                        // なにもしない
                                    }
                                }
                            }
                        }
                    }
                }

                // Box2dのフレーム処理
                if (this.world != null) {
                    // 物理世界を更新する
                    this.world.Step(1 / 30, 10, 10);
                    // デバック描画
                    this.world.DrawDebugData();
                    // 物理世界上の力をリセットする
                    this.world.ClearForces();
                }
            }
        }
        // デモの描画
        draw() {
            // 下地
            this.context.fillStyle = "#000000";
            this.context.fillRect(0, 0, gDScreen.width, gDScreen.height);

            // ロードが完了
            if (this.res == null || this.res.isLoaded) {

                if (Object.keys(this.demo).length != 0) {
                    for (let key in this.demo) {
                        if (this.res == null) {
                            // デモのドロー関数にコンテキストとリソースオブジェクトを渡す
                            this.demo[key].draw(this.context, null, this.data);
                        }
                        else {
                            // デモのドロー関数にコンテキストとリソースオブジェクトを渡す
                            this.demo[key].draw(this.context, this.res.res, this.data);
                        }
                    }
                }

                if (this.world != null) {
                    // デバッグ描画の設定
                    let debugDraw = new Box2D.Dynamics.b2DebugDraw();
                    debugDraw.SetSprite(this.context);
                    //描画スケール
                    debugDraw.SetDrawScale(BOX2D_MET_PIX);
                    //半透明値
                    debugDraw.SetFillAlpha(1.0);
                    //線の太さ
                    debugDraw.SetLineThickness(1.0);
                    debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);// 何をデバッグ描画するか
                    this.world.SetDebugDraw(debugDraw);
                }
            }
            // ロード中画面
            else {
                this.context.fillStyle = "#FFFFFF";
                this.context.font = FONT_SIZE;
                let nowLoading = "Now Loading...";

                this.context.fillText(nowLoading,
                    (V_WIDTH / 2) - 50, V_HEIGHT / 2);
                this.context.fillText(Math.floor((this.res.loaded_num / this.res.res_num) * 100) + "%",
                    (V_WIDTH / 2) - 20, V_HEIGHT / 2 + 30);
            }
        }
        // ワールドON
        worldOn(_gravity) {
            // 使用するBox2D周りのオブジェクト

            // 2Dベクトル
            let b2Vec2 = Box2D.Common.Math.b2Vec2
                // 物理世界
                , b2World = Box2D.Dynamics.b2World;

            // 世界を作る
            this.world = new b2World(new b2Vec2(0, _gravity), true);

            // 描画されているデモに剛体を割り当てる
            if (Object.keys(this.demo).length != 0) {
                for (let key in this.demo) {
                    // デモを世界に登録
                    this.worldAddDemo(this.demo[key]);
                }
            }
        }
        // ワールドOFF
        worldOff() {
            // 世界を削除
            this.world = null;
        }
        // 追加したデモを剛体として世界へ登録
        worldAddDemo(_demo) {
            // 2Dベクトル
            let b2Vec2 = Box2D.Common.Math.b2Vec2
                // Body定義
                , b2BodyDef = Box2D.Dynamics.b2BodyDef
                // Body
                , b2Body = Box2D.Dynamics.b2Body
                // Fixture定義
                , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
                // Fixture
                , b2Fixture = Box2D.Dynamics.b2Fixture
                // 物理世界
                , b2World = Box2D.Dynamics.b2World
                // 衝突オブジェクトの形状（ポリゴン）
                , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
                // 衝突オブジェクトの形状（円）
                , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
                // マウスジョイント
                , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
                // AABB(axis-aligned bounding box)
                , b2AABB = Box2D.Collision.b2AABB;
            // 対象のデモ
            if (_demo.type_name == "TextureDemo" ||
                _demo.type_name == "ChipTextureDemo" ||
                _demo.type_name == "CircleDemo" ||
                _demo.type_name == "RectDemo" ||
                _demo.type_name == "FontDemo") {

                // ボディ
                let bodyDef = new b2BodyDef;
                bodyDef.type = _demo.body;

                // ローテンション
                bodyDef.fixedRotation = _demo.fixedRotation;

                // 材質
                var fixDef = new b2FixtureDef;
                // 密度
                fixDef.density = _demo.density;
                // 摩擦係数
                fixDef.friction = _demo.friction;
                // 反発係数
                fixDef.restitution = _demo.restitution;

                // 円は円
                if (_demo.type_name == "CircleDemo") {
                    fixDef.shape = new b2CircleShape((_demo.radius - _demo.line) / BOX2D_MET_PIX);
                }
                else {
                    fixDef.shape = new b2PolygonShape;

                    fixDef.shape.SetAsOrientedBox(((_demo.width) / BOX2D_MET_PIX) - 0.92, ((_demo.height / 2.0) / BOX2D_MET_PIX), new b2Vec2(0, 0), 0.0);
                    //fixDef.shape.SetAsBox((_demo.width / 2.0) / BOX2D_MET_PIX, (_demo.height / 2.0) / BOX2D_MET_PIX);
                }
                bodyDef.position.Set(_demo.pos_x / BOX2D_MET_PIX, _demo.pos_y / BOX2D_MET_PIX);
                // 名前でユーザーデータの紐づけ
                bodyDef.userData = _demo.name;
                // ボディと材質を世界にセットする
                this.world.CreateBody(bodyDef).CreateFixture(fixDef);
            }
        }
    }
    // リソースクラス
    class Resouce {
        constructor(_name, _res) {
            // 名前
            this.name = _name;
            // リソースオブジェクト
            this.res = _res;
            // リソースオブジェクトのコピー
            this.res_copy = Object.assign({}, _res);
            // リソースの数
            this.res_num = Object.keys(this.res).length;
            // ロードが完了したリソース数
            this.loaded_num = 0;
            // ロード中か
            this.isLoading = false;
            // ロード終了済か
            this.isLoaded = false;
        }
        // 初期化（リソースはnull）
        init() {
            this.res = null;
            this.res_copy = null;
            this.res_num = Object.keys(this.res).length;
            this.loaded_num = 0;
            this.isLoading = false;
            this.isLoaded = false;
        }
        // リソースは再セット
        setRes(_res) {
            this.res = _res;
            this.res_copy = Object.assign({}, _res);
            this.res_num = Object.keys(this.res).length;
            this.isLoading = false;
            this.isLoaded = false;
        }
        // wwwまでのフルパスを取得する
        getPath() {
            let str = location.pathname;
            let i = str.lastIndexOf('/');
            return str.substring(0, i + 1);
        }
        // ロード数更新
        incLoadedNum() {
            this.loaded_num++;
        }
        // ロード
        load() {
            if (this.res_num != 0 && this.isLoaded == false && this.isLoading == false) {
                // ロード中フラグON
                this.isLoading = true;
                // リソースの分だけ実施
                for (let key in this.res) {
                    let str = this.res[key].split('.').pop();
                    // PNG
                    if (str == 'png') {
                        // イメージ生成
                        let img = new Image();
                        // オブジェクトからソースを取得
                        img.src = this.res[key];
                        // ロード関数フック
                        img.addEventListener("load", this.incLoadedNum.bind(this));
                        // 仮で上の関数のスコープがむずいので
                        //this.loaded_num++;
                        // オブジェクトの値にimgオブジェクトを格納する
                        this.res[key] = img;
                    }
                    // mp3 or wav
                    else if (str == 'mp3' ||
                        str == 'wav') {

                        // cordovaの場合
                        if (isCordova) {
                            // media生成
                            let srcPath = this.getPath() + this.res[key];
                            let media = new Media(srcPath);
                            // mediaは拾えないので無条件で加算
                            this.loaded_num++;

                            // オブジェクトの値にimgオブジェクトを格納する
                            this.res[key] = media;
                        }
                        // cordovaではない場合
                        else {
                            // オーディオオブジェクト
                            let audio = new Audio();
                            // オブジェクトからソースを取得
                            audio.src = this.res[key];
                            // ロード関数フック
                            audio.addEventListener("canplaythrough", this.incLoadedNum.bind(this));
                            // オブジェクトの値にimgオブジェクトを格納する
                            this.res[key] = audio;
                        }
                    }
                    else {
                        // 上記以外は無条件にロード済数をインクリメント
                        this.loaded_num++;
                    }
                }
            }
        }
        // プリロード
        preLoad() {
            this.load();
        }
        // ロードが完了したかのチェック
        chkLoad() {
            if (this.res_num <= this.loaded_num) {
                // ロード数がリソース数を上回ればロード済にする
                this.isLoaded = true;
                // ロード中フラグ落とす
                this.isLoading = false;
            }
        }
    }
    // サイズクラス
    class Size {
        constructor(_w, _h) {
            this.w = _w;
            this.h = _h;
        }
        getHelfW() {
            return Math.floor(this.w / 2);
        }
        getHelfH() {
            return Math.floor(this.h / 2);
        }
    }
    // 位置クラス
    class Pos {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        // ワールド座標
        getWorldPosX() {
            return this.x / BOX2D_MET_PIX;
        }
        getWorldPosY() {
            return this.y / BOX2D_MET_PIX;
        }
    }
    // スケールクラス
    class Scale {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
    }
    // デモ基底クラス
    class Demo {
        constructor(_name) {
            /* プロパティ */
            // デモ名
            this.name = _name;
            // リソースインデックス
            this.res = null;
            // サイズ
            this.size = new Size(V_WIDTH, V_HEIGHT);
            // 位置
            this.pos = new Pos(V_WIDTH/2, V_HEIGHT/2);
            // 拡縮
            this.scale = new Scale(1.0, 1.0);
            // 透過
            this.alpha = 1.0;

            /* Box2dプロパティ */
            // ローテーション
            this.fixedRotation = false;
            // 密度
            this.density = 1.0;
            // 摩擦係数
            this.friction = 1.5;
            // 反発係数
            this.restitution = 0.5;
            // Box2dの剛体属性（初期値は静的）
            this.body = sBox2dBodyType.DynamicBody;

            /* リスナー */
            // 更新処理関数
            this.update = null;
        }
        // サウンド再生
        startSound(_media) {
            try {
                // cordovaの場合
                if (isCordova) {
                    // 再生開始（単発再生）
                    _media.play();
                }
                // cordovaではない場合
                else {
                    // ループしない
                    _media.loop = false;
                    // 時間0
                    _media.currentTime = 0;
                    // 再生
                    _media.play();
                }
            }
            catch (e) {
                console.log("サウンド再生失敗");
            }
        }
        // サウンド停止
        stopSound(_media) {
            try {
                // 再生開始
                _media.stop();
            }
            catch (e) {
                console.log("サウンド停止失敗");
            }
        }
        // フレーム処理
        updateFunc(_scene) {
            if (this.update != null) {
                // 登録関数を実行
                this.update(_scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY);
            }
        }
        // フレーム処理セット
        setUpdate(_update) {
            this.update = _update;
        }
        // 自身との当り判定
        isHit(_x, _y, _w, _h) {
            // 宣言
            let myTop, myBottom, myLeft, myRight;

            // 円デモorフォントデモの時
            if (this.type_name == "CircleDemo" || this.type_name == "FontDemo") {
                // 自身の位置
                myTop = this.pos_y - (this.height / 2);
                myBottom = this.pos_y + (this.height / 2);
                myLeft = this.pos_x - (this.width / 2);
                myRight = this.pos_x + (this.width / 2);
            }
            else {
                // 自身の位置
                myTop = this.pos_y;
                myBottom = this.pos_y + this.height;
                myLeft = this.pos_x;
                myRight = this.pos_x + this.width;
            }
            // 相手の位置
            const targetTop = _y;
            const targetBottom = _y + _h;
            const targetLeft = _x;
            const targetRight = _x + _w;

            // 返却
            return (myTop < targetBottom && targetTop < myBottom) &&
                (myLeft < targetRight && targetLeft < myRight);
        }
        // 他デモとの当り判定
        isHitDemo(_demo) {
            // 宣言
            let myTop, myBottom, myLeft, myRight;
            let targetTop, targetBottom, targetLeft, targetRight;

            // 円デモorフォントデモの時
            if (this.type_name == "CircleDemo" || this.type_name == "FontDemo") {
                // 自身の位置
                myTop = this.pos_y - (this.height / 2);
                myBottom = this.pos_y + (this.height / 2);
                myLeft = this.pos_x - (this.width / 2);
                myRight = this.pos_x + (this.width / 2);
            }
            else {
                // 自身の位置
                myTop = this.pos_y;
                myBottom = this.pos_y + this.height;
                myLeft = this.pos_x;
                myRight = this.pos_x + this.width;
            }
            // 円デモorフォントデモの時
            if (_demo.type_name == "CircleDemo" || _demo.type_name == "FontDemo") {
                // 相手の位置
                targetTop = _demo.pos_y - (_demo.height / 2);
                targetBottom = _demo.pos_y + (_demo.height / 2);
                targetLeft = _demo.pos_x - (_demo.width / 2);
                targetRight = _demo.pos_x + (_demo.width / 2);
            }
            else {
                // 相手の位置
                targetTop = _demo.pos_y;
                targetBottom = _demo.pos_y + _demo.height;
                targetLeft = _demo.pos_x;
                targetRight = _demo.pos_x + _demo.width;
            }
            // 返却
            return (myTop < targetBottom && targetTop < myBottom) &&
                (myLeft < targetRight && targetLeft < myRight);
        }
    }

    // テクスチャデモクラス
    // 一枚絵を扱うデモ
    class TextureDemo extends Demo {
        constructor(_name) {
            // 親クラス呼び出し
            super(_name);
            // タイプ名
            this.type_name = "TextureDemo";
        }
        // 描画処理
        draw(g, _res, _data) {
            try {
                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;
                // 描画開始
                g.drawImage(
                    // イメージオブジェクト
                    _res[this.res],
                    // 描画範囲開始
                    0, 0,
                    // 描画範囲終了
                    this.size.w, this.size.h,
                    // 描画位置（アンカーが真ん中になるように）
                    (this.pos.x - this.size.getHelfW()), (this.pos.y - this.size.getHelfH()),
                    // サイズ
                    (this.size.w * this.scale.x), (this.size.h * this.scale.y)
                );
                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name);
            }
        }
    }
    // タイルクラス
    class Tile {
        constructor(_col, _row) {
            this.col = _col;
            this.row = _row;
        }
    }
    // チップテクスチャデモ
    class ChipTextureDemo extends Demo {
        constructor(_name) {
            // 親クラス呼び出し
            super(_name);
            // 現在のインデックス
            this.now = 1;
            // タイルサイズ
            this.tile = new Tile(3, 3);
            // タイプ名
            this.type_name = "ChipTextureDemo";
        }
        // 描画処理
        draw(g, _res, _data) {
            try {
                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;
                // 描画開始
                g.drawImage(
                    // イメージオブジェクト                       
                    _res[this.res],
                    // 描画範囲開始x
                    (this.now - 1 % this.tile.col) * this.size.w,
                    // 描画範囲開始y
                    Math.floor((this.now - 1) / this.tile.col) * this.size.h,
                    // 描画範囲終了
                    this.size.w, this.size.h,
                    // 描画位置（アンカーが真ん中になるように）
                    (this.pos.x - this.size.getHelfW()), (this.pos.y - this.size.getHelfH()),
                    // サイズ
                    this.size.w * this.scale.x, this.size.h * this.scale.y);
                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name);
            }
        }
    }
    // 図形クラス
    class Shape {
        constructor(_color, _line, _fill) {
            // 色
            this.color = _color;
            // 線の幅
            this.line = _line;
            // 塗りつぶすか
            this.fill = _fill;
        }
    }

    // 円デモ
    class CircleDemo extends Demo {
        constructor(_name) {
            // 親クラス呼び出し
            super(_name);
            // 半径
            this.r = 100;
            // サイズも半径に合わせる
            this.size.w = this.r * 2;
            this.size.h = this.r * 2;
            // 図形プロパティ
            this.shape = new Shape("#FFFFFF", 5, false);
            // タイプ名
            this.type_name = "CircleDemo";
        }
        // 描画処理
        draw(g, _res, _data) {
            try {
                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;
                // パスリセット
                g.beginPath();
                // 円描画
                g.arc(this.pos.x, this.pos.y,
                    (this.r * this.scale.x), 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                // 塗りつぶし
                if (this.shape.fill) {
                    g.fillStyle = this.shape.color;
                    g.fill();
                }
                // 塗りつぶしではない
                else {
                    g.strokeStyle = this.shape.color;
                    g.lineWidth = this.shape.line;
                    g.stroke();
                }
                // 半径によって幅とか変わるので更新
                this.size.w = this.r * 2;
                this.size.h = this.r * 2;

                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name);
            }
        }
    }

    // 四角形デモ
    class RectDemo extends Demo {
        constructor(_name) {
            // 親クラス呼び出し
            super(_name);
            // 図形プロパティ
            this.shape = new Shape("#FFFFFF", 5, false);
            // タイプ名
            this.type_name = "RectDemo";
        }
        // 描画処理
        draw(g, _res, _data) {
            try {
                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;
                // パスリセット
                g.beginPath();
                // 四角形描画
                g.rect(
                    // 描画位置（アンカーが真ん中になるように）
                    (this.pos.x - this.size.getHelfW()), (this.pos.y - this.size.getHelfH()),
                    // サイズ
                    this.size.w * this.scale.x, this.size.h * this.scale.y);
                // 塗りつぶし
                if (this.shape.fill) {
                    g.fillStyle = this.shape.color;
                    g.fill();
                }
                // 塗りつぶしではない
                else {
                    g.strokeStyle = this.shape.color;
                    g.lineWidth = this.shape.line;
                    g.stroke();
                }
                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name);
            }
        }
    }
    // フォントデモ
    class FontDemo extends Demo {
        constructor(_name) {
            // 親クラス呼び出し
            super(_name);
            // 高さ
            this.size.h = 20;
            // テキスト
            this.text = "New Text";
            // 色
            this.color = "#FFFFFF";
            // タイプ名
            this.type_name = "FontDemo";
        }
        // 描画処理
        draw(g, _res, _data) {
            try {
                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;
                // 色
                g.fillStyle = this.color;
                // サイズ、フォント
                g.font = this.height + "px " + FONT;
                // 中央詰め
                g.textAlign = "center";
                // ベースラインも中央
                g.textBaseline = "middle";

                // 描画
                g.fillText(this.text, this.pos.x, this.pos.y, this.size.w);

                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name);
            }
        }
    }
    // マップ基底クラス
    class MapDemo {
        constructor(_name, _res_idx, _wall_array, _w_chip_width, _w_chip_height, _w_num_x, _w_num_y, _width = V_WIDTH, _height = V_HEIGHT, _d_pos_x = 0, _d_pos_y = 0, _pos_x = 0, _pos_y = 0, _alpha = 1) {
            this.name = _name;
            this.res_idx = _res_idx;
            this.wall_array = _wall_array;
            this.w_chip_width = _w_chip_width;
            this.w_chip_height = _w_chip_height;
            this.w_num_x = _w_num_x;
            this.w_num_y = _w_num_y;
            this.width = _width;
            this.height = _height;
            this.d_pos_x = _d_pos_x;
            this.d_pos_y = _d_pos_y;
            this.pos_x = _pos_x;
            this.pos_y = _pos_y;
            this.alpha = _alpha;
            this.update = null;

            // プレイヤーデモ
            this.playerDemo = null;
            // 衝突範囲（プレイヤーの左上を起点として）
            this.hit_range_x = 0;
            this.hit_range_y = 0;
            this.hit_range_w = 0;
            this.hit_range_h = 0;

            // マップを描画するキャンバス
            this.canvas = document.createElement("canvas");
            // マップを描画するコンテキスト
            this.context = this.canvas.getContext("2d");
        }
        // フレーム処理
        updateFunc(_scene) {
            if (this.update != null) {
                // 登録関数を実行
                this.update(_scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY);
            }
        }
        // フレーム処理セット
        setUpdate(_update) {
            this.update = _update;
        }
        // プレイヤーデモセット
        setPlayerDemo(_demo, _hit_range_x, _hit_range_y, _hit_range_w, _hit_range_h) {
            if (_demo != null) {
                // 今のところ以下３つのデモ
                if (_demo.type_name == "TextureDemo" ||
                    _demo.type_name == "ChipTextureDemo" ||
                    _demo.type_name == "RectDemo") {
                    this.playerDemo = _demo;
                    this.hit_range_x = _hit_range_x;
                    this.hit_range_y = _hit_range_y;
                    this.hit_range_w = _hit_range_w;
                    this.hit_range_h = _hit_range_h;
                }
            }
        }
        // ローカル関数
        pixel_1_Move(_x, _y) {
            // 移動後のd_pox座標
            let a_d_pos_x = this.d_pos_x + _x;
            let a_d_pos_y = this.d_pos_y + _y;

            // プレイヤーが設定されている
            if (this.playerDemo != null) {
                // プレイヤーの座標
                let playerX = this.playerDemo.pos_x;
                let playerY = this.playerDemo.pos_y;

                // プレイヤー位置の補正判断
                let isPlayerCenterX = false;
                let isPlayerCenterY = false;

                // プレイヤーが真ん中ではない
                if (((playerX) + (this.playerDemo.width / 2)) != ((this.width / 2) + this.pos_x)) {
                    // 仮移動
                    let temp = playerX + _x;
                    // プレイヤーがマップからはみ出ないようにする
                    if (((temp + (this.playerDemo.width)) < (this.width + this.pos_x)) &&
                        ((temp) > this.pos_x)) {
                        playerX = temp;
                    }
                    // 画面は動かさない
                    a_d_pos_x = this.d_pos_x;
                    // フラグON
                    isPlayerCenterX = true;
                }
                // プレイヤーが真ん中ではない
                if (((playerY) + (this.playerDemo.height / 2)) != ((this.height / 2) + this.pos_y)) {
                    // 仮移動
                    let temp = playerY + _y;
                    // プレイヤーがマップからはみ出ないようにする
                    if (((temp + (this.playerDemo.height)) < (this.height + this.pos_y)) &&
                        ((temp) > this.pos_y)) {
                        playerY = temp;
                    }
                    // 画面は動かさない
                    a_d_pos_y = this.d_pos_y;
                    // フラグON
                    isPlayerCenterY = true;
                }


                // 補正済ではない
                if (!isPlayerCenterX) {
                    // 仮移動
                    let temp = playerX;
                    // 描画範囲がキャンバスの範囲を超えていたらキャンバスの最大値や最小値にする
                    if ((a_d_pos_x + (this.width + this.pos_x)) > this.canvas.width) {
                        a_d_pos_x = a_d_pos_x - ((a_d_pos_x + (this.width + this.pos_x)) - this.canvas.width);
                        // 代わりにプレイヤーを動かす
                        temp = playerX + _x;
                    }
                    if (a_d_pos_x < 0) {
                        a_d_pos_x = 0;
                        // 代わりにプレイヤーを動かす
                        temp = playerX + _x;
                    }
                    // プレイヤーがマップからはみ出ないようにする
                    if (((temp + (this.playerDemo.width)) < (this.width + this.pos_x)) &&
                        ((temp) > this.pos_x)) {
                        playerX = temp;
                    }
                }
                // 補正済ではない
                if (!isPlayerCenterY) {
                    // 仮移動
                    let temp = playerY;
                    // 描画範囲がキャンバスの範囲を超えていたらキャンバスの最大値や最小値にする
                    if ((a_d_pos_y + (this.height + this.pos_y)) > this.canvas.height) {
                        a_d_pos_y = a_d_pos_y - ((a_d_pos_y + (this.height + this.pos_y)) - this.canvas.height);
                        // 代わりにプレイヤーを動かす
                        temp = playerY + _y;
                    }
                    if (a_d_pos_y < 0) {
                        a_d_pos_y = 0;
                        // 代わりにプレイヤーを動かす
                        temp = playerY + _y;
                    }
                    // プレイヤーがマップからはみ出ないようにする
                    if (((temp + (this.playerDemo.height)) < (this.height + this.pos_y)) &&
                        ((temp) > this.pos_y)) {
                        playerY = temp;
                    }
                }

                // その場所のチップインデックスを左上、右上、左下、右下の四隅取得
                let idx_lt, idx_rt, idx_lb, idx_rb;

                // 左上
                idx_lt = ((Math.floor((((playerY + this.hit_range_y) - this.pos_y) + a_d_pos_y) / this.w_chip_height)) * this.w_num_x) + (Math.floor((((playerX + this.hit_range_x) - this.pos_x) + a_d_pos_x) / this.w_chip_width));
                // 右上
                idx_rt = ((Math.floor((((playerY + this.hit_range_y) - this.pos_y) + a_d_pos_y) / this.w_chip_height)) * this.w_num_x) + (Math.floor(((((playerX + this.hit_range_x) - this.pos_x) + this.hit_range_w) + a_d_pos_x) / this.w_chip_width));
                // 左下
                idx_lb = ((Math.floor(((((playerY + this.hit_range_y) - this.pos_y) + this.hit_range_h) + a_d_pos_y) / this.w_chip_height)) * this.w_num_x) + (Math.floor((((playerX + this.hit_range_x) - this.pos_x) + a_d_pos_x) / this.w_chip_width));
                // 右下
                idx_rb = ((Math.floor(((((playerY + this.hit_range_y) - this.pos_y) + this.hit_range_h) + a_d_pos_y) / this.w_chip_height)) * this.w_num_x) + (Math.floor(((((playerX + this.hit_range_x) - this.pos_x) + this.hit_range_w) + a_d_pos_x) / this.w_chip_width));

                // 四隅のどこかに壁がある
                if (this.wall_array[idx_lt] ||
                    this.wall_array[idx_rt] ||
                    this.wall_array[idx_lb] ||
                    this.wall_array[idx_rb]) {
                    // 移動しない
                }
                // 四隅のどこにも壁はないなら移動する
                else {
                    this.d_pos_x = a_d_pos_x;
                    this.d_pos_y = a_d_pos_y;
                    this.playerDemo.pos_x = playerX;
                    this.playerDemo.pos_y = playerY;
                }
            }
            // プレイヤーが設定されていなければそのまま移動
            else {
                this.d_pos_x = a_d_pos_x;
                this.d_pos_y = a_d_pos_y;
            }
        }
        // プレイヤーの移動
        movePlayerToX(_x) {
            // 移動値分繰り返し
            for (let i = 0; i < Math.abs(_x); i++) {
                if (_x < 0) {
                    this.pixel_1_Move(-1, 0);
                }
                else {
                    this.pixel_1_Move(1, 0);
                }
            }
        }
        // プレイヤーの移動
        movePlayerToY(_y) {
            // 移動値分繰り返し
            for (let i = 0; i < Math.abs(_y); i++) {
                if (_y < 0) {
                    this.pixel_1_Move(0, -1);
                }
                else {
                    this.pixel_1_Move(0, 1);
                }
            }
        }
        // そこが壁かどうかの判定
        isWall(_x, _y) {
            return this.wall_array[((Math.floor((_y + this.d_pos_y) / this.w_chip_height)) * this.w_num_x) + (Math.floor((_x + this.d_pos_x) / this.w_chip_width))] == 1;
        }
    }
    // チップマップクラス
    class ChipMapDemo extends MapDemo {
        constructor(_name, _res_idx, _idx_array, _wall_array, _w_chip_width, _w_chip_height, _idx_num_x, _idx_num_y, _w_num_x, _w_num_y, _width = V_WIDTH, _height = V_HEIGHT, _d_pos_x = 0, _d_pos_y = 0, _pos_x = 0, _pos_y = 0, _alpha = 1) {

            // 親クラス呼び出し
            super(_name, _res_idx, _wall_array, _w_chip_width, _w_chip_height, _w_num_x, _w_num_y, _width, _height, _d_pos_x, _d_pos_y, _pos_x, _pos_y, _alpha);

            // マップ構成配列
            this.idx_array = _idx_array;
            // マップ配列の縦横数
            this.idx_num_x = _idx_num_x;
            this.idx_num_y = _idx_num_y;

            // キャンバスサイズ
            this.canvas.width = (this.w_num_x * this.w_chip_width);
            this.canvas.height = (this.w_num_y * this.w_chip_height);

            // タイプ名
            this.type_name = "ChipMapDemo";
        }
        // 描画処理
        draw(g, _res, _data) {
            try {

                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;

                // 縦チップ
                for (let y = 0; y < this.w_num_y; y++) {
                    // 横チップ
                    for (let x = 0; x < this.w_num_x; x++) {
                        try {
                            this.context.drawImage(_res[this.res_idx],
                                ((this.idx_array[y * this.w_num_x + x] - 1) % this.idx_num_x) * this.w_chip_width,
                                Math.floor((this.idx_array[y * this.w_num_x + x] - 1) / this.idx_num_x) * this.w_chip_height,
                                this.w_chip_width, this.w_chip_height,
                                x * this.w_chip_width, y * this.w_chip_height,
                                this.w_chip_width, this.w_chip_height);
                        }
                        catch (e) {
                            console.log("デモ描画エラー:" + this.name + " ① ");
                        }
                    }
                }

                // 描画範囲がキャンバスの範囲を超えていたらキャンバスの最大値や最小値にする
                if ((this.d_pos_x + this.width) > this.canvas.width) {
                    this.d_pos_x = this.d_pos_x - ((this.d_pos_x + this.width) - this.canvas.width);
                }
                if ((this.d_pos_y + this.height) > this.canvas.height) {
                    this.d_pos_y = this.d_pos_y - ((this.d_pos_y + this.height) - this.canvas.height);
                }
                if (this.d_pos_x < 0) {
                    this.d_pos_x = 0;
                }
                if (this.d_pos_y < 0) {
                    this.d_pos_y = 0;
                }

                // 実際の描画
                g.drawImage(this.canvas, this.d_pos_x, this.d_pos_y, this.width, this.height, this.pos_x, this.pos_y, this.width, this.height);

                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name + " ② ");
            }
        }
    }
    // テクスチャマップクラス
    class TextureMapDemo extends MapDemo {
        constructor(_name, _res_idx, _wall_array, _w_chip_width, _w_chip_height, _w_num_x, _w_num_y, _w_width, _w_height, _width = V_WIDTH, _height = V_HEIGHT, _d_pos_x = 0, _d_pos_y = 0, _pos_x = 0, _pos_y = 0, _alpha = 1) {

            // 親クラス呼び出し
            super(_name, _res_idx, _wall_array, _w_chip_width, _w_chip_height, _w_num_x, _w_num_y, _width, _height, _d_pos_x, _d_pos_y, _pos_x, _pos_y, _alpha);

            // テクスチャのサイズ
            this.w_width = _w_width;
            this.w_height = _w_height;

            // キャンバスサイズ
            this.canvas.width = this.w_width;
            this.canvas.height = this.w_height;

            // タイプ名
            this.type_name = "TextureMapDemo";
        }
        // 描画処理
        draw(g, _res, _data) {

            try {
                // コンテキスト一時保存
                g.save();
                // 透明度
                g.globalAlpha = this.alpha;

                try {
                    // 描画
                    this.context.drawImage(_res[this.res_idx], 0, 0, this.w_width, this.w_height);
                }
                catch (e) {
                    console.log("デモ描画エラー:" + this.name + " ① ");
                }

                // 描画範囲がキャンバスの範囲を超えていたらキャンバスの最大値や最小値にする
                if ((this.d_pos_x + this.width) > this.canvas.width) {
                    this.d_pos_x = this.d_pos_x - ((this.d_pos_x + this.width) - this.canvas.width);
                }
                if ((this.d_pos_y + this.height) > this.canvas.height) {
                    this.d_pos_y = this.d_pos_y - ((this.d_pos_y + this.height) - this.canvas.height);
                }
                if (this.d_pos_x < 0) {
                    this.d_pos_x = 0;
                }
                if (this.d_pos_y < 0) {
                    this.d_pos_y = 0;
                }

                // 実際の描画
                g.drawImage(this.canvas, this.d_pos_x, this.d_pos_y, this.width, this.height, this.pos_x, this.pos_y, this.width, this.height);

                // コンテキストをsave時に戻す
                g.restore();
            }
            catch (e) {
                console.log("デモ描画エラー:" + this.name + " ② ");
            }
        }
    }
    /*************************************/

    /************ モジュール *************/
    // フレーム処理
    let mExeFrame = function () {
        // フレームカウンターの加算
        gFrame++;

        // シーン処理
        if (gSceneStack.length != 0) {
            // シーンのアップデート
            gSceneStack[gSceneStack.length - 1].updateFunc();
            // シーンの描画
            gSceneStack[gSceneStack.length - 1].draw();

            // タッチオフが立っていたら落とす
            if (gTouchOnOff) {
                gTouchOnOff = false;
            }
        }

        // 仮想画面描画
        mVDraw();
        // メイン画面描画
        mMDraw();
    };
    // メイン画面リサイズ
    let mMReSizeScreen = function () {
        // スムージング描画
        gMCon.imageSmoothingEnabled = true;

        // キャンバスサイズ変更
        gMScreen.width = window.innerWidth;
        gMScreen.height = window.innerHeight;

        // 描画画面サイズの設定
        gDWidth = gMScreen.width;
        gDHeight = gMScreen.height;

        // アスペクト比を維持して最大描画
        if ((gDWidth / V_WIDTH) < (gDHeight / V_HEIGHT)) {
            gDHeight = gDWidth * V_HEIGHT / V_WIDTH;
        }
        else {
            gDWidth = gDHeight * V_WIDTH / V_HEIGHT;
        }

        // 描画画面の左上を計算
        gDPosX = (gMScreen.width / 2) - (gDWidth / 2);
        gDPosY = 0;

        // 実画面と仮想画面の拡縮率を計算
        gDVScaleRateX = Math.min(gDWidth / V_WIDTH);
        gDVScaleRateY = Math.min(gDHeight / V_HEIGHT);
    };
    // 仮想画面への描画
    let mVDraw = function () {
        // 下地
        gDCon.fillStyle = "#221b22";
        gDCon.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // シーンキャンバスの描画
        if (gSceneStack.length != 0) {
            gDCon.drawImage(gSceneStack[gSceneStack.length - 1].getCanvas(),
                0, 0,
                V_WIDTH, V_HEIGHT,
                0, 0,
                V_WIDTH, V_HEIGHT);
        }

        // シーンデバッグモードなら
        if (gSceneDebugMode) {
            gDCon.fillStyle = "#FFFFFF";
            gDCon.font = FONT_SIZE;
            gDCon.fillText("一番下にあるシーンが描画されてます。",
                10, 30, 300);
            gDCon.fillStyle = "#FFFFFF";
            gDCon.font = FONT_SIZE;
            gDCon.fillText("シーンの数：" + gSceneStack.length,
                10, 55, 100);
            for (let i = 0; i < gSceneStack.length; i++) {
                gDCon.fillStyle = "#FFFFFF";
                gDCon.font = FONT_SIZE;
                gDCon.fillText("シーン[" + i + "] =" + gSceneStack[i].name,
                    10, 80 + (i * 25), 300);
            }
        }
    };
    // メイン画面への描画
    let mMDraw = function () {
        // 下地
        gMCon.fillStyle = "#000000";
        gMCon.fillRect(0, 0, gMScreen.width, gMScreen.height);

        // 仮想画面の描画（アスペクト比を維持して拡大）
        gMCon.drawImage(gDScreen, 0, 0, gDScreen.width, gDScreen.height, gDPosX, gDPosY, gDWidth, gDHeight);
    };
    /*************************************/

    /************* イベント **************/
    // ウィンドウ読み込み時orデバイス準備完了時
    document.addEventListener(startEventStr, function () {

        // 仮想画面生成
        gDScreen = document.createElement("canvas");
        // 仮想画面のコンテキスト取得
        gDCon = gDScreen.getContext("2d");
        // 仮想画面のサイズ設定
        gDScreen.width = V_WIDTH;
        gDScreen.height = V_HEIGHT;

        // メイン画面の取得
        gMScreen = document.getElementById("sGame");
        // メイン画面のコンテキスト取得
        gMCon = gMScreen.getContext("2d");
        // メイン画面のサイズ設定
        mMReSizeScreen();

        // リサイズのイベントリスナー登録
        window.addEventListener("resize", eReSize);
        // マウスのイベントリスナー登録
        gMScreen.addEventListener("mousedown", eMouseTouchOnDown, false);
        gMScreen.addEventListener("mousemove", eMouseTouchOnMove, false);
        gMScreen.addEventListener("mouseup", eMouseTouchOnUp, false);
        // タッチのイベントリスナー登録
        gMScreen.addEventListener("touchstart", eMouseTouchOnDown, false);
        gMScreen.addEventListener("touchmove", eMouseTouchOnMove, false);
        gMScreen.addEventListener("touchend", eMouseTouchOnUp, false);

        // ゲームループ
        setInterval(mExeFrame, FRAME_LATE);
    });
    // リサイズのイベント処理
    let eReSize = function () {
        // メイン画面のリサイズ
        mMReSizeScreen();
    };
    // タッチorマウスで押されたときのイベント処理
    let eMouseTouchOnDown = function (e) {
        // 座標の決定
        gTouchX = e.pageX;
        gTouchY = e.pageY;
        gTouchX -= gMScreen.offsetLeft;
        gTouchY -= gMScreen.offsetTop;

        // 以下、仮想画面の座標に変換

        // 描画画面開始の分引く
        gTouchX -= gDPosX;

        // 拡縮率で割る
        gTouchX = Math.floor(gTouchX / gDVScaleRateX);
        gTouchY = Math.floor(gTouchY / gDVScaleRateY);

        // 0以下なら「０」（仮想画面外）
        if (gTouchX < 0) {
            gTouchX = 0;
        }
        if (gTouchY < 0) {
            gTouchY = 0;
        }

        // 仮想画面以上の値なら仮想画面のMAX
        if (gTouchX > V_WIDTH) {
            gTouchX = V_WIDTH;
        }
        if (gTouchY > V_HEIGHT) {
            gTouchY = V_HEIGHT;
        }

        // どれだけ移動したかの値はクリア
        gTouchMoveX = 0;
        gTouchMoveY = 0;

        // 離した時の座標もクリア
        gTouchOffX = 0;
        gTouchOffY = 0;

        // オンフラグon
        gTouchOn = true;
        // オンオフフラグoff
        gTouchOnOff = false;

        //console.log("eMouseTouchOnDown:" + gTouchX + ", " + gTouchY);
    };
    // タッチorマウスで動いたときのイベント処理
    let eMouseTouchOnMove = function (e) {
        // タッチ中ならポジション更新
        if (gTouchOn) {
            // 前回の位置を一時保管
            tempTouchX = gTouchX;
            tempTouchY = gTouchY;

            // 座標の決定
            gTouchX = e.pageX;
            gTouchY = e.pageY;
            gTouchX -= gMScreen.offsetLeft;
            gTouchY -= gMScreen.offsetTop;

            // 以下、仮想画面の座標に変換

            // 描画画面開始の分引く
            gTouchX -= gDPosX;

            // 拡縮率で割る
            gTouchX = Math.floor(gTouchX / gDVScaleRateX);
            gTouchY = Math.floor(gTouchY / gDVScaleRateY);

            // 0以下なら「０」（仮想画面外）
            if (gTouchX < 0) {
                gTouchX = 0;
            }
            if (gTouchY < 0) {
                gTouchY = 0;
            }

            // 仮想画面以上の値なら仮想画面のMAX
            if (gTouchX > V_WIDTH) {
                gTouchX = V_WIDTH;
            }
            if (gTouchY > V_HEIGHT) {
                gTouchY = V_HEIGHT;
            }

            // どれだけ移動したかの値を設定
            gTouchMoveX = gTouchX - tempTouchX;
            gTouchMoveY = gTouchY - tempTouchY;

            // 離した時の座標はクリアしておく
            gTouchOffX = 0;
            gTouchOffY = 0;

            // オンフラグon
            gTouchOn = true;
            // オンオフフラグoff
            gTouchOnOff = false;
        }
    };
    // タッチorマウスで離されたときのイベント処理
    let eMouseTouchOnUp = function (e) {
        if (gTouchOn) {
            // オンオフフラグon
            gTouchOnOff = true;

            // 最後の座標をストックしてタッチ座標はクリア
            gTouchOffX = gTouchX;
            gTouchOffY = gTouchY;
            gTouchX = 0;
            gTouchY = 0;
            gTouchMoveX = 0;
            gTouchMoveY = 0;
        }
        // オンフラグoff
        gTouchOn = false;
    };
    // スクロール禁止処理
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });
    /*************************************/

    /************* 公開関数 **************/
    // ゲーム画面の設定
    let setSize = function (_w, _h) {
        V_WIDTH = _w;
        V_HEIGHT = _h;
    };
    // フォントの設定
    let setFont = function (_font) {
        FONT = _font;
    };
    // シーンの設定
    let pushScene = function (_scene) {
        // シーンは初期化してからプッシュする
        _scene.init();
        gSceneStack.push(_scene);
    };
    // シーンのポップ
    let popScene = function () {
        gSceneStack.pop();
    };
    // シーンデバッグON
    let sceneDebugOn = function () {
        gSceneDebugMode = true;
    };
    // シーンデバッグOFF
    let sceneDebugOff = function () {
        gSceneDebugMode = false;
    };
    // シーンの作成
    let createScene = function (_name) {
        return new Scene(_name);
    };
    // リソースの作成
    let createResouce = function (_name, _res) {
        return new Resouce(_name, _res);
    };
    // テクスチャデモの作成
    let createTextuerDemo = function (_name) {
        return new TextureDemo(_name);
    };
    // チップテクスチャデモの作成
    let createChipTextuerDemo = function (_name) {
        return new ChipTextureDemo(_name);
    };
    // 円デモの作成
    let createCircleDemo = function (_name) {
        return new CircleDemo(_name);
    };
    // 四角形デモの作成
    let createRectDemo = function (_name) {
        return new RectDemo(_name);
    };
    // フォントデモの作成
    let createFontDemo = function (_name) {
        return new FontDemo(_name);
    };
    // チップマップの作成
    let createChipMapDemo = function (_name, _res_idx, _idx_array, _wall_array, _chip_width, _chip_height, _idx_num_x, _idx_num_y, _w_num_x, _w_num_y, _width, _height, _d_pos_x, _d_pos_y, _pos_x, _pos_y, _alpha) {
        return new ChipMapDemo(_name, _res_idx, _idx_array, _wall_array, _chip_width, _chip_height, _idx_num_x, _idx_num_y, _w_num_x, _w_num_y, _width, _height, _d_pos_x, _d_pos_y, _pos_x, _pos_y, _alpha);
    };
    // テクスチャマップの作成
    let createTextureMapDemo = function (_name, _res_idx, _wall_array, _chip_width, _chip_height, _w_num_x, _w_num_y, _w_width, _w_height, _width, _height, _d_pos_x, _d_pos_y, _pos_x, _pos_y, _alpha) {
        return new TextureMapDemo(_name, _res_idx, _wall_array, _chip_width, _chip_height, _w_num_x, _w_num_y, _w_width, _w_height, _width, _height, _d_pos_x, _d_pos_y, _pos_x, _pos_y, _alpha);
    };
    // 公開
    return {
        width: V_WIDTH,
        height: V_HEIGHT,
        setSize: setSize,
        setFont: setFont,
        pushScene: pushScene,
        popScene: popScene,
        sceneDebugOn: sceneDebugOn,
        sceneDebugOff: sceneDebugOff,
        createScene: createScene,
        createResouce: createResouce,
        createTextuerDemo: createTextuerDemo,
        createChipTextuerDemo: createChipTextuerDemo,
        createCircleDemo: createCircleDemo,
        createRectDemo: createRectDemo,
        createFontDemo: createFontDemo,
        createChipMapDemo: createChipMapDemo,
        createTextureMapDemo: createTextureMapDemo,
    };
    /*************************************/
})();
