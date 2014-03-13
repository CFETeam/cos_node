[toc]


#Tencent QCloud COS SDK for Node.JS.

## 简介

>**COS SDK** 是腾讯云服务器的COS的Node.JS版本的SDK.  
>这个SDK可以让你的[Node.Js][1]服务轻松使用[腾讯云][2]的[COS][3]服务。

## 安装

```shell
$ npm install cos-sdk
```

## 如何使用
引入sdk，并且枚举一个目录下的所有文件
```javascript
var Cos = require("cos-sdk"); //引入sdk库

//初始化cos对象，传入必要的id和key参数用于访问cos。
var cos = new Cos({
            accessId: "1000000", //你的 cos 的accessId
            secretId: "abcdefghijk", //你的 cos secretId
            secretKey: "abcdefghijk" //你的 cos secretKey
        });
        
cos.ls("bucketID:/",function(error,body){
    if (!error) {
        console.log(body); //返回当前bucket根目录下的文件列表
    }
}); 
```

## COS Object API 列表
### upload
上传一个`localFile`文件到服务器对应的`bucketUrl` 
```javascript
cos.upload(localFile).to(bucketUrl,callback);
```

### convert
压缩线上`bucketUrl`的图片，目前支持图片缩放，图片压缩，水印, 处理好的图片保存到`newBucketUrl`
```javascript
cos.convert(bucketUrl).compress().resize(1, 640, 320).to(newBucketUrl, callback);
```

### mkBucket
创建一个buckect, 第一个参数可以是`bucketId`字符串，或者是`opt`对象
```javascript
cos.mkBucket(bucketId, callback);
//or
cos.mkBucket({
    "bucketId" : "bucket1",
    "acl" : 1
}, callback);
```
**opt**
`bucketId` bucket 的 id 名称
`acl` bucket 的访问权限, 0 是私有， 1是公开
`referer` bucket 访问的referer限制

### rmBucket
### lsBucket
### getBucketMeta
### setBucketMeta
### rename
### ls
### del
### zip
### mkdir
### rmdir
### setDirMeta
### stat
### url


## Upload API 详细说明
>待补充

## 图片转换 API 详细说明
>待补充

## Callback 格式
统一的回调参数格式
```javascript
function(error, body){
}
```

## 什么是 bucket URI
> `bucket URI` 是`cos sdk`里的一种路径规范，目的是简化接口调用的难度，可以让开发使用接口的时候可以更加清晰理解目录的结构

**bucket URI 的格式结构:** `bucketID` : `/dir/` `filename`  

例如: ***bucket1:/folder/test.jpg*** 意思是`bucket1`这个文件库里的`/folder/test.jpg`文件。在部分的文件操作里需要传bucket URI的时候直接使用这种路径规则即可。

## LICENSE
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

http://www.apache.org/licenses/LICENSE-2.0.html


  [1]: http://nodejs.org/
  [2]: http://www.qcloud.com/
  [3]: http://www.qcloud.com/product/product.php#item=cos