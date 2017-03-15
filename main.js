var AM = new AssetManager();

/*===============================================================*/

AM.queueDownload("./img/back/aqua/background0.png");
AM.queueDownload("./img/back/aqua/background1.png");
AM.queueDownload("./img/food/fish.png");

for (var i = 0; i < 26; i++) {
    var str = "./img/back/aqua/back_" + i + ".png";
    AM.queueDownload(str);
}

for (var i = 1; i < 7; i++) {
    var str = "./img/unit/f" + i + "/move_left.png";
    AM.queueDownload(str);
    str = "./img/unit/f" + i + "/move_right.png";
    AM.queueDownload(str);
    str = "./img/unit/f" + i + "/hit_left.png";
    AM.queueDownload(str);
    str = "./img/unit/f" + i + "/hit_right.png";
    AM.queueDownload(str);
    str = "./img/unit/f" + i + "/die.png";
    AM.queueDownload(str);
}

AM.queueDownload("./img/back/cloud.png");
AM.queueDownload("./img/back/sky.png");
AM.queueDownload("./img/back/back.png");
AM.queueDownload("./img/back/1.png");
AM.queueDownload("./img/back/2.png");

AM.queueDownload("./img/unit/dumpfish/stand.png");
AM.queueDownload("./img/unit/dumpfish/attack.png");
AM.queueDownload("./img/unit/dumpfish/attack_0.png");
AM.queueDownload("./img/unit/dumpfish/attack_1.png");
AM.queueDownload("./img/unit/dumpfish/attack_2.png");
AM.queueDownload("./img/unit/dumpfish/die.png");

AM.queueDownload("./img/unit/clang/move.png");
AM.queueDownload("./img/unit/clang/hit.png");

AM.queueDownload("./img/tutor.png");


AM.queueDownload("./img/back/portal.png");
AM.queueDownload("./img/food/spritesheet.png");
AM.queueDownload("./img/tomb.png");

AM.queueDownload("./img/ui/start_button_disable.png");
AM.queueDownload("./img/ui/start_button_pressed.png");
AM.queueDownload("./img/ui/start_button_mouseover.png");

AM.queueDownload("./img/ui/save.png");
AM.queueDownload("./img/ui/save_click.png");
AM.queueDownload("./img/ui/load.png");
AM.queueDownload("./img/ui/load_click.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.sceneManager.addScene('battle',Battle);
    gameEngine.start();

    
    gameEngine.sceneManager.startScene('battle');
    



});






