function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);

  document.querySelector("#verdict").style.opacity = 1;
  if (player.health === enemy.health) {
    document.querySelector("#verdict").innerHTML =
      "tie!<br />Please reload the page to play again!";
    player.dead = true;
    enemy.dead = true;
  }

  if (player.health > enemy.health) {
    document.querySelector("#verdict").innerHTML =
      "Player wins!<br />Please reload the page to play again!";
  }

  if (player.health < enemy.health) {
    document.querySelector("#verdict").innerHTML =
      "Enemy wins!<br />Please reload the page to play again!";
  }
}

let timer = 40;
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
