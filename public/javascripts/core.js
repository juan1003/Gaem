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
    constructor(x = 0, y = 0, hvel = 0) {
        super('/img/sprites/pico8_invaders_sprites.png');
        this.setAnimation(PlayerShot);

        this.life = 60;
        this.lifeCounter = 0;
        this.blendMode = 'hue';

        this.moveSpeed = 4;

        this.x = x;
        this.y = y;

        this.scale = 0.5;

        this.hvel = Math.round(hvel) / 2;
    }

    async update() {
        this.y -= this.moveSpeed;
        this.x += this.hvel;
        this.lifeCounter++;

        this.r3d[0] = (this.lifeCounter / (Math.PI * 24)) + this.moveSpeed;
        this.r3d[1] = ((this.x + this.lifeCounter) / (Math.PI * 4));
        this.r3d[3] = (this.lifeCounter / (Math.PI * 24));
        this.scale = Math.cos(this.lifeCounter / (Math.PI * 90));
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
            tick: 0
        }
    }

    async update() {
        let moveSpeed = (Input.hold('lb')) ? this.moveSpeed / 2 : this.moveSpeed;
        moveSpeed *= (Input.hold('rb')) ? 2 : 1;
        this.x += (Math.abs(Input.axes(0)) > 0.1) ? Math.sin(Input.axes(0) * Math.PI / 2) * moveSpeed : 0;
        this.y += (Math.abs(Input.axes(1)) > 0.1) ? Math.sin(Input.axes(1) * Math.PI / 2) * moveSpeed : 0;

        this.x += (Input.hold('left')) ? -moveSpeed : (Input.hold('right')) ? moveSpeed : 0;
        this.y += (Input.hold('up')) ? -moveSpeed : (Input.hold('down')) ? moveSpeed : 0;

        if (Input.hold('a')) {
            this.spawnTimer.tick++;
            if (this.spawnTimer.tick > this.spawnTimer.bullet) {
                const shots = 1;
                for (let i = -shots / 2; i < shots / 2; i++) {
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

    async setup() {
        this.particleTest = new ParticleSprite(view.canvas.width, view.canvas.height);
        this.particleTest.setRule('offscreen', true);


        this.addChild(this.particleTest);

        this.prepareTypewrite();
    }

    async update() {
        super.update();
        // PlayerSprite.update();
    }

    prepareTypewrite() {
        this.word = `Produced by $c[rgb(255,255,0)]HJD$c[n]`;
        this.letters = [];
        this.progress = 0;
        this.openText = new openSprite(view.canvas.width, view.canvas.height, self => {
            this.type(self);
        })
        this.openText.x = (view.canvas.width / 2)
        this.addChild(this.openText);

        this.wordPrep = this.openText.string(this.word);
    }

    type(self) {
        const newX = (view.canvas.width / 2) - (this.letters.length * 3);
        self.x += (newX - self.x) / 4;
        this.progress++;
        if (this.progress > 5 && this.letters.length < this.wordPrep.length) {
            self.y = view.canvas.height / 2 - 3;
            this.progress = 0;
            this.letters.push(this.wordPrep[this.letters.length])
             for (let i = 0; i < 5; i++) {
                const star_vel = this.particleTest.randomVelocity2D(1);
                const life = 30 + Math.random() * 60;
                
                this.particleTest.newParticle({
                    position: [self.x+Math.random() * (this.letters.length*6), self.y+3+-(Math.random() * 6)],
                    opacity: 1,
                    fadeVelocity: 1 / life,
                    velocity: star_vel,
                    life: life,
                    rotationalVelocity: this.particleTest.randomVelocity3D(1),
                    blendMode: 'source-over',
                    color: `rgba(10, 150, 255, ${0.5 + Math.random() / 2})`
                });
            }
        }

        if(this.progress == 10) {
            for (let i = 0; i < 100; i++) {
                const star_vel = this.particleTest.randomVelocity2D(1);
                const life = 30 + Math.random() * 60;
                
                this.particleTest.newParticle({
                    position: [self.x+Math.random() * (this.letters.length*6), self.y+3+-(Math.random() * 6)],
                    opacity: 1,
                    fadeVelocity: 1 / life,
                    velocity: star_vel,
                    life: life,
                    rotationalVelocity: this.particleTest.randomVelocity3D(1),
                    blendMode: 'source-over',
                    color: `rgba(255, 255, 255, 1)`
                });
            }
        }

        if (this.progress > 180) {
            self.opacity -= 5;
            self.y -= Math.cos(self.opacity / 164);
        }
        self.drawText(this.letters, 0, 0);

        if (this.progress > 280) {

        }
    }
};

SceneManager.push(Scene_Boot);
