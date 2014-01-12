var leo;
if (!leo) {
	leo = {};
}

leo.File = function() {
	var fileWriter;
	this.onNotesLoad = function() {
		return onNotesLoad.apply(window, arguments);
	}
	this.saveNotes = function() {
		return saveNotes.apply(window, arguments);
	}
	function onNotesLoad() {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSComplete,
				fail);
	}
	function onFSComplete(fileSystem) {
		// Load the notes.txt file, create it if it doesn't exist
		fileSystem.root.getFile("testPhoneGapFile.txt", {
			create : true
		}, onFileEntryComplete, fail);
	}
	function onFileEntryComplete(fileEntry) {
		// read the file to preload content
		fileEntry.file(onFileReadComplete, fail);

		// set up the fileWriter
		fileEntry.createWriter(onFileWriterComplete, fail);
	}
	function onFileReadComplete(file) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			// load it into the form
			var form = document.getElementsByTagName('form')[0].elements;
			form.notes.value = evt.target.result;
		};
		reader.readAsText(file);
	}

	function onFileWriterComplete(fileWriterObj) {
		// store the fileWriter in a
		// global variable so we have it
		// when the user presses save
		fileWriter = fileWriterObj;
	}
	function saveNotes() {
		// make sure the fileWriter is set
		if (fileWriter != null) {
			// create an oncomplete write function
			// that will redirect the user
			fileWriter.onwrite = function(evt) {
				alert("Saved successfully");
				$.mobile.changePage("index.html");
			};
			var form = document.getElementsByTagName('form')[0].elements;
			var notes = form.notes.value;
			// save the notes
			fileWriter.write(notes);
		} else {
			alert("There was an error trying to save the file");
		}
		return false;
	}
	function fail(error) {
		alert(error.code);
	}
}
leo.file = new leo.File();