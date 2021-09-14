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
        this.z = 0;

        this.crop = [0, 0, this.img.width, this.img.height];

        this.animation = { prototype: null, data: null };

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
        this.renderer.setSize(this.img.width, this.img.height);
        this.renderer.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.img.width, this.img.height)

        //Instead of using an if statement, we'll just redefine
        //the draw function. initially its blank, but once the
        //image loads, it'll change to this
        this.draw = function (view) {
            if (this.animation !== null) {
                this.crop = this.animation.current[this.animation.frame];
            }
            view.ctx.translate(this.crop[2]/2, this.crop[3]/2);
            view.ctx.rotate(this.angle);
            view.ctx.translate(-this.crop[2]/2, -this.crop[3]/2);
            view.ctx.drawImage(this.img, this.crop[0], this.crop[1], this.crop[2], this.crop[3], this.x, this.y, this.crop[2] * this.scale, this.crop[3] * this.scale);
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