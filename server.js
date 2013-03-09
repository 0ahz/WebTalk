/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * server.js
 * 2012-10-30
 +------------------------------------------------------------------------------
 */

var express      = require('express');
var socketio     = require('socket.io');
var MemoryStore  = require('connect/lib/middleware/session/memory');
var sessionStore = new MemoryStore({ reapInterval:60000 * 10 });
var server       = express.createServer();
var port         = 3000;
/**
 +------------------------------------------------------------------------------
 * Server 配置 //定义共享环境
 +------------------------------------------------------------------------------
 */
server.configure(function () {
    //定义jade为模板引擎
    server.set('view engine', 'jade');
    //定义模板路径
    server.set('views', __dirname + '/views');
    //定义静态文件路径
    server.use(express.static(__dirname + '/public'));
    //处理表单数据
    server.use(express.bodyParser());
    //处理Cookie
    server.use(express.cookieParser());
    //定义session存储
    server.use(express.session({secret:'zhpengle', store:sessionStore}));
    server.use(express.methodOverride());
    server.use(server.router);
    server.use(express.favicon(__dirname + '/public/favicon.ico'));
});

/**
 +------------------------------------------------------------------------------
 * Route 处理GET和POST请求（Controllers）
 +------------------------------------------------------------------------------
 */
var router = require('./router');
router.get(server);
router.post(server);

/**
 +------------------------------------------------------------------------------
 * Socket.io listen server
 +------------------------------------------------------------------------------
 */
var io = socketio.listen(server);
require('./socket')(io, sessionStore);


/**
 +------------------------------------------------------------------------------
 * Server listen port(3000) 可以修改为其他端口
 +------------------------------------------------------------------------------
 */
server.listen(port,showListenInfo);
function showListenInfo(){
    console.log('Server startup. listening on http://localhost:'+port);
    console.log('Welcome to WebTalk!');
}