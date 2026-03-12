export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        //  //  Load background, platform, mountain, arrow, pejoy, and spritesheets
        this.load.image('bg', 'bg.png');
        this.load.image('bg_blue', 'bg_blue.png');
        this.load.image('bg_colour', 'bg_colour.png');
        this.load.image('school', 'school.png');
        this.load.image('platform', 'platform.png');
        this.load.image('mountain', 'mountain.png');
        this.load.image('arrow', 'arrow.png');
        this.load.image('pejoy', 'pejoy.png');
        this.load.image('start', 'start.png');
        this.load.spritesheet('me', 'me_spritesheet.png', {
            frameWidth: 1400 / 5,
            frameHeight: 499
        });
        this.load.spritesheet('her', 'her_spritesheet.png', {
            frameWidth: 1206 / 5,
            frameHeight: 499
        });

    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Define animations for the player
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('me', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'me', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('me', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        //  Define animations for her
        this.anims.create({
            key: 'herLeft',
            frames: this.anims.generateFrameNumbers('her', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'herIdle',
            frames: [{ key: 'her', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'herRight',
            frames: this.anims.generateFrameNumbers('her', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        //  Move to the StartScene. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('StartScene');
    }
}
