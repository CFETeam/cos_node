// unittest for cos.js
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
		callback && callback();
	},
	tearDown: function(callback) {
		this.cosAPP = null;
		callback && callback();
	},
	testCosRequire: function(test) {
		test.ok(typeof cos == "object", '找到了cos对象');
		test.ok(typeof cos.getContext == "function", '找到了cos对象的核心方法');
		test.done();
	},
	testBucketCreate: function(test) {
		var ct = cos.getContext(this.cosAPP);
		ct.bucket.create(function(body) {
			if (body.code == -25498) {
				test.ok(body.data == null, "bucket已经存在");
			} else {
				test.ok(body.msg == "ok", "bucket正常创建");
			}

			test.done();
		});
	},
	testBucketCreate2: function(test) {
		var ct = cos.getContext(this.cosAPP);
		ct.bucket.create("test_bucket", function(body) {
			test.ok(body.msg == "ok", "test_bucket正常创建");

			//测试删除
			ct.bucket.del("test_bucket", function(body) {
				test.ok(body.msg == "ok", "test_bucket正常删除");
				test.done();
			});

		});

	},
	testBucketList: function(test) {
		var ct = cos.getContext(this.cosAPP);
		ct.bucket.list(function(body) {
			test.ok(body.msg == "ok", "正常返回");
			test.done();
		});
	},
	testBucketList2: function(test) {
		var ct = cos.getContext(this.cosAPP);
		ct.bucket.list({
			count: 1
		}, function(body) {
			test.ok(body.msg == "ok", "正常返回");
			test.ok(body.data.direntlst.length == 1, "只返回一个bucket");
			test.done();
		});
	}
};