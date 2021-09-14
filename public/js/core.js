const main = new View();
main.append();

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
Sprites.p1.x = 24;

main.addChild(Sprites.p1);
main.addChild(Sprites.p2);

Sprites.p1.setAnimation(walkDown);
Sprites.p2.setAnimation(walkDown);

var float_test = 0;

function _loop() {
    main.clear();
    _sharedTick.forEach(a => {
        a();
    })
    main.update();
    float_test+=Math.PI/120;
    Sprites.p1.z = 0.5+(Math.sin(float_test)/Math.PI)
    Sprites.p2.z = 0.5+(Math.cos(float_test)/Math.PI)
    Sprites.p1.scale = Sprites.p1.z;
    Sprites.p2.scale = Sprites.p2.z;
    requestAnimationFrame(_loop);

}

_loop();