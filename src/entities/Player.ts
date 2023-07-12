import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: GameScene;
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'dino-run')
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init()
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

    }
    init() {

        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this
            .setOrigin(0, 1)
            .setGravityY(200)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92)
        this.registerAnims()
    }
    playRunAnims(){
        this.play("dino-run-anims",true)
    }
    registerAnims() {
        this.anims.create({
            key: 'dino-run-anims',
            frames: this.anims.generateFrameNames("dino-run", {start: 2,end:3}),
            frameRate: 10,
            repeat: -1

        })
    }
    update() {
        const { space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

        if (!this.scene.isGameRunning) {
            return
        }
        if (isSpaceJustDown && onFloor) {
            this.setVelocityY(-1600);
        }
        if (this.body.deltaAbsY() > 0){
            this.anims.stop();
            this.setTexture('dino-run',0)
        }
        else{
            this.playRunAnims();
        }
    }
}