/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * login.js
 * 2012-10-30
 +------------------------------------------------------------------------------
 */

$(document).ready(function(){

	$("#submit").click(function(){
		sendLogin();
		return false;
	});
	$("#p").keypress(function(e){
		if (e.keyCode === 13) {
			sendLogin();
			return false;
		}
	});
});

var socket;
var firstConnect = true;

function connect(){
	if(firstConnect){
		socket = io.connect(null);
		firstConnect = false;
	}else{
		socket.socket.reconnect();
	}
}

function sendLogin(){
	var u = $("#u").val().trim();
	var p = $("#p").val().trim();
	if(u == '' || p == ''){
		$("#e").slideUp('fast');
		$("#w").text('用户名或密码不能为空！').slideDown();
		setTimeout(function(){$("#w").slideUp()},3000);
	}else{
		connect();
		socket.emit('login',u,p);
		socket.on('reLogin',function(isLogin){
			if(isLogin){
				$("#form").submit();
			}else{
				$("#w").slideUp('fast');
				$("#e").text('用户名或密码错误！').slideDown();
				setTimeout(function(){$("#e").slideUp()},3000);
			}
		});
	}
}


