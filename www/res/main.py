import os
import sys
import tools


# なにもしないコマンド
class NonCmd(tools.Cmd):
	def start(self):
		print("終了します。")


# デモを選択するコマンド
class DemSelCmd(tools.Cmd):
	def __init__(self):
		super().__init__()
		self.obj = None
	def start(self):
		print("作成するデモの種類を教えてください。")
		q = tools.easyinp("1:テクスチャデモ　2:円デモ　3:四角形デモ　4:フォントデモ　5:チップデモ　6:チップマップデモ　7:テクスチャマップデモ", 
		"0", "1", "2", "3", "4", "5", "6", "7")
		demsel = [NonCmd, tools.TexDemCmd, tools.CircleDemCmd, tools.RectDemCmd, tools.FontDemCmd, tools.ChipDemCmd, NonCmd, NonCmd]
		self.obj = demsel[int(q)]()
		self.obj.start()
	def getobj(self):
		return self.obj


# コマンドセレクター
cmdsel = [NonCmd, tools.SceneCmd, tools.ResCmd, tools.DataCmd, DemSelCmd, NonCmd]
def main():
	print("どうも、sGameクリエーターです。")
	
	# 生成されたコマンドを格納するリスト
	ret = []
	scec = []
	resc = []
	datc = []
	demc = []	
	# コマンド継続の判定
	next = "y"
	# コマンド継続が続く限り繰り返す
	while next == "y":
		print("行いたい作業を選択してください。")
		q = tools.easyinp("1:シーンの作成　2:リソースオブジェクトの作成　3:データオブジェクトの作成　4:デモの作成　5:Q&A", 
		"0", "1", "2", "3", "4", "5")
		cmd = cmdsel[int(q)]()
		cmd.start()
		# シーンコマンド
		if type(cmd) is tools.SceneCmd:
			ret.append(cmd)
			scec.append(cmd)
			# 継続確認
			next = tools.easyinp("まだ作業を続けますか？ y or n", "n")
		# リソースコマンド
		elif type(cmd) is tools.ResCmd:
			ret.append(cmd)
			resc.append(cmd)
			# 継続確認
			next = tools.easyinp("まだ作業を続けますか？ y or n", "n")
		# データコマンド
		elif type(cmd) is tools.DataCmd:
			ret.append(cmd)
			datc.append(cmd)
			# 継続確認
			next = tools.easyinp("まだ作業を続けますか？ y or n", "n")
		# デモコマンド
		elif type(cmd) is DemSelCmd:
			ret.append(cmd.getobj())
			demc.append(cmd.getobj())
			# 継続確認
			next = tools.easyinp("まだ作業を続けますか？ y or n", "n")
		# なにもしないコマンド
		elif type(cmd) is NonCmd:
			next = "n"
		else:
			pass
	
	# リストが空でなければ出力
	if ret:
		fname = tools.easyinp("出力ファイル名を教えてください。", "sgamecreator_output")
		path = os.path.join(os.getcwd(), fname + ".js")
		with open(path, mode="a", encoding="UTF-8") as f:
			# 全体を出力
			for c in ret:
				f.write(c.getcode())
				f.write("\n")
				# アップデートがあるクラス
				if isinstance(c, tools.UpdCmd):
					# アップデート関数
					f.write(c.getupdate())
					f.write("\n")

			# シーンオブジェクトのみ最後にセット系とシーンへのプッシュを行う
			for c in scec:
				# リソースのセット
				for r in resc:
					f.write(c.setres(r))
					f.write("\n")
				# データのセット
				for d in datc:
					f.write(c.setdata(d))
					f.write("\n")
				# デモのセット
				for d in demc:
					f.write(c.setdemo(d))
					f.write("\n")
				# シーンのプッシュ
				f.write(c.pushScene())
				f.write("\n")

	
# メイン
if __name__ == "__main__":
	main()
