window.leo = window.leo || {};

// ----------server info, begin------------------------------
leo.config = {};

leo.config.base = {
	heartbeatInterval : 300000, // 600000 is 10 mins
	webSocketPath : "/servlet/sendMsg",
	loginPath : "/servlet/login",

	// TODO: need append num and pwd?
	getWebSocketReconnPath : function() {
		return this.ws + this.serverName + this.port + this.appName
				+ this.webSocketPath + "?connectType=reconnect";
	},
	getLoginPath : function() {
		return this.ws + this.serverName + this.port + this.appName
				+ this.webSocketPath + "?connectType=login";
		// return 'http://' + this.serverName + ':' + this.port + this.appName +
		// this.loginPath;
	},
	getConnectPath : function() {
		return this.ws + this.serverName + this.port + this.appName
				+ this.webSocketPath + '?connectType=connectBeforeLogin';
	},
	getRegisterPath : function() {
		return this.http + this.serverName + this.port + this.appName
				+ "/leo/register";
	},
	getSendFromClientUrl : function() { // used in sae channel
		return this.http + this.serverName + this.port + this.appName
				+ "/leo/sendFromClient";
	}
}

leo.config.localWebServerInfo = {
	needGetChannelUrl : true,
	ws : 'ws://',
	http : 'http://',
	serverName : "192.168.1.111",
	channelServerName : "192.168.1.111",
	port : ":8080",
	appName : '/LeoWebAppServer',
	getChannelUrlPath : function() {
		return this.http + this.channelServerName + this.port + this.appName
				+ "/leo/getSaeChannelMimicUrl";
	},
	createSocket : function(_url) {
		return new window.WebSocket(_url);
	}
};

// use SAE server + SAE channel
leo.config.saeWebServerInfo = {
	needGetChannelUrl : true,
	ws : 'ws://',
	http : 'http://',
	serverName : "pabushai.sinaapp.com",
	channelServerName : "pabushai.sinaapp.com",
	port : "",
	appName : '',
	getChannelUrlPath : function() {
		return this.http + this.channelServerName + this.port + this.appName
				+ "/leo/getSaeChannelUrl";
	},
	createSocket : function(_url) {
		return sae.Channel(_url);
	}
};

leo.config.doConfig = function(flag) {
	with (leo.config) {
		switch (flag) {
		case "1":
			leo.config.strategy = localWebServerInfo;
			break;
		case "2":
			leo.config.strategy = saeWebServerInfo;
			break;
		default:
			leo.config.strategy = saeWebServerInfo;
		}
	}
	$.extend(leo.config.strategy, leo.config.base);
}
leo.config.doConfig('1');
// leo.config.strategy = leo.config.saeWebServerInfo;

// ----------server info, end------------------------------

leo.Model = function() {
	// ---------page showing state -------
	this.pageShowState = {};
	this.setPageShowState = function(id, state) {
		this.pageShowState[id] = state;
	}
	// this.getPageShowState = function(id) {
	// if (this.pageShowState[id] == null) {
	// return false;
	// }
	// return this.pageShowState[id];
	// }
	this.isPageShown = function(id) {
		return this.pageShowState[id] == true;
	}
	this.isPageHidden = function(id) {
		return this.pageShowState[id] == false;
	}
	this.isPageNotCreated = function(id) {
		return this.pageShowState[id] == null;
	}
}
leo.model = new leo.Model();