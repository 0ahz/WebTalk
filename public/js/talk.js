/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * talk.js
 * 2012-11-04
 +------------------------------------------------------------------------------
 */
var socket;
var names = new Map();
var firstConnect = true;
$(document).ready(function(){
	connect();
	var msg_ta = $('#msg_textarea');
	var index_msg = $("#index_msg");
	msg_ta.focus();
	socket.on('System',function(msg){
		var html = showMsg('left msg_sys','系统消息',msg);
		index_msg.append(html);
		$(document).scrollTop(document.body.clientHeight);
	});
	
	socket.on('Public', function(name,msg,is_self){
		var html = "";
		if(is_self){
			html = showMsg('right',name,msg,'Public');
		}else{
			html = showMsg('left',name,msg,'Public');
		}
		index_msg.append(html);
		refreshHeight();
	});
	
	socket.on('Private', function(name,msg,is_self){
		var html = "";
		if(is_self){
			html = showMsg('right',name,msg,'Private');
		}else{
			html = showMsg('left',name,msg,'Private');
		}
		index_msg.append(html);
		refreshHeight();
	});
	
	socket.on('Online',function(onlineNames){
		var html = '';
		for(var i in onlineNames){
			html += showFriend(onlineNames[i]);
		}
		$("#fList").html(html);
	});
	
	msg_ta.keydown(function(e){
		if(e.keyCode === 13 && e.ctrlKey){
			if(names.isEmpty()){
				sendMsg();
			}else{
				sendPrivateMsg();
			}
			$(this).val("").focus();
			return false;
		}
	});
	
	var document_h = document.documentElement.clientHeight-24;
	var document_w = document.documentElement.clientWidth-90;
	$("#friendList").css('height',document_h+'px');
	$("#fList").css('height',(document_h-24)+'px');
	$("#fOnOff").css('height',(document_h-24)+'px');
	$("#index_main").css('width',document_w+'px');
	
	var isOff = true;
	
	$("#fOnOff").click(function(){	
		if(isOff){
			$("#fList").show(500);
			$("#friendList").animate({
				width:"260px"
			},500);
			$("#index_main").animate({
				width:document_w-210
			},400);
            $("#fOnOff").text('‹');
			isOff = false;
		}else{
			$("#fList").hide(500);
			$("#friendList").animate({
				width:"48px"
			},500);
			$("#index_main").animate({
				width:document_w
			},600);
            $("#fOnOff").text('›');
			isOff = true;
		}
	});
	
	var friend = $('.friend');
	var friendName = $('.friend');
	var msgTt = $('#msg_textarea');
	var to = $('#to');
	friend.each(function(i){
		friend.eq(i).click(function(){
			addName(friendName.eq(i).text());
		});
	});

});

//连接服务器
function connect(){
	if(firstConnect){
		socket = io.connect(null);
		firstConnect = false;
	}else{
		socket.socket.reconnect();
	}
}
//显示消息
function showMsg(lr,name,msg,type){
	var msgType = '';
	if('Private' == type){
		msgType = '【私信】'
	}
	var html = '<div class="msg_'+lr+'">'+
					'<div class="avatar"></div>'+
					'<div class="cont">'+
						'<div class="name">'+msgType+'【'+name+'】说：</div>'+
						'<div>'+msg+'</div>'+
					'</div>'+
					'<div class="clear"></div>'+
				'</div>';
	return html;
}
//发送公共消息
function sendMsg(){
	var msg = $('#msg_textarea').val().trim();
	if(msg != "")
	socket.emit('Public', msg);
}
//发送私有消息
function sendPrivateMsg(){
	var msg = $('#msg_textarea').val().trim();
	if(msg != ""){
		var nameStr = '';
		var arr = names.getValues();
		for(var i in arr){
			nameStr += arr[i]+',';
		}
		socket.emit('Private', msg, arr);	
	}
}
//添加 发送好友
function addName(nameObj){
	var name = $(nameObj).attr('value');
	if(names.isExist(name)){
		return;
	}
	var nameHtml =  '<span class="toName" name="'+name+'" onclick="removeName(this)">@'+name+'</span>';
	$('#to').append(nameHtml);
	names.put(name,name);
}
//移除好友
function removeName(span){
	names.remove($(span).attr('name'));
	$(span).remove();
	$('#msg_textarea').focus();
}
//刷新高度
function refreshHeight(){
	var len = $('.cont:last').text().length;
	if(len > 94){
		var n = parseInt((len-94)/47);
		$('.cont:last').css('height',($('.cont:last').height()+26*n)+'px' );
		n = 0;
	}
	$(document).scrollTop(document.body.clientHeight+2000);	
}

function showFriend(name){
	var html = '<div class="friend" onclick="addName(this)" value="'+name+'">'+
					'<div class="friend_pic"></div>'+
					'<div class="friend_name">'+name+'</div>'+
				'</div>';
	return html;
}
