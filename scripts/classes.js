class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    frameMax = 1,
    currentFrame = 0,
    framesElapsed = 0,
    framesHold = 8,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.offset = offset;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;
    this.frameMax = frameMax;
    this.currentFrame = currentFrame;
    this.framesElapsed = framesElapsed;
    this.framesHold = framesHold;
  }

  draw() {
    canvasContext.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.frameMax),
      0,
      this.image.width / this.frameMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.frameMax - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offset = { x: 0, y: 0 },
    imgSrc,
    frameMax = 1,
    scale = 1,
    currentFrame = 0,
    framesElapsed = 0,
    framesHold = 8,
    sprites,
  }) {
    super({
      position,
      offset,
      imgSrc,
      scale,
      frameMax,
      currentFrame,
      framesElapsed,
      framesHold,
    });
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
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }

    console.log(this.sprites);
  }

  // draw() {
  //   canvasContext.fillStyle = this.color;
  //   canvasContext.fillRect(
  //     this.position.x,
  //     this.position.y,
  //     this.width,
  //     this.height
  //   );
  //   if (this.isAttacking) {
  //     canvasContext.fillStyle = "Red";
  //     canvasContext.fillRect(
  //       this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     );
  //   }
  // }

  update() {
    this.draw();

    this.animateFrames();
    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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
