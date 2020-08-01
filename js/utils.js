/**
 *创建元素函数
 *
 * @param {*} eleName 创建的元素类型
 * @param {*} classArr 该元素的类名
 * @param {*} styleObj 该元素的样式（对象）
 */
function createEle(eleName, classArr, styleObj) {
    var dom = document.createElement(eleName);

    for (let i = 0; i < classArr.length; i++) {
        dom.classList.add(classArr[i]);
    }

    for (let key in styleObj) {
        dom.style[key] = styleObj[key];
    }

    return dom;
}

/**
 *存储值
 *
 * @param {*} key
 * @param {*} value
 */
function setLocal(key, value) {
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

/**
 *取值
 *
 * @param {*} key
 * @param {*} value
 * @returns
 */
function getLocal(key, value) {
    var value = localStorage.getItem(key, value);
    if (value === null) {
        return value;
    }
    if (value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
    }
    return value;
}

/**
 * 格式化时间
 *
 * @param {*} num
 * @returns
 */
function formatNum(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

