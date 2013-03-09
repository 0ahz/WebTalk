/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * login_model.js
 * 2012-11-02
 +------------------------------------------------------------------------------
 */
var db = require('../config/db.js');
var Client = require('mysql').Client;
var UserInfo = require('../common/userinfo');

var client = new Client();
client.user = db.USERNAME;
client.password = db.PASSWORD;

//client.connect();//自动连接
client.query('USE '+db.DB_NAME);

module.exports = function(){
client.query('SELECT * FROM test',function selectCb(error, results){
		if(error){
			console.log('数据库连接失败...');
		}else{
			if(results.length>0){
				UserInfo = results;
				console.log(UserInfo);
			}
		}
		client.end();
	});
}



