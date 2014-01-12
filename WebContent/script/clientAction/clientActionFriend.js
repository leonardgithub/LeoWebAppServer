window.leo = window.leo || {};

// leo.imFriend
leo.ImFriend = function() { // the first panel at footer
	var esto = this; // ref to this
	esto.DEFAULT_FRIEND_GROUP_ID = '0';
	esto.imMainScroll = null;
	esto.initImMainScroll = function() {
		var scrollObj = new leo.LeoScroll({
			wrapper : 'imMainWra',
			pullDown : 'imMainPullDown',
			thelist : 'imMainList',
			pullUp : 'imMainPullUp',
			pullDownAction : null,
			pullUpAction : null
		});
		esto.imMainScroll = scrollObj;
		scrollObj.init();
	}
	esto.getUnreadImMsgCount = function(titleUserNum) {
		// TODO: it check by html content(i.e. view), it is better to check a
		// model(i.e. data), but some works are needed.
		var id = esto.getImNotifyId(titleUserNum);
		var obj = $('#' + id);
		var old = obj.html();
		var oldCount = 0;
		if (old == "") {
			oldCount = 0;
		} else {
			oldCount = parseInt(old);
		}
		return oldCount;
	}
	this.openChatPage = function(pageUserNum, chatPageTitle) {
		leo.imFriend.openChatPage2.apply(leo.imFriend, arguments);

		//
		var unreadImMsgCount = esto.getUnreadImMsgCount(pageUserNum);
		// if there are any unread msg
		if (unreadImMsgCount !== 0) {
			// msg notification process, begin
			leo.imFriend.clearNotificationOnChatItem(pageUserNum);
			leo.imFriend.notifyOnMain(0 - unreadImMsgCount);
			// msg notification process, end
			// queryUnreadImMsg
			leo.leoImMsgDao.queryUnreadImMsg({
				fromUserNum : pageUserNum,
				toUserNum : leo.leoChannel.num
			}, function(entities) {
				leo.imFriend.addMsgsToChatPage(pageUserNum, entities);
				var msgUuids = [];
				for ( var i = 0; i < entities.length; ++i) {
					msgUuids[i] = entities[i].msgUuid;
				}
				leo.leoImMsgDao.updateReadByMsgUuids(msgUuids);
			});
		}
	}
	esto.getLists = function() {
		var obj = {};
		var str = leo.leoRequestMsg
				.createRequest("leoMainMsg", 'getLists', obj);
		leo.leoChannel.sendMsg(str);
	}
	esto.renderFriendGroup = function(lists) {
		var needRefresh = false;
		var LIST_OBJ = $('#imMainList');
		for ( var i in lists) { // loop the lists
			var LIST = lists[i];
			var toUsers = LIST.toUsers; // users in this list group

			var oneListEle = leo.imFriend.buildOneImList({
				id : leo.imFriend.getImFriendGroupId(i),
				listName : LIST.listName
			});

			// window.setTimeout( function(){
			// var l = $('#im-list' + i).length;
			// alert(l);}, 4000
			// );

			// append it to the page container
			LIST_OBJ.append(oneListEle);

			needRefresh = true;

			if (toUsers != null) {
				// add friend into this group, begin
				for ( var j in toUsers) { // loop the friends
					var user = toUsers[j];
					var displayedName = leo.util.format('%s(%s)',
							user.toUserNumAlias, user.toUser.nickname);
					var oneLi = leo.imFriend.buildOneImItem({
						id : leo.imFriend.getImChatItemId(user.toUserNum),
						className : 'leo_im_list_hidden',
						imFriendGroupName : leo.imFriend.getImFriendGroupId(i),
						userNum : user.toUserNum,
						displayedName : displayedName,
						notifyId : leo.imFriend.getImNotifyId(user.toUserNum),
						imChatLinkId : leo.imFriend
								.getImChatLinkId(user.toUserNum)
					})
					LIST_OBJ.append(oneLi);
				}
				// add friend into this group, end
			}
		}
		if (needRefresh) {
			if (esto.imMainScroll) {
				esto.imMainScroll.doRefresh(true, false);
			} else {
				LIST_OBJ.listview('refresh');
			}
			// $('#main-chat-list').collapsibleset("refresh");
		}
	}
	this.getLatestQqMsg = function(fromUserNum) {
		// get latest msgs
		var obj = {};
		obj.fromUserNum = fromUserNum;
		var str = leo.leoRequestMsg.createRequest("leoMainMsg",
				'getLatestQqMsg', obj);
		leo.leoChannel.sendMsg(str);
	}
	this.getMsgsByUuids = function(msgUuids) {
		if (msgUuids == null) {
			return;
		}
		var obj = {};
		obj.msgUuids = msgUuids;
		var str = leo.leoRequestMsg.createRequest("leoMainMsg",
				'getMsgsByUuids', obj);
		leo.leoChannel.sendMsg(str);
	}

	this.getServerUnreadImMsgs = function() {
		var obj = {};
		var str = leo.leoRequestMsg.createRequest("leoMainMsg",
				'getServerUnreadImMsgs', obj);
		leo.leoChannel.sendMsg(str);
	}

	this.sendQqMsg = function(toUserNum) {
		var id = leo.imFriend.getMainChatInputId(toUserNum);
		var inputObj = $('#' + id);
		var txt = inputObj.val();
		if (txt != '') {
			if (leo.leoChannel.isLogin) {
				var obj = {};
				obj.content = txt;
				obj.fromUserNum = leo.leoChannel.num;
				obj.toUserNum = toUserNum;
				var str = leo.leoRequestMsg.createRequest("leoMainMsg",
						'sendMsg', obj);
				leo.leoChannel.sendMsg(str);
				// leo.imFriend.addMsgsToChatPage(toUserNum, [ obj ]);
				inputObj.val("");
			} else {
				leo.util.alert('请先登录');
				// TODO: alert not login now
			}
		} else {
			leo.util.alert('请输入信息');
			// TODO: alert pls input msg
		}
	}
	this.sendImImage = function(obj, toUserNum) {
		if (obj && obj.files) {
			for ( var i = 0, file; file = obj.files[i]; i++) {
				if (!/image\/\w+/.test(file.type)) {
					return;
				}
				if (1) {
					var opt = {
						type : 'post',
						url : "http://192.168.1.101:8080/LeoWebAppServer/leo/sendImg",
						success : function(e) {
							alert(e);
						},
						// data: $(obj.form).serialize(),
						contentType : "multipart/form-data",
						// data : file,
						error : function() {
							alert('error');
						}
					};
					$('#imgForm' + toUserNum).submit();
					// $.ajax(opt);

					// var xhr = new XMLHttpRequest();
					//
					// xhr
					// .open(
					// "POST",
					// "http://192.168.1.101:8080/LeoWebAppServer/leo/sendImg",
					// true);
					// //
					// //
					// xhr.setRequestHeader("Content-Type","multipart/form-data");
					// xhr.setRequestHeader("Content-Type",
					// "multipart/form-data; boundary=AaB03x");
					// // xhr.setRequestHeader("X_FILENAME", file.name);
					// xhr.send(file);
				} else {
					if (window.FileReader) {
						var fr = new FileReader();
						// fr.readAsBinaryString(file);// ontextmsg 76464
						fr.readAsText(file); // ontextmsg 73679
						// fr.readAsArrayBuffer(file); //onbinarymsg 131072
						fr.onload = function(e) {
							var obj = {};
							obj.toUserNum = toUserNum;
							obj.img = e.target.result;
							var str = leo.leoRequestMsg.createRequest(
									"leoMainMsg", 'sendImg', obj);
							leo.leoChannel.sendMsg(str);
						}
						fr.onerror = function(e) {
							alert('error: ' + e);
						}
					}
				}
			}
		}
	}
	esto.bindImListEvents = function() {
		leo.imFriend.bindImListEvents();
	};
	esto.getUserByCondition = function() {
		if (!esto.searchFriendResultScroll) {
			esto.initSearchFriendResultScroll();
		}
		var gender = $('#im_search_friend_gender').val();
		var obj = {
			'gender' : gender
		};
		var str = leo.leoRequestMsg.createRequest("leoMainMsg",
				'getUserByCondition', obj);
		leo.leoChannel.sendMsg(str);
	};
	// add friend related, begin
	esto.searchFriendResultScroll = null;
	esto.initSearchFriendResultScroll = function() {
		var scrollObj = new leo.LeoScroll({
			// var leoMainScroll = new leo.LeoMainScroll({
			thelist : 'im_search_friend_result_thelist',
			pullDown : 'im_search_friend_result_pullDown',
			pullUp : 'im_search_friend_result_pullUp',
			wrapper : 'im_search_friend_result_wrapper',
			pullDownAction : null,
			pullUpAction : esto.getUserByCondition
		});
		esto.searchFriendResultScroll = scrollObj;
		scrollObj.init();
	}
	esto.toAddFriendNum = "";
	esto.goToAddFri = function(toAddFriendNum) {
		esto.toAddFriendNum = toAddFriendNum;
		leo.imFriend.goToHtmlPage('im_add_friend.html');
	}
	esto.sendAddFriReq = function() {

	}
	esto.sendAddFri = function(msg) {
		var obj = {
			to : esto.toAddFriendNum,
			c : msg
		};
		var str = leo.leoRequestMsg.createRequest("leoMainMsg", 'addFri', obj);
		leo.leoChannel.sendMsg(str);
	}
	// add friend related, end

	// //////////////////////////////////////////////////

	// IM notification, begin
	esto.clearNotificationOnChatItem = function(titleUserNum) {
		var id = this.getImNotifyId(titleUserNum);
		var obj = $('#' + id);
		obj.html("");
	}
	esto.notifyOnChatItem = function(titleUserNum, addedCount) {
		var oldCount = this.getUnreadImMsgCount(titleUserNum);
		if (!addedCount) {
			addedCount = 1;
		}
		var newCount = oldCount + parseInt(addedCount);

		var id = this.getImNotifyId(titleUserNum);
		var obj = $('#' + id);
		obj.html((newCount == 0) ? '' : newCount);
	}
	esto.notifyOnMain = function(count) {
		var old = $('[name=leoMainNotify]').html();
		var oldCount = 0;
		if (old == "") {
			oldCount = 0;
		} else {
			oldCount = parseInt(old);
		}
		if (!count) {
			count = 1;
		}
		var newCount = oldCount + parseInt(count);
		$('[name=leoMainNotify]').html((newCount == 0) ? '' : newCount);
	}
	esto.notifyUserState = function(desc) {
		$('[name=leoUesrState]').html(desc);
	}
	esto.notifyIsLogin = function(desc) {
		$('[name=leoIsLogin]').html(desc);
	}
	// IM notification, end

	esto.appendTo = function(htmlCode, selector) {
		if (false) {
			$(htmlCode).appendTo($(selector));
		} else {
			$(selector).append(htmlCode);
		}
	}
	esto.createLi = function(opt) {
	}
	// ---------for transition begin, -------
	esto.goToJqmPage = function(jqmPageId, htmlName) {
		if (false) {
			// $.mobile.changePage("register.html#leo_register_page" );
			if (htmlName == null || htmlName == '') {
				htmlName = 'index.html';
			}
			if (jqmPageId != null && jqmPageId != '') {
				esto.redirectPage(htmlName + "#" + jqmPageId);
			} else {
				esto.redirectPage(htmlName);
			}
		} else {
			var changePageBtn = document.getElementById("change-page-btn");
			if (changePageBtn) {
				changePageBtn.href = "#" + jqmPageId;
				changePageBtn.click();
			}
		}
	}
	esto.goToHtmlPage = function(htmlPageName) {
		// alert($.mobile.changePage);
		// alert('goToHtmlPage: ' + htmlPageName);
		// var changePageBtn = document.getElementById("change-page-btn");
		// if (changePageBtn) {
		// changePageBtn.href = htmlPageName;
		// alert(changePageBtn.href);
		// changePageBtn.click();
		// }
		// alert('goToHtmlPage end: ' + htmlPageName);
		if (true) {
			var changePageBtn = document.getElementById("change-page-btn");
			if (changePageBtn) {
				changePageBtn.href = htmlPageName;
				changePageBtn.click();
			}
		} else {
			esto.redirectPage(htmlPageName);
		}
	}
	esto.redirectPage = function() {
		$.mobile.changePage.apply($.mobile, arguments);
	}
	// ---------for transition end, -------
	// esto.getMainChatInputText = function(num) {
	// var id = this.getMainChatInputId(num);
	// var text = $("#" + id).val();
	// return text;
	// };
	esto.buildOneImList = function(obj) {
		return leo.util
				.format(
						'<li data-role="list-divider" id="%s" name="leo-im-list">%s<span class="ui-icon ui-icon-plus ui-icon-shadow leo-im-list-icon">&nbsp;</span></li>',
						obj.id, obj.listName);
	};
	esto.buildOneImItem = function(obj) {
		// var s = '<li class="%s" name="%s"><a href="#" imUserNum=""
		// displayedName="" onclick="leo.imFriend.openChatPage(\'%s\',
		// \'%s\')">%s<sup id="%s"></sup></a></li>';
		// return leoCommon.format(s, obj.className, obj.name, obj.userNum,
		// obj.userNum, obj.displayedName,
		// obj.displayedName, obj.displayedName, obj.notifyId);
		// return leo.util.createElementStr('li', {
		// id : obj.id,
		// classname : obj.className,
		// name : obj.name,
		// imusernum : obj.userNum,
		// displayedname : obj.displayedName,
		// innerHTML : '<a href="#">' + obj.displayedName + '<sup id="'
		// + obj.notifyId + '"></sup></a></li>'
		// });
		var s = '<li id="%s" class="%s" imfriendgroupname="%s" imusernum="%s" displayedname="%s"><a href="#" id="%s" imusernum="%s" displayedname="%s"><img src="../img/head.gif"><h3>%s<sup id="%s" class="ui-li-count" style="color:red"></sup></h3><p>个性签名</p></a><a href="#" onclick="return false;">查看信息</a></li>';
		return leo.util.format(s, obj.id, obj.className, obj.imFriendGroupName,
				obj.userNum, obj.displayedName, obj.imChatLinkId, obj.userNum,
				obj.displayedName, obj.displayedName, obj.notifyId);
	}
	esto.buildPlusPanel = function(obj) {
		var b1 = leo.util
				.format(
						'<div class="ui-block-a"><img onclick="%s" src="../img/demoIconInPlusPanel.JPG"><form id="%s" action="192.168.1.101:8080/LeoWebAppServer/leo/sendImg" method="post" enctype="multipart/form-data"><input style="display:none" id="%s" type="file" multiple onchange="leo.imFriend.sendImImage(this, \'%s\')"/></form></div>',
						'$(\'#leo_im_img' + obj.userNum + '\').click();',
						'imgForm' + obj.userNum, 'leo_im_img' + obj.userNum,
						obj.userNum);
		var b2 = '<div class="ui-block-b" onclick=""><img src="../img/demoIconInPlusPanel.JPG"></div>';
		var b3 = '<div class="ui-block-c"><img src="../img/demoIconInPlusPanel.JPG"></div>';

		var s = '<div id="%s" class=%s><div class="ui-grid-d" style="text-align: center;">%s%s%s</div></div>';
		return leo.util.format(s, (obj.id == null ? "" : obj.id),
				(obj.className == null ? "" : obj.className), b1, b2, b3);
	}
	esto.createScroll = function(wrapperId, scrollerId, pullDownId, listId,
			pullUpId) {
		var o = {};
		o.listView = '<ul id="' + listId
				+ '" data-role="listview" style="margin:0px"></ul>';
		o.pullUp = leo.util
				.format(
						'<div id="%s" class="leo_pullUp"><span class="leo_pullUpIcon"></span><span class="pullUpLabel">Pull up to refresh...</span></div>',
						pullUpId);
		o.pullDown = leo.util
				.format(
						'<div id="%s" class="leo_pullDown"><span class="leo_pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span></div>',
						pullDownId);
		o.scroller = leo.util.format(
				'<div id="%s" class="leo_scroller">%s%s%s</div>', scrollerId,
				o.pullDown, o.listView, o.pullUp);
		o.wrapper = leo.util.format(
				'<div id="%s" class="leo_wrapper">%s</div>', wrapperId,
				o.scroller);
		return o.wrapper;
	}

	// open chat page to chat with user of num
	esto.openChatPage2 = function(num, title) {
		var newPageId = this.getMainChatPageId(num);

		// TODO: remove below
		// this.goToJqmPage(newPageId);
		// return;

		var NEW_PAGE_OBJ = document.getElementById(newPageId);
		if (NEW_PAGE_OBJ) {
			leo.util.log('page with id ' + newPageId + ' is already created');
		} else {
			leo.util.log('create page with id ' + newPageId);

			// get IDs, start
			var mainChatListId = this.getMainChatListId(num);
			var mainChatWrapperId = this.getMainChatWrapperId(num);
			var mainChatpPullDownId = this.getMainChatpPullDownId(num);
			var mainChatpPullUpId = this.getMainChatpPullUpId(num);
			im_chat_scroller_id = 'im_chat_scroller' + num;
			// get IDs, end

			var newPageHtmlObj = {};

			newPageHtmlObj.wrapper = esto.createScroll(mainChatWrapperId,
					im_chat_scroller_id, mainChatpPullDownId, mainChatListId,
					mainChatpPullUpId);

			newPageHtmlObj.pageHeader = leo.util
					.format(
							'<div data-role="header" data-position="fixed" data-tap-toggle="false"><h1>%s</h1></div>',
							((title != null) ? title : num));
			newPageHtmlObj.pageContent = '<div data-role="content">'
					+ newPageHtmlObj.wrapper + '</div>';
			var sendBtn = leo.util.buildOneButton({
				onclick : "leo.imFriend.sendQqMsg('" + num + "')",
				innerHTML : '发送'
			});
			var plusBtn = leo.util.buildOneButton({
				onclick : leo.util.format(
						"leo.imFriend.showOrHidePlusPanel('%s', null);", num)
			});

			var plusPanel = esto.buildPlusPanel({
				userNum : num,
				id : 'im_plus_panel' + num,
				className : 'leo_im_plus_hidden'
			});

			// newPageHtmlObj.pageFooter = '<div data-role="footer"
			// data-position="fixed"><textarea id="'
			// + this.getMainChatInputId(num)
			// + '"></textarea><a onclick="leo.imFriend.sendQqMsg(\''
			// + num
			// + '\');return false" href="#" data-role="button">发送</a></div>';
			newPageHtmlObj.pageFooter = leo.util
					.format(
							'<div data-role="footer" data-position="fixed" data-tap-toggle="false"><input id="%s"></input>'
									+ sendBtn + plusBtn + plusPanel + '</div>',
							this.getMainChatInputId(num));
			// newPageHtmlObj.pageFooter = '<div
			// data-role="content">ssss</div>';
			newPageHtmlObj.page = "<div data-role='page' id='" + newPageId
					+ "' data-add-back-btn='true' data-dom-cache='true'>"
					+ newPageHtmlObj.pageHeader + newPageHtmlObj.pageContent
					+ newPageHtmlObj.pageFooter + '</div>';
			// //newPageHtmlObj.page = "<div data-role='page' id='" + newPageId
			// + "' data-add-back-btn='true' data-dom-cache='true'>" +
			// newPageHtmlObj.pageHeader + newPageHtmlObj.pageFooter + '</div>';

			/*
			 * var lxs="<div data-role='page' id='main-chat-page666'
			 * data-add-back-btn='true' data-dom-cache='true'>"; lxs+='<div
			 * data-role="header" data-tap-toggle="false"><h1>tpage!!!!</h1></div><div
			 * data-role="content"><input /></div>'; lxs+='<div
			 * data-role="footer" data-position="fixed"><h1>fffsss!!!!</h1></div></div>'; //
			 * newPageHtmlObj.page = lxs;
			 */

			// append it to the page container
			this.appendTo(newPageHtmlObj.page, '#index-body');
			// $(newPageHtmlObj.page).appendTo($('#index-body'));
			// newPage.trigger('create');

			// do not use pageshow
			$("#" + newPageId).on('pagebeforeshow', function(event) {
				leo.model.setPageShowState(newPageId, true);
			});
			// do not use pagehide
			$("#" + newPageId).on('pagebeforehide', function(event) {// do
				leo.model.setPageShowState(newPageId, false);
			});

			// init scroll style, start
			var leoMainScroll = new leo.LeoMainScroll({
				thelist : mainChatListId,
				pullDown : mainChatpPullDownId,
				pullUp : mainChatpPullUpId,
				wrapper : mainChatWrapperId,
				pullDownAction : null,
				pullUpAction : null
			});
			leoMainScroll.init();
			esto.chatPageScrolls[num] = leoMainScroll;
			// leoMainScroll.doRefresh();

			// getHistoricalImMsg, begin
			leo.leoImMsgDao.getHistoricalImMsg({
				fromUserNum : leo.leoChannel.num,
				toUserNum : num
			}, function(entities) {
				leo.imFriend.addMsgsToChatPage(num, leo.util
						.reverseArray(entities));
			});
			// getHistoricalImMsg, end
		}
		this.goToJqmPage(newPageId); // jqm transition
		if (NEW_PAGE_OBJ) {
			esto.chatPageScrolls[num].scrollToBottom();
		}
		// $.mobile.changePage('#' + newPageId);
		// this.redirectPage('index.html#tpage');
	}
	esto.chatPageScrolls = {};
	esto.addMsgsToChatPage = function(pageUserNum, msgs, needScrollToBottom) {
		var scrollObj = esto.chatPageScrolls[pageUserNum];
		var finalHtml = "";
		for ( var i = 0; i < msgs.length; i++) {
			var msg = msgs[i];
			var s = '<li>' + msg.fromUserNum + " " + msg.creationTime
					+ ':<br/>' + leo.util.buildTextBlock(msg.content) + '</li>';
			finalHtml += s;
		}
		needScrollToBottom = needScrollToBottom || true;
		finalHtml != '' && scrollObj && scrollObj.append(finalHtml), scrollObj
				.doRefresh(true, false),
				(needScrollToBottom === true ? scrollObj.scrollToBottom() : "");
	}

	var plusPanelShowFlags = {};

	esto.showOrHidePlusPanel = function(chatUserNum, flag) {
		if (flag == null) {
			var flag = plusPanelShowFlags[chatUserNum];
			if (flag == '0' || flag == null) {
				// show it
				$('#im_plus_panel' + chatUserNum).removeClass(
						'leo_im_plus_hidden').addClass('leo_im_plus_show');
				plusPanelShowFlags[chatUserNum] = '1';
			} else {
				$('#im_plus_panel' + chatUserNum).removeClass(
						'leo_im_plus_show').addClass('leo_im_plus_hidden');
				// hide it
				plusPanelShowFlags[chatUserNum] = '0';
			}
		} else {

		}
	};
	// ---------IM page, begin
	this.getImNotifyId = function(num) {
		return 'im_notify' + num;
	}
	this.getMainChatInputId = function(num) {
		return 'main-chat-input' + num;
	}
	this.getImFriendGroupId = function(num) {
		return 'im-list' + num;
	}
	this.getImChatItemId = function(num) {
		return 'im_chat_item' + num;
	}
	this.getImChatLinkId = function(num) {
		return 'im_chat_link' + num;
	}
	// ---------IM page, end

	// ---------IM chat page, begin
	this.getMainChatPageId = function(num) {
		return 'main-chat-page' + num;
	}
	this.getMainChatListId = function(num) { // friend list
		return 'main-chat-list' + num;
	}
	this.getMainChatWrapperId = function(num) {
		return 'main-chat-wrapper' + num;
	}
	this.getMainChatpPullDownId = function(num) {
		return 'main-chat-pulldown' + num;
	}
	this.getMainChatpPullUpId = function(num) {
		return 'main-chat-pullup' + num;
	}
	// ---------IM chat page, end

	// this.getMainChatItemId = function(num) { // a friend item
	// return 'main-chat-item' + num;
	// }

	this.bindImListEvents = function() {
		// click im chat item to open chat page, begin
		$(document)
				.on(
						'click',
						'[id^=im_chat_link]',
						function() {
							if (esto
									.getImChatLinkId(this.attributes.imusernum.value) !== this.attributes.id.value) {
								return;
							}
							leo.imFriend.openChatPage(
									this.attributes.imusernum.value,
									this.attributes.displayedname.value);
						});
		// click im chat item to open chat page, end

		// click im chat divider to show/hide im chat item, begin
		var leo_im_list_show_flags = {};
		$(document).on(
				'click',
				'[name=leo-im-list]',
				function() {
					var imFriendItems = $('[imfriendgroupname='
							+ $(this).attr('id') + ']');
					var ch = $(this).children();

					if (leo_im_list_show_flags[this.id] == '0'
							|| leo_im_list_show_flags[this.id] == null) {
						imFriendItems.addClass('leo_im_list_show').removeClass(
								'leo_im_list_hidden');
						ch.removeClass('ui-icon-plus')
								.addClass('ui-icon-minus');
						leo_im_list_show_flags[this.id] = '1';
					} else {
						imFriendItems.addClass('leo_im_list_hidden')
								.removeClass('leo_im_list_show');
						ch.removeClass('ui-icon-minus')
								.addClass('ui-icon-plus');
						leo_im_list_show_flags[this.id] = '0';
					}
				});
		// click im chat divider to show/hide im chat item, end
	}
	esto.agreeAddFriend = function(from) {
		var str = leo.leoRequestMsg.createRequest("imFriend", 'agreeAddFriend',
				{
					fr : from
				});
		leo.leoChannel.sendMsg(str);
	}

	// -------------------callbacks-------------------------
	esto.handlers = new function() {
		var estoHandler = this; // ref to this
		estoHandler.handleGetFriGrp = function(jsonObj) {
			var lists = jsonObj.a.lists;
			esto.renderFriendGroup(lists);
			esto.getServerUnreadImMsgs();
		}
		estoHandler.handleReceiveImMsg = function(jsonObj) {
			var leoQqMsgs = jsonObj.a.leoQqMsgs;
			if (leoQqMsgs) {
				for ( var i = 0; i < leoQqMsgs.length; i++) {
					var leoQqMsg = leoQqMsgs[i];
					var pageUserPageId = leo.imFriend
							.getMainChatPageId(leoQqMsg.fromUserNum);
					var showState = leo.model.isPageShown(pageUserPageId);
					if (showState) { // shown
						leo.imFriend.addMsgsToChatPage(leoQqMsg.fromUserNum,
								[ leoQqMsg ]);
						leoQqMsg.isRead = "1";
					} else { // hidden or uncreated
						leo.imFriend.notifyOnMain(1);
						leo.imFriend.notifyOnChatItem(leoQqMsg.fromUserNum, 1);
						leoQqMsg.isRead = "0";
					}
					leo.leoImMsgDao.insert(leoQqMsg);
				}
			}
		}
		estoHandler.handleGetServerUnreadImMsgs = function(jsonObj) {
			this.handleReceiveImMsg(jsonObj);
		}
		estoHandler.handleLogin = function(jsonObj) {// method
			if (jsonObj.a.loginResult == 0) { // login OK
				// change event handlers of socket
				leo.leoChannel.doAfterLogin();
				leo.leoLogin.canGoToLoginPage = false;
				// transit to main.html
				// TODO: if this login isn't from login page,
				// TODO: then don't go to main.html
				leo.imFriend.goToHtmlPage("main.html");
			} else {
				leo.util.alert(jsonObj.a.loginMsg);
			}
		}
		estoHandler.handleGetLatestImMsg = function(jsonObj) {// method
			var appParams = jsonObj.a;
			if (appParams.msgs != null) {
				var msgs = appParams.msgs;
				leo.imFriend.addMsgsToChatPage(appParams.fromUserNum, msgs);
				// for ( var i = 0; i < msgs.length; i++) {
				// var msg = msgs[i];

				// }
			}
		}
		estoHandler.handleReceiveMyImMsg = function(jsonObj) {
			var leoQqMsgs = jsonObj.a.leoQqMsgs;
			if (leoQqMsgs) {
				for ( var i = 0; i < leoQqMsgs.length; i++) {
					var leoQqMsg = leoQqMsgs[i];
					var pageUserPageId = leo.imFriend
							.getMainChatPageId(leoQqMsg.toUserNum);
					var showState = leo.model.isPageShown(pageUserPageId);
					if (showState) { // shown
						leo.imFriend.addMsgsToChatPage(leoQqMsg.toUserNum,
								[ leoQqMsg ], true);
						leoQqMsg.isRead = "1";
					} else { // hidden or uncreated
						leoQqMsg.isRead = "0";
					}
					leo.leoImMsgDao.insert(leoQqMsg);
					// var id =
					// leo.imFriend.getMainChatInputId(leoQqMsg.toUserNum);
					// $('#' + id).val("");
				}
			}
		}
		estoHandler.handleGetUserByCondition = function(jsonObj) {
			var appParams = jsonObj.a;
			if (appParams.users != null) {
				var scrollObj = leo.imFriend.searchFriendResultScroll;
				var needRefresh = false;
				for ( var i = 0; i < appParams.users.length; i++) {
					var user = appParams.users[i];
					if (user != null) {
						var a = leo.util
								.format(
										'<a href="javascript:void(0)"><img src="../img/head.gif"/><p>%s(%s)</p><p>性别:%s</p></a>',
										user.nickname, user.num, user.gender);
						var addLink = leo.util
								.format(
										'<a href="#" onclick="leo.imFriend.goToAddFri(\'%s\');return false">加好友</a>',
										user.num);
						var li = '<li>' + a + addLink + '</li>';
						scrollObj.append(li);
						needRefresh = true;
					}
				}
				needRefresh && scrollObj.doRefresh();
				// temp method to fix
				$('#' + scrollObj.thelist + ' a').css("overflow", 'inherit');
			}
		}
		estoHandler.handleAddFri = function(jsonObj) {
			var appParams = jsonObj.a;
			var ret = appParams.ret;
			if (ret == '1') {
				leo.util.alert('发送成功', function() {
					$('#leoAddFriMsgBack').click();
				});
				// leo.imFriend.goToHtmlPage('im_search_friend_result.html');
				// $.mobile.changePage('im_search_friend_result.html');
			} else {
				leo.util.alert('发送失败，请重试');
			}
		}
		estoHandler.handleGetAddFriMsg = function(jsonObj) {
			jsonObj.a != null && (o = jsonObj.a.o) != null
					&& leo.leoMsg.addVerMsgs([ o ]);
			var o;
		}
		estoHandler.handleAgreeAddFriend = function(jsonObj) {
			var users;
			leo.util.alert((jsonObj.a.ret == '1' ? "操作成功" : "操作失败"));
			(users = jsonObj.a.users)
					&& addFriendToGroup(users, esto.DEFAULT_FRIEND_GROUP_ID);
		}
		estoHandler.handleAgreeAddFriendForSender = function(jsonObj) {
			var users;
			(users = jsonObj.a.users)
					&& addFriendToGroup(users, esto.DEFAULT_FRIEND_GROUP_ID);
		}

		var checkFriendInGroup = function(userNum, groupId) {
			var obj = $('[id=im_chat_item' + userNum
					+ '][imfriendgroupname=im-list' + groupId + ']');
			return obj.length > 0;
		}

		var addFriendToGroup = function(friends, groupId) {
			var LIST_OBJ = $('#imMainList');
			var needRefresh = false;
			var GROUP_ELE_ID = 'im-list' + groupId;
			for ( var i = 0; i < friends.length; i++) {
				var user = friends[i];
				if (!checkFriendInGroup(user.num, groupId)) {
					var displayedName = leo.util.format('%s(%s)',
							(user.toUserNumAlias ? user.toUserNumAlias : ''),
							user.nickname);
					var oneLi = leo.imFriend.buildOneImItem({
						id : leo.imFriend.getImChatItemId(user.num),
						className : 'leo_im_list_hidden',
						imFriendGroupName : leo.imFriend
								.getImFriendGroupId(groupId),
						userNum : user.num,
						displayedName : displayedName,
						notifyId : leo.imFriend.getImNotifyId(user.num),
						imChatLinkId : leo.imFriend.getImChatLinkId(user.num)
					})
					// TODO: need optimize '#' + GROUP_ID
					$(oneLi).insertAfter('#' + GROUP_ELE_ID);
					// GROUP.parentNode.insertAfter(, GROUP);
					needRefresh = true;
				}
			}
			needRefresh && LIST_OBJ.listview('refresh');
		}
	}// handlers end
};
leo.imFriend = new leo.ImFriend(); // 好友模块action

// register Handler. The leo.action.handlerMap must be created before here
!function() {
	var MAP = {
		receiveMyImMsg : 'handleReceiveMyImMsg',
		getServerUnreadImMsgs : 'handleGetServerUnreadImMsgs',
		receiveImMsg : 'handleReceiveImMsg',
		getLists : 'handleGetFriGrp',
		login : 'handleLogin',
		getLatestQqMsg : 'handleGetLatestImMsg',
		getUserByCondition : 'handleGetUserByCondition',
		addFri : 'handleAddFri',
		getAddFriMsg : 'handleGetAddFriMsg',
		agreeAddFriend : 'handleAgreeAddFriend',
		agreeAddFriendForSender : 'handleAgreeAddFriendForSender'
	}
	leo.action.handlerMap.registerHandler('leoMainMsg', leo.imFriend.handlers,
			MAP);
	leo.action.handlerMap.registerHandler('imFriend', leo.imFriend.handlers,
			MAP);
}();
