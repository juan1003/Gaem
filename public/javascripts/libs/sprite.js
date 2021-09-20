var BLEND_TYPE = 'source-over';
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
    
            if(this.depth3D<=0.1235) return;
            this.blendBuffer.refresh();
            const ox = Math.round(view.canvas.width / 2 + (this.x / this.depth3D) - (view.x / this.depth3D));
            const oy = Math.round(view.canvas.height / 2 + (this.y / this.depth3D) - (view.y / this.depth3D));

            if (this.animation !== null) {
                this.crop = this.animation.current[this.animation.frame];
            }

            const sx = this.crop[2];
            const sy = this.crop[3];

            const psx = sx*(this.scale / this.depth3D);
            const psy = sy*(this.scale / this.depth3D);

            this.blendBuffer.ctx.save();
            
            this.blendBuffer.ctx.translate(psx / 2, (psy) / 2);
            this.blendBuffer.ctx.setTransform(Math.cos(this.r3d[0]), 0, 0, Math.sin(this.r3d[2]+(Math.PI/2)), sx, sy)
            this.blendBuffer.ctx.rotate(this.angle + this.r3d[1]);
            this.blendBuffer.ctx.globalAlpha = this.opacity / 255;
            this.blendBuffer.ctx.translate(-psx / 2, -(psy) / 2);

            this.blendBuffer.ctx.drawImage(this.img, this.crop[0], this.crop[1], this.crop[2], this.crop[3], 0, 0, psx, psy);
            this.blendBuffer.ctx.globalAlpha = 1;
           
            this.blendBuffer.ctx.restore();

            view.ctx.drawImage(this.blendBuffer.canvas, ox, oy);
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
    draw(view = HTMLCanvasElement) { }

    update() {

    }
}