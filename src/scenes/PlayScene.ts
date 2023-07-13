import Phaser from 'phaser';
import { SpriteWithDynamicBody } from '../type';
import { Player } from '../entities/Player';
import { GameScene } from "./GameScene";
import { PRELOAD_CONFIG } from '..';


class PlayScene extends GameScene {

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    clouds: Phaser.GameObjects.Group;
    obstacles: Phaser.Physics.Arcade.Group
    startTrigger: SpriteWithDynamicBody;
    gameOverContainer: Phaser.GameObjects.Container;
    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image;
    scoreText: Phaser.GameObjects.Text;

    score:number = 0;
    scoreDeltaTime:number = 0;
    scoreInterval: number = 100;
    spawnInterval: number = 1500;
    gameSpeed = 5;
    spawnTime = 0;


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
        this.createAnimations();
        this.createScore();
        this.handleStartGame();
        this.handleGameRestart();
        this.handleObstacleCollision()
    }

    update(time: number, delta: number): void {

        if (!this.isGameRunning) return;

        this.spawnTime += delta;
        this.scoreDeltaTime += delta;

        if (this.scoreDeltaTime >=  this.scoreInterval){
            this.score++;
            console.log(this.score);
            this.scoreDeltaTime = 0;
        }
        if (this.spawnTime >= this.spawnInterval) {
            console.log("spwaing")
            this.spawnObstacle();
            this.spawnTime = 0;
        }
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.clouds.getChildren(), -this.gameSpeed);

        this.obstacles.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
            if (obstacle.getBounds().right < 0) {
                this.obstacles.remove(obstacle);
            }
        })
        this.clouds.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
            if (cloud.getBounds().right < 0) {
                cloud.x = this.gameWidth + 30;
            }
        })
        // console.log(this.obstacles.getChildren().length);
        this.ground.tilePositionX += this.gameSpeed
    }
    createEnvironment() {
        this.ground = this.add
        .tileSprite(0, this.gameHeight, 88, 26, 'ground')
        .setOrigin(0, 1);
        this.clouds = this.add.group()
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth/2,170,'clouds'),
            this.add.image(this.gameWidth-80,80,'clouds'),
            this.add.image(this.gameWidth/1.3,170,'clouds'),

        ])
        this.clouds.setAlpha(0);
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
    createAnimations(){
        this.anims.create({
            key: 'enemy-bird',
            frames: this.anims.generateFrameNames("enemy-bird"),
            frameRate: 6,
            repeat: -1
        })
    }
    createScore(){
        this.scoreText = this.add.text(this.gameWidth,0,'000000',{
            fontSize: 30,
            fontFamily: 'Arial',
            color: '#A9A9A9',
            resolution:10
        }).setOrigin(1,0).setAlpha(0)
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
                    this.clouds.setAlpha(1);  
                    this.scoreText.setAlpha(1);
                    this.isGameRunning = true;
                }
            }
        })
    }
    handleGameRestart() {
        this.restartText.on('pointerdown', () => {
            this.physics.resume();
            this.player.setVelocityY(0);
            this.obstacles.clear(true, true);
            this.gameOverContainer.setAlpha(0);
            this.anims.resumeAll();
            this.isGameRunning = true;
            this.player.play('', true)
        })
    }
    handleObstacleCollision() {
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.physics.pause();
            this.isGameRunning = false;
            this.player.die()
            this.anims.pauseAll()
            this.gameOverContainer.setAlpha(1)
            this.score=0
            this.spawnTime =0
            this.scoreDeltaTime =0 
            this.gameSpeed = 5
        })
    }

    spawnObstacle() {
        let obstacle;
        const obstacleCount = PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount;
        const obstacleNum = Math.floor(Math.random() * obstacleCount) + 1;
        const distance = Phaser.Math.Between(600, 900);
        
        if ( 7 > PRELOAD_CONFIG.cactusesCount){
            const enemyPossibleHeight = [20,70];
            const enemyHeight = enemyPossibleHeight[Math.floor(Math.random()*2)];
            obstacle =this.obstacles.create(this.gameWidth + distance, this.gameHeight- enemyHeight, `enemy-bird`)
            .play('enemy-bird',true)
        }

        else{
            obstacle= this.obstacles.create(this.gameWidth + distance, this.gameHeight, `obstacle-${obstacleNum}`)
            .setOrigin(0, 1).setImmovable()
        }
        obstacle.setOrigin(0, 1).setImmovable()

    }

}
export default PlayScene;