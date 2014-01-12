window.leo = window.leo || {};

// instance leo.imSetting
leo.ImSetting = function() {// the setting panel at footer
	var esto = this;
	esto.clickLogout = function(){
		leo.leoChannel.logoutServer();
	}
	// setting notification, begin
	// setting notification, end
}
// instance leo.imSetting


