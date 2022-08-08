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
    x: 215,
    y: 157,
  },
  imgSrc: "../sprites/characters/0/idle.png",
  scale: 2.5,
  frameMax: 8,
  sprites: {
    idle: {
      imgSrc: "../sprites/characters/0/idle.png",
      frameMax: 8,
    },
    run: {
      imgSrc: "../sprites/characters/0/run.png",
      frameMax: 8,
    },
    jump: {
      imgSrc: "../sprites/characters/0/jump.png",
      frameMax: 2,
    },
    fall: {
      imgSrc: "../sprites/characters/0/fall.png",
      frameMax: 2,
    },
    attack1: {
      imgSrc: "../sprites/characters/0/attack1.png",
      frameMax: 6,
    },
    takeHit: {
      imgSrc: "../sprites/characters/0/Take-Hit-white.png",
      frameMax: 4,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 215,
    y: 167,
  },
  imgSrc: "../sprites/characters/1/idle.png",
  scale: 2.5,
  frameMax: 4,
  sprites: {
    idle: {
      imgSrc: "../sprites/characters/1/idle.png",
      frameMax: 4,
    },
    run: {
      imgSrc: "../sprites/characters/1/run.png",
      frameMax: 8,
    },
    jump: {
      imgSrc: "../sprites/characters/1/jump.png",
      frameMax: 2,
    },
    fall: {
      imgSrc: "../sprites/characters/1/fall.png",
      frameMax: 2,
    },
    attack1: {
      imgSrc: "../sprites/characters/1/attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imgSrc: "../sprites/characters/1/TakeHit.png",
      frameMax: 3,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 172,
    height: 50,
  },
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
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //?Player jumps
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //!Enemy animate
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //*Enemy Jumps

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // if (player.position.x > enemy.position.x) {
  //   player.attackBox.offset.x = 50;
  // }

  // if (player.position.x < enemy.position.x) {
  //   player.attackBox.width = 100;
  //   enemy.attackBox.width = -50;
  // }

  //!Detection of Collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
  }

  //!player misses
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 2
  ) {
    console.log("player2 hit!");
    player.takeHit();
    document.querySelector("#playerHealth").style.width = `${player.health}%`;
    enemy.isAttacking = false;
  }

  //!enemy misses
  if (enemy.isAttacking && enemy.currentFrame === 4) {
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
