let FontDemoTestScene = sGame.createScene('FontDemoTestScene');
FontDemoTestScene.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
let FontDemoTest = sGame.createFontDemo('FontDemoTest',{'res': 'null', 'size': {'w': '100', 'h': '100'}, 'pos': {'x': '180', 'y': '320'}, 'scale': {'x': '1', 'y': '1'}, 'alpha': '1', 'wp': {'onWorld': 'false', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '0'}, 'text': 'テストの成功', 'color': '#009900'});
FontDemoTest.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
FontDemoTestScene.addDemo(FontDemoTest);
sGame.pushScene(FontDemoTestScene);
