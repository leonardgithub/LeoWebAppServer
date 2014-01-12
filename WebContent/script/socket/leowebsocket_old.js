

/*
 * Copyright (c) 2010 Animesh Kumar  (https://github.com/anismiles)
 * Copyright (c) 2010 Strumsoft  (https://strumsoft.com)
 *  
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *  
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *  
 */
(function() {
	
	// added by Leonard on 20131001 for chrome debug instead of phonegap debug, begin
	if(window.IsLeoPhonegap == null || window.WebSocketFactory == null){
		return;
	}
	// added by Leonard on 20131001 for chrome debug instead of phonegap debug, end
	
	// window object
	var global = window;
	
	// WebSocket Object. All listener methods are cleaned up!
	var WebSocket = global.WebSocket = function(url) {
		// get a new websocket object from factory (check com.strumsoft.websocket.WebSocketFactory.java)
		this.socket = WebSocketFactory.getInstance(url);
		// store in registry
		if(this.socket) {
			WebSocket.store[this.socket.getId()] = this;
		} else {
			throw new Error('Websocket instantiation failed! Address might be wrong.');
		}
	};
	
	// storage to hold websocket object for later invokation of event methods
	WebSocket.store = {};
	
	// static event methods to call event methods on target websocket objects
	WebSocket.onmessage = function (evt) {
		//alert('WebSocket.onmessage');
		WebSocket.store[evt._target]['onmessage'].call(global, evt);
	}	
	
	WebSocket.onopen = function (evt) {
		WebSocket.store[evt._target]['onopen'].call(global, evt);
	}
	
	WebSocket.onclose = function (evt) {
		leo.util.log('onclose');
		WebSocket.store[evt._target]['onclose'].call(global, evt);
	}
	
	WebSocket.onerror = function (evt) {
		leo.util.log('WebSocket.onerror, ' + evt);
	}

	// instance event methods
	WebSocket.prototype.send = function(data) {
		this.socket.send(data);
	}

	WebSocket.prototype.close = function() {
		this.socket.close();
	}
	
	WebSocket.prototype.getReadyState = function() {
		this.socket.getReadyState();
	}
	///////////// Must be overloaded
	WebSocket.prototype.onopen = function(){
		alert('prototype open');
		throw new Error('onopen not implemented.');
    };
    
    // alerts message pushed from server
    WebSocket.prototype.onmessage = function(msg){
		alert('prototype onmessage');
    };
    
    // alerts message pushed from server
    WebSocket.prototype.onerror = function(msg){
		alert('prototype onerror');
    	throw new Error('onerror not implemented.');
    };
    
    // alert close event
    WebSocket.prototype.onclose = function(){
    	leo.util.log('prototype onclose');
        throw new Error('onclose not implemented.');
    };
})();