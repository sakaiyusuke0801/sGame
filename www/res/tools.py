import os
import sys
from abc import ABCMeta, abstractclassmethod 

# エンジン内のもろもろ
# pythonの命名規約に沿わないけど生成されるJavasctript形式にここだけは合わせます
sGame = "sGame"
gameWidth = sGame + ".gameWidth"
gameHeight = sGame + ".gameHeight"
sBox2dBodyType = sGame + ".sBox2dBodyType"
setSize = sGame + ".setSize"
setFont = sGame + ".setFont"
pushScene = sGame + ".pushScene"
popScene = sGame + ".popScene"
sceneDebugOn = sGame + ".sceneDebugOn"
sceneDebugOff = sGame + ".sceneDebugOff"
createScene = sGame + ".createScene"
createResouce = sGame + ".createResouce"
createTextuerDemo =  sGame + ".createTextuerDemo"
createChipTextuerDemo = sGame + ".createChipTextuerDemo"
createCircleDemo = sGame + ".createCircleDemo"
createRectDemo = sGame + ".createRectDemo"
createFontDemo =  sGame + ".createFontDemo"
createChipMapDemo = sGame + ".createChipMapDemo"
createTextureMapDemo = sGame + ".createTextureMapDemo"

# 質問、返答、空文字判定をまとめた関数
def easyinp(s, d, *args):
	ret = input(s)
	if not ret:
		return d
	else:
		# 空判定
		if not args:
			return ret
		else:
			# args内に存在しない値ならデフォルト値を返す
			if ret in args:
				return ret
			else:
				return d	

# 命令を実行する抽象クラス
class Cmd(metaclass=ABCMeta):
	def __init__(self):
		# 変数名などになる名前
		self.name = ""
		# 生成されたコード
		self.code = ""
	@abstractclassmethod
	def start(self):
		pass
	# 名前の取得
	def getname(self):
		return self.name
	# クオート付き名前の取得
	def getqname(self):
		return "'" + self.name + "'"
	# コードの出力
	def getcode(self):
		return self.code
	# 質問、返答、空文字判定をまとめた関数
	def ques(self, s, d):
		ret = input(s)
		if not ret:
			return d
		else:
			return ret

	# 引数の生成
	def args(self, args):
		return "(" + args + ")"


# アップデート付き
class UpdCmd(Cmd):
	def __init__(self):
		super().__init__()
	# アップデート関数の生成
	def getupdate(self):
		return self.name + """.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);"""			


# データ用
class DatCmd(Cmd):
	def __init__(self):
		super().__init__()


# デモ用
class DemCmd(UpdCmd):
	def __init__(self):
		super().__init__()
		self.obj = {}
	def baseattr(self):
		self.name = self.ques("デモの名前を決めてください。変数と内部的な名前になります。", "defDemo")
				
		# リソース
		res_name = self.ques("リソース名を教えてください。", "null")
		self.obj["res"] = res_name
		
		# サイズ
		size = {}
		w = self.ques("横サイズを教えてください。", "360")
		size["w"] = w
		h = self.ques("縦サイズを教えてください。", "640")
		size["h"] = h
		self.obj["size"] = size
		
		# 位置
		pos = {}
		x = self.ques("x座標を教えてください。(アンカーは中心です)", "180")
		pos["x"] = x
		y = self.ques("y座標を教えてください。(アンカーは中心です)", "320")
		pos["y"] = y
		self.obj["pos"] = pos
		
		# スケール
		scale = {}
		x = self.ques("x座標における拡縮倍率を教えてください。", "1")
		scale["x"] = x
		y = self.ques("y座標における拡縮倍率を教えてください。", "1")
		scale["y"] = y
		self.obj["scale"] = scale
		
		# アルファ
		alpha = self.ques("アルファ値を教えてください。", "1")
		self.obj["alpha"] = alpha
		
		# Box2d周り
		wp = {}
		onWorld = self.ques("物理世界に影響を受けますか？ true or false", "false")
		wp["onWorld"] = onWorld
		fixedRotation = self.ques("ローテーションしますか？ true or false", "false")
		wp["fixedRotation"] = fixedRotation
		density = self.ques("密度の値を教えてください。(デフォルトは1.0)", "1.0")
		wp["density"] = density
		friction = self.ques("摩擦係数の値を教えてください。(デフォルトは0.5)", "0.5")
		wp["friction"] = friction
		restitution = self.ques("反発係数を教えてください。(デフォルトは0.5)", "0.5")
		wp["restitution"] = restitution
		bodytype = self.ques("Bodyタイプを決めてください。0:静的　1:キネクト 2:動的", "0")
		wp["bodytype"] = bodytype
		self.obj["wp"] = wp
				
								
# シーンを生成するサブクラス
class SceneCmd(UpdCmd):
	def __init__(self):
		super().__init__()
	def start(self):
		self.name = self.ques("シーンの名前を決めてください。変数と内部的な名称になります。", "defScene")
		self.code = "let " + self.name + " = " + createScene + self.args(self.getqname()) + ";"
	def setres(self, r):
		return self.name + ".setRes" + self.args(r.getname()) + ";"
	def setdata(self, d):
		return self.name + ".setData" + self.args(d.getname()) + ";"
	def setdemo(self, d):
		return self.name + ".addDemo" + self.args(d.getname()) + ";"
	def pushScene(self):
		return "sGame.pushScene" + self.args(self.getname()) + ";"

# リソースを生成する
class ResCmd(DatCmd):
	def __init__(self):
		super().__init__()
	def start(self):
		self.name = self.ques("リソースオブジェクトの名前を決めてください。変数と内部的な名称になります。", "defRes")		
		# リソースオブジェクト
		res = {}
		# リソースの数
		res_cnt = 0
		# リソースの登録有無
		res_reg = "y"
		while res_reg == "y":
			res_cnt+=1
			res_key = self.ques(str(res_cnt) + "つめのリソースにアクセスする名前を決めてください。", "defResKey" + str(res_cnt))
			res_val = self.ques(str(res_cnt) + "つめのリソースのパスを相対パス、リソース名付きで教えてください。", "null")
			if res_val != "null":
				res[res_key] = res_val
			res_reg = self.ques("リソースの登録をまだ行いますか？ y or n", "n")
		self.code = "let " + self.name + " = " + createResouce + self.args(self.getqname() + "," + str(res)) + ";"


# データを生成する
class DataCmd(DatCmd):
	def __init__(self):
		super().__init__()
	def start(self):
		self.name = self.ques("データオブジェクトの名前を決めてください。変数名になります。", "defData")
		# データオブジェクト
		data = {}
		# データの数
		data_cnt = 0
		# データの登録有無
		data_reg = "y"
		while data_reg == "y":
			data_cnt+=1
			data_key = self.ques(str(data_cnt) \
			+ "つめのデータにアクセスする名前を決めてください。", "defDataKey" + str(data_cnt))
			data_val = self.ques(str(data_cnt) + "つめのデータの初期値を教えてください", "null")
			if data_val != "null":
				data[data_key] = data_val
			data_reg = self.ques("データの登録をまだ行いますか？ y or n", "n")
		self.code = "let " + self.name + " = " + str(data) + ";"
		
		
# テクスチャデモを生成するサブクラス
class TexDemCmd(DemCmd):
	def __init__(self):
		super().__init__()
	def start(self):
		self.baseattr()
		self.code = "let " + self.name + " = " \
		+ createTextuerDemo \
		+ self.args(self.getqname() \
		+ "," + str(self.obj)) + ";"
		

# 円デモを作成するサブクラス
class CircleDemCmd(DemCmd):
	def __init__(self):
		super().__init__()
	def start(self):
		self.baseattr()

		red = self.ques("円の半径を教えてください。", "100")
		self.obj["r"] = red
		shape = {}
		col = self.ques("色を教えてください。", "#333333")
		shape["color"] = col
		fill = self.ques("塗りつぶしますか？", "false")
		shape["fill"] = fill
		lin = self.ques("線の幅を教えてください。(＊塗りつぶしていたら意味の無い数値にはなります)", "5")
		shape["line"] = lin
		self.obj["shape"] = shape
		self.code = "let " + self.name + " = " \
		+ createCircleDemo \
		+ self.args(self.getqname() \
		+ "," + str(self.obj)) + ";"
		
# 四角形デモを作成するサブクラス
class RectDemCmd(DemCmd):
	def __init__(self):
		super().__init__()
	def start(self):
		self.baseattr()

		shape = {}
		col = self.ques("色を教えてください。", "#333333")
		shape["color"] = col
		fill = self.ques("塗りつぶしますか？", "false")
		shape["fill"] = fill
		lin = self.ques("線の幅を教えてください。(＊塗りつぶしていたら意味の無い数値にはなります)", "5")
		shape["line"] = lin
		self.obj["shape"] = shape	
		self.code = "let " + self.name + " = " \
		+ createRectDemo \
		+ self.args(self.getqname() \
		+ "," + str(self.obj)) + ";"

class FontDemCmd(DemCmd):
	""" フォントデモを作成するサブクラスクラス
	""" 
	def __init__(self):
		super().__init__()
	def start(self):
		self.baseattr()
		
		tex = self.ques("表示するテキストを入力してください。", "テストテキスト")
		self.obj["text"] = tex
		col = self.ques("色を教えてください。", "#333333")
		self.obj["color"] = col
		self.code = "let " + self.name + " = " \
		+ createFontDemo \
		+ self.args(self.getqname() \
		+ "," + str(self.obj)) + ";"
		
class ChipDemCmd(DemCmd):
	""" チップデモを作成するサブクラスクラス
	""" 
	def __init__(self):
		super().__init__()
	def start(self):
		self.baseattr()
		
		now_idx = self.ques("初期インデックスを教えてください。", "1")
		self.obj["now_idx"] = now_idx
		
		tile = {}
		col = self.ques("タイルマップの横の個数を教えてください。", "3")
		tile["col"] = col
		row = self.ques("タイルマップの縦の個数を教えてください。", "4")
		tile["row"] = row
		self.obj["tile"] = tile
		
		self.code = "let " + self.name + " = " \
		+ createChipTextuerDemo \
		+ self.args(self.getqname() \
		+ "," + str(self.obj)) + ";"
