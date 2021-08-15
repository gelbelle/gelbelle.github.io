"use strict"

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width = window.innerWidth;
const canvasHeight = canvas.height = window.innerHeight;

let score = 0;

//** Handles sizing to full width regardless of scrollbars
function handleFullWidthSizing() {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    document.querySelector("canvas").style.width = `calc(100vw - ${scrollbarWidth}px)`;
}

if (document.readyState === "complete") {
    handleFullWidthSizing();
} else {
    document.onreadystatechange = function() {
        if (document.readyState === "complete") {
            handleFullWidthSizing();
        }
    }
}
//**
console.log(`Orientation changed. ${screen.orientation.type}`);

//** Orientation Testing
screen.orientation.addEventListener("change", function() {
    console.log(`Orientation changed. ${screen.orientation.type}`);
});

//** Creating a Shape **//
function Shape(x, y, velX, velY, exists = true) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

let shapeEater = {
    init() {
        this.width = 50;
        this.height = 50;
        this.x = canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight / 2 - this.height / 2;
        this.velX = 20;
        this.velY = 20;
        this.color = "black";
    },

    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    setControls() {
        let _this = this;
        window.onkeydown = function(evt) {
            if (evt.key === "a" || evt.key === "ArrowLeft") {
                _this.x -= _this.velX;
            } else if (evt.key === "d" || evt.key === "ArrowRight") {
                _this.x += _this.velX;
            } else if (evt.key === "w" || evt.key === "ArrowUp") {
                _this.y -= _this.velY;
            } else if (evt.key === "s" || evt.key === "ArrowDown") {
                _this.y += _this.velY;
            }
        }
    },

    update() {
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.x + this.width >= canvasWidth) {
            this.x = canvasWidth - this.width;
        }
        if (this.y <= 0) {
            this.y = 0;
        }
        if (this.y + this.height >= canvasHeight) {
            this.y = canvasHeight - this.height;
        }
    },

    detectCollision() {
        let offsetX;
        let offsetY;

        for (let ball of balls) {
            if (ball.exists) {
                offsetX = setOffsetX(ball, this);

                offsetY = setOffsetY(ball, this);


                if (distance(ball.x, ball.y, offsetX, offsetY) < ball.radius) {
                    ball.exists = false;
                    balls = balls.filter(el => el.exists !== false);
                    score++
                }
            }
        }
    }
}

let setOffsetX = function(ball, checking) {
    let offsetX;
    if (ball.x < checking.x) {
        offsetX = checking.x;
    } else if (ball.x > checking.x + checking.width) {
        offsetX = checking.x + checking.width;
    } else {
        offsetX = ball.x;
    }

    return offsetX;
}

let setOffsetY = function(ball, checking) {
    let offsetY;
    if (ball.y < checking.y) {
        offsetY = checking.y;
    } else if (ball.y > checking.y + checking.height) {
        offsetY = checking.y + checking.height;
    } else {
        offsetY = ball.y;
    }

    return offsetY;
}

let distance = function(x1, y1, x2, y2) {
    let distX = (x2 - x1) * (x2 - x1);
    let distY = (y2 - y1) * (y2 - y1);

    return Math.sqrt(distX + distY);
}

//** Creating a Ball **//
function Ball(x, y, velX, velY, color, radius) {
    Shape.call(this, x, y, velX, velY);
    this.color = color;
    this.radius = radius;
    this.right = this.x + radius;
    this.left = this.x - radius;
    this.top = this.y - radius;
    this.bottom = this.y + radius;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.radius) >= canvasWidth || (this.x - this.radius) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.radius) >= canvasHeight || (this.y - this.radius) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.detectCollision = function() {
    for (let ball of balls) {
        if (this !== ball && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.radius + ball.radius) {
                ball.color = this.color = `rgb(${randomNum(0,255)}, ${randomNum(0,255)}, ${randomNum(0,255)})`;
                this.velX = -this.velX;
                this.velY = -this.velY;
            }
        }
    }
}

//***

let randomNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//** Draw Button **//
function drawButton(message, x, y) {
    if (!x) {
        x = canvas.width / 2;
    }
    if (!y) {
        y = canvas.height / 3;
    }
    let msg = drawMessage(message, x, y, 16);
    const msgWidth = msg.width;
    const msgHeight = msg.height;
    const btnWidth = msgWidth + (msgWidth / 2);
    const btnHeight = msgHeight + (msgHeight / 4);

    ctx.fillStyle = "#ffae42";
    ctx.fillRect(x - btnWidth / 2, y - btnHeight / 3, btnWidth, btnHeight);
    drawMessage(message, x, y, 16)

    return {
        x: x - btnWidth,
        y: y - btnHeight,
        message: message,
        height: 2 * btnHeight,
        width: 2 * btnWidth,
    }
}
//** Draw Message **//

let drawMessage = function(message, x, y, radius, textColor = "white") {
    ctx.font = radius + "px Arial, bold";
    //const textInfo = ctx.measureText(message);
    let textHeight = Number(ctx.font.match(/\d+/).pop());
    ctx.textAlign = "center";
    const lines = message.split("\n");
    ctx.fillStyle = textColor;
    let max = 0;
    for (let line of lines) {
        ctx.fillText(line, x, y + textHeight);
        textHeight += textHeight + radius;
        if (ctx.measureText(line).width > max) {
            max = ctx.measureText(line).width;
        }
    }

    return {
        width: max,
        height: textHeight
    };
}

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function checkClick(loc, btn) {
    return loc.x >= btn.x && loc.x <= btn.x + btn.width && loc.y >= btn.y && loc.y <= btn.y + btn.height
}

let balls = [];
let evil = Object.create(shapeEater);


let running = false;

function loop() {
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);


    for (let ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.detectCollision();
        }
    }
    evil.draw();
    evil.update();
    evil.detectCollision();

    if (balls.length === 0) {
        running = false;
        let endTime = Date.now() - start;
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        canvas.addEventListener("click", handleClick, false);

        drawButton(`You won!\nIt took you ${Math.floor(endTime/1000)} seconds`, canvasWidth / 2, canvasHeight / 3);
        restartBtn = drawButton("Restart", canvasWidth / 2, canvasHeight / 2);
    }

    drawMessage("Score: " + score, 64, canvasHeight - 30, 20, "white");
    if (running) {
        canvas.removeEventListener("click", handleClick, false);
        requestAnimationFrame(loop);
    }
}

let start;
let startBtn;
let restartBtn;

function setupGame() {
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    while (balls.length < 25) {
        let radius = randomNum(10, 20);
        let ball = new Ball(randomNum(0 + radius, canvasWidth - radius), randomNum(0 + radius, canvasHeight - radius), randomNum(-7, 7), randomNum(-7, 7), `rgb(${randomNum(0,255)}, ${randomNum(0,255)}, ${randomNum(0,255)})`, radius);

        balls.push(ball);
    }
    for (let ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.detectCollision();
        }
    }
    evil.init();
    evil.draw();

    score = 0;
    startBtn = drawButton("Start");
}

let handleClick = function(evt) {
    if (checkClick(getMousePos(evt), startBtn)) {
        running = true;
        start = Date.now();
        evil.setControls();

        loop();
    } else if (checkClick(getMousePos(evt), restartBtn)) {
        setupGame();
    }
}

canvas.addEventListener("click", handleClick, false);

setupGame();

// canvas.addEventListener("click", function() {
//     if (running) {
//         running = false;
//     } else {
//         running = true;
//         start = Date.now();
//         loop();
//     }
// });