var ax, ay, az;

window.ondevicemotion = function (event) {
    ax = event.accelerationIncludingGravity.x;
    ay = event.accelerationIncludingGravity.y;
    az = event.accelerationIncludingGravity.z;
    var info = "X value: " + ax + "<br> Y value: " + ay + "<br> Z value: " + az + "<br> ";
    var zVal = document.getElementById("zVal");
    zVal.innerHTML = info;
}

var hero_elem, devil_elem, fruit_elem;

var can_width = can_height = 350;

var canvas = CE.defines("canvas_id").
ready(function () {
    canvas.Scene.call("MyScene");
});

canvas.Scene.new({
    name: "MyScene", // Obligatory
    materials: {
        images: {
            hero_img_id: "img/hero.png",
            devil_img_id: "img/devil.png",
            fruit_img_id: "img/fruit.png"
        }
    },
    ready: function (stage) {
        hero_elem = this.createElement();
        hero_elem.drawImage("hero_img_id");

        devil_elem = this.createElement();
        devil_elem.drawImage("devil_img_id");

        fruit_elem = this.createElement();
        fruit_elem.drawImage("fruit_img_id");

        stage.append(hero_elem);
        stage.append(devil_elem);
        stage.append(fruit_elem);
    },
    render: function (stage) {

        //BOUNDING HERO START
        hero_elem.x -= (2 * ax);
        hero_elem.y += (2 * ay);

        if (hero_elem.x < 0)
            hero_elem.x = 0;

        if (hero_elem.y < 0)
            hero_elem.y = 0;

        if (hero_elem.x > can_width - 50)
            hero_elem.x = can_width - 50;

        if (hero_elem.y > can_height - 50)
            hero_elem.y = can_height - 50;
        //BOUNDING HERO END

        //DEVIL FOLLOW HERO START
        if (hero_elem.x > devil_elem.x)
            devil_elem.x += 2;
        else
            devil_elem.x -= 2;

        if (hero_elem.y > devil_elem.y)
            devil_elem.y += 2;
        else
            devil_elem.y -= 2;
        //DEVIL FOLLOW HERO END

        //COLLECT FRUIT START
        collision(hero_elem, fruit_elem)
        //COLLECT FRUIT END

        stage.refresh();
    }
});

function collision(a, b)
{
    //LEFT SIDE
    if ((a.x < b.x && a.x > b.x - 50) && (a.y < b.y && a.y > b.y - 50))
        relocateFruit();

    //RIGHT SIDE
    if ((a.x > b.x && a.x < b.x + 50) && (a.y > b.y && a.y < b.y + 50))
        relocateFruit();

    //UP SIDE
    //if (a.y < b.y && a.y > b.y - 50)
    //    a.y = b.y - 50;

    //DOWN SIDE
    //if (a.y > b.y && a.y < b.y + 50)
    //    a.y = b.y + 50;
}

function relocateFruit()
{
    fruit_elem.x = Math.random(300);
    fruit_elem.y = Math.random(300);
}