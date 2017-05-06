var ax, ay, az;

window.ondevicemotion = function (event) {
    ax = event.accelerationIncludingGravity.x;
    ay = event.accelerationIncludingGravity.y;
    az = event.accelerationIncludingGravity.z;
    var info = "X value: " + ax + "<br> Y value: " + ay + "<br> Z value: " + az + "<br> ";
    var zVal = document.getElementById("zVal");
    zVal.innerHTML = info;
}

var hero_elem;

var canvas = CE.defines("canvas_id").
ready(function () {
    canvas.Scene.call("MyScene");
});

canvas.Scene.new({
    name: "MyScene",
    materials: {
        images: {
            img_id: "img/hero.png"
        }
    },
    ready: function (stage) {
        hero_elem = this.createElement();
        hero_elem.drawImage("img_id");
        stage.append(hero_elem);
    },
    render: function (stage) {

        stage.refresh();
    }
});