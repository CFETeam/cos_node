/*
 sign.js

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

var url = require("url"),
    crypto = require('crypto');

var ret = Object.freeze({
    OK: 0,
    BAD_ACCESS_KEY: -1
});

/**
 * 计算 HMAC-SHA1 加密结果
 * @param  {string} text 需要加密的文本
 * @param  {string} key  用来加密的key
 * @return {string}      返回base64的加密结果
 */
var getHmac = function (text, key) {
    key = key + "";
    var hmac = crypto.createHmac('sha1', key);
    hmac.setEncoding("base64");
    hmac.write(text);
    hmac.end();
    return hmac.read();
};

/**
 * 在encodeURI基础之上增加对*号的处理
 * @param  {string} text 需要编码的文本
 * @return {string}      编码后的结果
 */
var rawUrlEncode = function (text) {
    return encodeURIComponent(text).replace(/\*/g, "%2A");
};

/**
 * 初始化请求签名
 * @param {String} secretKey 设置AccessKey
 * @return {Boolean} 如果没有上面两个参数，则返回初始化失败
 */
var Sign = function (secretKey) {
    //this.accessId = accessId;
    this.secretKey = secretKey;
    this.ret = ret.OK;

    if (!this.secretKey) {
        this.ret = ret.BAD_ACCESS_KEY;
        return false;
    }
    return true;
};

/**
 * 通过url来获取签名
 * @param  {string} uri uri地址
 * @return {string}     返回base64的 HMac_SHA1 加密结果。
 */
Sign.prototype.get = function (uri) {
    var uri = url.parse(uri, true);
    var urlText = uri.pathname?[uri.pathname]:[];

    var queryString = uri.query;

    //计算成当前时间
    queryString.time = queryString.time || parseInt((new Date()).getTime() / 1000, 10);

    //获得所有key，并且进行排序
    Object.keys(queryString).sort().forEach(function (value) {
        //如果存在sign参数就排除
        if (value == "sign") {
            return
        }

        urlText.push(value + "=" + queryString[value]);
    });
    
    //这里进行encodeURI转换，但是这个方法不会转换*号，所以需要手动转换
    var encodeURI = rawUrlEncode(urlText.join("&"));

    var hmac = getHmac(encodeURI, this.secretKey);

    return hmac;
};

/**
 * 返回结果的静态枚举常量
 * @type {Object}
 */
Sign.ret = ret;

//抛出一些需要单元测试的接口
Sign._ = {
    rawUrlEncode: rawUrlEncode
};

module.exports = Sign;