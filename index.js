const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");
const gravity = 0.2;

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.color = color;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    canvasContext.fillStyle = this.color;
    canvasContext.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    if (this.isAttacking) {
      canvasContext.fillStyle = "Red";
      canvasContext.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, 200);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  color: "yellow",
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 400,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 50,
    y: 0,
  },
  color: "white",
});

keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.attackBox.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.attackBox.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.attackBox.position.y &&
    rectangle1.attackBox.position.y <=
      rectangle2.attackBox.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);

  document.querySelector("#verdict").style.opacity = 1;
  if (player.health === enemy.health) {
    document.querySelector("#verdict").innerHTML = "tie";
  }

  if (player.health > enemy.health) {
    document.querySelector("#verdict").innerHTML = "Player wins!";
  }

  if (player.health < enemy.health) {
    document.querySelector("#verdict").innerHTML = "Enemy wins!";
  }
}

let timer = 7;
let timerId;
document.querySelector("#timer").innerHTML = timer;

function startTimer() {
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }

  timerId = setTimeout(startTimer, 1000);
}
startTimer();

function animate() {
  window.requestAnimationFrame(animate);
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //Enemy animate
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  // if (player.position.x > enemy.position.x) {
  //   player.attackBox.offset.x = 50;
  // }

  // if (player.position.x < enemy.position.x) {
  //   player.attackBox.width = 100;
  //   enemy.attackBox.width = -50;
  // }

  //Detection of Collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    console.log("player1 hit!");
    enemy.health -= 20;
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    console.log("player2 hit!");
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = `${player.health}%`;
    enemy.isAttacking = false;
  }

  //Find out winner by zero health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      keys.a.pressed = true;
      player.velocity.y = -5;
      break;
    case " ":
      player.attack();
      break;

    //Enemy Keystrokes
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;

    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      enemy.velocity.y = -5;
      break;
    case "Backspace":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //Enemy key
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
