let TextureMapTestScene = sGame.createScene('TextureMapTestScene');
TextureMapTestScene.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
        	
        }
    }
);
let res = sGame.createResouce('res',{'map': 'res/mori.png', 'char': 'res/char1.png'});
let wall = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
];
let tMap = sGame.createTextureMapDemo('tMap',{'res': 'map', 'size': {'w': '360', 'h': '600'}, 'pos': {'x': '180', 'y': '320'}, 'alpha': '1', 'wall': wall, 'w_tile_size': {'w': '32', 'h': '32'}, 'w_tile': {'col': '14', 'row': '18'}, 'd_pos': {'x': '0', 'y': '0'}, 'w_size': {'w': '450', 'h': '600'}});
tMap.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOn) {
            //this.movePlayerToX(1);
            // 右に動かした
            if (gTouchMoveX > 0) {
                // 3ピクセル動く
                this.movePlayerToX(3);
                // 方向を更新
                //_scene.data["charDir"] = 2;
            }
            // 左に動かした
            else if (gTouchMoveX < 0) {
                // 3ピクセル動く
                this.movePlayerToX(-3);
                // 方向を更新
                //_scene.data["charDir"] = 1;
            }
            // 上に動かした
            if (gTouchMoveY > 0) {
                // 3ピクセル動く
                this.movePlayerToY(3);
                // 方向を更新
                //_scene.data["charDir"] = 0;
            }
            // 下に動かした
            else if (gTouchMoveY < 0) {
                // 3ピクセル動く
                this.movePlayerToY(-3);
                // 方向を更新
                //_scene.data["charDir"] = 3;
            }
        }
    }
);
let chiptest = sGame.createChipTextuerDemo('chiptest', { 'res': 'char', 'size': { 'w': '32', 'h': '32' }, 'pos': { 'x': '180', 'y': '320' }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1', 'wp': { 'onWorld': 'false', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '0' }, 'now_idx': '5', 'tile': { 'col': '3', 'row': '4' } });
chiptest.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {

        }
    }
);
tMap.setPlayerDemo(chiptest, 2, 16, 28, 15);
TextureMapTestScene.setRes(res);
TextureMapTestScene.addDemo(tMap);
TextureMapTestScene.addDemo(chiptest);
sGame.pushScene(TextureMapTestScene);
