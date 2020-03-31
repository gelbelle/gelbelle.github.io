"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let CVS_WIDTH = canvas.width;
let CVS_HEIGHT = canvas.height;
let container = document.getElementById("container");
let gameStats = document.getElementById("gameStats");
let wins = 0;
let losses = 0;
let score = wins - losses;

let gameRunning = true;

let sprites = {};

function loadSprites() {
    sprites.player = new Image();
    sprites.player.src = "images/hero.png";

    sprites.bg = new Image();
    sprites.bg.src = "images/floor.png";

    sprites.enemy = new Image();
    sprites.enemy.src = "images/enemy.png";

    sprites.goal = new Image();
    sprites.goal.src = "images/chest.png";
}

class GameCharacter {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.maxSpeed = 3;
    }

    moveX() {
        if ((this.x > CVS_WIDTH - this.width) | (this.x < 0)) {
            this.speed = -this.speed;
        }
        this.x += this.speed;
    }

    moveY() {
        if ((this.y > CVS_HEIGHT - this.height) | (this.y < 0)) {
            this.speed = -this.speed;
        }
        this.y += this.speed;
    }
}

//***Enemies
let rect1 = new GameCharacter(110, 50, 40, 40, "olive", 2);
let rect2 = new GameCharacter(290, 200, 40, 40, "cadetblue", 3);
let rect3 = new GameCharacter(475, 350, 40, 40, "darkorange", 4);
let enemies = [rect1, rect2, rect3];

let player = new GameCharacter(10, CVS_HEIGHT / 2, 40, 40, "lightpink", 0);
let goal = new GameCharacter(
    CVS_WIDTH - 55,
    CVS_HEIGHT / 2,
    36,
    100,
    "green",
    0
);

document.onkeydown = function (event) {
    let keyPressed = event.keyCode;

    if (keyPressed == 39) {
        player.speed = player.maxSpeed;
    }

    if (keyPressed == 37) {
        player.speed = -player.maxSpeed;
    }
};

document.onkeyup = function (event) {
    let keyPressed = event.keyCode;
    if ((keyPressed == 39) | (keyPressed == 37)) {
        player.speed = 0;
    }
};

function pauseGame() {
    player.x = 0;
    player.speed = 0;
    // enemies.forEach(function (element) {
    //     element.speed = 0;
    // });
}

function draw() {
    ctx.clearRect(0, 0, CVS_WIDTH, CVS_HEIGHT); //Must clear before every draw!!!!

    ctx.drawImage(sprites.bg, 0, 0);

    ctx.drawImage(sprites.player, player.x, player.y);
    ctx.drawImage(sprites.goal, goal.x, goal.y);

    enemies.forEach(moveChar);
    enemies.forEach(function (element) {
        ctx.drawImage(sprites.enemy, element.x, element.y)
    });
};

function checkCollision(obj1, obj2) {
    let xOverlap = Math.abs(obj1.x - obj2.x) <= Math.max(obj1.width, obj2.width);
    let yOverlap =
        Math.abs(obj1.y - obj2.y) <= Math.max(obj1.height, obj2.height);

    return xOverlap && yOverlap;
}

function moveChar(enemy) {
    enemy.moveY();
    player.moveX();

    if (checkCollision(enemy, player)) {
        losses++;
        endGame("You lose");
    }

    if (checkCollision(player, goal)) {
        wins++;
        endGame("You Win");
    }
}

function endGame(message) {
    pauseGame();
    //gameRunning = false;
    alert(message);
}

//***Main function that runs game
let step = function () {
    draw();
    if (gameRunning) {
        window.requestAnimationFrame(step); //Like while loop, keeps calling the next step so game continues drawing. THIS MUST BE AT THE END OF THE STEP FUNCTION!!!!!
    }
};

function updateWins() {
    return wins++;
}

loadSprites();
step(); //Start game

gameStats.innerHTML = `Wins: ${wins} <br>Losses: ${losses} <br>Score: ${score}`;