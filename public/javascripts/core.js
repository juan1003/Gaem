const view = new View();
view.append();
//Spritework from https://cluly.itch.io/space-eaters

const PlayerSprite = new AnimRect();
PlayerSprite.addSequence('idle', [
    [0, 0, 8, 8],
    [8, 0, 8, 8]
]);
PlayerSprite.setSequence('idle');


const PlayerShot = new AnimRect();
PlayerShot.addSequence('default', [
    [0, 16, 8, 8],
]);
PlayerShot.setSequence('default');

class Bullet extends Sprite {
    constructor(x=0, y=0, hvel=0) {
        super('/img/sprites/pico8_invaders_sprites.png');
        this.setAnimation(PlayerShot);

        this.life = 60;
        this.lifeCounter = 0;

        this.moveSpeed = 4;

        this.x = x;
        this.y = y;

        this.scale = 0.5;

        this.hvel = Math.round(hvel)/2;
    }

    update() {
        this.y -= this.moveSpeed;
        this.x += this.hvel;
        this.lifeCounter++;

        if(this.y<-view.canvas.height/2) {
            this.y-=((view.canvas.height/2)+this.y);
            this.moveSpeed = -this.moveSpeed/4;
            this.hvel = Math.random()*this.hvel - Math.random()*this.hvel;
        }

        if(this.x<-view.canvas.width/2) {
            this.hvel = -this.hvel/2;
        }

        if(this.x>view.canvas.width/2) {
            this.hvel = -this.hvel/2;
        }

        this.r3d[0] = (this.y/(Math.PI*2))+this.moveSpeed;
        this.r3d[1] = ((this.x+this.y)/(Math.PI*3));
        this.r3d[3] = (this.y/(Math.PI*4));
        if (this.lifeCounter >= this.life) {
            this.parent.removeChild(this);
        }
    }
}

const Player = new class extends Sprite {
    constructor() {
        super('/img/sprites/pico8_invaders_sprites.png');
        this.setAnimation(PlayerSprite);
        this.moveSpeed = 2.5;

        this.spawnTimer = {
            self: 5,
            bullet: 5,
            tick:0
        }
    }

    update() {
        let moveSpeed = (Input.hold('lb')) ? this.moveSpeed / 2 : this.moveSpeed;
        moveSpeed *= (Input.hold('rb')) ? 2 : 1;
        this.x += (Math.abs(Input.axes(0)) > 0.1) ? Math.sin(Input.axes(0) * Math.PI / 2) * moveSpeed : 0;
        this.y += (Math.abs(Input.axes(1)) > 0.1) ? Math.sin(Input.axes(1) * Math.PI / 2) * moveSpeed : 0;

        this.x += (Input.hold('left')) ? -moveSpeed : (Input.hold('right')) ? moveSpeed : 0;
        this.y += (Input.hold('up')) ? -moveSpeed : (Input.hold('down')) ? moveSpeed : 0;

        if (Input.hold('a')) {
            this.spawnTimer.tick++;
            if(this.spawnTimer.tick>this.spawnTimer.bullet) {
                const shots = 5;
                for(let i=-shots/2;i<shots/2;i++) {
                    const f = new Bullet(this.x, this.y, i);
                    SceneManager.currentScene.addChild(f);
                    this.spawnTimer.tick = 0;
                }
            }
        }
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