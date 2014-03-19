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
cos.upload(localFile).to(bucketUrl, callback);
```

### convert
压缩线上`bucketUrl`的图片，目前支持图片缩放，图片压缩，水印, 处理好的图片保存到`newBucketUrl`
```javascript
cos.convert(bucketUrl).compress().resize(1, 640, 320).to(newBucketUrl, callback);
```

### mkBucket
创建一个bucket, 第一个参数可以是`bucketId`字符串，或者是`opt`对象
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
`acl` bucket 的访问权限, 0 是私有， 1是公开。默认值是 0  
`referer` bucket 访问的referer限制

### rmBucket
删除一个bucket
```javascript
cos.rmBucket(bucketId, callback);
```

### lsBucket
枚举出cos下面所有bucket列表
```javascript
cos.lsBucket(callback);
//or
cos.lsBucket({
    "offset": 0,
    "count": 20,
    "prefix" : ""
},callback);
```
**opt**  
`offset` 枚举的偏移量，默认值是 **0** 。如果需要实现翻页，需要配合`count`参数一起使用。  
`count` 同时枚举出多少个，默认是一次列举 **20** 个  
`prefix` 用于匹配 bucketID 的前缀

### getBucketMeta
获取一个bucket的属性
```javascript
cos.getBucketMeta(bucketId, callback);
```

### setBucketMeta
设置一个bucket的属性
```javascript
cos.setBucketMeta(bucketId, opt, callback);
```
**opt**  
`acl` bucket 的访问权限, 0 是私有， 1是公开。默认值是 0
`referer` bucket 访问的referer限制

### rename
更改bucket上的文件名, 主要参数 `bucketUrl` 和 `filename`。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.rename(bucketUrl, filename, callback);
```

### ls
枚举bucketURL的文件列表, 主要参数 `bucketUrl` 和 `opt`。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.ls(bucketUrl, opt, callback);
```
**opt**  
`offset` 枚举的偏移量，默认值是 **0** 。如果需要实现翻页，需要配合`count`参数一起使用。  
`count` 同时枚举出多少个，默认是一次列举 **100** 个  
`prefix` 用于匹配文件名的前缀

**P.S.** 这里的bucketURL具体到路径即可 *(例如:bucket1:/path1/path/)*，不会单独枚举单个文件。

### del
删除一个bucket里的文件, 主要参数 `bucketUrl`。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.del(bucketUrl, callback);
```

### mkdir
创建一个目录, 主要参数 `bucketUrl` 和 `opt`。。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.mkdir(bucketUrl, opt, callback);
```
**opt**  
`mkType` mkType='p' 时表示是否递归创建目录，默认值是 'p'  
`expires` 目录下的文件，在发生请求时的expires时间，不包括子目录的文件  
`cacheControl` 目录下的文件，在发生请求时的cache-control时间，不包括子目录的文件  
`contentEncoding` 目录下的文件，在发生请求时的content-encoding的文件编码，不包括子目录的文件  
`contentDisposition` 目录下的文件，在发生请求时的content-disposition的文件格式和文件名，例如: ***attachment; filename=文件名***  
`contentLanguage` 目录下的文件，在发生请求时的content-language头信息，例如: ***Zh***

### rmdir
删除一个目录，需要确保当前目录没有文件,暂时不支持递归删除文件, 主要参数 `bucketUrl`。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.rmdir(bucketUrl, callback);
```
### setDirMeta
设置一个目录的属性, 主要参数 `bucketUrl` 和 `opt`。。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.mkdir(bucketUrl, opt, callback);
```
**opt**  
[请参考 cos.mkdir 的参数][4]

### stat
返回一个文件或者目录的属性, 主要参数 `bucketUrl`。`bucketUrl` 可以参考 **bucket URL的规范**。
```javascript
cos.stat(bucketUrl, callback);
```

### url
返回一个bucketUrl的外网下载地址, 主要参数 `bucketUrl`, `signed`, `queryString` 。
```javascript
/**
 * 返回一个bucketUrl的外网下载地址
 * @param {string} bucketUrl bucket url 路径
 * @param {boolean} signed 是否带签名，如果允许签名后，则可以允许私有bucket的文件被下载
 * @param {object} queryString 下载地址附加的query string
 * @returns {string}
 */
cos.stat(bucketUrl, signed, queryString); //return 下载url
```
如果bucket的属性是私有读写，并且希望单个文件被访问或下载，需要 **`signed` == `true`** ，来把下载url进行一次签名。

## Upload API 详细说明
###上传本地文件
把本地文件`localFile`上传到`bucketUrl`
```javascript
cos.upload(localFile).to(bucketUrl, callback);
```

###上传文件并且压缩
```javascript
cos.upload(localFile).compress().to(bucketUrl, callback);
```
默认质量是 85

###上传文件并且缩放
上传并缩放图片，缩放支持等比缩放和拉伸缩放。 P.S.此接口在 `0.2.0` 版本更新，接口不兼容以前的版本

```javascript
cos.upload(localFile).resize(width, height, stretch).to(bucketUrl, callback);
```
`width` 新的宽度  
`height` 新的高度  
`stretch` 是否进行拉伸缩放，默认是 `false` , 等比缩放

###上传并且进行图片裁剪
上传并裁剪图片，在`x`, `y`坐标开始，裁剪一个`width` x `height` 的图片。 `0.2.0 added`
```javascript
cos.upload(localFile).crop(x, y, width, height).to(bucketUrl, callback);
```

`x` 裁剪起始X坐标  
`y` 裁剪起始Y坐标  
`width` 裁剪的尺寸  
`height` 裁剪的尺寸  

###上传文件并且添加文字水印
```javascript
cos.upload(localFile).addTextMask(text, config).to(bucketUrl, callback);
```
`text` 水印文字  
`config` = {  
`align` 水印的位置， 1~9。按照就九宫格的顺序。 默认值是 9，在右下角位置。  
`x` 水印文字的X坐标偏移  
`y` 水印文字的Y坐标偏移  
`color` 水印文字的颜色，格式 RGBA。例如: `#ff00007f`  
`font` 水印文字类型，目前只有**仿宋** (据说还在申请字体版权)  
`size` 水印文字大小，默认是16，单位px  
`degree` 水印文字旋转角度，默认是0  
} 


###上传文件并且添加图片水印
```javascript
cos.upload(localFile).addImageMask(bucketUrl, config).to(bucketUrl, callback);
```
`bucketUrl` 水印的bucketUrl  
`config` = {  
`align` 水印的位置， 1~9。按照就九宫格的顺序。 默认值是 9，在右下角位置。  
`x` 水印的X坐标偏移  
`y` 水印的Y坐标偏移  
} 

###上传压缩文件混合用法
```javascript
cos.upload(localFile).addImageMask(bucketUrl, config).compress().to(bucketUrl, callback); //添加水印并且压缩
```
## 图片转换 API 详细说明
###压缩线上文件到新的路径
```javascript
cos.convert(bucketUrl).compress().to(bucketUrl, callback);
```

###convert的其他方法
和upload上传接口一样同时支持，压缩，缩放，水印等接口。具体的参数用法参考 [upload API][5].

>cos.convert(bucketUrl).**compress()**  
>cos.convert(bucketUrl).**resize(*width, height, stretch*)**  
>cos.convert(bucketUrl).**crop(*x, y, width, height*)** `0.2.0 added`  
>cos.convert(bucketUrl).**addImageMask(*bucketUrl, config*)**  
>cos.convert(bucketUrl).**addTextMask(*text, config*)**  
>cos.convert(bucketUrl).**to(*bucketUrl, callback*)**

## Callback 格式
统一的回调参数格式
```javascript
function(error, body){
    if (!error) {
        console.log(body);
    }
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
  [4]: #mkdir
  [5]: #upload-api-%E8%AF%A6%E7%BB%86%E8%AF%B4%E6%98%8E
