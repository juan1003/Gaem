const view = new View();
view.append();

const fps = 59.97;
const targetmsfps = Math.round(1000 / fps);
var renTime = new Date().getTime();

const degtorad = function (val) {
    return val * (Math.PI / 180)
}

//Shared ticker for enabling/disabling global timers
const _sharedTick = [];

const Sprites = {};



var floaty = 0;

const walkDown = new AnimRect({
    x: 0, y: 0, width: 48, height: 48
});

walkDown.addSequence('test', [
    [0, 0, 64, 64],
    [64, 0, 64, 64],
    [128, 0, 64, 64],
    [64, 0, 64, 64]
]);
walkDown.setSequence('test');


var float_test = 0;
var old_rentime = 0;
var new_rentime = 0;


/**
const main = new View();
view.append();

const targetmsfps = 1000 / 60;
var renTime = new Date().getTime();

//Shared ticker for enabling/disabling global timers
const _sharedTick = [];

const Sprites = {};

var floaty = 0;

const walkDown = new AnimRect({
    x: 0, y: 0, width: 48, height: 48
});

walkDown.addSequence('test', [
    [0, 0, 64, 64],
    [64, 0, 64, 64],
    [128, 0, 64, 64],
    [64, 0, 64, 64]
]);
walkDown.setSequence('test');

Sprites.p1 = new Sprite();
Sprites.p2 = new Sprite();
Sprites.p1.z = 2;
Sprites.p2.z = 3;
Sprites.p1.x = 124;
Sprites.p2.x = 96;

Sprites.p1.y = 96;
Sprites.p2.y = 96;

view.addChild(Sprites.p1);
view.addChild(Sprites.p2);

Sprites.p1.setAnimation(walkDown);
Sprites.p2.setAnimation(walkDown);

var float_test = 0;
function _loop() {
    requestAnimationFrame(_loop);
    const now = new Date().getTime();
    const delta = now - renTime;

    if (delta > targetmsfps) {
        view.clear();
        _sharedTick.forEach(a => {
            a();
        })
        view.update();

        Sprites.p1.r3d[1] += Math.PI / 240;
        Sprites.p1.r3d[2] += Math.PI / 230;

        Sprites.p2.r3d[2] = Sprites.p2.z+Math.cos((Sprites.p2.y)/180*Math.PI)*Math.PI;

        float_test += Math.PI / 240;
        Sprites.p1.z = 1 + ((Math.sin(float_test) / Math.PI) / 1);
        Sprites.p2.z = 1 + ((Math.cos(float_test) / Math.PI) / 0.5);

        Sprites.p1.x += Math.cos(float_test * 2) / 2;
        Sprites.p1.y += Math.sin(float_test * 2) / 1;
        Sprites.p2.x += Math.sin(float_test * 2) / 2;
        Sprites.p2.y += Math.cos(float_test * 2) / 1;
        Sprites.p1.scale = Sprites.p1.z;
        Sprites.p2.scale = Sprites.p2.z;

        renTime = now - (delta % targetmsfps);
        view.drawText(`PIXEL FONT BOI\npixel font boi`, 0, 0)
    }


}

_loop();
 */