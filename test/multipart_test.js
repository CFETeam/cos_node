// unittest for api/multipart.js
//
// puterjam
//
var assert = require("assert");
var cos = require("../cos");

module.exports = {
    setUp: function(callback) {
        this.cosAPP = {
            accessId: "1000353",
            secretId: "AKIDq99rTDnjIJglmwgLqzdttvMpXgpUcd9X",
            secretKey: "Viz6f07qQhWXDPMX8K1ygeITH3qzukPP"
        };
        this.ct = cos.getContext(this.cosAPP);
        callback && callback();
    },
    tearDown: function(callback) {
        this.cosAPP = null;
        callback && callback();
    },
    testMultipartUpload: function(test){
        test.done();
    }
}