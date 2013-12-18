/*
 bucketUri.js

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

/**
 * bucketURI 解释
 * @param {string} url buckect url地址
 * @returns {{bucket: string, path: string, file: string, href: string}}
 */
exports.parse = function (url) {
    var uri = url.split(":");
    if (uri.length != 2) {
        throw "bad. bucketUrl";
    }

    var path = uri[1].split("/");
    var file = path.pop();

    return {
        bucket: uri[0],
        path: path.join("/") || "/",
        file: file,
        href: path.join("/") + "/" + file
    };
};