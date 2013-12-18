/*
 util.js

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

//引入一些通用组件
require("./prototype");

/**
 *
 * @param defaultValue
 * @param opt
 * @param callback
 * @returns {Array}
 */
function initOpt(defaultValue, opt) {
    // callback = callback || ((typeof opt == "function") ? opt : null);

    opt = ((typeof opt == "function") ? null : opt) || {};

    //设置默认值
    opt.init(defaultValue);
    return opt;
}

exports.initOpt = initOpt;