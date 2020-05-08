// シーン
let s = sGame.createScene("TestScene");

let resObj = sGame.createResouce("res",
    {
      "bg": "res/title.png",
    }
  );
s.setRes(resObj);

// テクスチャデモの基本引数オブジェクト
TexutureDemoObj = {
	// リソースのパスを含めた文字列
	"res":"bg",
	// サイズ
	"size":{
		"w":sGame.gameWidth,
		"h":sGame.gameHeight,
	},
	// 位置
	"pos":{
		"x":sGame.gameWidth / 2,
		"y":sGame.gameHeight / 2,
	},
	// スケール
	"scale":{
		"x":1,
		"y":1,
	},
	// アルファ
	"alpha":1,
	// Box2d周り
	"wp":{
		// 物理世界に影響させるか
		"onWorld":false,
		// ローテーション
		"fixedRotation":false,
		// 密度
		"density":1.0,
		// 摩擦係数
		"friction":0.5,
		// 反発係数
		"restitution":0.5,
		// ボディタイプ
		"bodytype":sGame.sBox2dBodyType.StaticBody,
	}
};

// テクスチャデモテスト
let d = sGame.createTextuerDemo("title", TexutureDemoObj);

// シーンにデモをセット
s.addDemo(d);

// シーンのプッシュ
sGame.pushScene(s);
