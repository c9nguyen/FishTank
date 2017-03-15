function Battle(game)
{
	this.game = game;
}

Battle.prototype.create = function() {
    console.log('battle created');

    this.buildingBackground();
	this.loadCharacter();
    var tutor = new NonAnimatedObject(this.game, AM.getAsset("./img/tutor.png"), 0, 0);
    this.game.addEntity(tutor);
};

Battle.prototype.update = function() {
	// body...
};

Battle.prototype.buildingBackground = function() {
	canvasHeight = this.game.ctx.canvas.clientHeight;
	canvasWidth = this.game.ctx.canvas.clientWidth;
    var that = this;

    var back = new NonAnimatedObject(this.game, AM.getAsset("./img/back/aqua/background0.png"),0, 0);
  //  back.setSize(canvasWidth, canvasHeight);
    this.game.addEntity(back);

    back = new NonAnimatedObject(this.game, AM.getAsset("./img/back/aqua/background1.png"),0, 0);
    this.game.addEntity(back);

    var save = new Button(this.game, AM.getAsset("./img/ui/save.png"), 900, 20);
    save.side = UI;
    save.addSheet(AM.getAsset("./img/ui/save_click.png"), "press");
    save.addEventListener("click", function() {
        that.game.save = true;
    });
    this.game.addEntity(save);

    var load = new Button(this.game, AM.getAsset("./img/ui/load.png"), 1100, 20);
    load.side = UI;
    load.addSheet(AM.getAsset("./img/ui/load_click.png"), "press");
    load.addEventListener("click", function() {
        that.game.load = true;
    });
    this.game.addEntity(load);
};

Battle.prototype.loadCharacter = function(){
    spawnUnit(this.game, 850, 265, "dumpfish", BIG);
    spawnUnit(this.game, 350, 400, "clang", MID);
    spawnUnit(this.game, 200, 600, "f1", SMALL);
    spawnUnit(this.game, 250, 500, "f2", SMALL);
    spawnUnit(this.game, 300, 400, "f3", SMALL);
    spawnUnit(this.game, 350, 300, "f5", SMALL);
    spawnUnit(this.game, 400, 200, "f6", SMALL);
   // spawnUnit(this.game, 600, 300, "f3", SMALL);
};

Battle.prototype.buildTiles = function() {


};
