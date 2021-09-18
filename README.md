# Gaem

## Just a web game for giggles and fun
--

--
# View / Camera Operations
--

Cameras / viewports have the following properties:
 * [Variables/Objects]
 * * [x]
 * * [y]
 * *  [canvas]
 * *  - [width]
 * *  - [height]
 * *  [ctx] (2D)
 * [Functions]
 * * [drawText(str,x,y)] Debugging, draws text locked to self x/y + defined x/y
 * * [clear()] Clears the canvas
 * 

## SceneManager
 * [Variables/Objects]
 * * [children] Sprite array[]
 * * [currentScene] Type of Scene{}
 * * [sceneStack] Array of Scenes
 * [Functions]
 * * [addChild(child)] child = any class with an 'update()' and 'draw()' function
 * * [append(where)] Appends the canvas element to the desired location. Default: document.body
 * * [update()] Usually called on its own
 * * [run()] Starts the loop

## Sprite API:

Create a sprite:
```js
const my_sprite = new Sprite();
```

Sprite values:
 * x
 * y
 * z
 * animation
 * scale
 * angle

Sprite functions:
 * setAnimation(animation_name)
 * setRotation(degrees)
 * 

## AnimRect Api

Create an animation rect:
```js
const my_animation = new AnimRect();
```

Add an animation sequence:
```js
my_animation.addSequence('my_sequence', [
    //frame 1 crop x/y/width/height
    [0,0,64,64],
    //frame 2...
    [64,0,64,64]
]);
```

Set the sequence for said animation:
```js
my_animation.setSequence('my_sequence');
```