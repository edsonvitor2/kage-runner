class PlayerController {
  constructor(player, canvas) {
    this.player = player;

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (!this.spacePressed) {
          this.spacePressed = true;
          this.player.jump();
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        this.spacePressed = false;
        this.player.stopJump();
      }
    });

    canvas.addEventListener("mousedown", () => {
      this.player.jump();
    });

    canvas.addEventListener("mouseup", () => {
      this.player.stopJump();
    });

    // Para funcionar também em dispositivos touch (celular)
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault(); // evita scroll ao tocar
      this.player.jump();
    }, { passive: false });

    canvas.addEventListener("touchend", () => {
      this.player.stopJump();
    });
  }
}

window.PlayerController = PlayerController;
