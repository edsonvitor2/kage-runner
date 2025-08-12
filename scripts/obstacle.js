class Obstacle {
  constructor(canvasWidth, groundY) {
    this.image = new Image();
    this.image.src = "Object/shuriken.png";

    this.x = canvasWidth + 50; 
    this.y = groundY + 100;

    this.width = 30;
    this.height = 30;

    this.rotation = 0;
    this.rotationSpeed = (Math.random() * 0.1) + 0.05;

    this.speedX = 4; // definida no spawn
    this.speedXMax = 12;
  }

  update() {
    this.x -= this.speedX;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  checkCollision(player) {
    // Colisão oval/elíptica para o player
    // Centro e raios da elipse do player
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    const rx = player.width / 2;
    const ry = player.height / 2;

    // Ponto mais próximo do centro da elipse dentro do retângulo do obstáculo
    const closestX = Math.max(this.x, Math.min(px, this.x + this.width));
    const closestY = Math.max(this.y, Math.min(py, this.y + this.height));

    // Distância normalizada
    const dx = (px - closestX) / rx;
    const dy = (py - closestY) / ry;

    // Se a soma dos quadrados das distâncias normalizadas for <= 1, há colisão
    return (dx * dx + dy * dy) <= 1;
  }
}

window.Obstacle = Obstacle;
