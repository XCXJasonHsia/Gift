export class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.me = null;
        this.cursors = null;
        this.bg = null;
        this.platform = null;
        this.cPrompt = null;
        this.dialogBox = null;
        this.dialogText = null;
        this.currentDialogIndex = 0;
        this.dialogs = [
            "啊~多么明媚的一天",
            "今天是萌君的生日...",
            "我要给她一个惊喜！",
            "我这就瞬移到上海去见她~"
        ];
        this.isDialogActive = false;
        this.dialogComplete = false;
    }

    create() {
        // 加载背景并调整大小以盛满整个屏幕
        this.bg = this.add.image(0, 0, 'school').setOrigin(0, 0);
        this.bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        // 创建地面平台，扩大并放置在屏幕下方
        this.platform = this.physics.add.staticGroup();
        this.platform.create(this.sys.game.config.width / 2, this.sys.game.config.height - 16, 'platform').setDisplaySize(this.sys.game.config.width, 32).refreshBody();
        
        // 创建me精灵
        this.me = this.physics.add.sprite(100, this.sys.game.config.height - 200, 'me');
        this.me.setBounce(0.2);
        this.me.setCollideWorldBounds(true);
        this.me.setScale(0.25);
        
        // 添加碰撞
        this.physics.add.collider(this.me, this.platform);
        
        // 键盘输入
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 相机设置
        this.cameras.main.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        this.cameras.main.startFollow(this.me);
        
        // 创建C键提示
        this.cPrompt = this.add.text(this.me.x, this.me.y - 150, 'C', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 10 },
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5, 0.5);
        
        // 创建箭头提示
        this.arrow = this.add.image(this.sys.game.config.width - 100, this.sys.game.config.height - 100, 'arrow').setOrigin(0.5, 0.5).setVisible(false);
        
        // 创建对话框
        this.dialogBox = this.add.ellipse(this.sys.game.config.width / 2, this.sys.game.config.height - 200, this.sys.game.config.width * 0.25, 100, 0xffffff, 1).setVisible(false);
        this.dialogText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 200, '', {
            fontSize: '16px',
            fill: '#000000',
            wordWrap: { width: this.sys.game.config.width * 0.25 - 20 },
            fontFamily: 'Arial, sans-serif',
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5, 0.5).setVisible(false);
        
        // 添加提示语
        this.add.text(this.sys.game.config.width - 100, this.sys.game.config.height - 30, '按C继续对话，按上左右控制运动', {
            fontSize: '14px',
            fill: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0.5);
        
        // 监听C键
        this.input.keyboard.on('keydown-C', () => {
            if (!this.isDialogActive) {
                this.startDialog();
            } else {
                this.nextDialog();
            }
        });
    }

    update(time) {
        // 更新C键提示位置
        this.cPrompt.setPosition(this.me.x, this.me.y - 80);
        
        // 移动控制
        if (this.cursors.left.isDown) {
            this.me.setVelocityX(-200);
            this.me.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.me.setVelocityX(200);
            this.me.anims.play('right', true);
        } else {
            this.me.setVelocityX(0);
            this.me.anims.play('idle', true);
        }
        
        // 跳跃控制
        if (this.cursors.up.isDown && this.me.body.touching.down) {
            this.me.setVelocityY(-600);
        }
        
        // 限制相机不超过屏幕范围
        const camera = this.cameras.main;
        const screenWidth = this.sys.game.config.width;
        const screenHeight = this.sys.game.config.height;
        
        // 调整相机位置，确保不超出屏幕
        if (camera.scrollX < 0) {
            camera.scrollX = 0;
        }
        if (camera.scrollX > screenWidth - camera.width) {
            camera.scrollX = screenWidth - camera.width;
        }
        if (camera.scrollY < 0) {
            camera.scrollY = 0;
        }
        if (camera.scrollY > screenHeight - camera.height) {
            camera.scrollY = screenHeight - camera.height;
        }
        
        // 角色走到最右侧时切换场景，只有在对话完成后才允许
        if (this.dialogComplete && this.me.x > screenWidth - 50) {
            // 直接切换场景，不使用回调函数
            this.cameras.main.fadeOut(500);
            this.scene.start('HerGame');
        }
    }

    // 开始对话
    startDialog() {
        this.isDialogActive = true;
        this.currentDialogIndex = 0;
        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);
        this.cPrompt.setVisible(false);
        this.showDialog();
    }

    // 显示当前对话
    showDialog() {
        if (this.currentDialogIndex < this.dialogs.length) {
            this.dialogText.setText(this.dialogs[this.currentDialogIndex]);
        } else {
            this.endDialog();
        }
    }

    // 下一个对话
    nextDialog() {
        this.currentDialogIndex++;
        this.showDialog();
    }

    // 结束对话
    endDialog() {
        this.isDialogActive = false;
        this.dialogComplete = true;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.cPrompt.setVisible(false);
        this.arrow.setVisible(true);
    }

    
}
