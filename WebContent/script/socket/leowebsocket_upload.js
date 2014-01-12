

(function(){
	function FileInfo(file, pagesize) {
		this.Size = file.size;
		this.File = file;
		this.FileType = file.type;
		this.FileName = file.name;
		this.PageSize = pagesize;
		this.PageIndex = 0;
		this.Pages = 0;
		this.UploadError = null;
		this.UploadProcess = null;
		this.DataBuffer = null;
		this.UploadBytes = 0;
		this.ID = Math.floor(Math.random() * 0x10000).toString(16);
		this.LoadCallBack = null;
		if (Math.floor(this.Size % this.PageSize) > 0) {
			this.Pages = Math.floor((this.Size / this.PageSize)) + 1;

		} else {
			this.Pages = Math.floor(this.Size / this.PageSize);

		}

	}
	FileInfo.prototype.Reset = function() {
		this.PageIndex = 0;
		this.UploadBytes = 0;
	}
	FileInfo.prototype.toBase64String = function() {
		var binary = ''
		var bytes = new Uint8Array(this.DataBuffer)
		var len = bytes.byteLength;

		for ( var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i])
		}
		return window.btoa(binary);
	}
	FileInfo.prototype.OnLoadData = function(evt) {
		var obj = evt.target["tag"];

		if (evt.target.readyState == FileReader.DONE) {
			obj.DataBuffer = evt.target.result;
			if (obj.LoadCallBack != null)
				obj.LoadCallBack(obj);

		} else {
			if (obj.UploadError != null)
				obj.UploadError(fi, evt.target.error);
		}

	}

	FileInfo.prototype.Load = function(completed) {
		this.LoadCallBack = completed;
		if (this.filereader == null || this.filereader == undefined)
			this.filereader = new FileReader();
		var reader = this.filereader;
		reader["tag"] = this;
		reader.onloadend = this.OnLoadData;
		var count = this.Size - this.PageIndex * this.PageSize;
		if (count > this.PageSize)
			count = this.PageSize;
		this.UploadBytes += count;
		var blob = this.File.slice(this.PageIndex * this.PageSize, this.PageIndex
				* this.PageSize + count);

		reader.readAsArrayBuffer(blob);
	};

	FileInfo.prototype.OnUploadData = function(file) {
		var channel = file._channel;
		var url = file._url;
		channel.Send({
			url : url,
			parameters : {
				FileID : file.ID,
				PageIndex : file.PageIndex,
				Pages : file.Pages,
				Base64Data : file.toBase64String()
			}
		}, function(result) {
			if (result.status == null || result.status == undefined) {
				file.PageIndex++;
				if (file.UploadProcess != null)
					file.UploadProcess(file);
				if (file.PageIndex < file.Pages) {
					file.Load(file.OnUploadData);
				}
			} else {

				if (file.UploadError != null)
					file.UploadError(file, data.status);
			}
		});
	}

	FileInfo.prototype.Upload = function(channel, url) {
		var fi = this;
		channel.Send({
			url : url,
			parameters : {
				FileName : fi.FileName,
				Size : fi.Size,
				FileID : fi.ID
			}
		}, function(result) {
			if (result.status == null || result.status == undefined) {
				fi._channel = channel;
				fi._url = result.data;
				fi.Load(fi.OnUploadData);
			} else {
				if (file.UploadError != null)
					file.UploadError(fi, result.status);
			}
		});
	}
	window.leo.FileInfo = FileInfo;	//expose interface
})();

