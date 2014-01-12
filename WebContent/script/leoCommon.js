/*
 var oldAlert = null;
 if (!oldAlert) { // just override once, in case of override multiple times
 oldAlert = alert;
 alert = function() {
 var flag = 1;
 if (flag) {
 oldAlert.apply(window, arguments);
 }
 }
 }
 */

window.leo = window.leo || {};

leo.Util = function() {
	var esto = this;
	var alertFlag = true;
	esto.reverseArray = function(arr) {
		if (!arr) {
			return arr;
		}
		var revArr = [];
		for ( var i = 0; i < arr.length; i++) {
			revArr[arr.length - 1 - i] = arr[i];
		}
		return revArr;
	}
	
	//about common alert, begin
	esto.alertMsg = '';
	esto.alertCallback;
	esto.alert = function(str, f) {
		esto.alertMsg = (str ? str : '');
		esto.alertCallback = f;
		$("#imCommonAlert").click();
	}
	esto.alertError = function(f) {
		esto.alertMsg = "操作有误，请重试！";
		esto.alertCallback = f;
		$("#imCommonAlert").click();
	}
	//about common alert, begin
	
	esto.tryRun = function(f) {
		try {
			f();
		} catch (e) {
			this.alert(e.message);
		}
	}
	esto.bind = function(obj, event, f, flag) {
		leo.util.log('bind event:' + event);
		if (document.addEventListener) {
			if (!flag) {
				flag = false;
			}
			obj.addEventListener(event, f, flag);
			return true;
		} else if (document.attachEvent) {
			obj.attachEvent('on' + event, f);
			return true;
		}
		return false;
	}
	esto.doLog = function(str) {
		console.log('[console.log]: ' + str);
	}
	esto.log = function() {
		if (window.console && console.log) {
			this.doLog.apply(this, arguments);
			/*
			 * if(arguments != null && arguments.length > 0){ var str = '';
			 * for(var i =0;i<arguments.length;i++){ str += arguments[i]; }
			 * console.log(str); }
			 */
			var p = arguments[0];
			if (p != null) {
				// console.log('p is not null');
				if (p instanceof Object) {
					// console.log('p instanceof Object');
					if (p instanceof Array) {
						// console.log('p instanceof Array');
						for ( var i = 0; i < p.length; i++) {
							this.doLog(p[i]);
						}
					} else {
						// console.log('p not instanceof Array');
						for ( var i in p) {
							this.doLog(p[i]);
						}
					}
				}
			}
		}
	}
	esto.showErrMsg = function() {
		window.alert.apply(window, arguments);
	}
	esto.format = function(s) {
		var ret = s;
		for ( var i = 1; i < arguments.length; i++) {
			ret = ret.replace('%s', arguments[i]);
		}
		return ret;
	}
	esto.createElement = function() {
		return document.createElement.apply(document, arguments);
	}
	// this.createEleWithText = function(text) {
	// var div = document.createElement('div'); // div or span
	// div.innerText = text;
	// return div.outerHTML;
	// }
	esto.createElementBy$ = function() {
		return $.apply(window, arguments);
	}
	esto.createElementObj = function(tagName, params) {
		var ele = document.createElement(tagName);
		if (params) {
			for ( var i in params) {
				var param = params[i];
				ele[i] = param;
			}
		}
		return ele;
	}
	esto.createElementStr = function(tagName, params) {
		return esto.createElementObj(tagName, params).outerHTML;
	}
	esto.escapeUrl = function(obj) { // pass into a obj
		return $.param.apply($, arguments);
	}
	esto.previewImg = function(file, imgId) {
		if (file) {
			if (window.FileReader) {
				var fr = new FileReader();
				fr.readAsDataURL(file);
				fr.onload = function(e) {
					if (e && e.target && e.target.result) {
						document.getElementById(imgId).src = e.target.result;
					}
				}
			} else {

			}
		}
	}
	esto.getById = function(id) {
		return document.getElementById(id);
	}
	esto.promptUp = function() {
		window.alert.apply(window, arguments);
	}
	esto.textToHtml = function(text) {
		var ele = document.createElement('p');
		ele.innerText = text;
		return ele.innerHTML;
	}
	esto.loadJs = function(parentId, jsFilePath) {
		var oHead = document.getElementById(parentId);
		if (oHead) {
			var oScript = document.createElement("script");
			oScript.type = "text/javascript";
			oScript.src = jsFilePath;
			oHead.appendChild(oScript);
		}
	}
	esto.buildOneButton = function(obj) {
		var s = '<a onclick="' + (obj.onclick == null ? '' : obj.onclick)
				+ ';return false;" href="#" data-role="button">'
				+ (obj.innerHTML == null ? '' : obj.innerHTML) + '</a>';
		return s;
	}
	esto.buildTextBlock = function(text) {
		return esto.createElementStr('div', {
			innerText : text,
			className: "leoImMsg"
		});
	}
	esto.removeHtmlById = function(id) {
		var ele = document.getElementById(id);
		ele && (ele.outerHTML = '');
	}
}
leo.util = new leo.Util();

leo.LeoSrcImporter = function() {
	this.phoneGapJsFileName = '../script/phonegap/phonegap-1.2.0.js';
	this.create = function(tagName, option) {
		var src = document.createElement(tagName);
		for ( var i in option) {
			src.setAttribute(i, option[i]);
		}
		return src;
	}
	this.import = function(tagName, option) {
		var src = this.create(tagName, option);
		this.appendToHead(src);
	}
	this.appendToHead = function(srcs) {
		if (srcs == null)
			return false;
		var head = document.getElementsByTagName("head")[0];
		if (!head) {
			return false;
		}
		if (srcs instanceof Array) {
			for ( var i = 0; i < srcs.length; i++) {
				head.appendChild(srcs[i]);
			}
		} else {
			head.appendChild(srcs);
			alert('import ' + srcs);
		}
		return true;
	}
}

/*
 * document.oldAddEventListener = document.addEventListener;
 * document.addEventListener = function(){ if('deviceready' == arguments[0]){
 * alert('new document.addEventListener '); }
 * document.oldAddEventListener.apply(document, arguments); }
 */

function LeoInit() {
	var isPhoneGapReady = false;
	var intervalID;
	var isConnected = false;
	var isHighSpeed = false;
	var internetInterval;
	var os;
	var deviceUUID;
	var currentUrl;
	var isPaused = false;

	this.getIsPhoneGapReady = function() {
		return isPhoneGapReady;
	};
	this.getIsConnected = function() {
		return isConnected;
	};
	this.getCurrentUrl = function() {
		return currentUrl;
	}

	function listenDeviceready() {
		// Add an event listener for deviceready
		if (isPhoneGapReady) {
			onDeviceReady();
		} else {

			// $(document).bind("deviceready", onDeviceReady);
			leo.util.bind(document, "deviceready", onDeviceReady, false);

			// Older versions of Blackberry < 5.0 don't support
			// PhoneGap's custom events, so instead we need to perform
			// an interval check every 500 milliseconds to see whether
			// PhoneGap is ready. Once done, the interval will be
			// cleared and normal processing can begin.

			/*
			 * if (!intervalID) { intervalID = setInterval(function() {
			 * leoCommon.log('setInterval'); if (window.PhoneGap &&
			 * PhoneGap.available) { leoCommon.log('setInterval: ' +
			 * PhoneGap.available); onDeviceReady(); } }, 500); }
			 */
		}

	}

	this.init = function() {
		doInit.apply(window, arguments);
	}
	function doInit(url) {
		leo.util.log('init is called, url is ' + url);
		if (typeof url != 'string') {
			currentUrl = location.href;
		} else {
			currentUrl = url;
		}
		listenDeviceready();
	}
	function deviceDetection() {
		if (isPhoneGapReady) {
			os = device.platform;
		}
	}
	function onDeviceReady() {
		leo.util.log('onDeviceReady');
		if (intervalID != null) {
			window.clearInterval(intervalID);
			intervalID = null;
		}
		// set to true
		isPhoneGapReady = true;
		deviceUUID = device.uuid;
		checkNetWorkStatus();

		leo.util.bind(document, "online", checkNetWorkStatus, false);
		leo.util.bind(document, "offline", checkNetWorkStatus, false);
		leo.util.bind(document, "pause", onPause, false);
		leo.util.bind(document, "resume", onResume, false);

		// no need to setinterval for Android
		// internetInterval = setInterval(checkNetWorkStatus, 5000);

		// executeCallback();
		// *************do logic after device is ready*******************
		if (window.doAfterPhoneGapReady != null
				&& window.doAfterPhoneGapReady()) {
		}
	}
	function onPause() {
		leo.util.log('onPause');
		isPaused = true;
		// clear the Internet check interval
		// window.clearInterval(internetInterval);
		// internetInterval = null;
	}
	function onResume() {
		leo.util.log('onResume');
		// don't run if phonegap is already ready
		if (isPaused == true) {
			// doInit(currentUrl);
			isPaused = false;
		}
	}
	function executeCallback() {
		if (isPhoneGapReady) {
			// get the name of the current html page
			var pages = currentUrl.split("/");
			var currentPage = pages[pages.length - 1].slice(0,
					pages[pages.length - 1].indexOf(".html"));
			// capitalize the first letter and execute the function
			currentPage = currentPage.charAt(0).toUpperCase()
					+ currentPage.slice(1);
			if (typeof window['on' + currentPage + 'Load'] == 'function') {
				window['on' + currentPage + 'Load']();
			}
		}
	}
	function checkNetWorkStatus() {
		isConnected = false;
		isHighSpeed = false;
		// as long as the connection type is not none,
		// the device should have Internet access

		if (isPhoneGapReady && navigator.network
				&& navigator.network.connection
				&& navigator.network.connection.type) {
			if (navigator.network.connection.type != Connection.NONE) {
				isConnected = true;
			}
			if (isConnected == false) {
				isHighSpeed = false;
			} else {
				// determine whether this connection is high-speed
				// determine whether this connection is high-speed
				switch (navigator.network.connection.type) {
				case Connection.UNKNOWN:
				case Connection.CELL_2G:
					isHighSpeed = false;
					break;
				case Connection.NONE:
					isHighSpeed = false;
					break;
				case 'wifi':
					isHighSpeed = true;
					break;
				default:
					isHighSpeed = false;
					break;
				}
			}
		}
		leo.util.log('checkNetWorkStatus: isPhoneGapReady:' + isPhoneGapReady
				+ ', isConnected:' + isConnected + ', isHighSpeed:'
				+ isHighSpeed + ', navigator.network.connection.type: '
				+ navigator.network.connection.type);
	}
	/*
	 * function onOnline() { leoCommon.log('onOnline'); if (isConnected ==
	 * false) { isConnected = true; // do biz............. } } function
	 * onOffline() { leoCommon.log('onOffline'); if (isConnected == true) {
	 * isConnected = false; isHighSpeed = false; // do biz............. } }
	 */

}

/*
 * alert(window.PhoneGap); var leoSrcImporter = new LeoSrcImporter();
 * leoSrcImporter.import('script', { type : 'text/javascript', src :
 * leoSrcImporter.phoneGapJsFileName } ) var leoInit = new LeoInit();
 * 
 * alert(window.PhoneGap);
 */
var leoInit = new LeoInit();
/*
 * $(document).bind("pageload", function(event, data) { leoInit.init(data.url);
 * });
 */
$(document).ready(function() {
	leoInit.init();
});

// -------------------------------------------------------------

if (window.leo == null) {
	window.leo = {};
}

leo.LeoStorage = function() {
	var esto = this;
	esto.storage = window.localStorage;
	esto.setItem = function() {
		if (esto.storage) {
			esto.storage.setItem.apply(esto.storage, arguments);
		}
	}
	esto.getItem = function() {
		if (esto.storage) {
			return esto.storage.getItem.apply(esto.storage, arguments);
		}
		return "";
	}
}
leo.leoStorage = new leo.LeoStorage();
