window.leo = window.leo || {};

leo.LeoScroll = function(paramObj) {
	var esto = this;
	if (!paramObj) {
		paramObj = {};
	}
	esto.thelist = (paramObj.thelist == null || paramObj.thelist == "") ? 'thelist'
			: paramObj.thelist;
	esto.pullDown = (paramObj.pullDown == null || paramObj.pullDown == "") ? 'pullDown'
			: paramObj.pullDown;
	esto.pullUp = (paramObj.pullUp == null || paramObj.pullUp == "") ? 'pullUp'
			: paramObj.pullUp;
	esto.wrapper = (paramObj.wrapper == null || paramObj.wrapper == "") ? 'wrapper'
			: paramObj.wrapper;

	esto.thelistObj = $("#" + esto.thelist);
	esto.pullDownObj = $("#" + esto.pullDown);
	esto.pullUpObj = $("#" + esto.pullUp);

	// var myScroll;
	var pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;

	if (paramObj.pullDownAction != null) {
		esto.pullDownAction = function() {
			setTimeout(function() {
				paramObj.pullDownAction();
				// esto.doRefresh();
			}, 500);
		};
	} else {
		esto.pullDownAction = null;
	}

	if (paramObj.pullUpAction != null) {
		esto.pullUpAction = function() {
			setTimeout(function() {
				paramObj.pullUpAction();
				// esto.doRefresh();
			}, 500);
		};
	} else {
		esto.pullUpAction = null;
	}

	esto.loaded = function() {
		pullDownEl = document.getElementById(esto.pullDown);
		pullDownOffset = pullDownEl.offsetHeight; // affected by height:xxxpx
		pullUpEl = document.getElementById(esto.pullUp);
		pullUpOffset = pullUpEl.offsetHeight; // affected by height:xxxpx
		esto.myScroll = new iScroll(
				esto.wrapper,
				{
					useTransition : true,
					topOffset : pullDownOffset,
					vScrollbar : false, // remove vertical Scrollbar
					hScrollbar : false, // remove horizontal Scrollbar
					onRefresh : function() {// called from refresh function
						leo.util.log(esto.wrapper +' scroll onRefresh!');
						if (pullDownEl.className.match('loading')) {
							// pullDownEl.className = '';
							esto.pullDownObj.removeClass('loading');
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
						} else if (pullUpEl.className.match('loading')) {
							// pullUpEl.className = '';
							esto.pullUpObj.removeClass('loading');
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
						}
					},
					// override default onBeforeScrollStart
					onBeforeScrollStart : function(e) {
						var target = e.target;
						while (target.nodeType != 1)
							target = target.parentNode;
						if (target != null) {
							if (target.tagName != 'SELECT'
									&& target.tagName != 'INPUT'
									&& target.tagName != 'TEXTAREA'
									&& target.tagName != 'BUTTON') {
								e.preventDefault();
							}
						}
					},
					onScrollMove : function() {
						var TRIGGER_HEIGHT = 5;
						var log = leo.util
								.format(
										'scroll onScrollMove! this.y:%s, this.minScrollY:%s, this.maxScrollY:%s, pullDownEl.className:%s, pullUpEl.className:%s,',
										this.y, this.minScrollY,
										this.maxScrollY, pullDownEl.className,
										pullUpEl.className);
						// e.g. min 0, max: -29
						leo.util.log(log);
						/*
						 * class has flip means need more push down/up for
						 * refresh. minScrollY and maxScrollY is assigned in
						 * refresh function(iscroll.js line 920).
						 */
						if (this.y > TRIGGER_HEIGHT
								&& !pullDownEl.className.match('flip')) {
							leo.util.log('--can release to refresh top part');
							// pullDownEl.className = 'flip';
							esto.pullDownObj.addClass('flip');
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
							this.minScrollY = 0;
						} else if (this.y < TRIGGER_HEIGHT
								&& pullDownEl.className.match('flip')) {
							leo.util
									.log('--need more push down to refresh top part');
							// pullDownEl.className = '';
							esto.pullDownObj.removeClass('flip');
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
							this.minScrollY = -pullDownOffset;
						} else if (this.y < (this.maxScrollY - TRIGGER_HEIGHT)
								&& !pullUpEl.className.match('flip')) {
							leo.util
									.log('--can release to refresh bottom part');
							// pullUpEl.className = 'flip';
							esto.pullUpObj.addClass('flip');
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
							this.maxScrollY = this.maxScrollY;
						} else if (this.y > (this.maxScrollY + TRIGGER_HEIGHT)
								&& pullUpEl.className.match('flip')) {
							leo.util
									.log('--need more push up to refresh bottom part');
							// pullUpEl.className = '';
							esto.pullUpObj.removeClass('flip');
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
							this.maxScrollY = pullUpOffset;
						}
					},
					onScrollEnd : function() {
						leo.util.log('scroll onScrollEnd, pullDownEl: '
								+ pullDownEl.className + ', pullUpEl: '
								+ pullUpEl.className);
						if (pullDownEl.className.match('flip')) {
							// pullDownEl.className = 'loading';
							esto.pullDownObj.removeClass('flip').addClass(
									'loading');
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
							if (esto.pullDownAction) {
								esto.pullDownAction();
							} else {
								esto.doRefresh(false, true);
							}
						} else if (pullUpEl.className.match('flip')) {
							esto.pullUpObj.removeClass('flip').addClass(
									'loading');
							// pullUpEl.className = 'loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
							if (esto.pullUpAction) {
								esto.pullUpAction();
							} else {
								esto.doRefresh(false, true);
							}
						}
					}
				});

		// setTimeout(function() {
		// commented by leo
		// document.getElementById(esto.wrapper).style.left = '0';
		// }, 800);
	};

	esto.scrollToTop = function() {
		// var item = esto.wrapper;
		// var e = document.getElementById(item);
		// e.scrollTop = 0;
	}

	// 让滚动条滚到底部
	esto.scrollToBottom = function() {
		if (1) {
			var item = esto.wrapper;
			var e = document.getElementById(item);
//			$('#'+item).scrollTop(e.scrollHeight);
			e.scrollTop = e.scrollHeight;	//original
//			e.scrollTop = pullUpEl.offsetTop;
			//e.scrollHeight = e.offsetHeight;
			//e.scrollTop = e.offsetHeight;
		} else {
//			esto.myScroll.scrollTo(0, esto.myScroll.maxScrollY, 0);
			var top = 10;
			var h = 1000;
			alert(top + ', ' + h);
			setTimeout(function(){
				esto.myScroll.scrollTo(top, h, 0);
			}, 1000);
//			esto.myScroll.scrollToId(esto.pullDown);
		}
	}

	esto.init = function() {
		esto.loaded();
	}
	esto.doRefresh = function(refreshListview, refreshScroll) {
		if (refreshListview == null) {
			refreshListview = true;
		}
		if (refreshScroll == null) {
			refreshScroll = true;
		}
		// refresh listview first, and then myScroll
		// note: do not setTimeout to refresh
		refreshListview && esto.thelistObj.listview('refresh');
		refreshScroll && esto.myScroll && esto.myScroll.refresh();
	};
	esto.append = function(html) {
		esto.thelistObj.append(html);
	};
	esto.prepend = function(html) {
		esto.thelistObj.prepend(html);
	};
	esto.clear = function() {
		esto.thelistObj.html('');
	};
}

leo.LeoMainScroll = leo.LeoScroll;

// deprecated
/*
 * leo.LeoMainScroll = function(paramObj) { var esto = this; var esto = this;
 * 
 * paramObj = paramObj || {};
 * 
 * esto.thelist = (paramObj.thelist == null || paramObj.thelist == "") ?
 * 'thelist' : paramObj.thelist; esto.pullDown = (paramObj.pullDown == null ||
 * paramObj.pullDown == "") ? 'pullDown' : paramObj.pullDown; esto.pullUp =
 * (paramObj.pullUp == null || paramObj.pullUp == "") ? 'pullUp' :
 * paramObj.pullUp; esto.wrapper = (paramObj.wrapper == null || paramObj.wrapper ==
 * "") ? 'wrapper' : paramObj.wrapper; // var myScroll; var pullDownEl,
 * pullDownOffset, pullUpEl, pullUpOffset; esto.generatedCount = 0;
 * 
 * if (paramObj.pullDownAction != null) { esto.pullDownAction =
 * paramObj.pullDownAction; } else { esto.pullDownAction = function() {
 * setTimeout(function() { // <-- Simulate network congestion, remove //
 * setTimeout from production! }, 1000); // <-- Simulate network congestion,
 * remove setTimeout // from // production! } }
 * 
 * if (paramObj.pullUpAction != null) { esto.pullUpAction =
 * paramObj.pullUpAction; } else { esto.pullUpAction = function() {
 * setTimeout(function() { // <-- Simulate network congestion, remove //
 * setTimeout from production! var el, li, i; el =
 * document.getElementById(esto.thelist);
 * 
 * for (i = 0; i < 2; i++) { li = document.createElement('li'); // li.innerText =
 * 'Generated row ' + (++generatedCount); li.innerHTML = '<a
 * href="contacts_view.html">Generated row' + (++esto.generatedCount) + '</a>';
 * el.appendChild(li, el.childNodes[0]); }
 * 
 * esto.myScroll.refresh(); // Remember to refresh when contents // are //
 * loaded // (ie: on ajax completion) $('#' + esto.thelist).listview('refresh'); //
 * jqm refresh }, 1000); // <-- Simulate network congestion, remove setTimeout //
 * from // production! } }
 * 
 * esto.loaded = function() { pullDownEl =
 * document.getElementById(esto.pullDown); pullDownOffset =
 * pullDownEl.offsetHeight; pullUpEl = document.getElementById(esto.pullUp);
 * pullUpOffset = pullUpEl.offsetHeight;
 * 
 * esto.myScroll = new iScroll( esto.wrapper, { useTransition : true, topOffset :
 * pullDownOffset, onRefresh : function() { leo.util.log('scroll onRefresh'); if
 * (pullDownEl.className.match('loading')) { pullDownEl.className = '';
 * pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to
 * refresh...'; } else if (pullUpEl.className.match('loading')) {
 * pullUpEl.className = ''; pullUpEl.querySelector('.pullUpLabel').innerHTML =
 * 'Pull up to load more...'; } }, onScrollMove : function() {
 * leo.util.log('scroll onScrollMove'); if (this.y > 5 &&
 * !pullDownEl.className.match('flip')) { leo.util.log('scroll onScrollMove
 * branch 1'); pullDownEl.className = 'flip';
 * pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to
 * refresh...'; this.minScrollY = 0; } else if (this.y < 5 &&
 * pullDownEl.className.match('flip')) { leo.util.log('scroll onScrollMove
 * branch 2'); pullDownEl.className = '';
 * pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to
 * refresh...'; this.minScrollY = -pullDownOffset; } else if (this.y <
 * (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
 * leo.util.log('scroll onScrollMove branch 3'); pullUpEl.className = 'flip';
 * pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
 * this.maxScrollY = this.maxScrollY; } else if (this.y > (this.maxScrollY + 5) &&
 * pullUpEl.className.match('flip')) { leo.util.log('scroll onScrollMove branch
 * 4'); pullUpEl.className = '';
 * pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
 * this.maxScrollY = pullUpOffset; } }, onScrollEnd : function() {
 * leo.util.log('scroll onScrollEnd'); if (pullDownEl.className.match('flip')) {
 * pullDownEl.className = 'loading';
 * pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
 * esto.pullDownAction(); // Execute custom function // (ajax // call?) } else
 * if (pullUpEl.className.match('flip')) { pullUpEl.className = 'loading';
 * pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
 * esto.pullUpAction(); // Execute custom function // (ajax // call?) } } });
 * setTimeout(function() { document.getElementById(esto.wrapper).style.left =
 * '0'; }, 800); }
 * 
 * this.init = function() { setTimeout(esto.loaded, 200); }
 * 
 * this.doRefresh = function() { // added by leonard on 2013-11-16
 * setTimeout(function() { esto.myScroll.refresh(); }, 800); } }
 */
