let ChipDemoScene = sGame.createScene('ChipDemoScene');
ChipDemoScene.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
let res = sGame.createResouce('res',{'char': 'res/char1.png'});
let chiptest = sGame.createChipTextuerDemo('chiptest',{'res': 'char', 'size': {'w': '32', 'h': '32'}, 'pos': {'x': '180', 'y': '320'}, 'scale': {'x': '1', 'y': '1'}, 'alpha': '1', 'wp': {'onWorld': 'false', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '0'}, 'now_idx': '5', 'tile': {'col': '3', 'row': '4'}});
chiptest.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
ChipDemoScene.setRes(res);
ChipDemoScene.addDemo(chiptest);
sGame.pushScene(ChipDemoScene);
