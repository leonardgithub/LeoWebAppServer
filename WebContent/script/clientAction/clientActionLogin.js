window.leo = window.leo || {};

leo.LeoLogin = function() {
	var esto = this;
	esto.canGoToLoginPage = true;
	esto.executeLogin = function(num, pwd) {
		leo.util.log('leo.LeoLogin.executeLogin: num is ' + num + ', pwd is '
				+ pwd);
		var obj = {};
		obj.num = num;
		obj.pwd = pwd;
		obj.storage = leo.leoDao.isLocalStorageSupported;
		obj.connectType = 'login';
		var msg = leo.leoRequestMsg.createRequest("leoMainMsg", 'login', obj);
		leo.leoChannel.sendMsg(msg);
		// cache num and pwd locally
		leo.leoChannel.num = num;
		leo.leoChannel.pwd = pwd;
	}
	esto.clearLoginData = function() {
		$('#num').val('');
		$('#pwd').val('');
	}
}
leo.leoLogin = new leo.LeoLogin();


