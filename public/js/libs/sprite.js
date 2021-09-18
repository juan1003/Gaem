var BLEND_TYPE = 'source-over';

class AnimRect {
    /**
     * Animation rectangle, used for animating sprites
     * @param initials 
     */
    constructor(initials = { x: 0, y: 0, width: 0, height: 0 }) {
        this.current = initials;
        this.animations = {};

        this.frame = 0;
        this.timer = 0;
        this.speed = 7;
        _sharedTick.push(this.update.bind(this));
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

        this.flipx = 0;
        this.flipy = 0;

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
        this.renderer.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height)
        this.blendBuffer.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height)

        //Instead of using an if statement, we'll just redefine
        //the draw function. initially its blank, but once the
        //image loads, it'll change to this
        this.draw = function (view) {
            if(this.depth3D<=0.1235) return;
            this.blendBuffer.refresh();
            const ox = Math.round(this.parent.canvas.width / 2 + (this.x / this.depth3D) - (this.parent.x / this.depth3D));
            const oy = Math.round(this.parent.canvas.height / 2 + (this.y / this.depth3D) - (this.parent.y / this.depth3D));

            if (this.animation !== null) {
                this.crop = this.animation.current[this.animation.frame];
            }

            const sx = this.crop[2] * (this.scale / this.depth3D);
            const sy = this.crop[3] * (this.scale / this.depth3D)

            this.blendBuffer.ctx.save();
            
            this.blendBuffer.ctx.translate(ox, oy);
            this.blendBuffer.ctx.translate(sx / 2, (sy) / 2);
            this.blendBuffer.ctx.setTransform(this.flipx + Math.cos(this.r3d[0]), this.skewx, this.skewy, this.flipy + Math.sin(this.r3d[2] + Math.PI / 2), ox, oy)
            this.blendBuffer.ctx.rotate(this.angle + this.r3d[1]);
            this.blendBuffer.ctx.globalAlpha = this.opacity / 255;
            this.blendBuffer.ctx.translate(-sx / 2, -(sy) / 2);

            this.blendBuffer.ctx.globalCompositeOperation = this.blendMode;
            this.blendBuffer.ctx.drawImage(this.img, this.crop[0], this.crop[1], this.crop[2], this.crop[3], 0, 0, sx, sy);
            this.blendBuffer.ctx.globalAlpha = 1;
           
            this.blendBuffer.ctx.globalCompositeOperation = 'source-over';
            this.blendBuffer.ctx.restore();

            view.ctx.drawImage(this.blendBuffer.canvas, 0, 0);
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