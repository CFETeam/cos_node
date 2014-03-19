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
var bUri = require("../bucketUri"),
    multipart = require('./multipart');
var fs = require("fs");

/**
 * COS API
 * @type {{upload: string, compress: string}}
 */
var COS_API = {
    "upload": "/api/cos_upload",
    "compressUpload": "/api/cos_upload_with_compress",
    "compress": "/api/cos_compress_file"
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
    }, function (error, data) {
        callback && callback(null, data);
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
        callback(new Error("无效的bucket id."));
        return;
    }

    //接口的多态处理完成。。。。。。。
    ////判断文件是否存在
    var isFileExists = fs.existsSync(file);

    if (!isFileExists) {
        callback(new Error("文件不存在"));
        return;
    }

    var args = [file, initOpt({
        bucketId: bucketId,
        path: "/",
        cosFile: "new_file"
    }, opt), callback];

    _upload.apply(this, args);
    return null;
}

/**
 * 转换线上的文件
 * @param {{[Object]}|{callback:Function}} opt 参数，可以不传
 * @param {[Function]} callback 回调函数
 */
function convert(opt, callback) {
    this.request("POST",COS_API.compress,opt,function (error, data) {
        callback && callback(null, data);
    });
}

/**
 * 上传文件后马上转换文件
 * @param {String} file 需要上传的本地文件路径
 * @param {{[Object]}|{callback:Function}} opt 参数，可以不传
 * @param {[Function]} callback 回调函数
 */
function convertAfterUpload(file,opt,callback){
    ////判断文件是否存在
    var isFileExists = fs.existsSync(file);

    if (!isFileExists) {
        callback(new Error("文件不存在"));
        return;
    }

    fs.createReadStream(file).pipe(this.request("post", COS_API.compressUpload, opt, {
        headers: {
            "content-length": fs.statSync(file).size
        }
    }, function (error, data) {
        //console.log(data);
        callback && callback(null, data);
    }));
}

/**
 * [Uploader description]
 * @param {String} file 需要上传的本地文件
 * @param {Object} cosObject cos对象
 */
var Uploader = function (file, cosObject) {
    this.local = file;
    this.cosObj = cosObject;

    this.convert = null;
};

/**
 * 上传本地文件
 *
 * @param  {String} bucketUrl bucketUrl URI bucketname:/[dir/]filename.js
 * @param  {Function} callback 回调函数
 */
Uploader.prototype.to = function (bucketUrl, callback) {
    if (this.convert) {//如果有压缩的需求，则上传工作转给convert接口完成
        this.convert.local = this.local;
        this.convert.to(bucketUrl, callback);
        return;
    }
    var uri = bUri.parse(bucketUrl);

    var opt = {
        cosFile: uri.file,
        path: uri.path
    };

    upload.call(this.cosObj, uri.bucket, this.local, opt, callback);
};

//绑定上传文件的接口，以convert作为基础类库
['resize', 'compress', 'addtextMask', 'addImageMask', 'crop'].forEach(function (v) {
    Uploader.prototype[v] = function () {
        this.convert = this.convert || new Convert("", this.cosObj);
        this.convert[v].apply(this.convert, arguments);
        return this;
    }
});

var Convert = function (bucketUrl, cosObject) {
    this.srcUri = bUri.parse(bucketUrl);
    this.cosObj = cosObject;
    this.local = null; //是否上传本地文件

    this._opt = {};
};

Convert.prototype.resize = function (width, height, stretch) {
    this._opt.zoomType = !!stretch?3:1; //是否缩放是否拉伸图片，默认是等比缩放
    width && (this._opt.width = width);
    height && (this._opt.height = height);
    //OffsetX
    //OffsetY
    return this;
};

Convert.prototype.crop = function(x, y, width, height){
    this._opt.zoomType = 4; //裁剪
    x && (this._opt.OffsetX = x);
    y && (this._opt.OffsetY = y);

    width && (this._opt.width = width);
    height && (this._opt.height = height);
    return this;
}

Convert.prototype.compress = function () {
    this._opt.compress = 1;
    return this;
};

Convert.prototype.addTextMask = function (text, config) {
    if (!text) {
        return this;
    }

    config = config || {};
    this._opt.WMText = text;

    this._opt = initOpt({
        WMAlign: config.align || 9,
        WMOffsetX: config.x || 0,
        WMOffsetY: config.y || 0,
        WMColor: config.color || "#ff00007f",
        WMFontType: config.font || "仿宋",
        WMFontSize: config.size || 16,
        WMDegree: config.degree || 0
    }, this._opt);

    return this;
};

Convert.prototype.addImageMask = function (bucketUrl, config) {
    if (!bucketUrl) {
        return this;
    }

    config = config || {};
    var uri = bUri.parse(bucketUrl);

    this._opt = initOpt({
        WMImgBucket: uri.bucketId,
        WMImgPath: uri.href,
        WMAlign: config.align || 9,
        WMImgOffsetX: config.x || 0,
        WMImgOffsetY: config.y || 0
    }, this._opt);

    return this;
};

Convert.prototype.to = function (bucketUrl, callback) {
    var dstUri = bUri.parse(bucketUrl);

    if (this.local) { //上传并压缩文件
        var opt = {
          //  uploadBucketId: "",
            compressBucketId: dstUri.bucket,
         //   uploadFilePath: "",
            compressFilePath: dstUri.href
        };
        opt = initOpt(this._opt, opt);

        convertAfterUpload.call(this.cosObj, this.local, opt, callback);
    }else{ //压缩线上文件
        var opt = {
            srcBucketId: this.srcUri.bucket,
            dstBucketId: dstUri.bucket,
            srcFilePath: this.srcUri.href,
            dstFilePath: dstUri.href
        };
        opt = initOpt(this._opt, opt);

        convert.call(this.cosObj, opt, callback);
    }

    // upload.call(this.cosObj, uri.bucket, this.local, opt, callback);
}

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

exports.convert = function (bucketUrl) {
    return new Convert(bucketUrl, this);
};

