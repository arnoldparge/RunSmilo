var ax, ay, az;

window.ondevicemotion = function (event) {
    ax = event.accelerationIncludingGravity.x;
    ay = event.accelerationIncludingGravity.y;
    az = event.accelerationIncludingGravity.z;
    //var info = "X value: " + ax + "<br> Y value: " + ay + "<br> Z value: " + az + "<br> ";
    //var zVal = document.getElementById("zVal");
    //zVal.innerHTML = info;
}

var hero_elem, devil_elem, fruit_elem;
var hero_entity, devil_entity, fruit_entity;
var left_border;
var score_text, end_text;

var score = 0;

var time_count = 0;
var devil_speed = 0.5;
var max_devil_speed = 3;

var canvas = CE.defines("canvas_id").
    extend(Hit).
ready(function () {
    canvas.Scene.call("menu");
});

canvas.Scene.new({
    name: "StartGame", // Obligatory
    materials: {
        images: {
            hero_img_id: "img/hero.png",
            devil_img_id: "img/devil.png",
            fruit_img_id: "img/fruit.png",
            bg1_img_id: "img/bg1.png",
            bg2_img_id: "img/bg2.gif"
        }
    },
    ready: function (stage) {

        var bg = this.createElement();
        bg.drawImage("bg2_img_id");
        stage.append(bg);

        function addEntities(x, y, img) {
            var entity = Class.New("Entity", [stage]);
            entity.rect(30);
            entity.position(x, y);
            entity.el.drawImage(img);
            stage.append(entity.el);
            return entity;
        }

        score_text = this.createElement();
        score_text.font = "20px Arial";
        score_text.fillText("Score: " + score, 0, 20);

        hero_entity = addEntities(0, 0, "hero_img_id");
        devil_entity = addEntities(300, 300, "devil_img_id");
        fruit_entity = addEntities(150, 150, "fruit_img_id");

        stage.append(score_text);
    },
    render: function (stage) {
        time_count++;

        if (devil_speed < max_devil_speed) {
            if (time_count % 300 == 0) //REPEATE AFTER FIVE SECONDS (300/60)
                devil_speed += 0.5;
        }

        score_text.fillText("Score: " + score, 10, 20);

        //MOVE HERO START
        hero_entity.move(-ax, ay);
        //MOVE HERO END

        //BOUNDING HERO START
        if (hero_entity.el.x < 0)
            hero_entity.position(0, hero_entity.el.y);

        if (hero_entity.el.x > 300)
            hero_entity.position(300, hero_entity.el.y);

        if (hero_entity.el.y < 0)
            hero_entity.position(hero_entity.el.x, 0);

        if (hero_entity.el.y > 300)
            hero_entity.position(hero_entity.el.x, 300);
        //BOUNDING HERO END

        //DEVIL FOLLOW HERO START
        if (hero_entity.el.x > devil_entity.el.x)
            devil_entity.move(devil_speed);
        else
            devil_entity.move(-devil_speed);

        if (hero_entity.el.y > devil_entity.el.y)
            devil_entity.move(null, devil_speed);
        else
            devil_entity.move(null, -devil_speed);
        //DEVIL FOLLOW HERO END

        //COLLECT FRUIT START
        fruit_entity.hit([hero_entity], function (state, el) {
            if (state == "over") {
                fruit_entity.position(Math.round(Math.random() * 300), Math.round(Math.random() * 300));
                score += 100;
            }
        });
        //COLLECT FRUIT END

        //DEVIL CATCHING HERO START
        devil_entity.hit([hero_entity], function (state, el) {
            if (state == "over") {
                //alert("GAME OVER!! Final score: " + score);
                canvas.Scene.call("game_over");
                score = 0;
                devil_speed = 0.5;
                //canvas.Scene.call("StartGame");
            }
        });
        //DEVIL CATCHING HERO END

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "game_over", // Obligatory
    materials: {
        images: {
            img1: "img/gameOver.png",
            img2: "img/playAgain.png"
        }
    },
    ready: function (stage) {

        gameOver = this.createElement();
        gameOver.drawImage("img1", 75, 150);
        stage.append(gameOver);

        playAgain = this.createElement();
        playAgain.drawImage("img2", 95, 200);
        stage.append(playAgain);

        playAgain.on("click", function () {
            canvas.Scene.call("StartGame");
        });

    },
    render: function (stage) {

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "splash_jes", // Obligatory
    materials: {
        images: {
            img1: "img/jes.png"
        }
    },
    ready: function (stage) {
        elem = this.createElement();
        elem.drawImage("img1");
        stage.append(elem);
        setTimeout(function () {
            canvas.Scene.call("splash_squ");
        }, 4000);
    },
    render: function (stage) {

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "splash_squ", // Obligatory
    materials: {
        images: {
            img1: "img/squibs.png"
        }
    },
    ready: function (stage) {
        elem = this.createElement();
        elem.drawImage("img1");
        stage.append(elem);
        setTimeout(function () {
            canvas.Scene.call("menu");
        }, 4000);
    },
    render: function (stage) {

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "menu", // Obligatory
    materials: {
        images: {
            img_start: "img/btnStart.png",
            img_about: "img/btnAbout.png",
            img_tut: "img/btnTutorial.png"
        }
    },
    ready: function (stage) {

        btnTutorial = this.createElement();
        btnTutorial.drawImage("img_tut", 90, 100);
        stage.append(btnTutorial);

        btnTutorial.on("click", function () {
            //canvas.Scene.call("StartGame");
        });

        btnStart = this.createElement();
        btnStart.drawImage("img_start", 70, 150);
        stage.append(btnStart);

        btnStart.on("tap", function () {
            canvas.Scene.call("StartGame");
        });

        btnAbout = this.createElement();
        btnAbout.drawImage("img_about", 90, 210);
        stage.append(btnAbout);

        btnAbout.on("click", function () {
            //canvas.Scene.call("StartGame");
        });

    },
    render: function (stage) {

        stage.refresh();
    }
});