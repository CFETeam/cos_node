// unittest for sign.js
// 
// puterjam
// 
var assert = require("assert");
var Sign = require("../lib/sign");

module.exports = {
    setUp: function (callback) {
        this.cosAPP = {
            accessId: "1000353",
            secretId: "AKIDq99rTDnjIJglmwgLqzdttvMpXgpUcd9X",
            secretKey: "Viz6f07qQhWXDPMX8K1ygeITH3qzukPP"
        };
        this.sign = new Sign(this.cosAPP.secretKey);

        this.testURL = 'http://cosapi.myqcloud.com/api/cos_create_bucket?accessId=1000353&bucketId=abc&acl=0&time=1361431471&sign=XNibuRA%2FLx3vjq1FFiv4AqzygOA%3D';

        callback && callback();
    },
    tearDown: function (callback) {
        this.cosAPP = null;
        this.sign = null;
        callback && callback();
    },

    //测试Sign 对象初始化的状态
    testSignInit: function (test) {
        var _sign = new Sign();
        test.ok(_sign.ret === Sign.ret.BAD_ACCESS_KEY, "测试如果new Sign 空参数的结果");
        test.done();
    },
    //测试测试url的返回结果
    testSign: function (test) {
        test.ok("5fQLjYOPhNyrCZkESIqLhEYFwLM=" == this.sign.get(this.testURL), "测试固定url的结果");
        test.done();
    },

    testRawUrlEncode: function (test) {
        test.ok(Sign._.rawUrlEncode("-_.") == "-_.", "测试不需要转换的-_.");
        test.ok(Sign._.rawUrlEncode("*") == "%2A", "测试*号是否转换成%2A");
        test.done();
    }
};