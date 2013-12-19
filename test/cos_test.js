// unittest for api/cos.js
//
// puterjam
//
var assert = require("assert");
var Cos = require("../cos");
var url = require("url");


module.exports = {
    setUp: function (callback) {
        this.cosAPP = {
            accessId: "1000353",
            secretId: "AKIDq99rTDnjIJglmwgLqzdttvMpXgpUcd9X",
            secretKey: "Viz6f07qQhWXDPMX8K1ygeITH3qzukPP"
        };

        callback && callback();
    },

    tearDown: function (callback) {
        callback && callback();
    },

    testBestInit: function (test) {
        var cos = new Cos(this.cosAPP);

        test.ok((cos instanceof Cos), "判断cos是否是COS的instance");
        test.done();
    },

    testInit1: function (test) {
        var cos = Cos.getContext(this.cosAPP);

        test.ok((cos instanceof Cos), "判断cos是否是COS的instance");
        test.done();
    },

    testBadInit: function(test){
        test.throws(function(){
            new Cos();
        });

        test.throws(function(){
            new Cos({});
        });

        test.done();
    },

    testGetSign: function(test){
        var cos = Cos.getContext(this.cosAPP);
        var signUrl = url.parse(cos.signUrl("/api/cos_test",{time:'0',hello:"world"}),true);
        test.ok(signUrl.query.sign=='5YQcCuCNg1F5MWkAfufX879LHIU=',"验证签名串是否固定");

        var signUrl = url.parse(cos.signUrl("/api/cos_test"),true);
        test.ok(signUrl.query.sign!='wTn2kc5BqDVnaGSbXwQHAUTnhWY=',"验证签名串是否动态更新");

        test.done();
    }
}