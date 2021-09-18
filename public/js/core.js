const view = new View();
view.append();
//Spritework from https://cluly.itch.io/space-eaters

const PlayerSprite = new AnimRect();
PlayerSprite.addSequence('idle', [
    [0, 0, 8, 8],
    [8, 0, 8, 8]
]);
PlayerSprite.setSequence('idle');

const Player = new class extends Sprite {
    constructor() {
        super('/img/sprites/pico8_invaders_sprites.png');
        this.setAnimation(PlayerSprite);
        this.moveSpeed = 2;
    }

    update() {
        console.log(Input.axes(0))

        this.x+=(Math.abs(Input.axes(0))>0.1)?Math.sin(Input.axes(0)*Math.PI/2)*this.moveSpeed:0;
        this.y+=(Math.abs(Input.axes(1))>0.1)?Math.sin(Input.axes(1)*Math.PI/2)*this.moveSpeed:0;
    }
}

//Game logic
class Scene_Boot extends Scene {
    constructor() {
        super();
    }

    setup() {
        this.addChild(Player);
        console.log(Player)
    }

    update() {
        super.update();
        PlayerSprite.update();
    }
};

SceneManager.push(Scene_Boot);