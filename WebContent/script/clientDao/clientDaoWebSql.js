
window.leo = window.leo || {};

// leo.leoDao
leo.LeoDaoWebSql = function() {
	var esto = this;
	esto.testIsLocalStorageSupported = function() {
		return window.openDatabase != null;
	}
	esto.isLocalStorageSupported = esto.testIsLocalStorageSupported();
	esto.db = null;
	esto.getDbConn = function() {
		return esto.db;
	}
	esto.buildDynamicSql = function(arr) {
		if (arr && arr.length > 0) {
			var str = '';
			for ( var i = 0; i < arr.length; i++) {
				if (i == 0) {
					str += '(?';
				} else {
					str += ',?';
				}
			}
			str += ')';
			return str;
		} else {
			return '()';
		}
	}
	esto.init = function(userNumForDbPostfix) {
		esto.openDB(userNumForDbPostfix);
		// create tables
		esto.createLeoImMsgTab();
	}
	esto.openDB = function(userNumForDbPostfix) {
		esto.db = openDatabase("leoDb" + userNumForDbPostfix, // 鏁版嵁搴撶殑鐭悕瀛�
		"1.0", // 鏁版嵁搴撶殑鐗堟湰
		"Database for leo", // 鏁版嵁搴撶殑闀垮悕瀛�
		1024 * 1024 // 鍏佽鐨勬渶澶у昂瀵革紙瀛楄妭涓哄崟浣嶏級
		);
	}

	esto.createLeoImMsgTab = function() {
		var sql = "CREATE TABLE IF NOT EXISTS leo_im_msg (id INTEGER PRIMARY KEY AUTOINCREMENT, msgUuid TEXT, fromUserNum TEXT, toUserNum TEXT, content TEXT, creationTime DATE, isRead TEXT);";
		esto.db.transaction(function(tx) {
			tx.executeSql(sql, // 瑕佹墽琛岀殑SQL璇彞
			[], // SQL璇彞鐨勫弬鏁板垪琛�
			function() { // 鎴愬姛鐨勫洖璋冨嚱鏁�
				leo.util.log("create table leo_im_msg OK");
				// 鎻掑叆鏍锋湰鏁版嵁
				// record = {
				// note : "浠婂ぉ缁冧簡涓や釜灏忔椂",
				// date : new Date(2012, 2, 1)
				// };
				// insertRecord(db, record);
				// record = {
				// note : "浠婂ぉ閲嶇偣缁冧範浜嗚叞閮�,
				// date : new Date(2012, 2, 4)
				// };
				// insertRecord(db, record);
				// record = {
				// note : "鎵嬭噦缁冨緱濂界柤",
				// date : new Date(2012, 2, 7)
				// };
				// insertRecord(db, record);
				// record = {
				// note : "娲楀畬婢★紝绉颁簡涓�笅锛屽閲嶄簡锛屽懙鍛�,
				// date : new Date(2012, 2, 11)
				// };
				// insertRecord(db, record);
			}, esto.statementErrorCallback // 璇彞鎵ц澶辫触鐨勫洖璋冨嚱鏁�
			);
		}, esto.transactionErrorCallback // 浜嬪姟鍒涘缓澶辫触鐨勫洖璋冨嚱鏁�
		);
	}

	esto.transactionErrorCallback = function(error) {
		alert("Error: " + error.message);
	}

	esto.statementErrorCallback = function(transaction, error) {
		alert("Error: " + error.message);
	}

	esto.logParams = function(params) {
		if (params) {
			var str = "";
			for ( var i = 0; i < params.length; i++) {
				str += "param " + (i + 1) + ": " + params[i] + "\n";
			}
		}
		leo.util.log(str);
	}

	esto.query = function(sql, params, fieldMap, callback) {
		leo.util.log("execute sql: " + sql);
		esto.logParams(params);
		esto.getDbConn().transaction(function(tx) {
			tx.executeSql(sql, params, // SQL璇彞鐨勫弬鏁板垪琛�
			function(tx, rs) {
				var rows = rs.rows;
				var retArr = [];
				for ( var i = 0; i < rows.length; i++) {
					// 姣忔潯璁板綍鏄剧ず涓轰竴涓垪琛ㄩ」
					var obj = {};
					for ( var j in fieldMap) {
						obj[j] = rows.item(i)[fieldMap[j]];
					}
					retArr[retArr.length] = obj;
				}
				leo.util.log("execute sql OK: " + sql);
				leo.util.log("return count: " + retArr.length);
				if (callback) {
					callback(retArr);
				}
			}, function(tx, e) {
				leo.util.log("execute sql failed: " + e.message + ', ' + sql);
			});
		});
	}
	esto.update = function(sql, params, callback) {
		leo.util.log("execute sql: " + sql);
		esto.logParams(params);
		esto.getDbConn().transaction(function(tx) {
			tx.executeSql(sql, params, // SQL璇彞鐨勫弬鏁板垪琛�
			function() {
				leo.util.log("execute sql OK: " + sql);
				if (callback) {
					callback();
				}
			}, function(tx, e) {
				leo.util.log("execute sql failed: " + e.message + ', ' + sql);
			});
		});
	}
}
leo.leoDaoWebSql = new leo.LeoDaoWebSql();
leo.leoDao = leo.leoDaoWebSql;

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
		var sql = "INSERT INTO leo_im_msg (fromUserNum, toUserNum, content, isRead, creationTime, msgUuid) VALUES (?,?,?,?,?,?);"
		leo.leoDao.update(sql, [ entity.fromUserNum, entity.toUserNum,
				entity.content, entity.isRead, entity.creationTime,
				entity.msgUuid ], function() {
		});
	}
	esto.query = function(entity) {
		var sql = "select * from leo_im_msg";
		leo.leoDao.query(sql, [], esto.fieldMap, function(entities) {
			for ( var i = 0; i < entities.length; i++) {
				// alert('hola: ' + entities[i]['id']);
			}
		});
	}
	esto.getHistoricalImMsg = function(entity, callback) {
		var sql = "select * from leo_im_msg where ((fromUserNum=? and toUserNum=?) or (toUserNum=? and fromUserNum=?)) and isRead = '1' order by id desc limit 0,10";
		// var sql = "select * from leo_im_msg where ((toUserNum=? and
		// fromUserNum=? and isRead = '1') or (fromUserNum=? and toUserNum=? and
		// isRead = '1')) order by id desc limit 0,10";
		leo.leoDao
				.query(sql, [ entity.fromUserNum, entity.toUserNum,
						entity.fromUserNum, entity.toUserNum ], esto.fieldMap,
						callback);
		// leo.leoDao.query(sql, [ '11223344', '666', '11223344', '666'],
		// esto.fieldMap, callback);
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

// leo.leoImMsgDao.insert({
// fromUserNum : "11223344",
// toUserNum : "666",
// isRead: "1"
// });
// leo.leoImMsgDao.getHistoricalImMsg({
// fromUserNum : "11223344",
// toUserNum : "666"
// }, function(msgs) {
// for ( var i = 0; i < msgs.length; i++) {
// alert(msgs[i].id);
// }
// });

// -------------setting-----------------
leo.ImSettingDao = function() {
	var esto = this;
}
leo.imSettingDao = new leo.ImSettingDao();