var Storage = {
	getCurrentScore:function() {
		var score = cc.sys.localStorage.getItem("2048.score") || 0;
		return parseInt(score);
	},
	
	setCurrentScore:function(score) {
		cc.sys.localStorage.setItem("2048.score", score);
		return true;
	},
	
	getCurrentHighest:function() {
		var highest = cc.sys.localStorage.getItem("2048.highest") || 0;
		return parseInt(highest);
	},
	
	setCurrentHighest:function(highest) {
		cc.sys.localStorage.setItem("2048.highest", highest);
		return true;
	}
}