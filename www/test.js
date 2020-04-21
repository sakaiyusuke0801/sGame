// This is a JavaScript file

let testNum = 0;

// シーン
let boc2dTestScene = sGame.createScene("boc2dTestScene");
// シーンの更新処理
boc2dTestScene.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
            // デモ追加
            scene.addDemo(sGame.createRectDemo("box" + testNum, "#00FF00", true, 1, 50, 50, gTouchOffX, gTouchOffY, 1, 1, 1));
            // 名前を変えるための番号インクリメント
            testNum++;
        }
    }
);

// 初期の箱
let box1 = sGame.createRectDemo("box", "#00FF00", true, 1, 50, 50, 200, 0, 1, 1, 1);
box1.box2d_body_type = 2;
boc2dTestScene.addDemo(box1);

// jimen
let box2 = sGame.createRectDemo("jimen", "#00FF00", false, 1, 300, 50, 0, 550, 1, 1, 1);
box2.box2d_body_type = 0;
boc2dTestScene.addDemo(box2);

// 世界をON
boc2dTestScene.worldOn(10);

// ゲームにシーンを追加
sGame.pushScene(boc2dTestScene);
