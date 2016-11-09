var Sound = {
	silence:false,
	
	_playMerge:function() {
		if (!Sound.silence) {
			cc.audioEngine.playEffect(res.MERGE_MP3, false);
		}
	},
	
	_playSelect:function() {
		if (!Sound.silence) {
			cc.audioEngine.playEffect(res.SELECT_MP3, false);
		}
	},
	
	_playSetpos:function() {
		if (!Sound.silence) {
			cc.audioEngine.playEffect(res.SETPOS_MP3, false);
		}
	}
}