const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");
const gravity = 0.2;

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "../sprites/backgrounds/1.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 129,
  },
  imgSrc: "../sprites/backgrounds/shop.png",
  scale: 2.75,
  frameMax: 6,
});

const player = new Fighter({
  position: {
    x: 10,
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

const enemy = new Fighter({
  position: {
    x: 964,
    y: 0,
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

startTimer();

function animate() {
  window.requestAnimationFrame(animate);
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
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
