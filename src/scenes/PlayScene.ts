import Phaser from 'phaser';
import { SpriteWithDynamicBody } from '../type';
import { Player } from '../entities/Player';

class PlayScene extends Phaser.Scene {

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    isGameRunning: boolean = true
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


        const rollOutEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callback: () => {
                this.player.playRunAnims()
                this.player.setVelocityX(80);
                this.ground.width += (17 * 2);
                if (this.ground.width >= this.gameWidth) {
                    rollOutEvent.remove()
                    this.ground.width = this.gameWidth;
                    this.player.setVelocityX(0);
                    this.isGameRunning = true;
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