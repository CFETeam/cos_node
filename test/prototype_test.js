// prototype for sign.js
//
// puterjam
//
var assert = require("assert");
var Sign = require("../lib/prototype");

module.exports = {
    testPrototypeApi: function(test) {
        var foo = {},
            def = {
                "hello": 1
            };
        test.ok( !! foo.init, "找到default扩展");
        test.ok(!foo.hello, "没初始化的参数");

        foo.init(def);
        test.ok(foo["hello"] == 1, "给对象的参数初始化");

        var foo2 = {
            "hello": 2
        };
        foo2.init(def);
        test.ok(foo2["hello"] != 1, "测试默认参数不能覆盖已经被复制的参数");

        test.done();
    }
}