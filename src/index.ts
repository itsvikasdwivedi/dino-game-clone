
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
// import PlayScene from "./scenes/PlayScene"

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [new PreloadScene]
};

new Phaser.Game(config);

