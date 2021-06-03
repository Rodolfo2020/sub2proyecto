const itemPuntaje = document.getElementById('puntos');
const itemVidas = document.getElementById('vidas');
let puntos = 0;
let vidas = 3;
itemVidas.textContent = 'Vidas: ' + vidas;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


var lost = false;
var balls = [];
var rayosNave = [];
var rayosEnemigo = [];

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

// define Ball constructor, inheriting from Shape

function Alien(x, y, velX, velY, exists, size) {
    Shape.call(this, x, y, velX, velY, exists);

    this.size = size;
    this.task = setInterval(this.disparar(), 1000);
}

Alien.prototype = Object.create(Shape.prototype);
Alien.prototype.constructor = Alien;

// define ball draw method

Alien.prototype.draw = function () {
// Draw saucer bottom.
    ctx.beginPath();
    ctx.moveTo(this.x + 4.1, this.y + 4.9);
    ctx.bezierCurveTo(this.x + 6.1, this.y + 7.7, this.x + 0.6, this.y + 10, this.x - 6.3, this.y + 10);
    ctx.bezierCurveTo(this.x - 13.2, this.y + 10, this.x - 18.7, this.y + 7.7, this.x - 18.7, this.y + 4.9);
    ctx.bezierCurveTo(this.x - 18.7, this.y + 2.1, this.x - 13.2, this.y - 0.2, this.x - 6.3, this.y - 0.2);
    ctx.bezierCurveTo(this.x + 0.6, this.y - 0.2, this.x + 6.1, this.y + 2.1, this.x + 6.1, this.y + 4.9);
    ctx.closePath();
    ctx.fillStyle = "rgb(103,92,224)";
    ctx.fill();
    // Draw saucer top.
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x, this.y + 1.3, this.x - 2.9, this.y + 2.3, this.x - 6.4, this.y + 2.3);
    ctx.bezierCurveTo(this.x - 9.9, this.y + 2.3, this.x - 12.7, this.y + 1.3, this.x - 12.7, this.y);
    ctx.bezierCurveTo(this.x - 12.7, this.y - 1.2, this.x - 9.9, this.y - 2.3, this.x - 6.4, this.y - 2.3);
    ctx.bezierCurveTo(this.x - 2.9, this.y - 2.3, this.x, this.y - 1.2, this.x, this.y);
    ctx.closePath();
    ctx.fillStyle = "rgb(194,255,247)";
    ctx.fill();
};

Alien.prototype.disparar = function () {
    let disparar = Math.round(Math.random());
    if (disparar) {
        rayosEnemigo.push(new RayoEnemigo(this.x, this.y));
    }
};

Alien.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
        this.y += 15;
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
        this.y += 10;
    }

    if ((this.y + this.size) >= height + this.size) {
        clearInterval(this.task);
        this.exists = false;
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

Alien.prototype.collisionDetect = function () {
    for (let j = 0; j < rayosNave.length; j++) {
        if (rayosNave[j].exists) {
            const cx = this.x;
            const cy = this.y;
            const r = this.size;
            const x = rayosNave[j].x
            const y = rayosNave[j].y - 5
            const w = 1;
            const h = 5;
            var px = cx;
            px = cx;
            if (px < x) px = x;
            if (px > x + w) px = x + w;
            var py = cy;
            if (py < y) py = y;
            if (py > y + h) py = y + h;
            var distancia = Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
            if (distancia < r) {
                this.exists = false;
                rayosNave[j].exists = false;
                puntos++;
                itemPuntaje.textContent = "Puntos: " + puntos;
            }
        }
    }
};

function Nave(x, y, exists) {
    Shape.call(this, x, y, 20, 0, exists);
    this.size = 10;
}

Nave.prototype = Object.create(Shape.prototype);
Nave.prototype.constructor = Nave;

Nave.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(134,134,134)";
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "rgb(134,134,134)";
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "rgb(213,255,250)";
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y + this.size * -0.2, this.size * 0.6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "rgb(213,255,250)";
    ctx.closePath();
    ctx.fill();
};

Nave.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

};

Nave.prototype.setControls = function () {
    var _this = this;
    window.onkeypress = function (e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.keyCode == 32) {
            let rayo = new RayoNave(_this.x, _this.y);
            rayosNave.push(rayo);
        }
    };
};

Nave.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                if (vidas > 0) {
                    vidas--;
                    itemVidas.textContent = 'Vidas: ' + vidas;
                } else {
                    lostGame();
                }
            }
        }
    }
    for (let j = 0; j < rayosEnemigo.length; j++) {
        if (rayosEnemigo[j].exists) {
            const cx = this.x;
            const cy = this.y;
            const r = this.size;
            const x = rayosEnemigo[j].x
            const y = rayosEnemigo[j].y - 5
            const w = 1;
            const h = 5;
            var px = cx;
            px = cx;
            if (px < x) px = x;
            if (px > x + w) px = x + w;
            var py = cy;
            if (py < y) py = y;
            if (py > y + h) py = y + h;
            var distancia = Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
            if (distancia < r) {
                rayosEnemigo[j].exists = false;
                if (vidas > 0) {
                    vidas--;
                    itemVidas.textContent = 'Vidas: ' + vidas;
                } else {
                    lostGame();
                }
            }
        }
    }

};


function Rayos(x, y, color, velY) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velY = velY;
    this.exists = true;
}

function RayoNave(x, y) {
    Rayos.call(this, x, y, 'rgb(255,4,4)', -10);
}

RayoNave.prototype = Object.create(Rayos.prototype);
RayoNave.prototype.constructor = RayoNave;

RayoNave.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y - 5);
    ctx.strokeStyle = this.color;
    ctx.closePath();
    ctx.stroke();
};

RayoNave.prototype.checkBounds = function () {
    if ((this.y + this.size) >= height + this.size) {
        this.exists = false;
    }

};

RayoNave.prototype.update = function () {
    if ((this.y + this.size) >= height + this.size) {
        this.exists = false;
    }

    if ((this.y - this.size) <= 0) {
        this.exists = false;
    }

    this.y += this.velY;
};


function RayoEnemigo(x, y) {
    Rayos.call(this, x, y, 'rgb(100,255,21)', Math.round(Math.random() * (15 - 5)) + 5);
}

RayoEnemigo.prototype = Object.create(Rayos.prototype);
RayoEnemigo.prototype.constructor = RayoEnemigo;

RayoEnemigo.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y - 5);
    ctx.strokeStyle = this.color;
    ctx.closePath();
    ctx.stroke();
};

RayoEnemigo.prototype.checkBounds = function () {
    if ((this.y + this.size) >= height + this.size) {
        this.exists = false;
    }

};

RayoEnemigo.prototype.update = function () {
    if ((this.y + this.size) >= height + this.size) {
        this.exists = false;
    }

    if ((this.y - this.size) <= 0) {
        this.exists = false;
    }

    this.y += this.velY;
};

function crearAliens() {
    let espacio = (width - 40) / 8;
    for (let i = 20;
         i < espacio * 8 + 20;
         i += espacio
    ) {
        const size = 7;
        let ball = new Alien(
            i,
            20,
            2,
            0.4,
            true,
            size
        );
        balls.push(ball);
    }
}

var spawnAliensTask = window.setInterval(crearAliens, 2000);

let nave = new Nave(width / 2, height - 20, true);
nave.setControls();

function loop() {
    if (lost == true)
        clearInterval(spawnAliensTask);
    else {
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < balls.length; i++) {
            if (balls[i].exists) {
                balls[i].draw();
                balls[i].update();
                balls[i].collisionDetect();
            }
        }


        for (let i = 0; i < rayosNave.length; i++) {
            if (rayosNave[i].exists) {
                rayosNave[i].draw();
                rayosNave[i].checkBounds();
                rayosNave[i].update();
            }
        }

        for (let i = 0; i < rayosEnemigo.length; i++) {
            if (rayosEnemigo[i].exists) {
                rayosEnemigo[i].draw();
                rayosEnemigo[i].checkBounds();
                rayosEnemigo[i].update();
            }
        }

        nave.draw();
        nave.checkBounds();
        nave.collisionDetect();
        requestAnimationFrame(loop);
    }
}

loop();

let topTask;

function lostGame() {
    lost = true;
    const modal = document.getElementById("finJuego");
    modal.style.display = "block";
    const p = document.getElementById("puntuacion");
    p.value = puntos;
    actualizarTop();
    topTask = setInterval(actualizarTop, 15000);
}

function actualizarTop() {
    $.ajax({
        url: 'puntuaciones.json',
        type: 'GET',
        dataType: 'json'
    }).done(function (datos) {
        datos.sort(GetSortOrder("puntuacion"));
        let salida = "";
        let top = document.getElementById("top-rank-players");
        for (let i = datos.length - 1; i > datos.length - 11; i--) {
            if(datos[i] == undefined){
                salida += "<li> - </li>"
            } else {
                salida += "<li>" + datos[i].nickname + " - " + datos[i].puntuacion + "</li>";
            }
        }
        top.innerHTML = salida;
    });
}

function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

function bloquearBotones(){
    let btn = document.getElementById("btn-send");
    btn.disabled = true;
    btn.value = 'Guardado...';
    document.getElementById('nickname').readOnly = true;
}