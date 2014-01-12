window.leo = window.leo || {};

// instance leo.leoMsg
leo.LeoMsg = function() {// the setting panel at footer
	var esto = this;
	esto.msgScroll = null; // main scroll of msg module
	// esto.verMsgScroll = null;
	esto.subMsgScrolls = {}; // sub scrolls of msg module
	esto.msgCntNames = {
		0 : 'leoMsgVerCnt',
		1 : 'leoMsgSugCnt',
		2 : 'leoMsgGrpCnt'
	};
	esto.addMsgCnt = function(addedCnt, flag) {
		if (addedCnt == null || flag == null) {
			return;
		}
		var msgCntName = esto.msgCntNames[flag];
		var msgCntObj = $('[name=' + msgCntName + ']');
		if (msgCntObj.length == 0) {
			return;
		}
		var old = msgCntObj.html();
		var oldCount = 0;
		if (old == "") {
			oldCount = 0;
		} else {
			oldCount = parseInt(old);
		}
		var newCount = oldCount + parseInt(addedCnt);
		msgCntObj.html((newCount == 0) ? '' : newCount);
	}
	esto.initMsgScroll = function() {// msg main scroll
		var scrollObj = new leo.LeoScroll({
			thelist : 'leoMsgThelist',
			pullDown : 'leoMsgPullDown',
			pullUp : 'leoMsgPullUp',
			wrapper : 'leoMsgWrapper',
			pullDownAction : null,
			pullUpAction : null
		});
		esto.msgScroll = scrollObj;
		scrollObj.init();

		var temp = leo.util
				.format(
						'<li><a href="imVerMsg.html"><img src="../img/head.gif"/><h3>验证消息</h3><sup name="%s" class="ui-li-count" style="color:red"></sup></a></li>',
						esto.msgCntNames[0])
		scrollObj.append(temp);
		var temp = leo.util
				.format(
						'<li><a><img src="../img/head.gif"/><h3>好友推荐</h3><sup name="%s" class="ui-li-count" style="color:red"></sup></a></li>',
						esto.msgCntNames[1])
		scrollObj.append(temp);
		var temp = leo.util
				.format(
						'<li><a><img src="../img/head.gif"/><h3>群消息</h3><sup name="%s" class="ui-li-count" style="color:red"></sup></a></li>',
						esto.msgCntNames[2])
		scrollObj.append(temp);
		// scrollObj.doRefresh(true, false);
		// esto.addMsgCnt(-3, 0);
		// esto.addMsgCnt(-2, 1);
		// esto.addMsgCnt(-1, 2);
	}

	// ----------verification msg, begin
	esto.initVerMsgScroll = function() {
		var scrollObj = new leo.LeoScroll({
			wrapper : 'imVerMsgWra',
			pullDown : 'imVerMsgPullDown',
			thelist : 'imVerMsgList',
			pullUp : 'imVerMsgPullUp',
			pullDownAction : null,
			pullUpAction : null
		});
		esto.subMsgScrolls[0] = scrollObj;
		scrollObj.init();
	}
	esto.addVerMsgs = function(msgs) {
		var finalHtml = '';
		for ( var i = 0; i < msgs.length; i++) {
			var msg = msgs[i];
			var agreeBtn = leo.util
					.format(
							'<a href="#" onclick="leo.imFriend.agreeAddFriend(\'%s\');">同意</a>',
							msg.fr);
			var li = leo.util
					.format(
							'<li><a href="#"><img src="../img/head.gif"/><p>%s请求加您为好友</p><p>验证消息:%s</p>%s</a></li>',
							msg.fr, leo.util.textToHtml(msg.ct), agreeBtn);
			finalHtml = li + finalHtml;
		}
		finalHtml != '' && esto.subMsgScrolls[0].prepend(finalHtml),
				esto.subMsgScrolls[0].doRefresh(true, false);
	}
	// ----------verification msg, end
}
// instance leo.leoMsg

