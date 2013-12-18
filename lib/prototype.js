/**
 * 设置对象默认值
 * @param defaultValue
 */
Object.prototype.init = function (defaultValue) {
    var obj = this;
    Object.keys(defaultValue).forEach(function (v) {
        obj[v] = obj[v] || defaultValue[v];
    });
}
