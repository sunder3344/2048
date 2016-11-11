var GameScene = cc.Scene.extend({
	_helpBtn:null,
	_exitBtn:null,
	_background:null,
	_helpLayerSwitch:"off",
	_soundSwitch:"on",
	_scoreText:null,
	_recordText:null,
	_soundOn:null,				//静音按钮
	_soundOff:null,
	_score:0,
	_record:0,
	_panel:null,
	_panelLayer:null,
	_map:null,
	_txtMap:null,
	_x:null,
	_y:null,
	_offsetX:null,
	_offsetY:null,
	_maskClipper:null,
	
	ctor:function() {
		this._super();
		var winSize = cc.director.getWinSize();
		var gameLayer = new cc.Layer();
		this.addChild(gameLayer);
		
		//背景
		this._background = new cc.Sprite("#background.gif");
		gameLayer.addChild(this._background, 1);
		this._background.x = winSize.width / 2;
		this._background.y = winSize.height / 2;
		//_background.width = winSize.width;
		//_background.height = winSize.height;
		
		//logo
		var logo = new cc.Sprite("#logo.gif");
		logo.x = this._background.width / 2 - 150;
		logo.y = this._background.height / 2 + 260;
		this._background.addChild(logo, 2);
		
		//score
		var scoreTab = new cc.Sprite("#score.gif");
		scoreTab.x = logo.x + logo.width / 2 + 70;
		scoreTab.y = logo.y + 10;
		this._background.addChild(scoreTab, 2);
		
		//record
		var recordTab = new cc.Sprite("#record.gif");
		recordTab.x = scoreTab.x + logo.width / 2 + 60;
		recordTab.y = scoreTab.y;
		this._background.addChild(recordTab, 2);
		
		//sound button(默认显示声音,如果静音已经设置过，则显示静音)
		this._soundSwitch = Storage.getCurrentSound();
		this._soundOn = new cc.MenuItemImage(res.SOUND_ON, res.SOUND_ON, this._soundSwitchOn, this);
		this._soundOn.scale = 0.4;
		
		this._soundOff = new cc.MenuItemImage(res.SOUND_OFF, res.SOUND_OFF, this._soundSwitchOff, this);
		this._soundOff.scale = 0.4;
		this._soundOff.setVisible(false);
		var soundMenu = new cc.Menu(this._soundOn, this._soundOff);
		this._background.addChild(soundMenu, 2);
		soundMenu.x = recordTab.x + logo.width / 2 + 20;
		soundMenu.y = scoreTab.y;
		if (this._soundSwitch == "on") {
			this._soundOn.setVisible(true);
			this._soundOff.setVisible(false);
		} else if (this._soundSwitch == "off") {
			this._soundOn.setVisible(false);
			this._soundOff.setVisible(true);
		}
		
		//panel
		this._panel = new cc.Sprite("#panel.gif");
		this._panelLayer = new cc.Layer();
		this._panelLayer.addChild(this._panel);
		//this._panel.x = this._background.width / 2;
		//this._panel.y = this._background.height / 2 - 20;
		this._panelLayer.x = this._background.width / 2;
		this._panelLayer.y = this._background.height / 2 - 20;
		this._background.addChild(this._panelLayer, 2);
		
		//menubar
		this._helpBtn = new cc.MenuItemImage("#help_blue.gif", "#help_grey.gif", this._help, this);
		this._helpBtn.x = logo.x;
		this._helpBtn.y = this._helpBtn.height + 15;
		
		this._exitBtn = new cc.MenuItemImage("#exit_blue.gif", "#exit_grey.png", this._exit, this);
		this._exitBtn.x = this._helpBtn.x + this._helpBtn.width + 20;
		this._exitBtn.y = this._exitBtn.height + 15;
		var menu = new cc.Menu(this._helpBtn, this._exitBtn);
		menu.x = this._background.width / 2 - 200;
		menu.y = this._helpBtn.height + 55;
		this._background.addChild(menu, 2);
		
		//score text and record text
		this._scoreText = new cc.LabelBMFont("0", res.FONT_FNT);
		this._scoreText.scale = 0.6;
		this._background.addChild(this._scoreText, 2);
		this._scoreText.x = scoreTab.x;
		this._scoreText.y = scoreTab.y - 15;
		
		var highestRecord = Storage.getCurrentHighest();
		this._record = highestRecord;
		this._recordText = new cc.LabelBMFont(highestRecord.toString(), res.FONT_FNT);
		this._recordText.scale = 0.6;
		this._background.addChild(this._recordText, 2);
		this._recordText.x = recordTab.x;
		this._recordText.y = recordTab.y - 15;
		
		//音量键事件
		
		
		this._init();
		//新增cube
		this._addRandomNum();
		this._addRandomNum();
		//this.scheduleUpdate();
		
		//手势识别
		if ("touches" in cc.sys.capabilities) {
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: this._onMainTouchBegan.bind(this),
				onTouchEnded: this._onMainTouchEnded.bind(this)
			}, this);
		} else {
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				onMouseDown: this._onMainMouseDown.bind(this),
				onMouseUp: this._onMainMouseUp.bind(this)
			}, this);
		}
		return true;
	},
	
	//初始化16个格子
	_init:function() {
		this._map = [];
		this._txtMap = [];
		var numbers = 0;
		for (var i = 0; i < Constants.MAP_COLUMN; i	++) {
			var column = [];
			var txtColumn = [];
			for (var j = 0; j < Constants.MAP_ROW; j++) {
				var card = CardSprite.create(i, j, 0);
				card.setCardId(numbers);
				
				var showText = new cc.LabelTTF("", "arial", 36);
				showText.width = Constants.CARD_WIDTH;
				showText.height = Constants.CARD_HEIGHT;
				
				this._panelLayer.addChild(card, 3);
				this._panelLayer.addChild(showText, 3);
				
				card.x = i * Constants.CARD_WIDTH + Constants.CARD_WIDTH / 2 + i * Constants.CARD_GAP - this._panel.width / 2 + 15;
				card.y = j * Constants.CARD_HEIGHT + Constants.CARD_HEIGHT / 2 + j * Constants.CARD_GAP - this._panel.height / 2 + 15;
				showText.x = card.x;
				showText.y = card.y - 3;
				
				column.push(card);
				txtColumn.push(showText);
				numbers++;
			}
			this._map.push(column);
			this._txtMap.push(txtColumn);
		}
	},
	
	//帮助layer
	_help:function() {
		if (this._helpLayerSwitch != "on") {
			var helpLayer = new HelpLayer(this);
			helpLayer._setLayerSwitch("on");
			this._background.addChild(helpLayer, 3);
			_helpLayerSwitch = "on";
			
			this._helpBtn.setEnabled(false);
			this._exitBtn.setEnabled(false);
		}
	},
	
	_exit:function() {
		cc.director.end();
	},
	
	//获取随机位置
	_addRandomNum:function() {
		Sound._playSetpos();
		var currentMap = [];
		var currentTxtMap = [];
		for (var i = 0; i < Constants.MAP_COLUMN; i++) {
			var col = [];
			var txtCol = [];
			for (var j = 0; j < Constants.MAP_ROW; j++) {
				if (this._map[i][j].number == 0) {
					col.push(this._map[i][j]);
					txtCol.push(this._txtMap[i][j]);
				} else {
					//col.push(null);
				}
			}
			if (col.length != 0) {
				currentMap.push(col);
				currentTxtMap.push(txtCol);
			}
		}
		var num = UtilityHelper.getRandomNum();
		var cols = currentMap.length;
		if (cols != 0) {
			x = UtilityHelper.createRandomIndex(cols);
			var rows = currentMap[x].length;
			y = UtilityHelper.createRandomIndex(rows);
			currentMap[x][y].setCardColor(num);
			currentMap[x][y].number = num;
			currentMap[x][y]._showBlink();
			
			currentTxtMap[x][y].setString(num + "");
			currentTxtMap[x][y].setColor(cc.color(0,0,0));
		}
	},
	
	//触屏开始
	_onMainTouchBegan:function(touch, event) {
		var pos = touch.getLocation();
		this._x = pos.x;
		this._y = pos.y;
		return true;
	},
	
	//触屏结束
	_onMainTouchEnded:function(touch, event) {
		var pos = touch.getLocation();
		var endX = pos.x;
		var endY = pos.y;
		this._offsetX = endX - this._x;
		this._offsetY = endY - this._y;
		if (Math.abs(this._offsetX) > Math.abs(this._offsetY)) {		//左右滑
			if (this._offsetX < -Constants.FLING_MIN_DISTANCE) {
				this.toLeft();
			} else if (this._offsetX > Constants.FLING_MIN_DISTANCE){
				this.toRight();
			}
		} else {		//上下滑动
			if (this._offsetY < -Constants.FLING_MIN_DISTANCE) {
				this.toDown();
			} else if (this._offsetY > Constants.FLING_MIN_DISTANCE) {
				this.toUp();
			}
		}
	},
	
	//鼠标开始
	_onMainMouseDown:function(event) {
		var pos = event.getLocation();
		this._x = pos.x;
		this._y = pos.y;
	},
	
	//鼠标结束
	_onMainMouseUp:function(event) {
		var pos = event.getLocation();
		var endX = pos.x;
		var endY = pos.y;
		this._offsetX = endX - this._x;
		this._offsetY = endY - this._y;
		if (Math.abs(this._offsetX) > Math.abs(this._offsetY)) {		//左右滑
			if (this._offsetX < -Constants.FLING_MIN_DISTANCE) {
				this.toLeft();
			} else if (this._offsetX > Constants.FLING_MIN_DISTANCE){
				this.toRight();
			}
		} else {		//上下滑动
			if (this._offsetY < -Constants.FLING_MIN_DISTANCE) {
				this.toDown();
			} else if (this._offsetY > Constants.FLING_MIN_DISTANCE) {
				this.toUp();
			}
		}
	},
	
	//左移,y轴不变
	toLeft:function() {
		Sound._playSelect();
		var mMerge = false;
		
		for (var j = 0; j < Constants.MAP_ROW; j++) {
			for (var i = 0; i < Constants.MAP_COLUMN; i++) {
				for (var i2 = i + 1; i2 < Constants.MAP_COLUMN; i2++) {
					if (this._map[i2][j].getCardNum() > 0) {
						if (this._map[i][j].getCardNum() <= 0) {
							this._map[i][j].setCardNum(this._map[i2][j].getCardNum());
							//this._map[i][j]._showBrake("left");
							if (this._map[i][j].getCardNum() == 0) {
								this._txtMap[i][j].setString("");
							} else {
								this._txtMap[i][j].setString(this._map[i2][j].getCardNum());
								this._txtMap[i][j].setColor(cc.color(0,0,0));
							}
							
							this._map[i2][j].setCardNum(Constants.CARD_0);
							this._txtMap[i2][j].setString("");
							mMerge = true;
							i--;
						} else if (this._map[i][j].getCardNum() == this._map[i2][j].getCardNum()) {
							var mergeNum = parseInt(this._map[i][j].getCardNum());
							this._map[i][j].setCardNum(mergeNum * 2);
							this._map[i][j]._showBlink();
							this._txtMap[i][j].setString(mergeNum * 2);
							this._txtMap[i][j].setColor(cc.color(0,0,0));
							this._mergeAction(this._map[i][j]);
							
							this._map[i2][j].setCardNum(Constants.CARD_0);
							this._txtMap[i2][j].setString("");
							//添加当前分数
							this._updateScore(this._map[i][j].getCardNum());
							mMerge = true;
						}
						break;
					}
				}
			}
		}
		
		if (mMerge) {
			this._addRandomNum();
		}
		this._checkComplete();
	},
	
	//右移,y轴不变
	toRight:function() {
		Sound._playSelect();
		var mMerge = false;
		
		for (var j = 0; j < Constants.MAP_ROW; j ++) {
			for (var i = Constants.MAP_COLUMN - 1; i >= 0; i--) {
				for (var i2 = i - 1; i2 >= 0; i2--) {
					if (this._map[i2][j].getCardNum() > 0) {
						if (this._map[i][j].getCardNum() <= 0) {
							this._map[i][j].setCardNum(this._map[i2][j].getCardNum());
							//this._map[i][j]._showBrake("left");
							if (this._map[i][j].getCardNum() == 0) {
								this._txtMap[i][j].setString("");
							} else {
								this._txtMap[i][j].setString(this._map[i2][j].getCardNum());
								this._txtMap[i][j].setColor(cc.color(0,0,0));
							}
							
							this._map[i2][j].setCardNum(Constants.CARD_0);
							this._txtMap[i2][j].setString("");
							mMerge = true;
							i++;
						} else if (this._map[i][j].getCardNum() == this._map[i2][j].getCardNum()) {
							var mergeNum = parseInt(this._map[i][j].getCardNum());
							this._map[i][j].setCardNum(mergeNum * 2);
							this._map[i][j]._showBlink();
							this._txtMap[i][j].setString(mergeNum * 2);
							this._txtMap[i][j].setColor(cc.color(0,0,0));
							this._mergeAction(this._map[i][j]);
							
							this._map[i2][j].setCardNum(Constants.CARD_0);
							this._txtMap[i2][j].setString("");
							//添加当前分数
							this._updateScore(this._map[i][j].getCardNum());
							mMerge = true;
						}
						break;
					}
				}
			}
		}
		
		if (mMerge) {
			this._addRandomNum();
		}
		this._checkComplete();
	},
	
	//上移,x轴不变
	toUp:function() {
		Sound._playSelect();
		var mMerge = false;
		
		for (var i = 0; i < Constants.MAP_COLUMN; i++) {
			for (var j = Constants.MAP_ROW - 1; j >= 0 ; j--) {
				for (var j2 = j - 1; j2 >= 0; j2--) {
					if (this._map[i][j2].getCardNum() > 0) {
						if (this._map[i][j].getCardNum() <= 0) {
							this._map[i][j].setCardNum(this._map[i][j2].getCardNum());
							//this._map[i][j]._showBrake("up");
							if (this._map[i][j].getCardNum() == 0) {
								this._txtMap[i][j].setString("");
							} else {
								this._txtMap[i][j].setString(this._map[i][j2].getCardNum());
								this._txtMap[i][j].setColor(cc.color(0,0,0));
							}
							
							this._map[i][j2].setCardNum(Constants.CARD_0);
							this._txtMap[i][j2].setString("");
							mMerge = true;
							j++;
						} else if (this._map[i][j].getCardNum() == this._map[i][j2].getCardNum()) {
							var mergeNum = parseInt(this._map[i][j].getCardNum());
							this._map[i][j].setCardNum(mergeNum * 2);
							this._map[i][j]._showBlink();
							this._txtMap[i][j].setString(mergeNum * 2);
							this._txtMap[i][j].setColor(cc.color(0,0,0));
							this._mergeAction(this._map[i][j]);
							
							this._map[i][j2].setCardNum(Constants.CARD_0);
							this._txtMap[i][j2].setString("");
							//添加当前分数
							this._updateScore(this._map[i][j].getCardNum());
							mMerge = true;
						}
						break;
					}
				}
			}
		}
		
		if (mMerge) {
			this._addRandomNum();
		}
		this._checkComplete();
	},
	
	//下移,x轴不变
	toDown:function() {
		Sound._playSelect();
		var mMerge = false;
		
		for (var i = 0; i < Constants.MAP_COLUMN; i++) {
			for (var j = 0; j < Constants.MAP_ROW; j++) {
				for (var j2 = j + 1; j2 < Constants.MAP_COLUMN; j2++) {
					if (this._map[i][j2].getCardNum() > 0) {
						if (this._map[i][j].getCardNum() <= 0) {
							this._map[i][j].setCardNum(this._map[i][j2].getCardNum());
							//this._map[i][j]._showBrake("up");
							if (this._map[i][j].getCardNum() == 0) {
								this._txtMap[i][j].setString("");
							} else {
								this._txtMap[i][j].setString(this._map[i][j2].getCardNum());
								this._txtMap[i][j].setColor(cc.color(0,0,0));
							}
							
							this._map[i][j2].setCardNum(Constants.CARD_0);
							this._txtMap[i][j2].setString("");
							mMerge = true;
							j--;
						} else if (this._map[i][j].getCardNum() == this._map[i][j2].getCardNum()) {
							var mergeNum = parseInt(this._map[i][j].getCardNum());
							this._map[i][j].setCardNum(mergeNum * 2);
							this._map[i][j]._showBlink();
							this._txtMap[i][j].setString(mergeNum * 2);
							this._txtMap[i][j].setColor(cc.color(0,0,0));
							this._mergeAction(this._map[i][j]);
							
							this._map[i][j2].setCardNum(Constants.CARD_0);
							this._txtMap[i][j2].setString("");
							//添加当前分数
							this._updateScore(this._map[i][j].getCardNum());
							mMerge = true;
						}
						break;
					}
				}
			}
		}
		
		if (mMerge) {
			this._addRandomNum();
		}
		this._checkComplete();
	},
	
	update:function() {
		//cc.log('111');
	},
	
	//更新分数
	_updateScore:function(score) {
		//首先查看
		if (this._score < score) {
			this._score = score;
			this._scoreText.setString(this._score);
		}
		//记录最高分
		if (this._score > this._record) {
			this._record = this._score;
			this._recordText.setString(this._record);
			Storage.setCurrentHighest(this._record);
		}
	},
	
	//检查游戏是否结束
	_checkComplete:function() {
		//出现2048即胜利
		for (var i = 0; i < Constants.MAP_COLUMN; i++) {
			for (var j = 0; j < Constants.MAP_ROW; j++) {
				if (this._map[i][j].getCardNum() == Constants.CARD_2048) {
					//显示胜利layer
					this._showDialog(Constants.GAME_SUCCES);
					return;
				}
			}
		}
		
		//已经填满且不能再合并时提示
		for (var j = 0; j < Constants.MAP_ROW; j++) {
			for (var i = 0; i < Constants.MAP_COLUMN; i++) {
				if (this._map[i][j].getCardNum() <= 0
					|| (i > 0 && this._map[i][j].getCardNum() == this._map[i-1][j].getCardNum())
					|| (i < Constants.MAP_COLUMN - 1 && this._map[i][j].getCardNum() == this._map[i+1][j].getCardNum())
					|| (j > 0 && this._map[i][j].getCardNum() == this._map[i][j-1].getCardNum()) 
					|| (j < Constants.MAP_ROW - 1 && this._map[x][y].getCardNum() == this._map[x][j+1].getCardNum())) {
					return;
				}
			}
		}
		this._showDialog(Constants.GAME_FAILED);
	},
	
	_showDialog:function(content) {
		//遮罩层
		var winSize = cc.director.getWinSize();
		this._maskClipper = new cc.ClippingNode();
		this._maskClipper.attr({
			width : winSize.width,
			height : winSize.height,
			anchorX : 0.5,
			anchorY : 0.5,
			x : winSize.width / 2,
			y : winSize.height / 2
		});
		this._maskClipper.alphaThreshold = 0.05;
		
		var dialogLayer = new DialogLayer(this, content);
		this._background.addChild(dialogLayer, 4);
	},
	
	//合并时的动作效果
	_mergeAction:function() {
		Sound._playMerge();
	},
	
	//关闭声音
	_soundSwitchOn:function() {
		this._soundOff.setVisible(true);
		this._soundOn.setVisible(false);
		this._soundSwitch = "off";
		Storage.setCurrentSound("off");
	},
	
	//开启声音
	_soundSwitchOff:function() {
		this._soundOff.setVisible(false);
		this._soundOn.setVisible(true);
		this._soundSwitch = "on";
		Storage.setCurrentSound("on");
	},
});