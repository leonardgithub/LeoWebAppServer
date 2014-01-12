window.leo = window.leo || {};
window.leo.action = window.leo.action || {};

/**
 * handler map
 */
leo.action.HandlerMap = function() {

	/**
	 * @actionName: the action name returned from server 
	 * @handlerAction: handler object
	 * @methodMap: a object in which key is method name returned from server,
	 * value is method name of handlerAction
	 */
	this.registerHandler = function(actionName, handlerAction, methodMap) {
		var handlerActionWrapper = {
			handlerAction : handlerAction,
			methodMap : methodMap
		};
		this[actionName] = handlerActionWrapper;
	}
	this.callback = function(msg) {
		if (msg.data == null || msg.data == "" || !/^\{.*\}$/.test(msg.data)) {
			leo.util.log("invalid json: " + msg.data);
			return;
		}
		// parse string to object
		var jsonObj = leo.leoRequestMsg.jsonToObj(msg.data);
		if (jsonObj != null && jsonObj.s != null) {
			var action = jsonObj.s.action;
			var method = jsonObj.s.method;
			leo.util.log("-----decide handler, action: " + action
					+ ", method: " + method + " from server.");
			var handlerActionWrapper = this[action];
			if (handlerActionWrapper) {
				var handlerAction = handlerActionWrapper.handlerAction;
				if (handlerAction) {
					var handlerMethodName = handlerActionWrapper.methodMap[method];
					if (handlerMethodName && handlerAction[handlerMethodName]) {
						leo.util.log("handler method " + handlerMethodName
								+ " is called.");
						handlerAction[handlerMethodName](jsonObj);
					} else {
						leo.util.log("method is null");
					}
				} else {
					leo.util.log("handlerAction is null");
				}
			} else {
				leo.util.log("this[action] is null");
			}
			/*
			 * if (this[action] == null) { leo.util.log("this[action] is null"); }
			 * else if (this[action][method] == null) {
			 * leo.util.log("this[action][method] is null"); } else {
			 * leo.util.log("this[action][method] is called");
			 * this[action][method](jsonObj); }
			 */
		}
	}
};
leo.action.handlerMap = new leo.action.HandlerMap();
