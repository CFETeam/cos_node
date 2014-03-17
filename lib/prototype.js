/*
 sign.js

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
 * 对象初始化，替换默认参数
 *
 * @param {object} defaultValue 默认参数
 */
Object.prototype.init = function (defaultValue) {
    var obj = this;

    Object.keys(defaultValue).forEach(function (v) {
        obj[v] = obj[v] || defaultValue[v];
    });
};
