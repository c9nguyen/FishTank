//var socket = io.connect("http://76.28.150.193:8888");

function DatabaseManager(game) {
    this.game = game;
    this.socket = io.connect("http://76.28.150.193:8888");
    this.init();
}

DatabaseManager.prototype.init = function() {
    var that = this;
    console.log("starting up da sheild");

    this.socket.on("ping", function (ping) {
        console.log(ping);
        that.socket.emit("pong");
    });

    this.socket.on("connect", function () {
        console.log("Socket connected.")
    });
    this.socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    this.socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

    this.socket.on("load", function (data) {
        console.log("loading");
        that.game.clearFish();
        that.loadFish(data.fishList);
    });
}

// window.onload = function () {

// };

DatabaseManager.prototype.prepData = function(game) {
    var data = {};
    data["fish"] = [];
    data["food"] = [];

    for (var i = 0; i < game.food.length; i++) {
        var food = game.food[i];
        if (!food.removeFromWorld) {
            data.food.push({x: food.x, y: food.y})
        }
    }
    this.listToSaveData(game.big, data.fish);
    this.listToSaveData(game.mid, data.fish);
    this.listToSaveData(game.small, data.fish);

    return data;
}

DatabaseManager.prototype.listToSaveData = function(src, des) {
    for (var i = 0; i < src.length; i++) {
        var fish = src[i];
        if (!fish.removeFromWorld) {
            des.push(this.convertToJSON(fish));
        }
    }
}

DatabaseManager.prototype.convertToJSON = function(fish) {
    //saving actions
    var actions = {};
    var currentAction;
    for (var i in fish.actions) {
        var action = fish.actions[i];
        if (action === fish.currentAction) currentAction = i;
        actions[i] = {
            name: i,
            elapsedTime: fish.currentAction.elapsedTime,
            timeLastStart: fish.currentAction.timeLastStart ? fish.game.timer.gameTime - fish.currentAction.timeLastStart: undefined,
            previousHitbox: action.previousHitbox
        }
        
    }

    //saving unit
    var fishData = {
        unitcode: fish.unitcode,
        side: fish.side,
        x: fish.x,
        y: fish.y,
        health: fish.health,
        counter: fish.counter,
        currentAction: currentAction,
        actions: actions     
    };

    return fishData;
}

DatabaseManager.prototype.loadFish = function(data) {
    var that = this;
    for (var i = 0; i < data.food.length; i++) {
        var foodData = data.food[i];
        var food = spawnUnit(this, foodData.x, foodData.y, "food", FOOD);
    }

    for (var i = 0; i < data.fish.length; i++) {
        var fishData = data.fish[i];
        var fish = spawnUnit(this.game, fishData.x, fishData.y, fishData.unitcode, fishData.side);
        fish.health = fishData.health;
        fish.counter = fishData.counter;
        fish.currentAction = fish.actions[fishData.currentAction];

        for (var action in fishData.actions) {
         //   console.log(this.game.timer.gameTime + " - " + fishData.actions[action].timeLastStart + " = " + this.game.timer.gameTime - fishData.actions[action].timeLastStart);
            fish.actions[action].elapsedTime = fishData.actions[action].elapsedTime;
            fish.actions[action].timeLastStart = fishData.actions[action].timeLastStart ? this.game.timer.gameTime - fishData.actions[action].timeLastStart : undefined;
            fish.actions[action].previousHitbox = fishData.actions[action].previousHitbox;
        }
    }
}
