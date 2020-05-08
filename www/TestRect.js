let TestRect = sGame.createScene('TestRect');
TestRect.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
let RectTest = sGame.createRectDemo('RectTest',{'res': 'null', 'size': {'w': '60', 'h': '80'}, 'pos': {'x': '180', 'y': '320'}, 'scale': {'x': '1', 'y': '1'}, 'alpha': '1', 'wp': {'onWorld': 'false', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '0'}, 'shape': {'color': '#00FF00', 'fill': 'false', 'line': '8'}});
RectTest.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
TestRect.addDemo(RectTest);
sGame.pushScene(TestRect);
