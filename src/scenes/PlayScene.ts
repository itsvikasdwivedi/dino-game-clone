import Phaser from 'phaser';
import { SpriteWithDynamicBody } from '../type';
import { Player } from '../entities/Player';
import { GameScene } from "./GameScene";
import { PRELOAD_CONFIG } from '..';


class PlayScene extends GameScene {

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    spawnInterval: number = 1500
    spawnTime = 0
    gameSpeed = 5
    obstacles: Phaser.Physics.Arcade.Group
    startTrigger: SpriteWithDynamicBody;

    gameOverContainer: Phaser.GameObjects.Container;
    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image

    constructor() {
        super('PlayScene')
    }
    preload() {

    }
    create() {
        this.createEnvironment();
        this.createPlayer();
        this.createObstacles();
        this.createGameOverContianer()
        this.handleStartGame();
        this.handleGameRestart();
        this.handleObstacleCollision()
    }

    update(time: number, delta: number): void {

        if (!this.isGameRunning) return;
        this.spawnTime += delta;

        if (this.spawnTime >= this.spawnInterval) {
            console.log("spwaing")
            this.spawnObstacle();
            this.spawnTime = 0;
        }
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed)
        this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
            if (obstacle.getBounds().right < 0) {
                this.obstacles.remove(obstacle);
            }
        })
        // console.log(this.obstacles.getChildren().length);
        this.ground.tilePositionX += this.gameSpeed
    }
    createEnvironment() {
        this.ground =
            this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1);
    }
    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    createObstacles() {
        this.obstacles = this.physics.add.group();
    }
    createGameOverContianer() {
        this.gameOverText = this.add.image(0, 0, 'game-over')
        this.restartText = this.add.image(0, 80, 'restart').setInteractive();
        this.gameOverContainer = this.add.container(this.gameWidth / 2, (this.gameHeight / 2) - 50)
            .add([this.gameOverText, this.restartText])
            .setAlpha(0);

    }
    handleStartGame() {
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
            })
    }
    handleGameRestart() {
        this.restartText.on('pointerdown', () => {
          this.physics.resume();
          this.player.setVelocityY(0);
          this.obstacles.clear(true,true);
          this.gameOverContainer.setAlpha(0);
          this.anims.resumeAll();
          this.isGameRunning = true;
        })
    }
    handleObstacleCollision() {
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.physics.pause();
            this.isGameRunning = false;
            this.player.die()
            this.gameOverContainer.setAlpha(1)
        })
    }

    spawnObstacle() {
        const obstacleNum = Math.floor(Math.random() * PRELOAD_CONFIG.cactusesCount + 1);
        const distance = Phaser.Math.Between(600, 900);
        this.obstacles.create(distance, this.gameHeight, `obstacle-${obstacleNum}`)
            .setOrigin(0, 1).setImmovable()
    }

}
export default PlayScene;