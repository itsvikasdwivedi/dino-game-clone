import Phaser from 'phaser';
import { SpriteWithDynamicBody } from '../type';
import { Player } from '../entities/Player';

class PlayScene extends Phaser.Scene {

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    startTrigger: SpriteWithDynamicBody;


    get gameHeight() {
        return this.game.config.height as number
    }
    get gameWidth() {
        return this.game.config.width as number;
    }
    constructor() {
        super('PlayScene')
    }
    preload() {

    }
    create() {
        this.createEnvironment();
        this.createPlayer();
        this.startTrigger = this.physics.add.sprite(0, 10, null)
            .setAlpha(0)
            .setOrigin(0, 1);

        this.physics.add.overlap(this.player, this.startTrigger, () => {
            if (this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, this.gameHeight);
                console.log("Triggering upper Trigger!");
                return;
            }

            this.startTrigger.body.reset(9999, 9999);
            console.log("Roll out the ground and start the game!");
        })


        this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callback: () => {
                if (this.ground.width <= this.gameWidth) {
                    this.ground.width += (1);
                }
            }
        });

    }
    createEnvironment() {
        this.ground =
            this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1);
    }
    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    update() {
        
    }
}
export default PlayScene;