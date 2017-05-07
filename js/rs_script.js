var ax, ay, az;

window.ondevicemotion = function (event) {
    ax = event.accelerationIncludingGravity.x;
    ay = event.accelerationIncludingGravity.y;
    az = event.accelerationIncludingGravity.z;
    //var info = "X value: " + ax + "<br> Y value: " + ay + "<br> Z value: " + az + "<br> ";
    //var zVal = document.getElementById("zVal");
    //zVal.innerHTML = info;
}

//SPEEDS

//pig = 0.5
//heart = 1
//angel = 1.5
//monkey = 2
//tiger = 2.5
//devil = 3

var can_height, can_width;

var hero_elem, devil_elem, fruit_elem;
var hero_entity, devil_entity, fruit_entity;
var left_border;
var score_text, end_text;

var score = 0;

var time_count = 0;
var devil_speed = 0.5;
var max_devil_speed = 4;

var player_speed = 1.5;
var player_character = "angel";  // angel , horn , tiger , heart , monkey , pig

var canvas = CE.defines("canvas_id").
    extend(Hit).
ready(function () {
    can_height = document.getElementById('canvas_id').offsetHeight;
    can_width = document.getElementById('canvas_id').offsetWidth;
    canvas.Scene.call("menu");  //splash_jes
});

canvas.Scene.new({
    name: "StartGame", // Obligatory
    materials: {
        images: {
            img_angel: "img/new/angel_face.png",
            img_horns: "img/new/face_with_horns.png",
            img_heart: "img/new/heart_eyes.png",
            img_monkey: "img/new/monkey_face.png",
            img_pig: "img/new/pig_face.png",
            img_tiger: "img/new/tiger_face.png",
            devil_img_id: "img/new/red_devil.png",
            fruit_img_id: "img/new/donut.png",
            bg1_img_id: "img/bg1.png",
            img_score: "img/new/RS_Score.png",
            bg2_img_id: "img/bg2.gif"
        }
    },
    ready: function (stage) {
        score = 0;

        var bg = this.createElement();
        bg.drawImage("bg2_img_id");
        //stage.append(bg);

        dispScore = this.createElement();
        dispScore.drawImage("img_score", 0, 0);
        stage.append(dispScore);

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
        score_text.fillText(score, 70, 25);

        switch (player_character) // angel , horn , tiger , heart , monkey , pig
        {
            case "pig":
                hero_entity = addEntities(0, 0, "img_pig");
                break;

            case "heart":
                hero_entity = addEntities(0, 0, "img_heart");
                break;

            case "angel":
                hero_entity = addEntities(0, 0, "img_angel");
                break;

            case "monkey":
                hero_entity = addEntities(0, 0, "img_monkey");
                break;

            case "tiger":
                hero_entity = addEntities(0, 0, "img_tiger");
                break;

            case "horn":
                hero_entity = addEntities(0, 0, "img_horns");
                break;

            default:
                hero_entity = addEntities(0, 0, "img_angel");
                break;
        }
        devil_entity = addEntities(can_width - 50, can_height - 50, "devil_img_id");
        fruit_entity = addEntities((can_width - 50) / 2, (can_height - 50) / 2, "fruit_img_id");

        stage.append(score_text);
    },
    render: function (stage) {
        time_count++;

        //if (devil_speed < max_devil_speed) {
        //    if (time_count % 300 == 0) //REPEATE AFTER FIVE SECONDS (300/60)
        //        devil_speed += 0.5;
        //}

        if (time_count % 5 == 0) //REPEATE AFTER 83.33 MILISECONDS (5/60)
            score += 1;

        if (score >= 500 && score < 1000)
            devil_speed = 1;
        else if (score >= 1000 && score < 1500)
            devil_speed = 1.5;
        else if (score >= 1500 && score < 2000)
            devil_speed = 2;
        else if (score >= 2000 && score < 2500)
            devil_speed = 2.5;
        else if (score >= 2500 && score < 3000)
            devil_speed = 3;
        else if (score >= 3000 && score < 3500)
            devil_speed = 3.5;
        else if (score >= 3500)
            devil_speed = 4;
        else 
            devil_speed = 0.5;

        score_text.fillText(score, 70, 25);

        //MOVE HERO START
        hero_entity.move((-ax * player_speed), (ay * player_speed));
        //MOVE HERO END

        //BOUNDING HERO START
        if (hero_entity.el.x < 0) //LEFT WALL
            hero_entity.position(0, hero_entity.el.y);

        if (hero_entity.el.x > can_width - 50) //RIGHT WALL
            hero_entity.position(can_width - 50, hero_entity.el.y);

        if (hero_entity.el.y < 0) //TOP WALL
            hero_entity.position(hero_entity.el.x, 0);

        if (hero_entity.el.y > can_height - 50) // BOTTOM WALL
            hero_entity.position(hero_entity.el.x, can_height - 50);
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
                canvas.Scene.call("game_over");
                devil_speed = 0.5;
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
            img_gameover: "img/new/RS_GameOver.png",
            img_mainmenu: "img/new/RS_MainMenu.png",
            img_score: "img/new/RS_Score.png",
            img_playagain: "img/new/RS_PlayAgain.png",
            img_c_face: "img/new/challenge_facebook.png",
            img_c_what: "img/new/challenge_whatsapp.png"
        }
    },
    ready: function (stage) {
        gameOver = this.createElement();
        gameOver.drawImage("img_gameover", 5, 10);
        stage.append(gameOver);

        dispScore = this.createElement();
        dispScore.drawImage("img_score", 110, 110);
        stage.append(dispScore);

        playAgain = this.createElement();
        playAgain.drawImage("img_playagain", 97, 160);
        stage.append(playAgain);

        playAgain.on("click", function () {
            canvas.Scene.call("StartGame");
        });

        mainMenu = this.createElement();
        mainMenu.drawImage("img_mainmenu", 97, 210);
        stage.append(mainMenu);

        mainMenu.on("click", function () {
            canvas.Scene.call("menu");
        });

        challengeWhatsapp = this.createElement();
        challengeWhatsapp.drawImage("img_c_what", 35, 255);
        stage.append(challengeWhatsapp);

        challengeWhatsapp.on("click", function () {
            window.open("whatsapp://send?text=I%20scored%20" + score + "%20in%20Run%20Smilo.%20Lets%20see%20if%20you%20can%20beat%20me?%20%20http://www.squibs.in/rs");
        });

        challengeFacebook = this.createElement();
        challengeFacebook.drawImage("img_c_face", 37, 300);
        stage.append(challengeFacebook);

        challengeFacebook.on("click", function () {
            window.open("https://www.facebook.com/sharer/sharer.php?u=www.squibs.in/rs");
        });



        score_text = this.createElement();
        score_text.font = "20px Calibri";
        score_text.fillStyle = "yellow";
        score_text.fillText(score, 178, 135);
        stage.append(score_text);

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
            canvas.Scene.call("menu");
        }, 5000);
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
    name: "show_credits", // Obligatory
    materials: {
        images: {
            img_credit: "img/new/RS_showCredit.png",
            img_mainMenu: "img/new/RS_MainMenu.png"
        }
    },
    ready: function (stage) {

        cred = this.createElement();
        cred.drawImage("img_credit");
        stage.append(cred);

        mainMenu = this.createElement();
        mainMenu.drawImage("img_mainMenu",100,300);
        stage.append(mainMenu);

        mainMenu.on("click", function () {
            canvas.Scene.call("menu");
        });

    },
    render: function (stage) {

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "show_tuts", // Obligatory
    materials: {
        images: {
            img_tutPoints: "img/new/RS_TutPoints.png",
            img_mainMenu: "img/new/RS_MainMenu.png"
        }
    },
    ready: function (stage) {

        tutPoints = this.createElement();
        tutPoints.drawImage("img_tutPoints", 20, 20);
        stage.append(tutPoints);

        mainMenu = this.createElement();
        mainMenu.drawImage("img_mainMenu", 95, 290);
        stage.append(mainMenu);

        mainMenu.on("tap", function () {
            canvas.Scene.call("menu");
        });

    },
    render: function (stage) {

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "show_characters", // Obligatory
    materials: {
        images: {
            img_angel: "img/new/angel_face.png",
            img_horns: "img/new/face_with_horns.png",
            img_tiger: "img/new/tiger_face.png",
            img_heart_eyes: "img/new/heart_eyes.png",
            img_monkey: "img/new/monkey_face.png",
            img_pig: "img/new/pig_face.png",
            img_mainMenu: "img/new/RS_MainMenu.png"
        }
    },
    ready: function (stage) {

        btnAngel = this.createElement();
        btnAngel.drawImage("img_angel", 50, 83);
        stage.append(btnAngel);

        btnAngel.on("click", function () {
            player_speed = 1.5;
            player_character = "angel";
            canvas.Scene.call("menu");
        });

        btnHorn = this.createElement();
        btnHorn.drawImage("img_horns", 150, 83);
        stage.append(btnHorn);

        btnHorn.on("click", function () {
            player_speed = 3;
            player_character = "horn";
            canvas.Scene.call("menu");  
        });

        btnTiger = this.createElement();
        btnTiger.drawImage("img_tiger", 250, 83);
        stage.append(btnTiger);

        btnTiger.on("click", function () {
            player_speed = 2.5;
            player_character = "tiger";
            canvas.Scene.call("menu");
        });

        btnHeart = this.createElement();
        btnHeart.drawImage("img_heart_eyes", 50, 183);
        stage.append(btnHeart);

        btnHeart.on("click", function () {
            player_speed = 1;
            player_character = "heart";
            canvas.Scene.call("menu");
        });

        btnMonkey = this.createElement();
        btnMonkey.drawImage("img_monkey", 150, 183);
        stage.append(btnMonkey);

        btnMonkey.on("click", function () {
            player_speed = 2;
            player_character = "monkey";
            canvas.Scene.call("menu");
        });

        btnPig = this.createElement();
        btnPig.drawImage("img_pig", 250, 183);
        stage.append(btnPig);

        btnPig.on("click", function () {
            player_speed = 0.5;
            player_character = "pig";
            canvas.Scene.call("menu");
        });

        btnMainMenu = this.createElement();
        btnMainMenu.drawImage("img_mainMenu", 105, 280);
        stage.append(btnMainMenu);

        btnMainMenu.on("click", function () {
            canvas.Scene.call("menu");
        });

    },
    render: function (stage) {

        stage.refresh();
    }
});


canvas.Scene.new({
    name: "menu", // Obligatory
    materials: {
        images: {
            img_title: "img/new/RS_Title.png",
            img_title: "img/new/RS_Title.png",
            img_start: "img/new/RS_StartGame.png",
            img_about: "img/new/RS_Credits.png",
            img_char: "img/new/RS_Characters.png",
            img_facebook: "img/new/RS_fb_logo.png",
            img_twitter: "img/new/RS_twitter_logo.png",
            img_tut: "img/new/RS_Tutorial.png"
        }
    },
    ready: function (stage) {

        lblTitle = this.createElement();
        lblTitle.drawImage("img_title", 17,10);
        stage.append(lblTitle);

        btnStart = this.createElement();
        btnStart.drawImage("img_start", 100, 100);
        stage.append(btnStart);

        btnStart.on("tap", function () {
            canvas.Scene.call("StartGame");
        });

        btnTutorial = this.createElement();
        btnTutorial.drawImage("img_tut", 100, 150);
        stage.append(btnTutorial);

        btnTutorial.on("tap", function () {
            canvas.Scene.call("show_tuts");
        });

        btnChar = this.createElement();
        btnChar.drawImage("img_char", 100, 200);
        stage.append(btnChar);

        btnChar.on("click", function () {
            canvas.Scene.call("show_characters");
        });

        btnAbout = this.createElement();
        btnAbout.drawImage("img_about", 100, 250);
        stage.append(btnAbout);

        btnAbout.on("click", function () {
            canvas.Scene.call("show_credits");
        });

        btnFacebook = this.createElement();
        btnFacebook.drawImage("img_facebook", 120, 300);
        stage.append(btnFacebook);

        btnFacebook.on("click", function () {
            window.open("https://www.facebook.com/jeslogies");
        });

        btnTwitter = this.createElement();
        btnTwitter.drawImage("img_twitter", 180, 300);
        stage.append(btnTwitter);

        btnTwitter.on("click", function () {
            window.open("https://www.twitter.com/jeslogies");
        });

    },
    render: function (stage) {

        stage.refresh();
    }
});