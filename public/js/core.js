const main = new View();
main.append();

var floaty = 0;

function _loop() {
    main.canvas.width = main.canvas.width;
    main.drawText('Test', 32+Math.cos(floaty)*4, 8);
    requestAnimationFrame(_loop);
    floaty+=Math.PI/60;
}

_loop();