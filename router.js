/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * router.js
 * 2012-10-31
 +------------------------------------------------------------------------------
 */
 
var index	 = require('./router/index');
var login	 = require('./router/login');
var register = require('./router/register');
var error 	 = require('./router/error');

/**
 +------------------------------------------------------------------------------
 * 处理GET请求
 +------------------------------------------------------------------------------
 */
exports.get = function (server) {

    server.get('/', index.index);
    server.get('/index', index.index);
    server.get('/login', login.index);
    server.get('/logout', login.logout);
    server.get('/register', register.index);

    //以上条件不匹配时，转到下面的错误处理
    server.get('*', error.notfound);
};

/**
 +------------------------------------------------------------------------------
 * 处理POST请求
 +------------------------------------------------------------------------------
 */
exports.post = function (server) {

    server.post('/login', login.login);
    server.post('/register', register.register);

};
