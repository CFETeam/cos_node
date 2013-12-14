/*
bucket.js

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

//cos buckect API
var COS_API = {
	"create": "/api/cos_create_bucket",
	"delete": "/api/cos_delete_bucket",
	"getInfo": "/api/cos_get_bucket",
	"setInfo": "/api/cos_set_bucket",
	"list": "/api/cos_list_bucket"
};

function initArguments(defaultValue, opt, callback) {
	callback = callback || ((typeof opt == "function") ? opt : null);

	opt = ((typeof opt == "function") ? null : opt) || {};

	//设置默认值
	opt.init(defaultValue);
	return [opt, callback];
}

var listBucket = function(opt, callback) {
		this.request("get", COS_API.list, opt, function(err, rep, body) {
			if (err) {
				throw err;
			}
			var data = JSON.parse(body);

			callback && callback(data);
		});
	};

var createBucket = function(opt, callback){
    this.request("get", COS_API.create, opt, function(err, rep, body) {
        if (err) {
            throw err;
        }
        var data = JSON.parse(body);

        callback && callback(data);
    });
}

var deleteBucket = function(opt,callback){
    this.request("del", COS_API.delete, opt, function(err, rep, body) {
        if (err) {
            throw err;
        }
        var data = JSON.parse(body);

        callback && callback(data);
    });
}

exports.create = function(opt, callback) {
    opt = ((typeof opt == "string")?{bucketId:opt}:opt) || {};

    var args = initArguments({
        bucketId: "new_bucket",
        acl: 0, //W_PRIVATE_R_PRIVATE=0; W_PRIVATE_R_PUBLIC = 1;默认置0
        referer: ""
    }, opt, callback);

    createBucket.apply(this, args);
}

exports.list = function(opt, callback) {
	var args = initArguments({
		offset: 0,
		count: 20,
		prefix: ""
	}, opt, callback);

	listBucket.apply(this, args);
}

exports.delete = function(opt, callback) {
    opt = ((typeof opt == "string")?{bucketId:opt}:opt) || {};

    if (!opt.bucketId) {
        throw "miss bucket id.";
    }
    var args = initArguments({}, opt, callback);

    deleteBucket.apply(this, args);
}

exports.getInfo = function(opt, callback) {
    var args = initArguments({
        offset: 0,
        count: 20,
        prefix: ""
    }, opt, callback);

   // listBucket.apply(this, args);
}

exports.setInfo = function(opt, callback) {
    var args = initArguments({
        offset: 0,
        count: 20,
        prefix: ""
    }, opt, callback);

    //listBucket.apply(this, args);
}