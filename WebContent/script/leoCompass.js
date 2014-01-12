

var leoCompass = new LeoCompass();
function LeoCompass() {
	this.init = function() {
		if(leoInit.getIsPhoneGapReady()){
			onDeviceReady();
		}
		//leoCommon.bind(document, 'deviceready', onDeviceReady);
		
		/*
		var button = document.getElementById("capture");
		var compassOptions = {
			frequency : 1000
		};
		navigator.compass.watchHeading(onSuccess, onError, compassOptions);
		*/
	}
	/** Called when phonegap javascript is loaded */
	function onDeviceReady() {
		var button = document.getElementById("capture");
		var compassOptions = {
			frequency : 1000
		};
		navigator.compass.watchHeading(onSuccess, onError, compassOptions);
	}
	function onSuccess(heading) {
		var image = document.getElementById('compass');
		var headingDiv = document.getElementById('compassHeading');
		if(heading != null){
			if(heading.trueHeading != null){
				headingDiv.innerHTML = heading.trueHeading;
				var reverseHeading = 360 - heading.trueHeading;
			}else{
				headingDiv.innerHTML = heading;
				var reverseHeading = 360 - heading;
			}
			image.style.webkitTransform = "rotate(" + reverseHeading + "deg)";
		}
	}
	function onError(error) {
		alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	}
	/** Called when browser load this page */
	function init() {
		document.addEventListener("deviceready", onDeviceReady, false);
	}
}