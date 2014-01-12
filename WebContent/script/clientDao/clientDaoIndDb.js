window.leo = window.leo || {};

// instance is leo.leoDaoIndDb
leo.LeoDaoIndDb = function() {
	var esto = this;
	esto.version = '7';
	esto.testIsLocalStorageSupported = function() {
		var indDb = window.indexedDB || window.webkitIndexedDB
				|| window.mozIndexedDB || window.msIndexedDB;
		return indDb != null;
	}
	esto.isLocalStorageSupported = esto.testIsLocalStorageSupported();

	esto.db = null;
	esto.indexedDB = null;
	esto.getDbConn = function() {
		return esto.db;
	}
	esto.init = function(userNumForDbPostfix) {
		esto.indexedDB = window.indexedDB || window.webkitIndexedDB
				|| window.mozIndexedDB || window.msIndexedDB;
		esto.openDB(userNumForDbPostfix);
	}
	esto.openDB = function(userNumForDbPostfix) {
		var openRequest = indexedDB.open("leoDb" + userNumForDbPostfix, esto.version);
		openRequest.onsuccess = function(e) {
			esto.db = openRequest.result || e.target.result;
		}
		openRequest.onerror = function(event) {
		}
		openRequest.onupgradeneeded = function(e) {
			esto.db = openRequest.result || e.target.result;
			// create tables
			esto.createLeoImMsgTab();
		}
	}
	esto.createLeoImMsgTab = function() {
		if (esto.db.objectStoreNames.contains('leo_im_msg')) {
			esto.db.deleteObjectStore('leo_im_msg'); 
			// db.deleteObjectStore("customers")
		}
		var objectStore = esto.db.createObjectStore("leo_im_msg", {
			// primary key
			keyPath : "id",
			// auto increment
			autoIncrement : true
		});
		objectStore.createIndex("msgUuid", "msgUuid", {
			unique : false
		});
		// 1st parameter is index name, 2nd parameter is column name
		objectStore.createIndex("fromUserNum", "fromUserNum", {
			unique : false
		});
		objectStore.createIndex("toUserNum", "toUserNum", {
			unique : false
		});
		objectStore.createIndex("content", "content", {
			unique : false
		});
		objectStore.createIndex("creationTime", "creationTime", {
			unique : false
		});
		objectStore.createIndex("isRead", "isRead", {
			unique : false
		});
		objectStore.createIndex("from_to", ["fromUserNum", 'toUserNum'], {
			unique : false
		});
		// esto.imgTable = objectStore;
	}

	// util, start
	esto.getByPK = function(storeName, pk, callback) {
		var tx = esto.db.transaction(storeName, 'readwrite');
		var store = tx.objectStore(storeName);
		var request = store.get(pk);
		request.onsuccess = function(e) {
			var entity = e.target.result;
			callback(entity);
		};
	}
	esto.getByUniqueIndex = function(storeName, indName, val, callback) {
		var tx = esto.db.transaction(storeName);
		var store = tx.objectStore(storeName);
		var index = store.index(indName);
		index.get(val).onsuccess = function(e) {
			var entity = e.target.result;
			callback(entity);
		}
	}
	esto.getByIndex = function(storeName, indName, val, callback) {
		var tx = esto.db.transaction(storeName);
		var store = tx.objectStore(storeName);
		var index = store.index(indName);
		var boundKeyRange = IDBKeyRange.only(val);
		var request = index.openCursor(boundKeyRange)
		var rets = [];
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
				var e = cursor.value;
				rets.push(e);
				cursor['continue']();
			} else {
				callback(rets);
			}
		}
	}
	esto.getAll = function(storeName, callback) {
		var transaction = esto.db.transaction(storeName);
		var store = transaction.objectStore(storeName);
		var request = store.openCursor();
		var rets = [];
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
				var e = cursor.value;
				rets.push(e);
				cursor['continue']();
			} else {
				callback(rets);
			}
		};
	}
	esto.deleteAll = function(storeName) {
		var tx = esto.db.transaction(storeName, 'readwrite');
		var store = tx.objectStore(storeName);
		store.clear();
	}
	esto.deleteByPK = function(storeName, pk) {
		var tx = esto.db.transaction(storeName, 'readwrite');
		var store = tx.objectStore(storeName);
		store['delete'](pk);
	}
	// util, end
}
leo.leoDaoIndDb = new leo.LeoDaoIndDb();
leo.leoDao = leo.leoDaoIndDb;
// instance is leo.leoDaoIndDb

// instance: leo.leoImMsgDao
leo.LeoImMsgDao = function() {
	var esto = this;
	esto.fieldMap = { // entity field -> db field
		id : 'id',
		msgUuid : 'msgUuid',
		fromUserNum : 'fromUserNum',
		toUserNum : 'toUserNum',
		content : 'content',
		creationTime : 'creationTime',
		isRead : 'isRead'
	};
	esto.insert = function(entity) {
		try {
			var tx = leo.leoDao.db.transaction([ "leo_im_msg" ], 'readwrite');
			// 通过IDBTransaction得到IDBObjectStore
			var objectStore = tx.objectStore("leo_im_msg");
			objectStore.add(entity);
		} catch (e) {
			alert(e.message);
		}
	}
	esto.query = function(entity) {
		// var transaction = leo.leoDao.db.transaction(["leo_im_msg"]);
		// 通过IDBTransaction得到IDBObjectStore
		// var objectStore = transaction.objectStore("leo_im_msg");
		// 打开游标，遍历customers中所有数据
		leo.leoDao.imgTable.openCursor().onsuccess = function(event) {
			var c = event.target.result;
			if (c) {
				var key = c.key;
				var rowData = c.value;
				c['continue']();
			}
		}
	}
	esto.getHistoricalImMsg = function(entity, callback) {
		//esto.insert({fromUserNum:'6521', toUserNum:'14662'});
		//esto.insert({fromUserNum:'666', toUserNum:'11223344'});
		try {
			var tx = leo.leoDao.db.transaction([ "leo_im_msg" ]);
			// 通过IDBTransaction得到IDBObjectStore
			var objectStore = tx.objectStore("leo_im_msg");
			var boundKeyRange = IDBKeyRange.only(['6521', '14662']);
			var rets = [];
			objectStore.index("from_to").openCursor(boundKeyRange).onsuccess = function(
					event) {
				var cursor = event.target.result;
				if (!cursor) {
					callback(rets);
					return;
				}
				var rowData = cursor.value;
				rets.push(rowData);
				cursor['continue']();
			};
		} catch (e) {
			alert(e.message);
		}
	}
	esto.queryUnreadImMsg = function(entity, callback) {
		// var sql = "select * from leo_im_msg where (fromUserNum=? and
		// toUserNum=? or toUserNum=? and fromUserNum=?) and isRead = '0'";
		var sql = "select * from leo_im_msg where fromUserNum=? and toUserNum=? and isRead = '0' order by id asc";
		leo.leoDao.query(sql, [ entity.fromUserNum, entity.toUserNum ],
				esto.fieldMap, function(entities) {
					callback(entities);
					// for ( var i = 0; i < entities.length; i++) {
					// // alert('hola: ' + entities[i]['id']);
					// }
				});
	}
	esto.updateReadByMsgUuids = function(msgUuids, callback) {

		var sql = "update leo_im_msg set isRead = '1' ";
		if (msgUuids && msgUuids.length > 0) {
			// for ( var i = 0; i < msgUuids.length; i++) {
			// if (i == 0) {
			//
			// }
			// }
			var condition = leo.leoDao.buildDynamicSql(msgUuids);
			sql += ' where msgUuid in ' + condition;
			leo.leoDao.update(sql, msgUuids, callback);
		}
	}
}
leo.leoImMsgDao = new leo.LeoImMsgDao();
