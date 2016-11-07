var Sound = {
	silence:false,
	
	_playMerge:function() {
		if (!Sound.silence) {
			cc.audioEngine.playMusic(res.MERGE_MP3, false);
		}
	},
	
	_playSelect:function() {
		if (!Sound.silence) {
			cc.audioEngine.playMusic(res.SELECT_MP3, false);
		}
	},
	
	_playSetpos:function() {
		if (!Sound.silence) {
			cc.audioEngine.playMusic(res.SETPOS_MP3, false);
		}
	}
}