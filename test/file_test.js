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
            test.ok(body.msg == "ok" || body.code == -24986, "文件夹已经创建，或者已经存在");
            test.done();
        })
    },

    testSetDirMeta: function(test){
        this.ct.file.setDirMeta("test_upload:/test",{
            expires:7000,
            contentEncoding:"UTF-8",
            contentLanguage:"zh",
            contentDisposition:"attachment",
            cacheControl:"max-age=1000"
        },function(body){
            test.done();
        })
    },

    testMkMultiDir: function (test) {
        //  console.log(this.ct.file.mkdir.toString());
        this.ct.file.mkdir("test_upload:/tree/tree/tree/end",function(body){
            test.ok(body.msg == "ok" || body.code == -24986, "文件夹已经创建，或者已经存在");
            test.done();
        })
    },

    testListDir: function(test){
        this.ct.file.list("test_upload:/",function(body){
            test.ok(body.msg == "ok", "列举列表成功");
            test.done();
        })
    },

    testListDirByOptions: function(test){
        //只枚举前缀是 upload 的文件,最多列举2个
        this.ct.file.list("test_upload:/",{count:2,prefix:"upload"},function(body){
            test.ok(body.msg == "ok", "列举列表成功");
            test.ok(body.data.files.length == 1, "只返回一个文件");
            test.ok(body.data.files[0].name == "uploader.js", "其实只有一个测试文件是uploader.js");
            test.ok(body.data.files[0].type == 1, "确定是一个文件");
            test.done();
        })
    },

//    testRmMultiDir: function (test) {
//        //  console.log(this.ct.file.mkdir.toString());
//        this.ct.file.rmdir("test_upload:/tree",function(body){
//            console.log(body);
//            test.done();
//        })
//    },

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
            test.ok(body.msg == "ok", "获取信息正确");
            test.ok(body.data['Content-Disposition'] == "attachment","测试返回的目录设置");
            test.done();
        })
    },

    testRemoveTestDir: function(test){
        this.ct.file.rmdir("test_upload:/test",function(body){
            test.ok(body.msg == "ok", "测试目录删除成功");
            test.done();
        })
    }
}