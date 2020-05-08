// テクスチャデモの基本引数オブジェクト
TexutureDemoObjTemplate = {
	// リソースオブジェクトで定めた文字列
	"res":"リソース名",
	// サイズ
	"size":{
		"w":sGame.width,
		"h":sGame.height,
	},
	// 位置
	"pos":{
		"x":0,
		"y":0,
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
		"bodytype":sBox2dBodyType.StaticBody,
	}
};