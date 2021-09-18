const ImgPreloadArray = ['/img/font.png', '/img/sprites/default.png', '/img/patterns/wood.png'];
const ImgPreload = {};
ImgPreloadArray.forEach((a, b) => {
    const src = new Image();
    src.src = a;
    ImgPreload[a] = src;
})

class View {
    /**
     * Creates a canvas and CTX
     * @param config 
     */
    constructor(config = {
        width: 284,
        // width: 640,
        height: 160
        // height: 360
    }) {

        this.canvas = document.createElement('canvas');
        this.canvas.width = config.width;
        this.canvas.height = config.height;
        this.ctx = this.canvas.getContext('2d');
        this.fps = 60;
        this.targetmsfps = Math.round(1000 / this.fps);
        this.x = 0;
        this.y = 0;
        this.isRunning = false;

        this.debug = {
            on: true,
            ticker: 0,
            renTime: new Date().getTime(),
            old_rentime: 0,
            new_rentime: 0
        }

        this.children = [];
        this.run();
    }

    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Appends it to the DOM
     * @param where 
     */
    append(where = document.body) {
        where.appendChild(this.canvas);
    }

    clear() {
        this.canvas.width = this.canvas.width;
    }

    async update() {
        try {
            //Sort children
            this.children.sort((a, b) => {
                return a.z - b.z;
            })
            for (let i in this.children) {
                try {
                    this.children[i].update();
                    //set this to false per frame to ensure sharp pixels
                    this.children[i].draw(this);

                } catch {

                }
            }
            if (this.isRunning) requestAnimationFrame(
                this.update.bind(this)
            );

            const now = new Date().getTime();
            const delta = now - this.debug.renTime;

            this.debug.new_rentime = Date.now();


            if (delta > this.targetmsfps) {
                this.clear();

                if (this.debug.on) {
                    this.debug.ticker++;
                    this.debug.ticker = this.debug.ticker % 31;
                    if (this.debug.ticker == 30) {
                        this.debug.responseTime = Math.floor(this.debug.new_rentime - this.debug.old_rentime);
                        this.debug.renTime = now - (delta % this.targetmsfps);
                        this.debug.old_rentime = Date.now();
                    }
                    this.drawText(`${Math.floor((this.debug.new_rentime / this.debug.old_rentime) * this.fps)}FPS`, 0, 0)
                }
            }
        } catch (e) {
            //Something went wrong, lets stop
            //processing it
            this.isRunning = false;
            console.error(e);
        }
    }

    run() {
        this.isRunning = true;
        this.update();
    }

    stop() {
        this.isRunning = false;
    }

    /**Draw text */
    drawText(str, x, y) {
        //Round off the positions to prevent subpixel blurring
        x = Math.round(x);
        y = Math.round(y);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;

        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillStyle = '#333333';
        //Temp canvas is for optimizing memory management, since it'll properly be destroyed after
        //calling

        const string = Array.from(str);
        let ox = 0;
        let oy = 0;
        string.forEach((a, b) => {
            //Minus 32 since thats where the ascii font starts.
            //See https://www.w3schools.com/charsets/ref_html_ascii.asp
            const charPos = a.charCodeAt(0) - 32;
            if (a == '\n') {
                ox = -6;
                oy += 6;
            }

            tempCtx.drawImage(
                ImgPreload['/img/font.png'],
                charPos * 6, 0,
                6, 6,
                x + ox, y + oy,
                6, 6);
            ox += 6;
        });

        this.ctx.drawImage(tempCanvas, x, y);
    }
}