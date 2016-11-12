var DialogLayer = cc.Layer.extend({
	_gameScene:null,
	_background:null,
	_exitItem:null,
	_retryItem:null,
	_dialogPanel:null,
	_layerStatus:"",
	_promptTxt:"",
	flag:-1,
	
	ctor:function(gameScene, content) {
		this._super();
		
		this._gameScene = gameScene;
		this._background = gameScene._background;
		//mask(竖屏和横屏不一样)
		var distance = 80;
		if ("touches" in cc.sys.capabilities) {
			distance = 80;
		} else {
			distance = 230;
		}
		var mask = new cc.Sprite("#background.gif");
		winSize = cc.director.getWinSize();
		mask.x = this._gameScene._background.x - distance;
		mask.y = this._gameScene._background.y;
		this.addChild(mask, 1);
		
		this._dialogPanel = new cc.Sprite("#panel.gif");
		this.addChild(this._dialogPanel, 2);
		this._dialogPanel.x = this._background.width / 2;
		this._dialogPanel.y = this._background.height / 2 - 20;
		
		//提示信息
		this._promptTxt = new cc.LabelTTF(content, "Arial", 30);
		this._promptTxt.x = this._background.width / 2;
		this._promptTxt.y = this._background.height / 2 - 200;
		this._dialogPanel.addChild(this._promptTxt);
		
		//增加menuItem
		this._exitItem = new cc.MenuItemImage(res.EXIT_PNG, res.EXIT_PNG, this._exitGame, this);
		this._exitItem.scale = 0.8;
		this._exitItem.x = this._dialogPanel.x - 130;
		this._exitItem.y = this._dialogPanel.y - 400;
		this._retryItem = new cc.MenuItemImage(res.RETRY_PNG, res.RETRY_PNG, this._retry, this);
		this._retryItem.scale = 0.8;
		this._retryItem.x = this._exitItem.x + this._exitItem.width / 2 + 100;
		this._retryItem.y = this._dialogPanel.y - 400;
		var menu = new cc.Menu(this._exitItem, this._retryItem);
		this._dialogPanel.addChild(menu);
		menu.x = 0;
		menu.y = 0;
	},
	
	onEnter:function() {
		this._super();
		/*var layerListener = null;
		if ("touches" in cc.sys.capabilities) {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: this._onTouchEnded.bind(this),
			});
		} else {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.MOUSE,
				swallowTouches: true,
				onMouseUp: this._onMouseUp.bind(this)
			});
		}
		cc.eventManager.addListener(layerListener, this._dialogPanel);
		this._listener = layerListener;*/
	},
	
	onExit:function() {
		cc.eventManager.removeListener(this._listener);
		this._super();
	},
	
	init:function() {
		
	},
	
	//退出游戏
	_exitGame:function() {
		cc.director.end();
	},
	
	//重新开始
	_retry:function() {
		cc.director.runScene(new GameScene());
	}
});

DialogLayer.create = function() {
	if (cc.pool.hasObject(Dialoglayer)) {
		return cc.pool.getFromPool(DialogLayer);
	} else {
		return new DialogLayer();
	}
}