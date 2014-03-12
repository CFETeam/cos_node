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
    bucket = require('./lib/api/bucket'),
    file = require('./lib/api/file'),
    upload = require('./lib/api/upload'),
    initOpt = require("./lib/util").initOpt;


var COS_HOST = "cosapi.myqcloud.com";
  //COS_HOST_INNER = "cosapi.tencentyun.com"; //用于测试环境测试

var cosToken;

/**
 * 初始化COS接口
 * @param  {Object} Obj 包含accessId,secretId,secretKey的json数据
 * @type {Class}
 */
var COS = function (Obj) {
    if (!Obj || !Obj.accessId || !Obj.secretKey) {
        throw new Error("invalid app access key.");
    }

    this.accessId = Obj.accessId;
    this.secretId = Obj.secretId;
    this.secretKey = Obj.secretKey;

    //返回 Sign对象，可以使用sign.get来获取sign。
    this.signObj = new Sign(this.secretKey);

    return true;
};

//COS对象的prototype设置
COS.prototype = {
    upload: upload.upload,
    convert: upload.convert,

    mkBucket: bucket.create,
    rmBucket: bucket.delete,
    lsBucket: bucket.list,
    getBucketMeta: bucket.getInfo,
    setBucketMeta: bucket.setInfo,

    rename: file.rename,
    ls: file.list,
    del: file.del,
    zip: file.compress,
    mkdir: file.mkdir,
    rmdir: file.rmdir,
    setDirMeta: file.setDirMeta,
    stat: file.getMeta,

    url:file.getDownloadUrl,

    signUrl: function (apiUrl, queryString) {
        var uri = url.parse(apiUrl, true),
            queryString = queryString || {};

        queryString.accessId = this.accessId;
        this.secretId && (queryString.secretId = this.secretId);
        queryString.time = queryString.time || parseInt((new Date()).getTime() / 1000, 10);

        uri.query = initOpt(queryString,uri.query);
        uri.search = ""; //清空search，让uri对象根据query来计算结果

        uri.query.sign = this.signObj.get(url.format(uri));

        return url.format(uri);
    },

    request: function (method, api, queryString, opt, callback) {
        //支持opt和callback的多态
        callback = callback || ((typeof opt == "function") ? opt : null);
        opt = ((typeof opt == "function") ? {} : opt) || {};

        return _requset.call(this, method, api, queryString, opt, callback);
    }
};


/**
 * 发起API的请求
 *
 * @param  {string}   method   默认是get
 * @param  {string}   api      请求的API地址，相对路径
 * @param  {Object}   data     请求的参数
 * @param  {Function} callback 请求完成的回调函数
 * @return {WriteStream} 返回请求的数据WriteStream
 */
var _requset = function (method, api, queryString, opt, callback) {

    var method = method.toLowerCase() || "get",
        uri = this.signUrl(api, queryString),
        opt = opt || {};

    var requestUrl = ["http://", COS_HOST, uri].join("");

    //var requestUrl = ["http://" , COS_HOST , uri.pathname].join("");

    //console.log(api)
    //请求
    return request[method](requestUrl, opt, function (error, response, body) {
        if (!error){
        	try {
                var data = JSON.parse(body);
            } catch (e) {
                error = new Error("返回无效的json数据格式"+body);
            }
            callback && callback(error,data);
        }else{
        	callback(error);
        }
    });
}

/**
 * 获取 cos 操作对象
 * @param Obj
 * @returns {COS}
 */
COS.getContext = function (Obj) {
    return new COS(Obj);
}


module.exports = COS;
