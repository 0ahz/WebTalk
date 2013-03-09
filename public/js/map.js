/**
 +------------------------------------------------------------------------------
 * Author zhpengle
 +------------------------------------------------------------------------------
 * Map	example map = new Map();
 * 2012-11-25
 +------------------------------------------------------------------------------
**/
function Map(){
	//定义数组对象作为Map对象
	this.objs = new Array();
	//返回Map大小
	this.size = function(){
		return this.objs.length;
	}
	//返回Map是否为空
	this.isEmpty = function(){
		return (this.objs.length < 1);
	}
	//添加{key,value},如果key有重复将会覆盖原来的
	this.put = function(_key,_value){
		this.remove(_key);
		this.objs.push({ key:_key, value:_value });
	}
	//根据key获得value
	this.get = function(_key){
		try{
			var len = this.objs.length;
			for(var i = 0; i < len; i++){
				if(_key == this.objs[i].key){
					return this.objs[i].value;
				}
			}
		}catch(e){
			return null;
		}
		return null;
	}
	//根据key删除{key,value}
	this.remove = function(_key){
		try{
			var len = this.objs.length;
			for(var i = 0; i < len; i++){
				if(_key == this.objs[i].key){
					this.objs.splice(i, 1);
					return true;
				}
			}
		}catch(e){
			return false;
		}
		return false;
	}
	//清空Map
	this.clear = function(){
		this.objs = new Array();
	}
	//根据索引获得的{key,value}
	this.index = function(_index){
		if(_index < 1 || _index >= this.objs.length){
			return null;
		}
		return this.objs[_index];
	}
	//根据key判断map中是否存在该对象
	this.isExist = function(_key){
		try{
			var len = this.objs.length;
			for(var i = 0; i < len; i++){
				if(_key == this.objs[i].key){
					return true;
				}
			}
		}catch(e){
			return false;
		}
		return false;		
	}
	//获得所有的key 返回Array
	this.getKeys = function(){
		var len = this.objs.length;
		var arr = new Array();
		for(var i = 0; i < len; i++){
			arr.push(this.objs[i].key);
		}
		return arr;
	}
	//获得所有的value 返回Array
	this.getValues = function(){
		var len = this.objs.length;
		var arr = new Array();
		for(var i = 0; i < len; i++){
			arr.push(this.objs[i].value);
		}
		return arr;
	}
	
	this.print = function(){
		if(this.isEmpty()){
			return null;
		}
		for(var i in this.objs){
			console.log(this.objs[i]);
		}
		console.log(this.size());
	}
}

//test
var map = new Map();
map.put('a', 'aaaaa');
map.put('b', 'bbbbb');
map.put('c', 'ccccc');
map.put('d', 'ddddd');
map.print();

