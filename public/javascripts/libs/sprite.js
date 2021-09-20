var BLEND_TYPE = 'source-over';
const SPR_DEBUG = true;
_sharedTick = [];
class AnimRect {
    /**
     * Animation rectangle, used for animating sprites
     * @param initials 
     */
    constructor(initials = { x: 0, y: 0, width: 8, height: 8 }) {
        this.current = initials;
        this.animations = {};

        this.frame = 0;
        this.timer = 0;
        this.speed = 7;
    }

    /**
     * Creates a new animation
     */
    addSequence(name, frames = [
        [0, 0, 0, 0],
        [64, 64, 64, 64]
    ]) {
        this.animations[name] = frames;
    }

    /**
     * Adds a frame to an animation
     */
    addFrame(name, x, y, width, height) {
        this.animations[name].push([x, y, width, height]);
    }

    update() {
        this.timer += this.speed;
        if (this.timer >= 60) {
            this.timer = 0;
            this.frame++;
            this.frame = this.frame % this.current.length;
        }
    }

    /**
     * Set current sequence to an animation
     * @param name 
     */
    setSequence(name) {
        this.current = this.animations[name];
    }
}

class Renderer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Refresh the viewport
     */
    refresh() {
        this.canvas.width = this.canvas.width;
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * Sets the size of the renderer
     * @param width 
     * @param height 
     */
    setSize(width = 0, height = 0) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    drawImage(img, crop = [0, 0, 0, 0], output = [0, 0, 0, 0]) {
        this.ctx.imageSmoothingEnabled = false;
        return this.ctx.drawImage(img, crop[0], crop[1], crop[2], crop[3], output[0], output[1], output[2], output[3]);
    }
}

class Sprite {
    /**
     * Creates a sprite
     * @param dft 
     */
    constructor(dft = '/img/sprites/default.png') {
        this.img = ImgPreload[dft];

        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.angle = 0;

        this.opacity = 255;
        this.z = 0;
        this.r3d = [
            //y rotation
            0,

            //x rotation
            0,

            //z rotation

            0
        ];

        this.depth3D = 1;

        this.skewx = 0;
        this.skewy = 0;

        this.blendMode = 'source-over';

        this.crop = [0, 0, this.img.width, this.img.height];

        this.animation = null;

        if (this.img.complete) {
            this.setup();
        } else {
            //If not, create a listener that waits until the image
            //is ready.
            this.img.addEventListener('load', this.imgLoaded.bind(this));
        }
    }

    /**
     * Just in case it hasn't loaded already.
     * We want this here in case we create the sprite before
     * the preload has loaded~
     */
    imgLoaded() {
        this.setup();

        this.img.removeEventListener('load', this.imgLoaded);
        //Remove it to prevent memory leak^
    }

    setRotation(value) {
        this.angle = value / 180 * Math.PI;
    }

    /**
     * Main sprite setup, draws the graphic onto the canvas
     */
    setup() {
        this.renderer = new Renderer();
        this.blendBuffer = new Renderer();
        this.renderer.setSize(this.img.width, this.img.height);
        this.blendBuffer.setSize(this.img.width, this.img.height);
        this.renderer.ctx.drawImage(this.img, 0, 0);
        this.blendBuffer.ctx.drawImage(this.img, 0, 0);

        //Instead of using an if statement, we'll just redefine
        //the draw function. initially its blank, but once the
        //image loads, it'll change to this
        this.draw = function () {

            if (this.depth3D <= 0.1235) return;
            this.blendBuffer.refresh();
            const ox = Math.round(view.canvas.width / 2 + (this.x / this.depth3D) - (view.x / this.depth3D));
            const oy = Math.round(view.canvas.height / 2 + (this.y / this.depth3D) - (view.y / this.depth3D));

            if (this.animation !== null) {
                this.crop = this.animation.current[this.animation.frame];
            }

            const sx = this.crop[2];
            const sy = this.crop[3];

            const psx = sx * (this.scale / this.depth3D);
            const psy = sy * (this.scale / this.depth3D);

            this.blendBuffer.ctx.save();

            this.blendBuffer.ctx.translate(psx / 2, (psy) / 2);
            this.blendBuffer.ctx.setTransform(Math.cos(this.r3d[0]), 0, 0, Math.sin(this.r3d[2] + (Math.PI / 2)), sx, sy)
            this.blendBuffer.ctx.rotate(this.angle + this.r3d[1]);
            this.blendBuffer.ctx.globalAlpha = Math.max(this.opacity / 255, 0);
            this.blendBuffer.ctx.translate(-psx / 2, -(psy) / 2);


            this.blendBuffer.ctx.drawImage(this.img, this.crop[0], this.crop[1], this.crop[2], this.crop[3], 0, 0, psx, psy);

            this.blendBuffer.ctx.globalAlpha = 1;

            this.blendBuffer.ctx.restore();

            view.ctx.globalCompositeOperation = this.blendMode;
            view.ctx.drawImage(this.blendBuffer.canvas, ox, oy);
            view.ctx.globalCompositeOperation = 'source-over';

            if (SPR_DEBUG == true) {
                view.ctx.strokeStyle = '#ff000050';
                // view.ctx.strokeRect(ox+this.crop[2]/2, oy+this.crop[3]/2, this.crop[2], this.crop[3])
            }
        }
    }

    /**
     * Rectangle to draw
     */
    setCrop(x = 0, y = 0, width = 0, height = 0) {
        this.crop = [x, y, width, height];
    }

    setAnimation(animation = AnimRect) {
        this.animation = animation;
    }

    /**
     * Draws the sprite to a viewport
     * @param view 
     */
    async draw(view = HTMLCanvasElement) { }

    async update() {

    }
}

class ParticleSprite {
    constructor(width, height) {
        this.renderer = new Renderer();

        this.renderer.canvas.width = width;
        this.renderer.canvas.height = height;

        this.particles = [];

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.rules = {
            offscreen: false
        }
    }

    setRule(rule = 'offscreen', value = true) {
        this.rules[rule] = value;
    }

    randomVelocity2D(multiplier, scaleOverride = 0) {
        return [(Math.random() - Math.random()) * multiplier, (Math.random() - Math.random()) * multiplier, scaleOverride]
    }

    randomVelocity3D(multiplier) {
        return [(Math.random() - Math.random()) * multiplier, (Math.random() - Math.random()) * multiplier, (Math.random() - Math.random()) * multiplier]
    }

    newParticle(physics = {
        //x, y
        //relative to sprites x/y
        position: [0, 0],
        opacity: 1,
        //x y scale
        velocity: [0, 0, 0],
        fadeVelocity: 0,
        life: 24,
        //x, y z
        rotationalVelocity: [0, 0, 0],
        color: `#ffffff`,
        blendMode: 'source-over'
    }) {
        physics.tick = 0;
        physics.opacity = 1;
        this.particles.push(physics);
    }

    async draw() {
        for (let i = this.particles.length - 1; i > 0; i--) {
            const particle = this.particles[i];
            if (particle) {
                particle.tick++;
                particle.position[0] += particle.velocity[0];
                particle.position[1] += particle.velocity[1];

                if (particle.tick > particle.life && particle.life != 0) {
                    this.particles.splice(i, 1);
                }

                if (!this.rules.offscreen) {
                    particle.position[0] -= (particle.position[0] > this.renderer.canvas.width) ? this.renderer.canvas.width : 0;
                    particle.position[0] += (particle.position[0] < 0) ? this.renderer.canvas.width : 0;
                    particle.position[1] -= (particle.position[1] > this.renderer.canvas.height) ? this.renderer.canvas.height : 0;
                    particle.position[1] += (particle.position[1] < 0) ? this.renderer.canvas.height : 0;
                }
                particle.opacity -= particle.fadeVelocity;
                view.ctx.fillStyle = particle.color;
                view.ctx.globalCompositeOperation = particle.blendMode;
                view.ctx.globalAlpha = Math.max(particle.opacity, 0);
                view.ctx.fillRect(Math.floor(particle.position[0]), Math.floor(particle.position[1]), 1, 1);
                view.ctx.globalCompositeOperation = 'source-over';
                view.ctx.globalAlpha = 1;
            }
        }
    }

    async update() {

    }
}

class openSprite {
    constructor(width, height, draw = () => { }) {
        this.renderer = new Renderer();
        this.renderer.canvas.width = width;
        this.renderer.canvas.height = height;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.opacity = 255;

        this.drawEx = draw;

    }

    async draw() {
        const ox = Math.floor(this.x);
        const oy = Math.floor(this.y);
        this.drawEx(this);

        view.ctx.globalCompositeOperation = 'source-over';
        view.ctx.globalAlpha = Math.max(this.opacity / 255, 0);
        view.ctx.drawImage(this.renderer.canvas, ox, oy);
        view.ctx.globalAlpha = 1;
    }

    async update() {

    }

    /**
     * Finds where the color codes are and how long they are,
     * then applies that to an object array
     * @param str 
     * @returns object array
     */
    processString(str) {
        var re = /\$c\[(.*?)]/gm;
        let match;
        const returned = [];
        while ((match = re.exec(str)) != null) {
            returned.push({
                index: match.index,
                length: match[0].length,
                value: match[1]
            })
        }

        return returned;
    }

    /**
     * Processes the string into an array of objects
     * to display with color
     * @param str 
     * @returns processed string
     */
    string(str) {
        const proc = this.processString(str);
        const strAry = Array.from(str);
        const colors = [];
        proc.forEach((a, b) => {
            var deleted = 0;
            for (let i = a.index; i < a.index + a.length; i++) {
                delete strAry[i];
                deleted++;
            }
            colors[a.index + deleted] = a.value;
        })

        const results = [];
        strAry.forEach((a, b) => {
            results.push({
                char: a,
                color: colors[b] || null
            })
        })
        return results;
    }

    /**
     * Draws text
     * @param str 
     * @param x 
     * @param y 
     */
    drawText(str = this.string(''), x = 0, y = 0) {

        //Round off the positions to prevent subpixel blurring
        x = Math.round(x);
        y = Math.round(y);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.renderer.canvas.width;
        tempCanvas.height = this.renderer.canvas.height;

        const tColorCanvas = document.createElement('canvas');
        tColorCanvas.width = this.renderer.canvas.width;
        tColorCanvas.height = this.renderer.canvas.height;

        const tempCtx = tempCanvas.getContext('2d');
        const tColorCtx = tColorCanvas.getContext('2d');
        //Temp canvas is for optimizing memory management, since it'll properly be destroyed after
        //calling

        const string = str
        let ox = 0;
        let oy = 0;
        tColorCtx.fillStyle = '#ffffff';

        string.forEach((a, b) => {
            //Minus 32 since thats where the ascii font starts.
            //See https://www.w3schools.com/charsets/ref_html_ascii.asp
            const charPos = a.char.charCodeAt(0) - 32;
            if (a == '\n') {
                ox = -6;
                oy += 6;
            }

            if (a.color !== 'n' && a.color !== null) {
                tColorCtx.fillStyle = a.color;
            } else if(a.color === 'n'){
                tColorCtx.fillStyle = '#ffffff';
            }
            tColorCtx.fillRect(6+x + ox, y + oy,
                6, 6);
            ox += 6;

            
            tempCtx.drawImage(
                ImgPreload['/img/font.png'],
                charPos * 6, 0,
                6, 6,
                x + ox, y + oy,
                6, 6);
                
        });
        tempCtx.globalCompositeOperation = 'source-atop';
        tempCtx.drawImage(
            tColorCanvas, 0,0);
        this.renderer.ctx.drawImage(tempCanvas, x, y);

    }
}