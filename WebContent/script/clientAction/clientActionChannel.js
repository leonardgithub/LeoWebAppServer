window.leo = window.leo || {};

leo.LeoChannel = function() {
	var esto = this;
	var socket = null; // websocket or sae channel object
	esto.getSocket = function() {
		return socket;
	}
	// states management, begin
	esto.states = [ "disconnected", "connecting", "connected" ];
	esto.connState = esto.states[0];
	esto.setState = function(idx) {
		esto.connState = esto.states[idx];
		// leo.imFriend.notifyUserState(esto.states[idx]);
	}
	esto.canDoConnection = function() {
		return esto.connState === esto.states[0];
	}
	esto.isLogin = false;
	esto.setIsLogin = function(flag) {
		esto.isLogin = flag;
		// leo.imFriend.notifyIsLogin((esto.isLogin ? 'online' : 'offline'));
	}
	// states management, end
	// login info, begin
	esto.num = ''; // TODO: encrypted and saved locally
	esto.pwd = ''; // TODO: encrypted and saved locally
	// var url = null;
	// esto.setUrl = function(u) {
	// url = u;
	// }
	// login info, end

	// if (false) {
	// esto.setSocketCallbackAfterLogin = function() {
	// url = leo.config.strategy.getWebSocketReconnPath();
	// socket.onopen = function() {
	// leo.util.log('socket.onopen!');
	// esto.setState(2);
	// };
	// socket.onmessage = function(msg) {
	// leo.util.log('socket.onmessage');
	// var data = msg.data;
	// leo.action.handlerMap[data.s.action][data.s.method]();
	// };
	//
	// socket.onclose = function(p) {
	// leo.util.log('socket.onclose: ' + p);
	// esto.setState(0);
	// esto.setIsLogin(false);
	// doConnect();
	// };
	// socket.onerror = function(p) {
	// leo.util.log('socket.onerror: ' + p);
	// esto.setState(0);
	// doConnect();
	// };
	// }
	// function doConnect() {
	// alert(12346546);
	// if (esto.connState == esto.states[1]
	// || esto.connState == esto.states[2]) {
	// return;
	// }
	// setTimeout(function() {
	// esto.setState(1);
	// leo.util.log('connecting to ' + url);
	// socket = esto.CreateSocket(url);
	// esto.setSocketCallbackAfterLogin();
	// }, 1000);
	// }
	// }
	esto.CreateSocket = function(_url) {
		return leo.config.strategy.createSocket(_url);
	}
	esto.doAfterLogin = function() {// invoked after login OK
		leo.util.log('doAfterLogin begin');
		esto.setIsLogin(true);
		// this.num = p_num;
		// this.pwd = p_pwd;
		socket.onclose = function(msg) {
			esto.setState(0);
			esto.setIsLogin(false);
			leo.util.log('socket.onclose: ' + msg);
			// re-login regardless of isFromLoginPage
			esto.doReconnect({
				num : esto.num,
				pwd : esto.pwd,
				isFromLoginPage : false
			});
		};
		esto.startHeartbeat();
	}
	esto.startHeartbeat = function() {
		var intervalId = setInterval(function() {
			if (esto.connState === esto.states[2] && esto.isLogin === true) {
				esto.sendMsg("heartbeat");
			} else {
				clearInterval(intervalId);
			}
		}, leo.config.strategy.heartbeatInterval);
	}
	/**
	 * click login button, or reconnect
	 */
	esto.loginServer = function(num, pwd, isFromLoginPage) {
		leo.util.log('loginServer: num: ' + num + ', pwd: ' + pwd
				+ ', isFromLoginPage: ' + isFromLoginPage);
		if (esto.isLogin) {
			return;
		}
		if (esto.connState == esto.states[0]) {
			// connect channel/socket first, then login later
			leo.util.log('state == states[0] in loginServer()');
			esto.connectAndThenLogin(num, pwd, isFromLoginPage);
		} else if (esto.connState == esto.states[2]) {
			// socket/channel is connected, login directly
			leo.util.log('state == states[2] in loginServer()');
			leo.leoLogin.executeLogin(num, pwd);
		} else if (esto.connState == esto.states[1]) {
			// state is connecting, do nothing
			leo.util.log('state == states[1] in loginServer()');
		}
	}

	// -------for reconnection, begin-------
	esto.isReconnTiming = false;
	// esto.needReconn = false; //not used now
	// setter and getter for isReconnTiming
	esto.reconnTiming = function(flag) {
		if (flag == null) {
			leo.util.log('get reconnTiming: ' + esto.isReconnTiming);
			return esto.isReconnTiming; // getter
		}
		leo.util.log('set reconnTiming: ' + flag);
		esto.isReconnTiming = flag;// setter
	}
	esto.doReconnect = function(paramObj) {
		if (esto.reconnTiming()) {// only one timer for reconnection
			return;
		}
		if (paramObj != null) {
			var time = 30000;
			leo.util.log('setTimeout for doReconnect, time: ' + time);
			setTimeout(function() {
				leo.util.log('doReconnect');
				esto.loginServer(paramObj.num, paramObj.pwd,
						paramObj.isFromLoginPage);
				esto.reconnTiming(false);// it is not timing now
			}, time);
			esto.reconnTiming(true);// it is timing now
		}
	}
	// -------for reconnection, end-------
	esto.getChannelUrlAndConnect = function(paramObj) {
		var getChannelUrlPath = leo.config.strategy.getChannelUrlPath();
		var opt = {
			type : 'post',
			url : getChannelUrlPath,
			success : function(e) {
				if (!esto.canDoConnection()) {
					return;
				}
				if (e != null) {
					if (e.result == 1 && e.url && e.url !== 'null') {
						esto.channelName = e.channelName;
						setTimeout(function() {
							socket = esto.CreateSocket(e.url);
							esto.setHandlersForSocket(paramObj);
						}, 1000);
					} else {
						leo.util.log("invalid result for channel url");
						// reconnect
						if (paramObj.isFromLoginPage == false) {
							esto.doReconnect(paramObj);
						}
					}
				} else {
					leo.util.log("e is null, invalid channel url result.");
					// reconnect
					if (paramObj.isFromLoginPage == false) {
						esto.doReconnect(paramObj);
					}
				}
			},
			error : function(e) {
				// TODO: get channel url again
				leo.util.log('get url error: ' + (e && e.readyState));
				if (e != null) {
					if (e.result == 1) {
						leo.util.log(e.url);
					} else {
					}
				} else {
					leo.util.log('error, no data');
				}
				// reconnect
				if (paramObj.isFromLoginPage == false) {
					esto.doReconnect(paramObj);
				}
			}
		};
		leo.util.log('get channel url, ajax to ' + getChannelUrlPath);
		$.ajax(opt);
	}

	/**
	 * invoked after websocket/channel object is created
	 * 
	 * @param paramObj
	 */
	esto.setHandlersForSocket = function(paramObj) {
		socket.onopen = function() { // login OK
			esto.setState(2);
			leo.util.log('socket.onopen!');
			leo.leoLogin.executeLogin(paramObj.num, paramObj.pwd);
		};
		socket.onmessage = function(msg) {
			leo.util.log('socket.onmessage: ' + msg);
			if (msg != null && msg.data) {
				leo.util.log('msg.data in socket.onmessage: ' + msg.data);
				leo.action.handlerMap.callback(msg);
			}
		};
		socket.onclose = function(msg) { // login failed
			esto.setState(0);
			esto.setIsLogin(false);
			leo.util.log('socket.onclose: ' + msg);
			// TODO: notify user that network problem 20130929
			// if not from login page, re-login automatically
			if (paramObj.isFromLoginPage == false) {
				esto.doReconnect(paramObj);
			}
		};
		// it seems onerror will not be invoked for SAE Channel
		socket.onerror = function(p) {
			leo.util.log('socket.onerror: ' + p);
			// TODO: notify user that network problem 20130929
		};
	}
	esto.connectAndThenLogin = function(num, pwd, isFromLoginPage) {
		if (!esto.canDoConnection()) {
			return;
		}
		// login info
		var params = {
			num : num,
			pwd : pwd,
			isFromLoginPage : isFromLoginPage
		}
		var needGetChannelUrl = leo.config.strategy.needGetChannelUrl;
		// for sae channel, if system requires client get channel url first
		if (needGetChannelUrl) {
			esto.getChannelUrlAndConnect(params);
		} else {// for websocket, if no need to get channel url first
			var connectUrl = leo.config.strategy.getConnectPath();
			setTimeout(function() {
				leo.util.log('connecting to ' + connectUrl);
				esto.setState(1);
				socket = esto.CreateSocket(connectUrl);
				esto.setHandlersForSocket(params);
			}, 1000);
		}
	}
	esto.sendMsg = function(msg) {
		// TODO: implement encryption
		if (window.LeoEncryptor != null) {
			leo.util.log("---before encryption----" + msg);
			msg = LeoEncryptor.encrypt(msg);
		}
		leo.util.log("---sendMsg----" + msg);
		socket.send(msg);
	}
	esto.logoutServer = function() {
		// just to remove reconnection timer
		if (esto.isLogin) {
			socket.onclose = function(msg) {
				esto.setState(0);
				esto.setIsLogin(false);
				leo.util.log('socket.onclose: ' + msg);
				location.href = document.getElementById('leoImLoginUrl').value;
				leo.util.removeHtmlById('index-body');
			};
			esto.doClose();
		}
	}
	esto.doClose = function() {
		socket && esto.isLogin && socket.close && socket.close();
	}
};
leo.leoChannel = new leo.LeoChannel();
// -----------------------------request msg start------------------------------
leo.LeoRequestMsg = function() {
	var esto = this;
	// ---------parse json string to object, begin---------
	esto.parseJsonByFun = function(str) {
		if (window.Function) {
			try {
				leo.util.log("new function parse:" + str);
				return (new window.Function("", "return " + str))();
			} catch (e) {
				leo.util.log("new function parse json failed:" + e.message);
				throw e;
			}
		} else {
			throw "";
		}
	}
	esto.parseJsonByEval = function(str) {
		if (window.eval) {
			try {
				leo.util.log("eval json parse:" + str);
				return eval("(" + str + ")");
			} catch (e) {
				leo.util.log("eval json parse failed:" + e.message);
				throw e;
			}
		} else {
			throw "";
		}
	}
	esto.parseJsonByJson = function(str) {
		if (window.JSON) {
			try {
				leo.util.log("JSON.parse:" + str);
				return JSON.parse(str);
			} catch (e) {
				leo.util.log("JSON.parse failed:" + e.message);
				throw e;
			}
		} else {
			throw "";
		}
	}
	this.jsonToObj = function(str) { // string to obj
		try {
			return esto.parseJsonByJson(str);
		} catch (e) {
			try {
				return esto.parseJsonByEval(str);
			} catch (e) {
				try {
					return esto.parseJsonByFun(str);
				} catch (e) {
					return {};
				}
			}
		}
	}
	// ---------parse json string to object, end---------
	this.objToJson = function(obj) { // stringify obj to string
		return JSON.stringify(obj);
	}
	this.createRequest = function(action, method, appParamsObj) {
		var obj = {
			s : {
				action : action,
				method : method
			},
			a : appParamsObj
		}
		return this.objToJson(obj); // return string
	}
	this.createSysParams = function(action, method) {
		return {
			action : action,
			method : method
		};
	}
	this.buildArray = function(arr) {
		if (arr == null) {
			return '';
		}
		for ( var i = 0; i < arr.length; i++) {
			if (i == 1) {

			}
		}
	}
}
leo.leoRequestMsg = new leo.LeoRequestMsg();
// -----------------------------request msg end------------------------------

