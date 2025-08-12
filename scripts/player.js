class Player {
    constructor(x, y, groundY) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.gravity = 1;
        this.jumpStrength = -15;
        this.velocityY = 0;
        this.grounded = false;
        this.isJumping = false;
        this.minJumpHeight = 200;
        this.jumpStartY = y;
        this.groundY = groundY;

        // Animação
        this.frames = [];
        this.currentFrame = 0;
        this.frameSpeed = 3;
        this.frameCounter = 0;
        this.totalFrames = 8; // ajuste conforme quantidade de sprites
        this.loadFrames();
    }
    loadFrames() {
        for (let i = 1; i <= this.totalFrames; i++) {
            let img = new Image();
            img.src = `anim_player/Run-${i}.png`;
            this.frames.push(img);
        }
    }

    jump() {
        if (this.grounded) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
            this.grounded = false;
            this.jumpStartY = this.y;
        }
    }

    stopJump() {
        // Só executa stopJump se estiver subindo
        if (this.isJumping && this.velocityY < 0) {
            if ((this.jumpStartY - this.y) < this.minJumpHeight) {
                this.velocityY = this.jumpStrength / 2; // impulso extra para atingir o mínimo
            } else {
                // Caso já tenha atingido a altura mínima, começa a cair
                if (this.velocityY < -5) {
                    this.velocityY = -5;
                }
            }
            this.isJumping = false;
        }
    }

    update() {
        // Atualiza animação
        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Colisão com o chão
        if (this.y >= this.groundY) { // altura do chão
            this.y = this.groundY;
            this.velocityY = 0;
            this.grounded = true;
            this.isJumping = false;
        }
    }

    draw(ctx) {
        if (this.frames.length > 0) {
            ctx.drawImage(this.frames[this.currentFrame], this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// Controle de teclas
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        player.jump();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        player.stopJump();
    }
});
