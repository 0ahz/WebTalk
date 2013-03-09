/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * socket.js
 * 2012-11-01
 +------------------------------------------------------------------------------
 */

var parseCookie = require('connect').utils.parseCookie;
var UserSocket 	= require('./common/usersocket');

module.exports = function(io,sessionStore){
	
	//初始化io，主要是设置SESSION
	init(io,sessionStore);
	
	//io监听connection事件，当有socket连接（io.connect）时触发
	io.sockets.on('connection', function(socket){
		var username = socket.handshake.session.username;
		
		var refreshOnline = function(){
			var onlineNames = [];
			for(var name in UserSocket){
				onlineNames.push(name);
			}
			io.sockets.emit('Online', onlineNames);
		}
		
		if(username && username != ''){
			UserSocket[username] = socket;
			UserSocket[username].emit('System','【'+username+'】Welcome WebTalk!');
			for(var i in UserSocket){
				if(UserSocket[i] != socket)
				UserSocket[i].emit('System','<i style="color:green">【'+username+'】上线了！</i>');
			}
		}
		refreshOnline();
		socket.on('Public', function(msg){
            console.log('[Public] '+username+' To All Say: '+msg);
			for(var i in UserSocket){
				if(UserSocket[i] != socket){
					UserSocket[i].emit('Public',username,msg,false);
				}else{
					UserSocket[i].emit('Public',username,msg,true);
				}
			}
		});
		
		socket.on('Private', function(msg,names){
            var s = '';
            for(var n in names){
                s += ','+names[n];
            }
            s = s.substring(1);
            console.log('[Private] '+username+' To '+s+' Say: '+msg);
			names.push(username);
			for(var i in names){
				if(UserSocket[names[i]]){
					if(UserSocket[names[i]] != socket){
						UserSocket[names[i]].emit('Private',username,msg,false);
					}else{
						UserSocket[names[i]].emit('Private',username,msg,true);
					}
				}
			}
		});
		
		socket.on('login',function(username,password){
			var isLogin = false;
			if(is_login(username,password)){
				isLogin = true;
			}
			socket.emit('reLogin',isLogin);
		});
		
		//socket监听disconnect事件，当此socket的断开连接时触发
		socket.on('disconnect', function(){
			delete UserSocket[username];
			for(var i in UserSocket){
				if(username)
				UserSocket[i].emit('System','<i>【'+username+'】下线了！</i>');
			}
			refreshOnline();
		});
		
	});
	
}
function is_login(username,password){
	var is_login = false;
	var users = {};
	users['zhao'] 			= '1234';
	users['qian'] 			= '1234';
	users['sun'] 			= '1234';
	users['li'] 			= '1234';
	
	for(var i in users){
		if(i == username){
			if(password == users[username]){
                return true;
			}
		}
	}
	return false;
}

function init(io,sessionStore){
	//去掉控制台的Debug信息
	io.set('log level',1);
	
	io.set('authorization', function(handshakeData, callback){
	
		//通过客户端的cookie字符串来获取其session数据
		handshakeData.cookie = parseCookie(handshakeData.headers.cookie)
		var connect_sid = handshakeData.cookie['connect.sid'];
		
		if (connect_sid) {
			sessionStore.get(connect_sid, function(error, session){
				if (error) {
					// if we cannot grab a session, turn down the connection
					callback(error.message, false);
				}
				else {
					// save the session data and accept the connection
					handshakeData.session = session;
					callback(null, true);
				}
			});
		}
		else {
			callback('nosession');
		}
	});
}