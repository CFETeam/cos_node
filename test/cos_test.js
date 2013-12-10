// unittest for cos.js
// 
// puterjam
// 
var assert = require("assert");
var cos = require("../cos");

module.exports = {
	setUp: function(callback) {
		this.cosAPP = {
			accessId: 1000353,
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
	testBucketList: function(test) {
		var ct = cos.getContext(this.cosAPP);
		ct.bucket.list()
		test.done();
	}
};