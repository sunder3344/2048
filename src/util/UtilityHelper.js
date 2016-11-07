var UtilityHelper = {
	//生成随机数
	createRandomIndex:function(number) {
		return parseInt(Math.random() * number);
	},
	
	getRandomNum:function() {
		num = Constants.CARD_2;
		if (Math.random() > 0.1) {
			num = Constants.CARD_2;
		} else {
			num = Constants.CARD_4;
		}
		return num;
	}
}