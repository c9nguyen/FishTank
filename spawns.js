/*
 * Temporary unit code h000:
 * h: normal human unit
 * t: tower unit
 * m: monster unit
 */

// const STAND = 0;
// const JUMP = 1;
// const WALK = 2;
// const ATTACK = 3;

// const UNIT_0000 = 0;  

// function Action(game, unit, spritesheet,
//                 sheetWidth, frameDuration, frames, 
//                 groundPoints, collisionBoxes, cooldown = 0,
//                 scale = 1, frameWidth = spritesheet.width / sheetWidth , 
//                 frameHeight = spritesheet.height / Math.ceil(frames / sheetWidth),
//                 width = frameWidth, height = frameHeight) { 

function spawnUnit(game, x, y, unitcode, side = NEUTRAL) {
    var unit;
    switch (unitcode) {
        case "dumpfish":   
            unit = new Unit(game, x, y, unitcode, side);
            unit.flying = true;
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var stand = new Action(game, unit, AM.getAsset("./img/unit/dumpfish/stand.png"),
                                    6, 0.1, 36, groundPoints, collisionBox, false, 1);
            stand.endEffect = function() {
                this.unit.changeAction("eat0");
            }

            groundPoints = [{x: 0, y: 17}];
            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var eat0 = new Action(game, unit, AM.getAsset("./img/unit/dumpfish/attack_0.png"),
                                    4, 0.1, 8, groundPoints, collisionBox, false, 20);
            eat0.endEffect = function() {
                this.unit.changeAction("eat1");
            } 

            groundPoints = [{x: 0, y: 17}];
            collisionBox = [{x: 50, y: 240, width: 90, height: 80}];
            var eat1 = new Action(game, unit, AM.getAsset("./img/unit/dumpfish/attack_1.png"),
                                    4, 0.1, 32, groundPoints, collisionBox, false, 2);
            eat1.endEffect = function() {
                var mid = this.game.mid;
                for (var i in mid) {
                    mid[i].changeAction("walk");
                }
                var small = this.game.small;
                for (var i in small) {
                    small[i].changeAction("move_left");
                }

                this.unit.changeAction("eat2");
            } 
            eat1.duringEffect = function() {
                var collisionBox = this.unit.getCollisionBox();
                var mid = this.game.mid;
                for (var i in mid) {
                    mid[i].changeAction("hit");
                    mid[i].velocity.x = 130;
                }

                var small = this.game.small;
                for (var i in small) {
                    small[i].changeAction("hit_left");
                    var enemy = small[i];
                    enemy.food = undefined;
                    if (collise(collisionBox, enemy.getCollisionBox())) {
                        small[i].removeFromWorld = true;
                        this.unit.health += small[i].health;
                        this.unit.health = Math.min(this.unit.health, 100);
                        small.splice(i, 1);
                        i--;
                    } else {
                        if (enemy.x < collisionBox.x) {
                            enemy.velocity.x = 80;
                        } else if (enemy.x > collisionBox.x) {
                            enemy.velocity.x = -80;
                        }
                        if (enemy.y < collisionBox.y) {
                            enemy.velocity.y = 80;
                        } else if (enemy.y > collisionBox.y) {
                            enemy.velocity.y = -80;
                        }
                    }
                }
            }

            groundPoints = [{x: 0, y: 17}];
            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var eat2 = new Action(game, unit, AM.getAsset("./img/unit/dumpfish/attack_2.png"),
                                    4, 0.1, 16, groundPoints, collisionBox, false, 2);
            eat2.endEffect = function() {
                this.unit.changeAction("stand");
            } 

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/dumpfish/die.png"),
                                    5, 0.1, 10, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["stand"] = stand;
            unit.actions["eat0"] = eat0;
            unit.actions["eat1"] = eat1;
            unit.actions["eat2"] = eat2;
            unit.actions["die"] = die;
            // unit.actions["attack"] = attack;
            // unit.actions["attack2"] = attack2;
            // unit.actions["die"] = die;
            unit.defaultAction = stand;
            unit.currentAction = stand;
            unit.setCollisionReacts(function() { }, 
                                    function() { });

            break;

        case "clang":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var walk = new Action(game, unit, AM.getAsset("./img/unit/clang/move.png"),
                                    5, 0.08, 5, groundPoints, collisionBox, true);
            walk.startEffect = function() {this.unit.velocity.x = this.unit.movementspeed};
            walk.endEffect = function() {this.unit.velocity.x = 0};

            groundPoints = [{x: 0, y: 0}];
            var hit = new Action(game, unit, AM.getAsset("./img/unit/clang/hit.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            unit.actions["walk"] = walk;
            unit.actions["hit"] = hit;

            unit.defaultAction = walk;
            unit.currentAction = walk;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });
            break;

        case "f1":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 40, y: 0, width: 40, height: 40}];
            var move_right = new Action(game, unit, AM.getAsset("./img/unit/f1/move_right.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_right.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
                for (var i in foods) {
       
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }
                console.log(this.food);
                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_left");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }

            };     
            move_right.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed;
                //random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed * -1;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed;
                // }
            };
            move_right.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_left");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }    
                }
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_right = new Action(game, unit, AM.getAsset("./img/unit/f1/hit_right.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            var move_left = new Action(game, unit, AM.getAsset("./img/unit/f1/move_left.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_left.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
      

                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }
                console.log(this.food);
                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };
            move_left.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed * -1;
                // random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed ;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed * -1;
                // }
            };
            move_left.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_right");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }   
                } 
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_left = new Action(game, unit, AM.getAsset("./img/unit/f1/hit_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/f1/die.png"),
                                    7, 0.1, 7, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["move_left"] = move_left;
            unit.actions["move_right"] = move_right;
            unit.actions["hit_left"] = hit_left;
            unit.actions["hit_right"] = hit_right;
            unit.actions["die"] = die;

            unit.defaultAction = move_right;
            var random = Math.random() >= 0.5;
            if (random) {
                unit.currentAction = move_left;
            }  else  unit.currentAction = move_right;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });

            break;
        
        case "f2":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 40, y: 0, width: 40, height: 40}];
            var move_right = new Action(game, unit, AM.getAsset("./img/unit/f2/move_right.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_right.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;

                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };     
            move_right.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed;
                //random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed * -1;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed;
                // }
            };
            move_right.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_left");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }    
                }
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_right = new Action(game, unit, AM.getAsset("./img/unit/f2/hit_right.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            var move_left = new Action(game, unit, AM.getAsset("./img/unit/f2/move_left.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_left.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
              
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };
            move_left.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed * -1;
                // random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed ;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed * -1;
                // }
            };
            move_left.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_right");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }   
                } 
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_left = new Action(game, unit, AM.getAsset("./img/unit/f2/hit_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/f2/die.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["move_left"] = move_left;
            unit.actions["move_right"] = move_right;
            unit.actions["hit_left"] = hit_left;
            unit.actions["hit_right"] = hit_right;
            unit.actions["die"] = die;

            unit.defaultAction = move_right;
            var random = Math.random() >= 0.5;
            if (random) {
                unit.currentAction = move_left;
            }  else  unit.currentAction = move_right;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });

            break;
        
        case "f3":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 40, y: 0, width: 40, height: 40}];
            var move_right = new Action(game, unit, AM.getAsset("./img/unit/f3/move_right.png"),
                                    12, 0.1, 12, groundPoints, collisionBox, true, 1);
            move_right.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
 
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_left");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };     
            move_right.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed;
                //random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed * -1;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed;
                // }
            };
            move_right.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_left");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }    
                }
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_right = new Action(game, unit, AM.getAsset("./img/unit/f3/hit_right.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            var move_left = new Action(game, unit, AM.getAsset("./img/unit/f3/move_left.png"),
                                    12, 0.1, 12, groundPoints, collisionBox, true, 1);
            move_left.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
         
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };
            move_left.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed * -1;
                // random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed ;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed * -1;
                // }
            };
            move_left.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_right");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }   
                } 
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_left = new Action(game, unit, AM.getAsset("./img/unit/f3/hit_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/f3/die.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["move_left"] = move_left;
            unit.actions["move_right"] = move_right;
            unit.actions["hit_left"] = hit_left;
            unit.actions["hit_right"] = hit_right;
            unit.actions["die"] = die;

            unit.defaultAction = move_right;
            var random = Math.random() >= 0.5;
            if (random) {
                unit.currentAction = move_left;
            }  else  unit.currentAction = move_right;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });

            break;

        case "f4":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 40, y: 0, width: 40, height: 40}];
            var move_right = new Action(game, unit, AM.getAsset("./img/unit/f4/move_right.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_right.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
           
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_left");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };     
            move_right.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed;
                //random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed * -1;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed;
                // }
            };
            move_right.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_left");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }    
                }
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_right = new Action(game, unit, AM.getAsset("./img/unit/f4/hit_right.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            var move_left = new Action(game, unit, AM.getAsset("./img/unit/f4/move_left.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_left.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
         
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };
            move_left.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed * -1;
                // random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed ;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed * -1;
                // }
            };
            move_left.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_right");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }   
                } 
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_left = new Action(game, unit, AM.getAsset("./img/unit/f2/hit_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/f2/die.png"),
                                    4, 0.1, 4, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["move_left"] = move_left;
            unit.actions["move_right"] = move_right;
            unit.actions["hit_left"] = hit_left;
            unit.actions["hit_right"] = hit_right;
            unit.actions["die"] = die;

            unit.defaultAction = move_right;
            var random = Math.random() >= 0.5;
            if (random) {
                unit.currentAction = move_left;
            }  else  unit.currentAction = move_right;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });

            break;
        
        case "f5":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 40, y: 0, width: 40, height: 40}];
            var move_right = new Action(game, unit, AM.getAsset("./img/unit/f5/move_right.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_right.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
        
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_left");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };     
            move_right.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed;
                //random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed * -1;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed;
                // }
            };
            move_right.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_left");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }    
                }
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_right = new Action(game, unit, AM.getAsset("./img/unit/f5/hit_right.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            var move_left = new Action(game, unit, AM.getAsset("./img/unit/f5/move_left.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_left.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
              
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };
            move_left.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed * -1;
                // random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed ;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed * -1;
                // }
            };
            move_left.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_right");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }   
                } 
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_left = new Action(game, unit, AM.getAsset("./img/unit/f5/hit_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/f5/die.png"),
                                    5, 0.1, 5, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["move_left"] = move_left;
            unit.actions["move_right"] = move_right;
            unit.actions["hit_left"] = hit_left;
            unit.actions["hit_right"] = hit_right;
            unit.actions["die"] = die;

            unit.defaultAction = move_right;
            var random = Math.random() >= 0.5;
            if (random) {
                unit.currentAction = move_left;
            }  else  unit.currentAction = move_right;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });

            break;

        case "f6":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 40, y: 0, width: 40, height: 40}];
            var move_right = new Action(game, unit, AM.getAsset("./img/unit/f6/move_right.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_right.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
         
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_left");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                }
                
            };     
            move_right.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed;
                //random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed * -1;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed;
                // }
            };
            move_right.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_left");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }    
                }
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_right = new Action(game, unit, AM.getAsset("./img/unit/f6/hit_right.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            var move_left = new Action(game, unit, AM.getAsset("./img/unit/f6/move_left.png"),
                                    6, 0.1, 6, groundPoints, collisionBox, true, 1);
            move_left.duringEffect = function () {
                var box = this.unit.getCollisionBox();
                var foods = this.game.food;
                var shortest;
                this.food = undefined;
        
                for (var i in foods) {
                    if (!foods[i].removeFromWorld){
                        var dist = distance(foods[i], this.unit.getCollisionBox());
                        if (dist < 200 && (shortest === undefined || dist < shortest)) {
                            shortest = dist;
                            this.food = foods[i];
                        }
                        if (collise(box, foods[i])) {
                            this.unit.health += 50;
                            this.unit.health = Math.min(20, this.unit.health);
                            foods[i].removeFromWorld = true;
                        }
                    }
                }

                if (this.food !== undefined && this.food.x < box.x) {
                    this.unit.changeAction("move_right");
                    this.unit.velocity.x = -this.unit.movementspeed * 2;
                }
                if (this.food !== undefined && this.food.y > box.y) {
                    this.unit.velocity.y = this.unit.movementspeed * 2;
                }  else if (this.food !== undefined && this.food.y < box.y) {
                    this.unit.velocity.y =  -this.unit.movementspeed * 2;
                }else if (this.food !== undefined && this.food.y === box.y) {
                    this.unit.velocity.y = 0;
                
                }
            };
            move_left.startEffect = function() {
                this.unit.velocity.x = this.unit.movementspeed * -1;
                // random = Math.random() >= 0.5;
                // if (random) {
                //     this.unit.velocity.y = this.unit.movementspeed ;
                // }  else {
                // this.unit.velocity.y = this.unit.movementspeed * -1;
                // }
            };
            move_left.endEffect = function() {
                if (this.food === undefined) {
                var random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.x = this.unit.movementspeed * -1;
                    this.unit.changeAction("move_right");
                }    

                random = Math.random() >= 0.9;
                if (random) {
                    this.unit.velocity.y = this.unit.velocity.y * -1;
                }   
                } 
            };

            collisionBox = [{x: 0, y: 0, width: 40, height: 40}];
            var hit_left = new Action(game, unit, AM.getAsset("./img/unit/f6/hit_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, false);

            collisionBox = [{x: 0, y: 0, width: 0, height: 0}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/f6/die.png"),
                                    7, 0.1, 7, groundPoints, collisionBox, false, -1);
            die.startEffect = function() {
                this.unit.velocity.x = 0;
                this.unit.velocity.y = 0;
            };         
            die.endEffect = function() {
                this.unit.removeFromWorld = true;
            };

            unit.actions["move_left"] = move_left;
            unit.actions["move_right"] = move_right;
            unit.actions["hit_left"] = hit_left;
            unit.actions["hit_right"] = hit_right;
            unit.actions["die"] = die;

            unit.defaultAction = move_right;
            var random = Math.random() >= 0.5;
            if (random) {
                unit.currentAction = move_left;
            }  else  unit.currentAction = move_right;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function(enemy) { });

            break;
             

        case "food":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 0}];
            var collisionBox = [{x: 0, y: 0, width: 25, height: 20}];
            var move = new Action(game, unit, AM.getAsset("./img/food/fish.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, true);
            move.startEffect = function() {this.unit.velocity.y = this.unit.movementspeed};
            move.duringEffect = function() {
                if (this.x > canvasHeight) this.removeFromWorld = true;
                else {
                this.unit.velocity.x= 0;
                this.unit.velocity.y = this.unit.movementspeed;
                }
            };

            unit.actions["move"] = move;
            unit.defaultAction = move;
            unit.currentAction = move;
            unit.currentAction.start();
            unit.setCollisionReacts(function() { }, 
                                    function() { }, 
                                    function() { });
            game.food.push(unit);
            break;

        case "m000":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 50, y: 105}];
            var collisionBox = [{x: 50, y: 20, width: 70, height: 85}];
            var walk = new Action(game, unit, AM.getAsset("./img/unit/m000/walk_left.png"),
                                    2, 0.1, 4, groundPoints, collisionBox, true);
            walk.startEffect = function() {this.unit.velocity.x = this.unit.movementspeed};
            walk.endEffect = function() {this.unit.velocity.x = 0};
                    
            groundPoints = [{x: 50, y: 105}];
            collisionBox = [{x: 50, y: 20, width: 70, height: 85}];
            var jump = new Action(game, unit, AM.getAsset("./img/unit/m000/jump_left.png"),
                                    1, 0.1, 1, groundPoints, collisionBox, true);

            collisionBox = [];
            groundPoints = [{x: 300, y: 109}];
            collisionBox[0] = {x: 283, y: 25, width: 70, height: 85};
            collisionBox[4] = {x: 253, y: 25, width: 90, height: 85};
            collisionBox[5] = {x: 260, y: 25, width: 90, height: 85};
            collisionBox[6] = {x: 280, y: 25, width: 80, height: 85};
            collisionBox[7] = {x: 283, y: 25, width: 60, height: 85};
            var attack = new Action(game, unit, AM.getAsset("./img/unit/m000/attack_left.png"),
                                    8, 0.15, 8, groundPoints, collisionBox, false);
            attack.effects[4] = function(that) {
                                    castSkill(that.game, that.x + 0, that.y + 50, that.unit, 00000, 1,
                                    undefined,350, 60, 0.3)};

            groundPoints = [];
            collisionBox = [];
            groundPoints = [{x: 66, y: 181}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/m000/die_left.png"),
                                    10, 0.1, 10, groundPoints, collisionBox, false, -1);
            // die.startEffect = function() {this.unit.velocity.x = -this.unit.movementspeed;
            //                                 this.unit.velocity.y = -150};
            die.endEffect = function() {this.unit.removeFromWorld = true};

            //attack.startEffect = function() {this.unit.velocity.y = -800; this.unit.velocity.x = 200};
            unit.actions["walk"] = walk;
            unit.actions["jump"] = jump;
            unit.actions["attack"] = attack;
            unit.actions["die"] = die;
            unit.defaultAction = walk;
            unit.setCollisionReacts(function() { this.changeAction("walk");}, 
                                    function() { this.changeAction("jump");}, 
                                    function() { this.changeAction("attack"); });
            break;
        
        case "m010":
            unit = new Unit(game, x, y, unitcode, side);
            var groundPoints = [{x: 0, y: 130}];
            var collisionBox = [{x: 10, y: 10, width: 120, height: 120}];
            var walk = new Action(game, unit, AM.getAsset("./img/unit/m010/walk.png"),
                                    3, 0.2, 6, groundPoints, collisionBox, true);
            walk.startEffect = function() {this.unit.velocity.x = this.unit.movementspeed};
            walk.endEffect = function() {this.unit.velocity.x = 0};

            groundPoints = [{x: 0, y: 130}];
            collisionBox = [{x:10, y: 10, width: 120, height: 120}];
            var jump = new Action(game, unit, AM.getAsset("./img/unit/m010/jump.png"),
                                    1, 0.2, 1, groundPoints, collisionBox, true);
            
            groundPoints = [{x: 50, y: 140}];
            collisionBox[0] = {x: 50, y: 20, width: 120, height: 120};

            var attack = new Action(game, unit, AM.getAsset("./img/unit/m010/attack.png"),
                                    4, 0.15, 12, groundPoints, collisionBox, false);

            //Making knock back effect
            attack.effects[4] = function(that) {
                castSkill(that.game, that.x, that.y + 30, that.unit, 00000, 1,
                            function(unit) { unit.velocity.x = unit.movementspeed / (-unit.movementspeed) * 200;
                                            unit.velocity.y = -300;
                                            unit.changeAction("jump");},
                            160, 100, 0.4)};

            groundPoints = [{x: 0, y: 130}];
            var die = new Action(game, unit, AM.getAsset("./img/unit/m010/die.png"),
                                    3, 0.1, 9, groundPoints, collisionBox, false, -1);
            die.endEffect = function() {this.unit.removeFromWorld = true};

            var groundPoints = [{x: 0, y: 130}];
            var collisionBox = [{x: 10, y: 10, width: 120, height: 120}];
            var stand = new Action(game, unit, AM.getAsset("./img/unit/m010/stand.png"),
                                    3, 0.2, 6, groundPoints, collisionBox, true);
            stand.startEffect = function() {this.unit.velocity.x = 0};

            //attack.startEffect = function() {this.unit.velocity.y = -800; this.unit.velocity.x = 200};
            unit.actions["walk"] = walk;
            unit.actions["jump"] = jump;
            unit.actions["attack"] = attack;
            unit.actions["die"] = die;
            unit.actions["stand"] = stand;
            unit.defaultAction = walk;
            unit.setCollisionReacts(function() { this.changeAction("stand");}, 
                                    function() { this.changeAction("jump");}, 
                                    function() { this.changeAction("attack"); });
            break;
    }

    if (unit !== undefined) game.addEntity(unit);
    else console.log("Wrong unitcode");
    return unit;
}