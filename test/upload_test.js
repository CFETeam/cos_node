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
        this.ct.upload(process.cwd() + "/lib/api/upload.js").to("test_upload:/uploader.js", function (error, body) {
            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
            test.done();
        });
    },

    testDeleteFile: function (test) {
        this.ct.del("test_upload:/uploader.js", function (error, body) {
            test.ok(body.msg == "ok", "测试文件被删除成功");
            test.done();
        })
    },

    testUploaderAPI2: function (test) {
        this.ct.upload(process.cwd() + "/lib/api/upload.js").to("test_upload:/lib/uploader.js", function (error, body) {
            test.ok(body.code == "-24985", "目录不存在无法上传");
            test.done();
        });
    },

    testConvertFile: function (test) {
        var convert = this.ct.convert("test_upload:/test.jpg").compress().resize(1, 640, 320);
        var o = this;
        test.ok(convert._opt.compress == 1, "设置压缩");
        test.ok(convert._opt.zoomType == 1, "调整尺寸设置");

        var url = "test_upload:/test_compress_" + new Date().getTime() + ".jpg";

        convert.to(url, function (error, body) {
            test.ok(body.code == 0, "成功转换图片");
            o.ct.del(url);
            test.done();
        });
    },

    testConvertTextMask: function (test) {
        //FIXME 这里需要给look反馈的问题 1. 字体数量太少， 2. offsetX,offsetY坐标计算应该换成padding，或者坐标支持负数

        var convert = this.ct.convert("test_upload:/test.jpg").addTextMask("这是水印。。。", {
            size: 50,
            font: "仿宋",//TODO 。。。只有仿宋
            degree: 45
        });

        var o = this;

        var url = "test_upload:/test_compress_" + new Date().getTime() + ".jpg";
        convert.to(url, function (error, body) {
            // console.log(body);
            test.ok(body.code == 0, "成功转换图片");
            o.ct.del(url);
            test.done();
        })
    },

    testConvertImgMask: function (test) {
        //FIXME 这里需要给look反馈，图片居然不支持align........

        var convert = this.ct.convert("test_upload:/test.jpg").addImageMask("test_upload:/ex_logo.png", {
            x: 100,
            y: 100
        });

        var o = this;

        var url = "test_upload:/test_compress_" + new Date().getTime() + ".jpg";
        convert.to(url, function (error, body) {
            // console.log(body);
            test.ok(body.code == 0, "成功转换图片");
            o.ct.del(url);
            test.done();
        })
    },

    testConvert: function (test) {
        var upload = this.ct.upload(process.cwd() + "/lib/api/upload.js").resize(1, 640);

        test.done();
    }
}