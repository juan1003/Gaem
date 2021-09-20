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
        child.id = this.children.length - 1;
    }

    removeChild(child) {
        for (let i = 0; i < this.children.length; i++) {
            if (child == this.children[i]) {
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
        this.targetmsfps = (1000 / this.fps);
        this.lastTime = Date.now();
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

    pop() {
        this.sceneStack.pop();
        this.currentScene = this.sceneStack[this.sceneStack.length - 1];
    }

    clean() {
        this.sceneStack.splice(0, this.sceneStack.length);
        this.currentScene = new Scene();
    }

    update() {
        try {
            if (this.isRunning) requestAnimationFrame(this.update.bind(this));
            let now = (new Date()).getTime();
            this.delta = (now-this.lastTime);

            if(this.delta > this.targetmsfps) {
                Input.updateInput();
                this.mainView.clear();
                this.currentScene.update();
                this.lastTime = now - (this.delta % this.targetmsfps);
            }

        } catch (e) {
            //Something went wrong, lets stop
            //processing it
            this.isRunning = false;
            console.error(e);
        }
    }

    render() {

    }

    run(mainView) {
        this.isRunning = true;
        this.mainView = mainView;
        this.update(Date.now());
    }

    stop() {
        this.isRunning = false;
    }
} const SceneManager = new _SceneManager();

var lastTime;
var requiredElapsed = 1000 / 100; // desired interval is 10fps

requestAnimationFrame(loop);

function loop(now) {
    requestAnimationFrame(loop);

    if (!lastTime) { lastTime = now; }
    var elapsed = lastTime - now;

    if (elapsed > requiredElapsed) {
        console.log('what');
        lastTime = now;
    }

}