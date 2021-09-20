class Scene {
    constructor() {
        this.children = [];
        this.setup();
    }

    setup() {

    }

    addChild(child = Sprite) {
        this.children.push(child);
        child.parent = this;
        child.id = this.children.length-1;
    }

    removeChild(child) {
        for(let i=0;i<this.children.length;i++) {
            if(child == this.children[i]) {
                this.children.splice(i, 1);
            }
        }
    }

    update() {
        //Sort children
        this.children.sort((a, b) => {
            return a.z - b.z;
        })
        for (let i in this.children) {
            try {
                if (this.children[i]) {
                    this.children[i].update();
                    this.children[i].draw();
                    // console.log(this.children)
                }
            } catch (e) {
                // console.log(e);
            }
        }
    }

    draw() {

    }
}

class _SceneManager {
    constructor() {
        //Scene stack, for returning to previous scenes
        this.sceneStack = [];
        this.currentScene = new Scene();
        this.fps = 60;
        this.targetmsfps = Math.round(1000 / this.fps);
        this.isRunning = false;

        this.debug = {
            on: true,
            ticker: 0,
            renTime: new Date().getTime(),
            old_rentime: 0,
            new_rentime: 0
        }

        this.mainView = null;
    }

    push(scene = Scene) {
        this.sceneStack.push(new scene());
        this.currentScene = this.sceneStack[this.sceneStack.length - 1];
    }

    update() {
        try {
            if (this.isRunning) requestAnimationFrame(this.update.bind(this));
            Input.updateInput();
            const now = new Date().getTime();
            const delta = now - this.debug.renTime;

            this.debug.new_rentime = Date.now();


            if (delta > this.targetmsfps) {
                this.mainView.clear();
                if (this.debug.on) {
                    this.debug.ticker++;
                    this.debug.ticker = this.debug.ticker % 31;
                    if (this.debug.ticker == 30) {
                        this.debug.responseTime = Math.floor(this.debug.new_rentime - this.debug.old_rentime);
                        this.debug.renTime = now - (delta % this.targetmsfps);
                        this.debug.old_rentime = Date.now();
                    }
                    this.mainView.drawText(`${Math.floor((this.debug.new_rentime / this.debug.old_rentime) * this.fps)}FPS`, 0, 0)
                }
                this.currentScene.update();

            }
        } catch (e) {
            //Something went wrong, lets stop
            //processing it
            this.isRunning = false;
            console.error(e);
        }
    }

    run(mainView) {
        this.isRunning = true;
        this.mainView = mainView;
        this.update();
    }

    stop() {
        this.isRunning = false;
    }
} const SceneManager = new _SceneManager();