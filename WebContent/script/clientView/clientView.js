window.leo = window.leo || {};

leo.LeoShake = function() {
	// 锟斤拷前`watchHeading`锟斤拷锟斤拷锟斤拷
	var watchID = null;
	// 锟斤拷始锟斤拷指锟斤拷锟斤拷锟借备锟侥硷拷锟�
	this.startWatch = function() {
		// 每锟斤拷锟斤拷锟斤拷锟斤拷锟揭伙拷锟斤拷锟斤拷
		var options = {
			frequency : 100
		};
		watchID = navigator.compass.watchHeading(onSuccess, onError, options);
	}
	// 停止锟斤拷指锟斤拷锟斤拷锟借备锟侥硷拷锟�
	this.stopWatch = function() {
		if (watchID) {
			navigator.compass.clearWatch(watchID);
			watchID = null;
		}
	}
	// onSuccess锟截碉拷锟斤拷锟斤拷锟街革拷锟斤拷锟侥碉拷前锟斤拷锟斤拷
	function onSuccess(heading) {
		var element = document.getElementById('heading');
		var x = heading.magneticHeading;
		element.innerHTML = '指锟斤拷锟诫方锟津（角度ｏ拷: ' + x;
		document.getElementById('northDiv').style.webkitTransform = 'rotate('
				+ x + "deg)";
	}
	// onError锟截碉拷锟斤拷锟斤拷锟斤拷锟较革拷拇锟斤拷锟斤拷锟较�
	function onError(compassError) {
		alert('锟斤拷锟斤拷锟斤拷息: ' + compassError.code);
	}
}

//leo.CommonView = function() {
//}
//leo.commonView = new leo.CommonView();

// leo.imView
leo.ImView = function() {
	var esto = this;
}

