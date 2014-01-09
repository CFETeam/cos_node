// prototype for sign.js
//
// puterjam
//
var assert = require("assert");
var bUri = require("../lib/bucketUri");

module.exports = {
    testBucketUriParse: function (test) {
        var uri = bUri.parse("test_bucket:/lib/foo.js");
        test.ok(uri.bucket == "test_bucket");
        test.ok(uri.path == "/lib");
        test.ok(uri.file == "foo.js");
        test.ok(uri.href == "/lib/foo.js");

        var uri = bUri.parse("test_bucket:/index.htm");
        test.ok(uri.bucket == "test_bucket");
        test.ok(uri.path == "/");
        test.ok(uri.file == "index.htm");
        test.ok(uri.href == "/index.htm");

        test.done();
    },

    testBucketDir: function(test){
        var uri = bUri.parse("test_bucket:/lib");
        test.ok(uri.path == "/");
        test.ok(uri.file == "lib","这个会被认为是一个叫lib的文件");

        var uri = bUri.parse("test_bucket:/lib/");
        test.ok(uri.path == "/lib");
        test.ok(uri.file == "","如果文件名为空，一般都是可以认为是目录");

        test.done();
    },

    testBucketBadUri: function(test){
        //测试函数异常，如果不抛异常说明逻辑不严谨
    	test.ok(bUri.parse("test_bucket2:index.htm:bad.js")==null,"判断url是否正确解析");

        test.done();
    }
}
