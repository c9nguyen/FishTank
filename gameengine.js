window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

const NEUTRAL = 0;
const BIG = 1
const MID = 2;
const SMALL = 3;
const FOOD = 4;
const UI = -1;

const GRAVITY = 1800; //can change this to make gravity better

function GameEngine() {
    this.sceneManager = new SceneManager(this);
    this.collisionBox = {
        ground: [],
    };
    this.ui = [];
    this.entities = [];
    this.big = [];
    this.mid = [];
    this.small = [];
    this.food = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;

    this.movedAmount = 0;

    //events
    this.mouse = {click: false,
                    x: undefined,
                    y: undefined,
                    width: 1,
                    height: 1,
                    pressed: false,
                    reset: function() {
                        this.click = false;
                      //  this.pressed = false;
                    }};
    this.events = {
    }
    this.save = false;
    this.load = false;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.DM = new DatabaseManager(this);
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.sceneManager.preUpdate();
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("mousedown", function (e) {
        if (e.which === 1)
            that.mouse.pressed = true; 
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        that.mouse.click = true;
    }, false);


    this.ctx.canvas.addEventListener("mousemove", function (e) {
        var coor = getXandY(e);
        that.mouse.x = coor.x;
        that.mouse.y = coor.y;
       // console.log(coor);
    }, false);



    console.log('Input started');
}


GameEngine.prototype.addEntity = function (entity) {
 //   console.log('added entity');
    if (entity.side === UI) {
        this.ui.push(entity);
    } else {
        if (entity.side === MID) this.mid.push(entity);
        else if (entity.side === SMALL) this.small.push(entity);
        else if (entity.side === BIG) this.big.push(entity);
        this.entities.push(entity);
    }

}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    var entities = this.entities;
    for (var i = 0; i < entities.length; i++) {
        entities[i].draw(this.ctx);
    }
    for (var i = 0; i < this.ui.length; i++) {
        this.ui[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entities = this.entities;
    var food = this.food;
    // console.log(this.food.length);
    // console.log(this.entities.length + " = " + this.mid.length + " + " + this.small.length);

    for (var i = 0; i < this.ui.length; i++) {
        this.ui[i].update();
        if (this.ui[i].removeFromWorld) {
            this.ui.splice(i, 1);
            i--;
        }
        
    }

   for (var i = 0; i < food.length; i++) {
 
        if (food[i].removeFromWorld) {
            food.splice(i, 1);
            i--;
        }
    }
    for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];


            
            if (entities[i].removeFromWorld) {
                entities.splice(i, 1);
                i--;
            } else {
                entity.update();
            }
    }

    if (this.mouse.click) {
        if (this.food.length < 5) {
        var coor = this.mouse;
        spawnUnit(this, coor.x, coor.y, "food", FOOD);
        }
    }

    if (this.save) this.DM.socket.emit("save", { studentname: "Chinh Nguyen", 
                                                statename: "fishtank", 
                                                fishList: this.DM.prepData(this) });
    else if (this.load) 
    this.DM.socket.emit("load", { studentname: "Chinh Nguyen", 
                                statename: "fishtank"});
    this.save = false;
    this.load = false;
    this.mouse.reset();
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

GameEngine.prototype.clearFish = function () {
    this.big.map(function(fish) {
        fish.removeFromWorld = true;
    });
    this.mid.map(function(fish) {
        fish.removeFromWorld = true;
    });
    this.small.map(function(fish) {
        fish.removeFromWorld = true;
    });
    this.food.map(function(food) {
        food.removeFromWorld = true;
    });
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y, side = NEUTRAL) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.movable = true;
    this.gravity = false;
    this.velocity = {x: 0, y:0};
    this.yVelocity = 0; //will be removed
    this.side = side;
    this.removeFromWorld = false;
    this.forceX = 0;
    this.forceY = 0;
}

//Push the entity in a direction
Entity.prototype.force = function(forceX, forceY) {
    this.forceX += forceX;
    this.forceY += forceY;
}

Entity.prototype.update = function () {
    // adding screen scroll
    // if (this.side === ENEMY) {
    //     console.log(this.velocity.y);
    // }
    if(this.movable){
        this.x += this.game.movedAmount;
    }

    if (this.gravity) this.velocity.y += this.game.clockTick * GRAVITY;      //Applying grativy
    this.y += this.game.clockTick * this.velocity.y;
    this.x += this.game.clockTick * this.velocity.x;
   // console.log(this.game.moveAmount);

   //force
   var forceX = this.game.clockTick * this.forceX;
   this.forceX -= forceX;
   var forceY = this.game.clockTick * this.forceY;
   this.forceY -= forceY;
   this.x += forceX;
   this.y += forceY;
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

/**
 * Collision detection
 */
function collise(box1, box2) {
    return (box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.height + box1.y > box2.y) 
}

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}