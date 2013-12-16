// unittest for api/bucket.js
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

		this.testReferer = "*.pjhome.net|*.qq.com|*.paipai.com";
        this.ct = cos.getContext(this.cosAPP);
		callback && callback();
	},
	tearDown: function(callback) {
		this.cosAPP = null;
		callback && callback();
	},
	testBucketCreate: function(test) {
        this.ct.bucket.create(function(body) {
			if (body.code == -25498) {
				test.ok(body.data == null, "bucket已经存在");
			} else {
				test.ok(body.msg == "ok", "bucket正常创建");
			}

			test.done();
		});
	},
	testBucketCreate2: function(test) {
        var ct = this.ct;
        ct.bucket.create("test_bucket", function(body) {
			test.ok(body.msg == "ok", "test_bucket正常创建");

			//测试删除
            ct.bucket.del("test_bucket", function(body) {
				test.ok(body.msg == "ok", "test_bucket正常删除");
				test.done();
			});

		});
	},
	testSetBucketMeta: function(test) {
        var ct = this.ct;
		ct.bucket.setInfo("new_bucket", {
			acl: 0,
			referer: this.testReferer
		}, function(body) {
			test.ok(body.msg == "ok", "设置bucket的信息");
			test.done();
		});
	},

	testGetBucketMeta: function(test) {
        var ct = this.ct;
		var o = this;
		ct.bucket.getInfo("new_bucket", function(body) {
			test.ok(body.msg == "ok", "获取bucket信息");
			test.ok(body.data.referer == o.testReferer.replace(/\|/g, "\n"), "获取bucket的信息正确");
			test.done();
		});
	},

	testDelBucket: function(test) {
        var ct = this.ct;
		ct.bucket.del("new_bucket", function(body) {
			test.ok(body.msg == "ok", "new_bucket正常删除");
			test.done();
		});
	},

	testBucketList: function(test) {
        var ct = this.ct;
		ct.bucket.list(function(body) {
			test.ok(body.msg == "ok", "正常返回");
			test.done();
		});
	},

	testBucketList2: function(test) {
        var ct = this.ct;
		ct.bucket.list({
			count: 1
		}, function(body) {
			test.ok(body.msg == "ok", "正常返回");
			test.ok(body.data.direntlst.length == 1, "只返回一个bucket");
			test.done();
		});
	}
};