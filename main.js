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

AM.queueDownload("./img/tiles/en_spritesheet.png");
AM.queueDownload("./img/tiles/en1_spritesheet.png");
AM.queueDownload("./img/tiles/bsc_spritesheet.png");

AM.queueDownload("./img/unit/h000/card.png");
AM.queueDownload("./img/unit/h000/card_mouseover.png");
AM.queueDownload("./img/unit/h000/card_click.png");
AM.queueDownload("./img/unit/h000/stand_right.png");
AM.queueDownload("./img/unit/h000/walk_right.png");
AM.queueDownload("./img/unit/h000/jump_right.png");
AM.queueDownload("./img/unit/h000/stab_right.png");
AM.queueDownload("./img/unit/h000/jumpattack_right.png");
AM.queueDownload("./img/unit/h000/die_right.png");

AM.queueDownload("./img/unit/h100/stand.png");
AM.queueDownload("./img/unit/h100/walk.png");
AM.queueDownload("./img/unit/h100/jump.png");
AM.queueDownload("./img/unit/h100/die.png");
AM.queueDownload("./img/unit/h100/attack1.png");
AM.queueDownload("./img/unit/h100/attack2.png");
AM.queueDownload("./img/unit/h100/attack3.png");

AM.queueDownload("./img/unit/m000/card.png");
AM.queueDownload("./img/unit/m000/card_mouseover.png");
AM.queueDownload("./img/unit/m000/card_click.png");
AM.queueDownload("./img/unit/m000/stand_left.png");
AM.queueDownload("./img/unit/m000/walk_left.png");
AM.queueDownload("./img/unit/m000/jump_left.png");
AM.queueDownload("./img/unit/m000/attack_left.png");
AM.queueDownload("./img/unit/m000/die_left.png");

AM.queueDownload("./img/unit/m010/stand.png");
AM.queueDownload("./img/unit/m010/walk.png");
AM.queueDownload("./img/unit/m010/jump.png");
AM.queueDownload("./img/unit/m010/attack.png");
AM.queueDownload("./img/unit/m010/die.png");

AM.queueDownload("./img/character/warrior/stand_right.png");
AM.queueDownload("./img/character/warrior/walk_right.png");
AM.queueDownload("./img/character/warrior/jump_right.png");
AM.queueDownload("./img/character/warrior/swing_right.png");

AM.queueDownload("./img/back/portal.png");
AM.queueDownload("./img/food/spritesheet.png");
AM.queueDownload("./img/tomb.png");

AM.queueDownload("./img/ui/start_button_disable.png");
AM.queueDownload("./img/ui/start_button_pressed.png");
AM.queueDownload("./img/ui/start_button_mouseover.png");

AM.queueDownload("./img/effect/00000/stab.png");
AM.queueDownload("./img/effect/00000/9.swingP1.2_0.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.sceneManager.addScene('battle',Battle);
    gameEngine.start();

    
    gameEngine.sceneManager.startScene('battle');
    

});






