import Phaser from "phaser"
import { PRELOAD_CONFIG } from ".."

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene')
    }
    preload (){
        this.load.image('ground','assets/ground.png')
        this.load.image('dino','assets/dino-idle-2.png')
        this.load.image('dino-hurt', 'assets/dino-hurt.png');
        this.load.image('game-over', 'assets/game-over.png')
        this.load.image('restart', 'assets/restart.png');
        this.load.image('clouds', 'assets/cloud.png');
        for (let i=1 ; i <= PRELOAD_CONFIG.cactusesCount; i++){
            this.load.image(`obstacle-${i}`,`assets/cactuses_${i}.png`)
        }
        this.load.spritesheet('dino-run', 'assets/dino-run.png',{
            frameWidth: 88 ,frameHeight: 94
        })
        this.load.spritesheet('dino-down', 'assets/dino-down-2.png',{
            frameWidth: 118 ,frameHeight: 94
        })
        this.load.spritesheet('enemy-bird', 'assets/enemy-bird.png',{
            frameWidth: 92 ,frameHeight: 77
        })

    }
    create(){
    this.scene.start('PlayScene')
    }
    update(){

    }
}
export default PreloadScene