var CardSprite = cc.Sprite.extend({
	_id:null,
	number:0,
	column:0,
	row:0,
	_isOccuty:0,			//被任意一个非0的占据
	_showText:null,
	
	ctor:function(column, row, number) {
		this._super("#cube.gif");
		this.init(column, row, number);
	},
	
	init:function(column, row, number) {
		this.column = column;
		this.row = row;
		this.number = number;
		this.setCardColor(number);
		
		/*this._showText = new cc.LabelTTF("", "arial", 36);
		this._showText.setColor(cc.color(0,0,0));
		this.addChild(this._showText);
		if (number != 0) {
			this._showText.setString(number);
		}*/
	},
	
	/*setShowText:function(number) {
		this._showText.setString(number);
	},*/
	
	setCardId:function(id) {
		this._id = id;
	},
	
	setCardColor:function(number) {
		if (number == 0) {
			this.setColor(Constants.RGB_0);
		} else if (number == 2) {
			this.setColor(Constants.RGB_2);
		} else if (number == 4) {
			this.setColor(Constants.RGB_4);
		} else if (number == 8) {
			this.setColor(Constants.RGB_8);
		} else if (number == 16) {
			this.setColor(Constants.RGB_16);
		} else if (number == 32) {
			this.setColor(Constants.RGB_32);
		} else if (number == 64) {
			this.setColor(Constants.RGB_64);
		} else if (number == 128) {
			this.setColor(Constants.RGB_128);
		} else if (number == 256) {
			this.setColor(Constants.RGB_256);
		} else if (number == 512) {
			this.setColor(Constants.RGB_512);
		} else if (number == 1024) {
			this.setColor(Constants.RGB_1024);
		} else if (number == 2048) {
			this.setColor(Constants.RGB_2048);
		}
	},
	
	setCardNum:function(number) {
		this.number = number;
		this.setCardColor(number);
	},
	
	getCardNum:function() {
		return this.number;
	},
	
	//动画效果(闪烁)
	_showBlink() {
		var seq = cc.sequence(cc.scaleTo(0.1, 0.8), cc.scaleTo(0.1, 1));
		this.runAction(seq);
	},
	
	//刹车效果
	_showBrake(direction) {
		var cardX = this.x;
		var cardY = this.y;
		var seq = null;
		if (direction == "left") {
			seq = cc.sequence(cc.moveTo(0.2, cc.p(cardX - Constants.BRAKE_DISTANCE, cardY)), cc.moveTo(0.2, cc.p(cardX, cardY)));
		} else if (direction == "right") {
			
		} else if (direction == "up") {
			
		} else if (direction == "down") {
			
		}
		if (seq != null) {
			this.runAction(seq);
		}
	}
});

CardSprite.create = function(column, row, number) {
	if (cc.pool.hasObject(CardSprite)) {
		return cc.pool.getFromPool(CardSprite);
	} else {
		return new CardSprite(column, row, number);
	}
}