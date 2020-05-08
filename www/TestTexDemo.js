let testtexs = sGame.createScene('testtexs');
testtexs.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
let res = sGame.createResouce('res',{'bg': 'res/title.png'});
let testtexdemo = sGame.createTextuerDemo('testtexdemo',{'res': 'bg', 'size': {'w': '360', 'h': '640'}, 'pos': {'x': '180', 'y': '320'}, 'scale': {'x': '1', 'y': '1'}, 'alpha': '1', 'wp': {'onWorld': 'false', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '0'}});
testtexdemo.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
testtexs.setRes(res);
testtexs.addDemo(testtexdemo);
sGame.pushScene(testtexs);
