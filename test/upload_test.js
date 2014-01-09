// unittest for api/upload.js
//
// puterjam
//
var assert = require("assert");
var cos = require("../cos");

module.exports = {
    setUp: function (callback) {
        this.cosAPP = {
            accessId: "1000353",
            secretId: "AKIDq99rTDnjIJglmwgLqzdttvMpXgpUcd9X",
            secretKey: "Viz6f07qQhWXDPMX8K1ygeITH3qzukPP"
        };
        this.ct = cos.getContext(this.cosAPP);

        //初始化上传用的bucket
        this.ct.mkBucket("test_upload", function () {
            callback && callback();
        });
    },
    tearDown: function (callback) {
        this.cosAPP = null;

        //暂时不做删除
        //        this.ct.bucket.del("test_upload",function(error,body){
        //            console.log(body);
        //            callback && callback();
        //        })
        callback && callback();
    },

//    testUploadFile: function (test) {
//
//        this.ct.upload("test_upload", process.cwd() + "/lib/api/upload.js", function (error,body) {
//            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
//            test.done();
//        });
//    },
//
//    testUploadFileByOptions: function (test) {
//        this.ct.upload("test_upload", process.cwd() + "/lib/api/upload.js", {
//            path: "/",
//            cosFile: "upload.js"
//        }, function (error,body) {
//            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
//            test.done();
//        });
//    },
//
//    testUploadFileInNotExistDir: function (test) {
//        this.ct.upload("test_upload", process.cwd() + "/lib/api/upload.js", {
//            path: "/lib",
//            cosFile: "upload.js"
//        }, function (error,body) {
//            test.ok(body.code == "-24985", "目录不存在无法上传");
//            test.done();
//        })
//    },

    testUploaderAPI: function (test) {
        this.ct.upload(process.cwd() + "/lib/api/upload.js").to("test_upload:/uploader.js", function (error,body) {
            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
            test.done();
        });
    },

    testDeleteFile: function (test) {
        this.ct.del("test_upload:/uploader.js", function (error,body) {
            test.ok(body.msg == "ok", "测试文件被删除成功");
            test.done();
        })
    },

    testUploaderAPI2: function (test) {
        this.ct.upload(process.cwd() + "/lib/api/upload.js").to("test_upload:/lib/uploader.js", function (error,body) {
            test.ok(body.code == "-24985", "目录不存在无法上传");
            test.done();
        });
    }
}