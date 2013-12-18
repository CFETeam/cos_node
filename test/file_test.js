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
        this.ct.bucket.create("test_upload", function () {
            callback && callback();
        });
    },
    tearDown: function (callback) {
        this.cosAPP = null;

        //暂时不做删除
        //        this.ct.bucket.del("test_upload",function(body){
        //            console.log(body);
        //            callback && callback();
        //        })
        callback && callback();
    },

    testUploaderAPI: function (test) {
        this.ct.upload(process.cwd() + "/lib/api/upload.js").to("test_upload:/uploader.js", function (body) {
            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
            test.done();
        });
    },

    testGetFileMeta: function(test){
        this.ct.file.getMeta("test_upload:/uploader.js",function(body){
            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
            test.ok(body.data.type == 1, "文件类型");
            test.ok(body.data.finish_flag == true, "文件上传完成");
            test.done();
        })
    },

    testMkDir: function (test) {
      //  console.log(this.ct.file.mkdir.toString());
        this.ct.file.mkdir("test_upload:/test",function(body){
            console.log(body);
            test.done();
        })
    },

    testSetDirMeta: function(test){

    },

    testRmDir: function (test) {
        //  console.log(this.ct.file.mkdir.toString());
        this.ct.file.mkdir("test_upload:/test_for_del",function(body){
            this.ct.file.rmdir("test_upload:/test_for_del",function(body){
                test.ok(body.msg == "ok" || body.code == -24991, "文件删除成功");
                test.done();
            })
        }.bind(this))
    },

    testGetDirMeta: function(test){
        this.ct.file.getMeta("test_upload:/test",function(body){
            console.log(body);
            test.done();
        })
    }
}