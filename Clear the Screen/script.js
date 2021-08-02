const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

canvas.addEventListener("touchstart", handleTouch, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchmove", handleTouch, false);
canvas.addEventListener("touchcancel", handlecancel, false);

let score = 0;

//** Handles sizing to full width regardless of scrollbars
function handleFullWidthSizing() {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    // const scrollbarHeight = window.innerHeight - document.body.clientHeight;
    // document.querySelector("canvas").style.height = `calc(50hw - ${scrollbarHeight}px)`;
    document.querySelector("canvas").style.width = `calc(100vw - ${scrollbarWidth}px)`;
    // console.log(`inner ${window.innerWidth} client ${document.body.clientWidth}`);
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

function touchHandler(evt) {
    if (evt.touches) {
        evil.x = evt.touches[0].pageX - canvas.offsetLeft - evil.size / 2;
        evil.y = evt.touches[0].pageY - canvas.offsetTop - evil.size / 2;
        console.log(`Touch X: ${evil.x} Y: ${evil.y}`);
        evt.preventDefault();
    }
}

//** Creating a Shape **//
function Shape(x, y, velX, velY, exists = true) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function shapeEater(x, y, velX = 20, velY = 20) {
    Shape.call(this, x, y, velX, velY);
    this.size = 50;
    this.color = "black";
    this.inputEnabled = true;
    this.input.enableDrag();
    this.events.onDragStart.add(onDragStart, this);
    this.events.onDragStop.add(onDragStop, this);
}

shapeEater.prototype.onDragStart = function() {
    console.log("Moving");
}

shapeEater.prototype.onDragStop = function() {
    console.log(`Done moving at ${this.x} ${this.y}`);
}

shapeEater.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(width / 2 - this.size / 2, height / 2 - this.size / 2, this.size, this.size);
}

shapeEater.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.x = width - this.size;
    }
    if ((this.x - this.size) <= 0) {
        this.x = this.size;
    }
    if ((this.y + this.size) >= height) {
        this.y = height - this.size;
    }
    if ((this.y - this.size) <= 0) {
        this.y = this.size;
    }
}

shapeEater.prototype.setControls = function() {
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
}

shapeEater.prototype.detectCollision = function() {
    for (let ball of balls) {
        if (ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.size + ball.size) {
                ball.exists = false;
                balls = balls.filter(el => el.exists !== false);
                score++
            }
        }
    }
}

//** Creating a Ball **//
function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY);
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    console.log(`height ${height} width ${width}`);
    this.y += this.velY;
}

Ball.prototype.detectCollision = function() {
    for (let ball of balls) {
        if (this !== ball && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.size + ball.size) {
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
function drawButton(message, x = canvas.width, y = canvas.height) {
    let msg = drawMessage(message, x, y, 16);

    const msgWidth = msg.width;
    const msgHeight = msg.height;
    const btnWidth = msgWidth + (msgWidth / 2);
    const btnHeight = msgHeight + (msgHeight / 4);
    console.log(`message size ${msgWidth} ${msgHeight}`);

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

let drawMessage = function(message, x, y, size, textColor = "white") {
    ctx.font = size + "px Arial, bold";
    //const textInfo = ctx.measureText(message);
    let textHeight = Number(ctx.font.match(/\d+/).pop());
    ctx.textAlign = "center";
    const lines = message.split("\n");
    ctx.fillStyle = textColor;
    let max = 0;
    for (let line of lines) {
        ctx.fillText(line, x, y + textHeight);
        textHeight += textHeight + size;
        if (ctx.measureText(line).width > max) {
            max = ctx.measureText(line).width;
        }
    }

    return {
        width: max,
        height: textHeight
    };
}

let balls = [];

while (balls.length <= 25) {
    let size = randomNum(10, 20);
    let ball = new Ball(randomNum(0 + size, width - size), randomNum(0 + size, height - size), randomNum(-7, 7), randomNum(-7, 7), `rgb(${randomNum(0,255)}, ${randomNum(0,255)}, ${randomNum(0,255)})`, size);

    balls.push(ball);
}

let evil = new shapeEater(100, 100);
evil.setControls();

let running = false;

function loop() {
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, width, height);
    if (balls.length === 0) {
        running = false;
        let endTime = Date.now() - start;
        drawButton(`You won!\nIt took you ${Math.floor(endTime/1000)} seconds`, width / 2, height / 3);
    }

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

    drawMessage("Score: " + score, 64, height - 30, 20, "white");
    if (running) {
        requestAnimationFrame(loop);
    }
}

let start;

canvas.addEventListener("click", function() {
    if (running) {
        running = false;
    } else {
        running = true;
        start = Date.now();
        loop();
    }
});

loop();