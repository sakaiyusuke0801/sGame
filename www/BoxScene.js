
let cd_obj = { 'res': 'null', 'size': { 'w': '50', 'h': '50' }, 'pos': { 'x': '150', 'y': '100' }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1', 'angle': 0, 'wp': { 'onWorld': 'true', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.1', 'restitution': '0.5', 'bodytype': '2' }, 'r': '25', 'shape': { 'color': '#963210', 'fill': 'false', 'line': '5' } };
let num = 0;

let btest = sGame.createScene('btest');
btest.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
            //scene.addDemo(sGame.createCircleDemo("cd" + num, { 'res': 'null', 'size': { 'w': '50', 'h': '50' }, 'pos': { 'x': gTouchOffX, 'y': gTouchOffY }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1', 'wp': { 'onWorld': 'true', 'fixedRotation': 'false', 'density': '0.5', 'friction': '10.5', 'restitution': '0.1', 'bodytype': '2' }, 'r': '25', 'shape': { 'color': '#963210', 'fill': 'false', 'line': '5' } }));
            scene.addDemo(sGame.createRectDemo('rd' + num, { 'res': 'null', 'size': { 'w': '50', 'h': '50' }, 'pos': { 'x': gTouchOffX, 'y': gTouchOffY }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1',  'angle': 0, 'wp': { 'onWorld': 'true', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '2' }, 'shape': { 'color': '#00EE00', 'fill': 'false', 'line': '5' } }));
            num++;
        }
    }
);
let cd = sGame.createCircleDemo('cd', cd_obj);
cd.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {

        }
    }
);
let rd = sGame.createRectDemo('rd', { 'res': 'null', 'size': { 'w': '50', 'h': '50' }, 'pos': { 'x': '50', 'y': '50' }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1', 'angle': 0, 'wp': { 'onWorld': 'true', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '2' }, 'shape': { 'color': '#00EE00', 'fill': 'false', 'line': '5' } });
rd.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {

    }
);
let jd = sGame.createRectDemo('jd', { 'res': 'null', 'size': { 'w': '200', 'h': '50' }, 'pos': { 'x': '150', 'y': '600' }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1', 'angle': 0, 'wp': { 'onWorld': 'true', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '1' }, 'shape': { 'color': '#00EE00', 'fill': 'false', 'line': '5' } });
jd.setUpdate(
    function (scene, gTouchOn, gTouchOnOff, gTouchX, gTouchY, gTouchMoveX, gTouchMoveY, gTouchOffX, gTouchOffY) {
        // タッチされたら
        if (gTouchOnOff) {
            if (this.isHit(gTouchOffX, gTouchOffY, 1, 1)) {
                scene.addDemo(sGame.createRectDemo('jd' + num, { 'res': 'null', 'size': { 'w': '200', 'h': '50' }, 'pos': { 'x': gTouchOffX, 'y': 0 }, 'scale': { 'x': '1', 'y': '1' }, 'alpha': '1',  'angle': 0, 'wp': { 'onWorld': 'true', 'fixedRotation': 'false', 'density': '1.0', 'friction': '0.5', 'restitution': '0.5', 'bodytype': '2' }, 'shape': { 'color': '#008800', 'fill': 'false', 'line': '5' } }));
            }
        }
    }
);
btest.addDemo(cd);
btest.addDemo(rd);
btest.addDemo(jd);

btest.worldOn(10);

sGame.pushScene(btest);


