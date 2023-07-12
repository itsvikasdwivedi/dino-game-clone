import { Input } from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'dino')
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
        
    }
  
    update() {
        const { space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        
        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

        if (isSpaceJustDown && onFloor) {
            this.setVelocityY(-1600)
        }
    }
}