import Phaser from "phaser"

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene')
    }
    preload (){
        this.load.image('ground','assets/ground.png')
        this.load.image('dino','assets/dino-idle-2.png')
    }
    create(){
    this.scene.start('PlayScene')
    }
    update(){

    }
}
export default PreloadScene