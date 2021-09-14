const main = new View();
main.append();

//Shared ticker for enabling/disabling global timers
const _sharedTick = [];

var floaty = 0;
const spriteThing = new Sprite();
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
main.addChild(spriteThing);
spriteThing.setAnimation(walkDown)

function _loop() {
    main.clear();
    _sharedTick.forEach(a => {
        a();
    })
    main.update();

    spriteThing.angle+=Math.PI/120;
    requestAnimationFrame(_loop);

}

_loop();