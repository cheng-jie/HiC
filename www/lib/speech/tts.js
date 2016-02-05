		/**
		  * 初始化Session对象
		  */
	    var session = new IFlyTtsSession({
                                      'url' : 'http://webapi.openspeech.cn/',							
                                      'interval' : '30000', 
								      'disconnect_hint' : 'disconnect',
								      'sub' : 'tts'
						         });
		var audio = null;
		
		var speakTimer;
		function speak(content){
			clearTimeout(speakTimer);
			speakTimer = setTimeout(function(){
				_speak(content);
			}, 200);
		};
		
		/**
		  * 输入文本，输出语音播放链接 
		  * @content 待合成文本(不超过4096字节)
		  */
		function _speak(content) {
		    /***********************************************************以下签名过程需根据实际应用信息填入***************************************************/
		 
		    var appid = "56ac8345";                              //应用APPID，在open.voicecloud.cn上申请即可获得
		    var timestamp = (new Date()).valueOf();                      //当前时间戳，例new Date().toLocaleTimeString()
            var expires = 60000;                          //签名失效时间，单位:ms，例60000		
		    //!!!为避免secretkey泄露，签名函数调用代码建议在服务器上完成
		    var signature = faultylabs.MD5(appid + '&' + timestamp + '&' + expires + '&' + "d043d3d33c04618d");		
		   /************************************************************以上签名过程需根据实际应用信息填入**************************************************/
		   
			var params = { "params" : "vcn = xiaoqi, aue = speex-wb;7, ent = intp65, spd = 50, vol = 50, tte = utf8, caller.appid=" + appid + ",timestamp=" + timestamp + ",expires=" + expires, "signature" : signature, "gat" : "mp3"};	
			session.start(params, content, function (err, obj)
	        {
			    if(err) {
				    alert("语音合成发生错误，错误代码 ：" + err);
			    } else {
			        if(audio != null)
					{
					    audio.pause();
					}
					audio = new Audio();
					audio.src = '';
	                audio.play();
					audio.src = "http://webapi.openspeech.cn/" + obj.audio_url;
					audio.play();
			    }
		    });
		};
		
//		
//		var iatSession = new IFlyIatSession({
//            'url' : 'http://webapi.openspeech.cn/',							
//            'reconnection'       : true,
//			  'reconnectionDelay'  : 30000,
//			  'compress' : 'speex',
//			  'speex_path' : 'lib/speech/speex.js',              //speex.js����·�� 
//			  'vad_path' : 'lib/speech/vad.js',                  //vad.js����·��
//			  'recorder_path' : 'lib/speech/recorderWorker.js'    //recordWorker.js����·��
//       });
//		
//		function listen(){
//			var appid = "56ac8345";                              //应用APPID，在open.voicecloud.cn上申请即可获得
//		    var timestamp = (new Date()).valueOf();                      //当前时间戳，例new Date().toLocaleTimeString()
//            var expires = 60000;                          //签名失效时间，单位:ms，例60000		
//		    //!!!为避免secretkey泄露，签名函数调用代码建议在服务器上完成
//		    var signature = faultylabs.MD5(appid + '&' + timestamp + '&' + expires + '&' + "d043d3d33c04618d");		
//		    var ssb_param = {"grammar_list" : null, "params" : "aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, caller.appid = " + appid + ",timestamp = " + timestamp + ",expires = " + expires, "signature" : signature};
//		    
//		    iatSession.stop(null);
//			iatSession.start(ssb_param , function (volume)
//					{
//					        /* 显示音量波动界面 */
//					        //display(volume);
//					}, function (err, result)
//					{
//					        /* 若err为null则显示识别结果，否则显示识别错误 */
//					        if(err == null)
//					        {
//					                //display(result);
//					                console.log(result);
//					        }else {
//					                //display(err);
//					        }
//					});
//		};
