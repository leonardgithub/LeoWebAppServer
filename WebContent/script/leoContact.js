var leoContact = new LeoContact();
function LeoContact() {
	var contactId = "";

	this.onContactsLoad = function() {
		leo.util.bind(document, 'deviceready', onContactsLoad);
	}
	this.onViewLoad = function() {
		leo.util.bind(document, 'deviceready', onViewLoad);
	}
	function onContactsLoad() {
		var fields = [ "id", "displayName", "name" ];
		navigator.contacts.find(fields, showContacts);
	}
	function onViewLoad() {
		// get the contact by the displayName from the URL
		var fields = [ "id", "displayName", "name", "emails", "phoneNumbers" ];
		var options = new ContactFindOptions();
		// options.filter = getParameterByName("id");
		if (options.filter == null || options.filter == "") {
			options.filter = contactId;
		}
		options.filter = "47901";
		navigator.contacts.find(fields, showContact, onError, options);
	}

	function showContact(contacts) {
		if (contacts.length > 0) {
			var contact = contacts[0];
			$("#contact").append(
					"<h2>" + contact.name.givenName + " "
							+ contact.name.familyName + "</h2>");
			if (contact.emails.length > 0) {
				$("#contact").append("<h3>Emails</h3>");
				$("#contact").append("<ul>");
			}
			for ( var i = 0; i < contact.emails.length; i++) {
				$("#contact")
						.append("<li>" + contact.emails[i].value + "</li>");
			}
			if (contact.emails.length > 0) {
				$("#contact").append("</ul>");
			}
			if (contact.phoneNumbers.length > 0) {
				$("#contact").append("<h3>Phone Numbers</h3>");
				$("#contact").append("<ul>");
			}
			for ( var i = 0; i < contact.phoneNumbers.length; i++) {
				$("#contact").append(
						"<li>" + contact.phoneNumbers[i].value + "</li>");
			}
			if (contact.phoneNumbers.length > 0) {
				$("#contact").append("</ul>");
			}
		} else {
			alert("Unable to find contact");
		}
	}
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		alert(leoInit.getCurrentUrl());
		var results = regex.exec(leoInit.getCurrentUrl()); // ////////////////////////////currentUrl
		// is undefined
		alert('results is ' + results);
		if (results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	function showContacts(contacts) {
		var cSort = function(a, b) {
			aName = a.name.givenName;
			bName = b.name.givenName;
			return aName < bName ? -1 : (aName == bName ? 0 : 1);
		};
		contacts = contacts.sort(cSort);
		var dividers = "";

		for ( var i = 0; i < contacts.length; i++) {
			var firstLetter = contacts[i].name.givenName.charAt(0)
					.toUpperCase();
			// check if we need to add a divider
			if (dividers.indexOf(firstLetter) < 0) {
				dividers += firstLetter;
				$("#contactList").append(
						"<li data-role=\"list-divider\">" + firstLetter
								+ "</li>");
			}
			if (contacts[i].name.familyName) {
				var name = contacts[i].name.givenName + " "
						+ contacts[i].name.familyName;
			} else {
				var name = contacts[i].name.givenName;
			}
			var li = '<li><a href="contacts_view.html">' + name + '<br/>'
					+ contacts[i].id + '</a></li>';
			$("#contactList").append(li);
		}
		$("#contactList").listview('refresh');
	}
	function onError(contactError) {
		alert("Error = " + contactError.code);
		return false;
	}
}