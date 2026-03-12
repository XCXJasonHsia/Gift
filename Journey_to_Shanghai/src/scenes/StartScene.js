export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        // 加载背景
        this.bg = this.add.image(0, 0, 'bg_colour').setOrigin(0, 0);
        this.bg.setDisplaySize(this.sys.game.config.width*2, this.sys.game.config.height);
        
        // 显示start图片
        const startImage = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'start').setOrigin(0.5, 0.5);
        
        // 监听enter键进入Game场景
        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => {
                this.scene.start('Game');
            });
        });
    }

    
}