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
    constructor(x, y, width, height, speedX = 0, speedY = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = speedX;
        this.speedY = speedY;
        this.maxSpeed = 3;
    }

    move() {
        if (this.x > CVS_WIDTH - this.width) {
            this.speedX = CVS_WIDTH - this.speedX;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        this.x += this.speedX;

        if (this.y > CVS_HEIGHT - this.height) {
            this.speedY = -this.speedY;
        }

        if (this.y < 0) {
            this.y = 0;
        }

        this.y += this.speedY
    }
}

class Enemy extends GameCharacter {
    constructor(x, y, width, height, speedX, speedY = speedX) {
        super(x, y, width, height, speedX, speedY);
    }

    move() {
        if (this.x > CVS_WIDTH - this.width | this.x < this.width) {
            this.speedX = -this.speedX;
        }
        if (this.y > CVS_HEIGHT - this.height | this.y < this.height) {
            this.speedY = -this.speedY;
        }

        this.x += this.speedX;
        this.y += this.speedY;
    }
}



//***Enemies
let numEn = 0;
if (CVS_WIDTH > 900) {
    numEn = 5;
} else if (CVS_WIDTH > 500) {
    numEn = 3;
} else {
    numEn = 1;
}

let enemies = createEnemies(numEn);

function createEnemies(numEnemies) {
    let enemiesList = new Array(numEnemies);
    let en;
    for (let i = 0; i < numEnemies; i++) {
        en = new Enemy(getRandom(50, (CVS_WIDTH - 40)), getRandom(40, (CVS_HEIGHT - 40)), 40, 40, getRandom(2, 5));
        enemiesList.push(en);
    }
    return enemiesList;
}

let player = new GameCharacter(10, CVS_HEIGHT / 2, 40, 40);
let goal = new GameCharacter(
    CVS_WIDTH - 55,
    CVS_HEIGHT / 2,
    36,
    100,
);

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

document.onkeydown = function (event) {
    let keyPressed = event.keyCode;

    //Right arrow
    if (keyPressed == 39) {
        player.speedX = player.maxSpeed;
    }
    //Left arrow
    if (keyPressed == 37) {
        player.speedX = -player.maxSpeed;
    }

    //Up arrow
    if (keyPressed == 40) {
        player.speedY = player.maxSpeed;
    }

    //Down arrow
    if (keyPressed == 38) {
        player.speedY = -player.maxSpeed;
    }
};

document.onkeyup = function (event) {
    let keyPressed = event.keyCode;
    if ((keyPressed == 39) | (keyPressed == 37) | (keyPressed == 38) | (keyPressed == 40)) {
        player.speedX = 0;
        player.speedY = 0;
    }
};

function pauseGame() {
    player.x = 0;
    player.speedX = 0;
    player.speedY = 0;
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
    enemy.move();
    player.move();

    if (checkCollision(enemy, player)) {
        updateScore("lose");
        endGame("You lose");
    }

    if (checkCollision(player, goal)) {
        updateScore("win");
        endGame("You Win");
    }
}

function updateScore(type) {
    if (type == "lose") {
        losses++;
    } else {
        wins++;
    }
    score = wins - losses;
    gameStats.innerHTML = `Wins: ${wins} <br>Losses: ${losses} <br>Score: ${score}`;

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