// unittest for api/upload.js
//
// puterjam
//
var assert = require("assert");
var cos = require("../cos");
var request = require('request');

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

    testGetFileMeta: function (test) {
        this.ct.stat("test_upload:/uploader.js", function (body) {
            test.ok(body.msg == "ok" || body.code == -24991, "文件上传成功, 或者文件已经存在");
            test.ok(body.data.type == 1, "文件类型");
            test.ok(body.data.finish_flag == true, "文件上传完成");
            test.done();
        })
    },

    testMkDir: function (test) {
        this.ct.mkdir("test_upload:/test", function (body) {
            test.ok(body.msg == "ok" || body.code == -24986, "文件夹已经创建，或者已经存在");
            test.done();
        })
    },

    testSetDirMeta: function (test) {
        this.ct.setDirMeta("test_upload:/test", {
            expires: 7000,
            contentEncoding: "UTF-8",
            contentLanguage: "zh",
            contentDisposition: "attachment",
            cacheControl: "max-age=1000"
        }, function (body) {
            test.done();
        })
    },

    testMkMultiDir: function (test) {
        this.ct.mkdir("test_upload:/tree/tree/tree/end", function (body) {
            test.ok(body.msg == "ok" || body.code == -24986, "文件夹已经创建，或者已经存在");
            test.done();
        })
    },

    testListDir: function (test) {
        this.ct.ls("test_upload:/", function (body) {
            test.ok(body.msg == "ok", "列举列表成功");
            test.done();
        })
    },

    testListDirByOptions: function (test) {
        //只枚举前缀是 upload 的文件,最多列举2个
        this.ct.ls("test_upload:/", {count: 2, prefix: "upload"}, function (body) {
            test.ok(body.msg == "ok", "列举列表成功");
            test.ok(body.data.files.length == 1, "只返回一个文件");
            test.ok(body.data.files[0].name == "uploader.js", "其实只有一个测试文件是uploader.js");
            test.ok(body.data.files[0].type == 1, "确定是一个文件");
            test.done();
        })
    },

    testRmDir: function (test) {
        this.ct.mkdir("test_upload:/test_for_del", function (body) {
            this.ct.rmdir("test_upload:/test_for_del", function (body) {
                test.ok(body.msg == "ok" || body.code == -24991, "文件删除成功");
                test.done();
            })
        }.bind(this))
    },

    testGetDirMeta: function (test) {
        this.ct.stat("test_upload:/test", function (body) {
            test.ok(body.msg == "ok", "获取信息正确");
            test.ok(body.data['Content-Disposition'] == "attachment", "测试返回的目录设置");
            test.done();
        })
    },

    testRemoveTestDir: function (test) {
        this.ct.rmdir("test_upload:/test", function (body) {
            test.ok(body.msg == "ok", "测试目录删除成功");
            test.done();
        })
    },

    testGetDownloadUrl: function (test) {
        var url = this.ct.url("test_upload:/ex_logo.png");
        test.ok(url == "http://cos.myqcloud.com/1000353/test_upload/ex_logo.png", "不用签名的下载路径");

        test.done();
    },

    testGetDownloadUrlWithOption: function (test) {
        var url = this.ct.url("test_upload:/ex_logo.png", false, {
            res_content_disposition: "attachement;" //当附件下载
        });
        test.ok(url == "http://cos.myqcloud.com/1000353/test_upload/ex_logo.png?res_content_disposition=attachement%3B", "不用签名的下载路径");

        test.done();
    },

    testGetDownloadUrlWithSign: function (test) {
        var o = this;
        this.ct.setBucketMeta("test_upload", {
            acl: 0 //把 bucket 设置成私有
        }, function () {
            var url = o.ct.url("test_upload:/ex_logo.png", true);
            request.get(url, function (error, rep) {
                test.ok(rep.statusCode == 200, "如果返回是200说明签名生效了");
                test.done();
            });
        })
    },

    testRename: function (test) {
        var o = this;
        this.ct.rename("test_upload:/test2/ex_logo.png", "exlogo.png", function (body) {
            test.ok(body.msg == "ok", "文件名修改成功");

            o.ct.rename("test_upload:/test2/exlogo.png", "ex_logo.png", function (body) {
                //还原修改的文件
                test.ok(body.msg == "ok", "文件名修改成功");
                test.done();
            })

        });
    }
}