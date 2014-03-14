/*
 bucket.js

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

var initOpt = require("../util").initOpt;

//cos buckect API
var COS_API = {
    "create": "/api/cos_create_bucket",
    "delete": "/api/cos_delete_bucket",
    "list": "/api/cos_list_bucket",
    "getInfo": "/api/cos_get_bucket",
    "setInfo": "/api/cos_set_bucket"
};


//////
/// bucket 接口的实现
var listBucket = function (opt, callback) {
    this.request("get", COS_API.list, opt, function (error,data) {
        callback && callback(error,data);
    });
};

var createBucket = function (opt, callback) {
    this.request("get", COS_API.create, opt, function (error,data) {
        callback && callback(error,data);
    });
};

var deleteBucket = function (opt, callback) {
    this.request("del", COS_API.delete, opt, function (error,data) {
        callback && callback(error,data);
    });
};

var getBucketMeta = function (opt, callback) {
    this.request("get", COS_API.getInfo, opt, function (error,data) {
        callback && callback(error,data);
    });
};

var setBucketMeta = function (opt, callback) {
    opt.referer = opt.referer.replace(/\|/g, "\n"); //支持|分割符号
    this.request("put", COS_API.setInfo, opt, function (error,data) {
        callback && callback(error,data);
    });
};

/////export bucket api
/**
 * 创建一个 bucket
 * @param  {{bucketId: type[]}|{}}   opt      参数, 可以省略
 * @param  {Function} callback 回调函数
 */
exports.create = function (opt, callback) {
    opt = ((typeof opt == "string") ? {
        bucketId: opt
    } : opt) || {};

    var args = [initOpt({
        bucketId: "new_bucket",
        acl: 0,
        //W_PRIVATE_R_PRIVATE=0; W_PRIVATE_R_PUBLIC = 1;默认置0
        referer: ""
    }, opt), callback];

    createBucket.apply(this, args);
};

/**
 * 列出当前accessID下所有bucket列表
 * @param  {[type]}   opt      参数, 可以省略
 * @param  {Function} callback 回调函数
 */
exports.list = function (opt, callback) {
    callback = callback || ((typeof opt == "function") ? opt : null);
    opt = ((typeof opt == "function") ? {} : opt) || {};

    var args = [initOpt({
        offset: 0,
        count: 20,
        prefix: ""
    }, opt), callback];

    listBucket.apply(this, args);
};

/**
 * 删除一个bucket
 * @param  {string}   bucketId bucket的ID
 * @param  {Function} callback 回调函数
 */
exports.delete = function (opt, callback) {
    opt = ((typeof opt == "string") ? {
        bucketId: opt
    } : opt) || {};

    if (!opt.bucketId) {
    	callback(new Error("无效的bucket id."));
        return;
    }
    var args = [initOpt({}, opt), callback];

    deleteBucket.apply(this, args);
};

/**
 * 获取当前bucket的基本信息
 * @param  {string}   bucketId bucket的ID
 * @param  {Function} callback 回调函数
 */
exports.getInfo = function (opt, callback) {
    opt = ((typeof opt == "string") ? {
        bucketId: opt
    } : opt) || {};

    if (!opt.bucketId) {
    	callback(new Error("无效的bucket id."));
        return;
    }

    var args = [initOpt({}, opt), callback];

    getBucketMeta.apply(this, args);
};

/**
 * 设置bucket的信息
 * @param  {string}   bucketId bucket的ID
 * @param  {Object}   opt      设置bucket的参数参数
 * @param  {Function} callback 回调函数
 */
exports.setInfo = function (bucketId, opt, callback) {
    opt = opt || {};

    if (!bucketId) {
    	callback(new Error("无效的bucket id."));
        return;
    }

    var args = [initOpt({
        bucketId: bucketId,
        acl: 0,
        referer: ""
    }, opt), callback];

    setBucketMeta.apply(this, args);
};