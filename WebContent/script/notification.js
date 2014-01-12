
var leo;
if(!leo){
	leo = {};
}

leo.Notification = function(){
	this.onNotifyLoad = function(){
		alert('noti');
		return onNotifyLoad();
	}
	function onNotifyLoad() {
		alert("alert 1");
		alert("alert 2", handleClick);
		alert("alert 3", handleClick, "My title");
		alert("alert 4", handleClick, "My title", "All done");
		confirm("confirm 1");
		confirm("confirm 2", handleConfirmClick);
		confirm("confirm 3", handleConfirmClick, "My title");
		confirm("confirm 4", handleConfirmClick, "My title", "Play Again,Quit");
		navigator.notification.vibrate(500);
		navigator.notification.beep(3);
	}
	function handleClick() {
		leo.util.log('handleClick');
	}
	// button contains the name of the button clicked
	// Windows Phone 7 ignores button names, always 'OK|Cancel'
	function handleConfirmClick(button) {
		if (button == 'Play Again' || button == 'OK') {
			leo.util.log(1);
			// do play again
		} else if (button == 'Quit' || button == 'Cancel') {
			leo.util.log(2);
			// do quit code
		}
	}
	// override the built in JavaScript alert function
	function alert(msg, callback, title, button) {
		if (typeof callback == 'undefined')
	        callback = handleClick;
	    if (typeof title == 'undefined')
	        title = "my title";
	    if (typeof button == 'undefined')
	        button = "click me";
		navigator.notification.alert(msg, callback, title, button);
	}
	function confirm(msg, callback, title, buttons) {
		navigator.notification.confirm(msg, callback, title, buttons);
	}
}

leo.notification = new leo.Notification();