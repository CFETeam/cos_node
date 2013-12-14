/*
cos.js

Copyright (c) 2013

PuterJam

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var request = require('request'),
	fs = require('fs'),
	events = require('events'),
	util = require('util'),
    url = require("url");

var Sign = require('./lib/sign'),
	bucket = require('./lib/api/bucket');

//引入一些通用组件
require("./lib/prototype");

var COS_HOST = "cosapi.myqcloud.com",
	COS_HOST_INNER = "cosapi.tencentyun.com",
	COS_DOWNLOAD_HOST = "cos.myqcloud.com",
	COS_DOWNLOAD_HOST_INNER = "cos.tencentyun.com",

	COS_W_PRIVATE_R_PRIVATE = 0,
	COS_W_PRIVATE_R_PUBLIC = 1,
	// 参数为空
	COS_ERROR_REQUIRED_PARAMETER_EMPTY = 1001,
	// 参数格式错误
	COS_ERROR_REQUIRED_PARAMETER_INVALID = 1002,
	// 返回包格式错误
	COS_ERROR_RESPONSE_DATA_INVALID = 1003,
	// 网络错误
	COS_ERROR_CURL = 1004,

	//cos API
	COS_API = {
		"upload": "/api/cos_upload",
		"compress": "/api/cos_upload_with_compress",
		"file": {
			"getMeta": "/api/cos_get_meta",
			"setMeta": "/api/cos_set_meta",
			"list": "/api/cos_list_file",
			"rename": "/api/cos_rename",
			"del": "/api/cos_delete_file",
			"compress": "/api/cos_compress_file"
		},
		"dir": {
			"mk": "/api/cos_mkdir",
			"rm": "/api/cos_rmdir"
		},
		"bucket": {
			"create": "/api/cos_create_bucket",
			"delete": "/api/cos_delete_bucket",
			"getInfo": "/api/cos_get_bucket",
			"setInfo": "/api/cos_set_bucket",
			"list": "/api/cos_list_bucket"
		},
		"multipart": {
			"upload": "/api/cos_multipart_upload",
			"complete": "/api/cos_complete_multipart_upload"
		}
	};

/**
 * 初始化COS接口
 * @param  {Object} Obj 包含accessId,secretId,secretKey的json数据
 * @type {Class}
 */
var COS = function(Obj) {
		this.accessId = Obj.accessId;
		this.secretId = Obj.secretId;
		this.secretKey = Obj.secretKey;

		this.bucket = this._bucket();
		this.file = this._file();
		this.dir = this._dir();
		this.multipart = this._multipart();

		//返回 Sign对象，可以使用sign.get来获取sign。
		this.sign = new Sign(this.secretKey);

		return true;
	};

//COS对象的prototype设置
COS.prototype = {
	upload: function() {},
	compress: function() {},
	_bucket: function() {
		return {
			create: bucket.create.bind(this),
			list: bucket.list.bind(this),
			del: bucket.delete.bind(this),
			setInfo: bucket.setInfo.bind(this),
			getInfo: bucket.getInfo.bind(this)
		}
	},
	_file: function() {
		return {
			list: (function() {
				return this
			}).bind(this),
			rename: (function() {
				return this
			}).bind(this),
			del: (function() {
				return this
			}).bind(this),
			compress: (function() {
				return this
			}).bind(this),
			setMeta: (function() {
				return this
			}).bind(this),
			getMeta: (function() {
				return this
			}).bind(this)
		}
	},
	_dir: function() {
		return {
			mk: (function() {
				return this
			}).bind(this),
			rm: (function() {
				return this
			}).bind(this)
		}
	},
	_multipart: function() {
		return {
			upload: (function() {
				return this
			}).bind(this),
			complete: (function() {
				return this
			}).bind(this)
		}
	}
};

/**
 * 发起API的请求
 * 
 * @param  {string}   method   默认是get
 * @param  {string}   api      请求的API地址，相对路径
 * @param  {Object}   data     请求的参数
 * @param  {Function} callback 请求完成的回调函数
 */
COS.prototype.request = function(method, api, data, callback) {
	var method = method.toLowerCase() || "get",
        queryString = data,
        uri = url.parse(api,true);

    queryString.accessId = this.accessId;
    queryString.secretId = this.secretId;
    queryString.time = parseInt((new Date()).getTime() / 1000, 10);

    uri.query = queryString;

    //获取请求的token
    var formatUrl = url.format(uri);
	var token = this.sign.get(formatUrl);

    var requestUrl = ["http://" , COS_HOST , formatUrl , "&sign=",token].join("");

    //请求
	request[method](requestUrl, function(error, response, body) {
        callback && callback(error, response, body);
    });
}

module.exports = {
	getContext: function(Obj) {
		return new COS(Obj);
	}
};