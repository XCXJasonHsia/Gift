export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        // 加载背景
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        this.bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        // 定义滚动文本内容
        const textContent = [
            "感谢你游玩 Journey to Shanghai！",
            "希望你喜欢这个游戏。",
            "游戏中的角色和场景都是精心设计的。",
            "感谢所有参与制作的人员。",
            "期待与你再次相遇！"
        ];
        
        // 创建文本组
        const textGroup = this.add.group();
        
        // 添加文本到组中
        textContent.forEach((text, index) => {
            const textObject = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height + index * 100, text, {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                align: 'center'
            }).setOrigin(0.5, 0.5);
            textGroup.add(textObject);
        });
        
        // 创建滚动动画
        this.tweens.add({
            targets: textGroup.getChildren(),
            y: '-=800',
            duration: 10000,
            ease: 'Linear',
            repeat: 0
        });
    }

    
}