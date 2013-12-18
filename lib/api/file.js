/*
 file.js

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

var bUri = require("../bucketUri");
var initOpt = require("../util").initOpt;

//cos file API
var COS_API = {
    "getMeta": "/api/cos_get_meta",
    "setMeta": "/api/cos_set_meta",
    "list": "/api/cos_list_file",
    "rename": "/api/cos_rename",
    "del": "/api/cos_delete_file",
    "compress": "/api/cos_compress_file",
    "mkdir": "/api/cos_mkdir",
    "rmdir": "/api/cos_rmdir"
};

var deleteFile = function (opt, callback) {
    this.request("del", COS_API.del, opt, function (data) {
        callback && callback(data);
    });
};

var list = function (opt, callback) {
    this.request("get", COS_API.list, opt, function (data) {
        callback && callback(data);
    });
};
var rename = function (opt, callback) {
    this.request("post", COS_API.rename, opt, function (data) {
        callback && callback(data);
    });
};

var getMeta = function (opt, callback) {
    this.request("get", COS_API.getMeta, opt, function (data) {
        callback && callback(data);
    });
};

var setMeta = function (opt, callback) {
    this.request("post", COS_API.setMeta, opt, function (data) {
        callback && callback(data);
    });
};

var mkdir = function (opt, callback) {
    this.request("post", COS_API.mkdir, opt, function (data) {
        callback && callback(data);
    });
};

var rmdir = function (opt, callback) {
    this.request("del", COS_API.rmdir, opt, function (data) {
        callback && callback(data);
    });
};

/**
 * 获得文件或目录的信息
 * @param {String} bucketUrl cos的文件路径
 * @param {[Function]} callback  回调函数
 */
exports.getMeta = function (bucketUrl, callback) {
    var uri = bUri.parse(bucketUrl);

    getMeta.call(this, {
        bucketId: uri.bucket,
        path: uri.href
    }, callback);
};

/**
 * 设置目录的属性
 * @param bucketUrl
 * @param opt
 * @param callback
 */
exports.setDirMeta = function (bucketUrl, opt, callback) {
    var uri = bUri.parse(bucketUrl);

    setMeta.call(this, initOpt({
        bucketId: uri.bucket,
        path: uri.href,
        expires: "",
        cacheControl: "",
        contentEncoding: "",
        contentDisposition: "",
        contentLanguage: ""
    }, opt), callback);
};

/**
 * 枚举出具体目录的文件
 *
 * @param bucketUrl
 * @param opt
 * @param callback
 */
exports.list = function (bucketUrl, opt, callback) {
    //接口的多态处理
    callback = callback || ((typeof opt == "function") ? opt : null);
    opt = ((typeof opt == "function") ? {} : opt) || {};

    var uri = bUri.parse(bucketUrl);

    list.call(this, initOpt({
        bucketId: uri.bucket,
        path: uri.href,
        offset: 0,
        count: 100,
        prefix: ""
    }, opt), callback);
};

exports.rename = function (bucketUrl, filename, callback) {
    //TODO 重名接口
};

exports.del = function (bucketUrl, callback) {
    var uri = bUri.parse(bucketUrl);

    deleteFile.call(this, {
        bucketId: uri.bucket,
        path: uri.path,
        deleteObj: uri.file
    }, callback);
};

exports.mkdir = function (bucketUrl, opt, callback) {
    //接口的多态处理
    callback = callback || ((typeof opt == "function") ? opt : null);
    opt = ((typeof opt == "function") ? {} : opt) || {};

    var uri = bUri.parse(bucketUrl);

    mkdir.call(this, initOpt({
        bucketId: uri.bucket,
        path: uri.href,
        mkType: "p",
        expires: "",
        cacheControl: "",
        contentEncoding: "",
        contentDisposition: "",
        contentLanguage: ""
    }, opt), callback);
};

exports.rmdir = function (bucketUrl, callback) {
    var uri = bUri.parse(bucketUrl);

    rmdir.call(this, {
        bucketId: uri.bucket,
        path: uri.href
    }, callback);
};

exports.compress = function () {
    //TODO 压缩数据
};