var HelpLayer = cc.Layer.extend({
	_gameScene:null,
	_background:null,
	_exitBtn:null,
	_helpPanel:null,
	_listener:null,
	_layerSwitch:"",
	flag:-1,
	
	ctor:function(gameScene) {
		this._super();
		
		this._gameScene = gameScene;
		this._background = gameScene._background;
		this._helpPanel = new cc.Sprite("#help.gif");
		this.addChild(this._helpPanel, 1);
		this._helpPanel.x = this._background.width / 2;
		this._helpPanel.y = this._background.height / 2 - 50;
	},
	
	onEnter:function() {
		this._super();
		var layerListener = null;
		if ("touches" in cc.sys.capabilities) {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				//onTouchEnded:function(touch, event) {
				//	_background.removeChild(this);
				//}
				onTouchBegan: this._onTouchEnded.bind(this),
				//onTouchEnded: this._onTouchEnded.bind(this)
				//onTouchBegan:function(touch, event) {
				//	return true;
				//}
			});
		} else {
			layerListener = cc.EventListener.create({
				event: cc.EventListener.MOUSE,
				swallowTouches: true,
				//onMouseUp:function(event) {
				//	cc.log(_background);
				//	_background.removeChild(this);
				//}
				onMouseUp: this._onMouseUp.bind(this)
			});
		}
		cc.eventManager.addListener(layerListener, this._helpPanel);
		this._listener = layerListener;
	},
	
	onExit:function() {
		cc.eventManager.removeListener(this._listener);
		this._super();
	},
	
	init:function(helpPanel) {
		
	},
	
	_onTouchEnded:function(touches, event) {
		this.flag++;
		if (this.flag >= 0) {
			if (this._layerSwitch == "on") {
				this._background.removeChild(this);
				this._gameScene._helpBtn.setEnabled(true);
				this._gameScene._exitBtn.setEnabled(true);
				this._layerSwitch = "off";
				this.flag = 0;
			}
		}
	},
	
	_onMouseUp:function(event) {
		this.flag++;
		if (this.flag > 0) {
			if (this._layerSwitch == "on") {
				this._background.removeChild(this);
				this._gameScene._helpBtn.setEnabled(true);
				this._gameScene._exitBtn.setEnabled(true);
				this._layerSwitch = "off";
				this.flag = 0;
			}
		}
	},
	
	_helpExit:function() {
		cc.log('asdf');
	},
	
	_setLayerSwitch:function(layerSwitch) {
		this._layerSwitch = layerSwitch;
	}
});

HelpLayer.create = function() {
	if (cc.pool.hasObject(Helplayer)) {
		return cc.pool.getFromPool(HelpLayer);
	} else {
		return new HelpLayer();
	}
}