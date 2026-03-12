export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    create() {
        // 加载背景
        this.bg = this.add.image(0, 0, 'bg_colour').setOrigin(0, 0);
        this.bg.setDisplaySize(this.sys.game.config.width*2, this.sys.game.config.height*2);
        
        // 定义滚动文本内容
        const textContent = [
            "17岁是个很好的年纪",
            "祝愿你能继续拥有欢笑，调侃，幽默",
            "依然可以自在的独处，在值得珍视的人们那里收获爱与温暖",
            "学业的压力是不可避免的啦",
            "但这肯定不会是生活中最重要的事情~所以还是要轻松一点的！",
            "我永远都会陪伴着你的",
            "来自你的企鹅"
        ];
        
        // 创建文本组
        const textGroup = this.add.group();
        
        // 添加文本到组中
        textContent.forEach((text, index) => {
            const textObject = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height + index * 60, text, {
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
            y: '-=600',
            duration: 15000,
            ease: 'Linear',
            repeat: 0
        });
    }

    
}