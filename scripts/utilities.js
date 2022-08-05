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
