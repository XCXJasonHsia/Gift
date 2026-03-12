export class HerGame extends Phaser.Scene {
    constructor() {
        super('HerGame');

        this.her = null;
        this.me = null;
        this.cursors = null;
        this.bg = null;
        this.platform = null;
        this.cPrompt = null;
        this.dialogBox = null;
        this.dialogText = null;
        this.mountain = null;
        this.isDialogActive = false;
        this.meActive = false;
        this.dialogIndex = 0;
        this.dialogs = [
            "看，夕阳点亮了云朵和天空",
            "第一次来你家时，也是这样的景色",
            "它们很美",
            "我经常回忆起那一刻",
            "这些粉红的云朵",
            "会把我们包裹在一起",
            "不知道今天会有谁陪你过生日呢",
            "很抱歉我不能出现在你的身边啦",
            "无论如何，生日快乐！",
            "我最后要引用一句很喜欢的歌词",
            "每个冬夜，我都会与你相遇",
            "嗷 其实还有一个小小的魔术",
            "我要给你永远吃不完的...",
            "芝士蛋糕百醇！"
        ];
    }

    create() {
        // 场景淡入
        this.cameras.main.fadeIn(1000);
        
        // 加载背景并调整大小以盛满整个屏幕
        this.bg = this.add.image(0, 0, 'bg_blue').setOrigin(0, 0);
        this.bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        
        // 创建地面平台，扩大并放置在屏幕下方
        this.platform = this.physics.add.staticGroup();
        this.platform.create(this.sys.game.config.width / 2, this.sys.game.config.height - 16, 'platform').setDisplaySize(this.sys.game.config.width, 32).refreshBody();
        
        // 创建her精灵
        this.her = this.physics.add.sprite(100, this.sys.game.config.height - 200, 'her');
        this.her.setBounce(0.2);
        this.her.setCollideWorldBounds(true);
        this.her.setScale(0.25);
        
        // 创建随机走动的me角色
        this.me = this.physics.add.sprite(400, this.sys.game.config.height - 200, 'me');
        this.me.setBounce(0.2);
        this.me.setCollideWorldBounds(true);
        this.me.setScale(0.25);
        
        // 添加碰撞
        this.physics.add.collider(this.her, this.platform);
        this.physics.add.collider(this.me, this.platform);
        
        // 添加her和me的碰撞检测
        this.physics.add.overlap(this.her, this.me, this.handleMeEncounter, null, this);
        
        // 键盘输入
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 监听C键
        this.input.keyboard.on('keydown-C', () => {
            if (this.meActive && !this.isDialogActive) {
                this.startDialog();
            }
        });
        
        // 创建C键提示
        this.cPrompt = this.add.text(0, 0, 'C', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 10 },
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5, 0.5).setVisible(false);
        
        // 创建对话框
        this.dialogBox = this.add.ellipse(this.sys.game.config.width / 2, this.sys.game.config.height - 200, this.sys.game.config.width * 0.25, 100, 0xffffff, 1).setVisible(false);
        this.dialogText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 200, '', {
            fontSize: '16px',
            fill: '#000000',
            wordWrap: { width: this.sys.game.config.width * 0.25 - 20 },
            fontFamily: 'Arial, sans-serif',
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5, 0.5).setVisible(false);
        
        // 相机设置
        this.cameras.main.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        this.cameras.main.startFollow(this.her);
        
        // 添加提示语
        this.add.text(this.sys.game.config.width - 100, this.sys.game.config.height - 30, '按C继续对话，按上左右控制运动', {
            fontSize: '14px',
            fill: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5, 0.5);
        
        // 启动me的随机移动
        this.startMeMovement();
    }

    update(time) {
        // 更新C键提示位置
        if (this.meActive) {
            this.cPrompt.setPosition(this.me.x, this.me.y - 100);
        }
        
        // 移动控制
        if (this.cursors.left.isDown) {
            this.her.setVelocityX(-200);
            this.her.anims.play('herLeft', true);
        } else if (this.cursors.right.isDown) {
            this.her.setVelocityX(200);
            this.her.anims.play('herRight', true);
        } else {
            this.her.setVelocityX(0);
            this.her.anims.play('herIdle', true);
        }
        
        // 跳跃控制
        if (this.cursors.up.isDown && this.her.body.touching.down) {
            this.her.setVelocityY(-600);
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
    }

    // 开始me的随机移动
    startMeMovement() {
        const moveLeft = () => {
            this.me.setVelocityX(-50);
            this.me.anims.play('left', true);
            this.time.delayedCall(Phaser.Math.Between(3000, 5000), () => {
                // 停止移动5秒
                this.me.setVelocityX(0);
                this.me.anims.play('idle', true);
                this.time.delayedCall(5000, () => {
                    moveRight();
                });
            });
        };

        const moveRight = () => {
            this.me.setVelocityX(50);
            this.me.anims.play('right', true);
            this.time.delayedCall(Phaser.Math.Between(3000, 5000), () => {
                // 停止移动5秒
                this.me.setVelocityX(0);
                this.me.anims.play('idle', true);
                this.time.delayedCall(5000, () => {
                    moveLeft();
                });
            });
        };

        // 随机开始向左或向右移动
        if (Math.random() > 0.5) {
            moveLeft();
        } else {
            moveRight();
        }
    }

    // 处理her和me的相遇
    handleMeEncounter(her, me) {
        if (!this.meActive) {
            this.meActive = true;
            this.cPrompt.setVisible(true);
        }
    }

    // 开始对话
    startDialog() {
        if (this.isDialogActive) return; // 防止重复触发
        
        this.isDialogActive = true;
        this.cPrompt.setVisible(false);
        this.dialogBox.setVisible(true);
        
        // 停止me的运动
        this.me.setVelocityX(0);
        this.me.anims.play('idle', true);
        
        // 检查是否是第一次对话
        if (!this.mountain) {
            // 第一次对话
            this.dialogText.setText('我有礼物要送给你！');
            
            // 3秒后结束对话
            this.time.delayedCall(3000, () => {
                this.endDialog(false);
            });
        } else {
            // 背景切换后的对话
            if (this.dialogIndex < this.dialogs.length) {
                this.dialogText.setText(this.dialogs[this.dialogIndex]);
                
                // 3秒后结束对话
                this.time.delayedCall(3000, () => {
                    if (this.dialogIndex === 0) {
                        // 第一条对话结束后开始背景切换
                        this.switchBackground();
                    } else {
                        this.dialogIndex++;
                        if (this.dialogIndex < this.dialogs.length) {
                            // 继续下一个对话
                            this.isDialogActive = false;
                            this.startDialog();
                        } else {
                            // 对话结束，开始掉落pejoy
                            this.dropPejoy();
                        }
                    }
                });
            }
        }
        
        this.dialogText.setVisible(true);
    }
    
    // 切换背景
    switchBackground() {
        this.isDialogActive = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        
        // 屏幕变暗
        this.cameras.main.fadeOut(1000);
        
        this.time.delayedCall(1500, () => {
            // 切换背景为bg
            this.bg.setTexture('bg');
            
            // 屏幕恢复正常
            this.cameras.main.fadeIn(1000);
            
            // 1秒后继续显示下一条对话
            this.time.delayedCall(1000, () => {
                this.dialogIndex++;
                this.startDialog();
            });
        });
    }

    // 结束对话，显示mountain或切换背景
    endDialog(switchBackground) {
        this.isDialogActive = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        
        // 对话之后5秒的时间内，me保持不动
        this.me.setVelocityX(0);
        this.me.anims.play('idle', true);
        
        if (switchBackground) {
            // 第二次对话结束，切换背景
            this.cameras.main.fadeOut(1000);
            
            this.time.delayedCall(1500, () => {
                // 切换背景为bg
                this.bg.setTexture('bg');
                
                // 屏幕恢复正常
                this.cameras.main.fadeIn(1000);
                
                // 5秒后重新激活me的对话功能
                this.time.delayedCall(5000, () => {
                    this.meActive = false;
                    // 重新添加her和me的碰撞检测
                    this.physics.add.overlap(this.her, this.me, this.handleMeEncounter, null, this);
                    
                    // 恢复me的移动
                    this.startMeMovement();
                });
            });
        } else {
            // 第一次对话结束，显示mountain
            // 屏幕变暗
            this.cameras.main.fadeOut(1000);
            
            // 1.5秒后显示mountain
            this.time.delayedCall(1500, () => {
                // 创建mountain精灵
                this.mountain = this.physics.add.sprite(this.sys.game.config.width / 2, -100, 'mountain');
                this.mountain.setBounce(0.2);
                this.mountain.setCollideWorldBounds(true);
                
                // 添加碰撞
                this.physics.add.collider(this.mountain, this.platform);
                this.physics.add.collider(this.mountain, this.her);
                this.physics.add.collider(this.mountain, this.me);
                
                // 屏幕恢复正常
                this.cameras.main.fadeIn(1000);
                
                // 5秒后将mountain移动到屏幕右侧
                this.time.delayedCall(5000, () => {
                    this.tweens.add({
                        targets: this.mountain,
                        x: this.sys.game.config.width - 100,
                        duration: 2000,
                        ease: 'Power1',
                        onComplete: () => {
                            // mountain到达右侧后，重新激活me的对话功能
                            this.meActive = false;
                            
                            // 重新添加her和me的碰撞检测
                            this.physics.add.overlap(this.her, this.me, this.handleMeEncounter, null, this);
                            
                            // 恢复me的移动
                            this.startMeMovement();
                        }
                    });
                });
            });
        }
    }
    
    // 掉落pejoy
    dropPejoy() {
        this.isDialogActive = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        
        // 创建pejoy组
        const pejoyGroup = this.physics.add.group();
        
        // 连续掉落5秒
        const dropDuration = 5000;
        const dropInterval = 50; // 每50毫秒掉落一个pejoy
        const totalDrops = dropDuration / dropInterval;
        
        // 添加碰撞
        this.physics.add.collider(pejoyGroup, this.platform);
        this.physics.add.collider(pejoyGroup, this.her);
        this.physics.add.collider(pejoyGroup, this.me);
        this.physics.add.collider(pejoyGroup, this.mountain);
        
        // 开始掉落
        let dropCount = 0;
        const dropTimer = this.time.addEvent({
            delay: dropInterval,
            callback: () => {
                if (dropCount < totalDrops) {
                    console.log(dropCount, totalDrops);
                    // 从屏幕上方随机位置掉落
                    const x = Phaser.Math.Between(0, this.sys.game.config.width);
                    const pejoy = pejoyGroup.create(x, -50, 'pejoy');
                    pejoy.setBounce(0.5);
                    pejoy.setCollideWorldBounds(true);
                    pejoy.setScale(0.5);
                    dropCount++;
                } else {
                    console.log('end',dropCount, totalDrops);
                    dropTimer.remove();
                    
                    // 10秒后切换到新场景
                    this.time.delayedCall(5000, () => {
                        this.scene.start('EndScene');
                    });
                }
            },
            callbackScope: this,
            repeat: totalDrops
        });
    }

    
}