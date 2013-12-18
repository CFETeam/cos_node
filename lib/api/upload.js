/*
 upload.js

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
var bUri = require("../bucketUri");
var fs = require("fs");

/**
 * COS API
 * @type {{upload: string, compress: string}}
 */
var COS_API = {
    "upload": "/api/cos_upload",
    "compress": "/api/cos_upload_with_compress"
};

/**
 *
 * @param file
 * @param opt
 * @param callback
 * @private
 */
var _upload = function (file, opt, callback) {
    fs.createReadStream(file).pipe(this.request("post", COS_API.upload, opt, {
        headers: {
            "content-length": fs.statSync(file).size
        }
    }, function (data) {
        callback && callback(data);
    }));
};

/**
 * 上传组件
 *
 * @param bucketId bucket ID
 * @param file 需要上传的本地文件
 * @param {{[Object]}|{callback:Function}} opt 参数，可以不传
 * @param {[Function]} callback 回调函数
 * @returns {{Uploader}|{null}}
 */
function upload(bucketId, file, opt, callback) {
    //接口的多态处理
    callback = callback || ((typeof opt == "function") ? opt : null);
    opt = ((typeof opt == "function") ? {} : opt) || {};

    if (!bucketId) {
        throw "miss bucket id.";
    }

    //接口的多态处理完成。。。。。。。
    ////判断文件是否存在
    var isFileExists = fs.existsSync(file);

    if (!isFileExists) {
        throw "not exist file."
    }

    var args = [file, initOpt({
        bucketId: bucketId,
        path: "/",
        cosFile: "new_file.js"
    }, opt), callback];

    _upload.apply(this, args);
    return null;
}

/**
 * [Uploader description]
 * @param {String} file 需要上传的本地文件
 * @param {Object} cosObject cos对象
 */
var Uploader = function (file, cosObject) {
    this.local = file;
    this.cosObj = cosObject;
};

/**
 * 上传本地文件
 *
 * @param  {String} bucketUrl bucketUrl URI bucketname:/[dir/]filename.js
 * @param  {Function} callback 回调函数
 */
Uploader.prototype.to = function (bucketUrl, callback) {
    var uri = bUri.parse(bucketUrl);

    var opt = {
        cosFile: uri.file,
        path: uri.path
    };

    upload.call(this.cosObj, uri.bucket, this.local, opt, callback);
};

/**
 * 上传文件
 *
 * @param {String} localFile bucket ID
 */
exports.upload = function (localFile) {
    return new Uploader(localFile, this);
};

/**
 * 不再推荐
 */
//exports.upload = upload;

exports.compress = function () {
};