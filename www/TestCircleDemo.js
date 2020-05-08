let testcircles = sGame.createScene('testcircles');
testcircles.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
let testc = sGame.createCircleDemo('testc',{'res': 'null', 'size': {'w': '360', 'h': '640'}, 'pos': {'x': '180', 'y': '320'}, 'scale': {'x': '1', 'y': '1'}, 'alpha': '1', 'wp': {'onWorld': 'false', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '2'}, 'r': '30', 'shape': {'color': '#333333', 'fill': 'false', 'line': '10'}});
testc.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
testcircles.addDemo(testc);
sGame.pushScene(testcircles);
