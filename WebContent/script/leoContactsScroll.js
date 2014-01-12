
function LeoContactsScroll(paramObj) {
	if (!paramObj) {
		paramObj = {};
	}
	var thelist = (paramObj.thelist == null || paramObj.thelist == "") ? 'thelist'
			: paramObj.thelist;
	var pullDown = (paramObj.pullDown == null || paramObj.pullDown == "") ? 'pullDown'
			: paramObj.pullDown;
	var pullUp = (paramObj.pullUp == null || paramObj.pullUp == "") ? 'pullUp'
			: paramObj.pullUp;
	var wrapper = (paramObj.wrapper == null || paramObj.wrapper == "") ? 'wrapper'
			: paramObj.wrapper;

	var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 0;

	function pullDownAction() {
		setTimeout(function() { // <-- Simulate network congestion, remove
								// setTimeout from production!
			var el, li, i;
			el = document.getElementById(thelist);

			for (i = 0; i < 3; i++) {
				li = document.createElement('li');
				// li.innerText = 'Generated row ' + (++generatedCount);
				li.innerHTML = '<a href="contacts_view.html">Generated row'
						+ (++generatedCount) + '</a>';
				el.insertBefore(li, el.childNodes[0]);
			}

			myScroll.refresh(); // Remember to refresh when contents are loaded
								// (ie: on ajax completion)
			$('#' + thelist).listview('refresh'); // jqm refresh
		}, 1000); // <-- Simulate network congestion, remove setTimeout from
					// production!
	}

	function pullUpAction() {
		setTimeout(function() { // <-- Simulate network congestion, remove
								// setTimeout from production!
			var el, li, i;
			el = document.getElementById(thelist);

			for (i = 0; i < 3; i++) {
				li = document.createElement('li');
				// li.innerText = 'Generated row ' + (++generatedCount);
				li.innerHTML = '<a href="contacts_view.html">Generated row'
						+ (++generatedCount) + '</a>';
				el.appendChild(li, el.childNodes[0]);
			}

			myScroll.refresh(); // Remember to refresh when contents are loaded
								// (ie: on ajax completion)
			$('#' + thelist).listview('refresh'); // jqm refresh
		}, 1000); // <-- Simulate network congestion, remove setTimeout from
					// production!
	}

	function loaded() {
		pullDownEl = document.getElementById(pullDown);
		pullDownOffset = pullDownEl.offsetHeight;
		pullUpEl = document.getElementById(pullUp);
		pullUpOffset = pullUpEl.offsetHeight;

		myScroll = new iScroll(
				wrapper,
				{
					useTransition : true,
					topOffset : pullDownOffset,
					onRefresh : function() {
						leo.util.log('scroll onRefresh');
						if (pullDownEl.className.match('loading')) {
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
						} else if (pullUpEl.className.match('loading')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
						}
					},
					onScrollMove : function() {
						leo.util.log('scroll onScrollMove');
						if (this.y > 5 && !pullDownEl.className.match('flip')) {
							pullDownEl.className = 'flip';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
							this.minScrollY = 0;
						} else if (this.y < 5
								&& pullDownEl.className.match('flip')) {
							pullDownEl.className = '';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
							this.minScrollY = -pullDownOffset;
						} else if (this.y < (this.maxScrollY - 5)
								&& !pullUpEl.className.match('flip')) {
							pullUpEl.className = 'flip';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
							this.maxScrollY = this.maxScrollY;
						} else if (this.y > (this.maxScrollY + 5)
								&& pullUpEl.className.match('flip')) {
							pullUpEl.className = '';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
							this.maxScrollY = pullUpOffset;
						}
					},
					onScrollEnd : function() {
						leo.util.log('scroll onScrollEnd');
						if (pullDownEl.className.match('flip')) {
							pullDownEl.className = 'loading';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
							pullDownAction(); // Execute custom function (ajax
												// call?)
						} else if (pullUpEl.className.match('flip')) {
							pullUpEl.className = 'loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
							pullUpAction(); // Execute custom function (ajax
											// call?)
						}
					}
				});

		setTimeout(function() {
			document.getElementById(wrapper).style.left = '0';
		}, 800);
	}

	this.init = function() {
		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);
		// document.addEventListener('DOMContentLoaded', function ()
		// {alert('DOMContentLoaded ready'); setTimeout(loaded, 200); }, false);
		setTimeout(loaded, 200);
	}
}