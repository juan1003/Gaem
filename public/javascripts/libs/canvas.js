const ImgPreloadArray = ['/img/font.png','/img/sprites/pico8_invaders_sprites.png'];
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
        width: 427,
        // width: 640,
        height: 240
        // height: 360
    }) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = config.width;
        this.canvas.height = config.height;
        this.ctx = this.canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        
        this.children = [];
        SceneManager.run(this);
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