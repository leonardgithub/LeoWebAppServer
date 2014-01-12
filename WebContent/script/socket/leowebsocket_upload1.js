if (!window.leo) {
	window.leo = {};
}
window.leo.LeoLoader = function() {
	this.upload = function(fileInputId) {
		var fileObj = document.getElementById(fileInputId);
		if (!fileObj || !fileObj.files || !fileObj.files[0]) {
			return;
		}
		var fr = new FileReader();
		fr.onload = function(e) {
			leo.util.log("filereader onload");
			if (!e.target || !e.target.result) {
				return;
			}
			leo.leoChannel.sendMsg(e.target.result);
		}
		fr.onerror = function() {
			leo.util.log("filereader onerror");
		}
		fr.readAsBinaryString(fileObj.files[0]);
		// fr.readAsText(fileObj.files[0]);
		// fr.readAsDataURL(fileObj.files[0]);
	}
	this.showImg = function(fileInputId, imgId) {
		var fileObj = document.getElementById(fileInputId);
		if (!fileObj || !fileObj.files || !fileObj.files[0]) {
			return;
		}
		var fr = new FileReader();
		fr.onload = function(e) {
			leo.util.log("filereader onload");
			var imgObj = document.getElementById(imgId);
			leo.util.log(imgObj);

			if (!imgObj || !e.target || !e.target.result) {
				return;
			}
			leo.util.log("e.target.result is " + e.target.result);
			var result = e.target.result;
			result = result.replace('data:base64', 'data:image/jpeg;base64');
			imgObj.src = result;
		}
		fr.onerror = function() {
			leo.util.log("filereader onerror");
		}
		fr.readAsDataURL(fileObj.files[0]);
	}
	this.getCamera = function() {
		var cameraOptions = {
			quality : 50
		};
		navigator.camera.getPicture(onSuccess, onError, cameraOptions);
		function onSuccess(imageData) {
			var image = document.getElementById('mainImgId');
			leo.util.log('imageData: ' + imageData);
			//image.src = "data:image/jpeg;base64," + imageData;
			image.src = imageData;
		}
		function onError(error) {
			leo.util.showErrMsg('code: ' + error.code + '\n' + 'message: '
					+ error.message + '\n');
		}
	}
}

window.leo.leoLoader = new window.leo.LeoLoader();
