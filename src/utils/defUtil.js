import Vue from "vue";

/**
 * 等待一段时间
 * @param milliseconds{Number} 等待时间，单位毫秒，默认1000毫秒，即1秒
 * @returns {Promise<>}
 */
const wait = (milliseconds = 1000) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * 内容导出为文件
 * @param {String}content 内容
 * @param {String}fileName 文件名
 */
const fileDownload = (content, fileName) => {
    // 获取导出文件内容
    // 创建隐藏的下载文件链接
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    // 手动触发下载
    element.click();
    // 清理dom
    document.body.removeChild(element);
}

/**
 * 保存大文本到文件
 * @param text {string} 文本内容
 * @param filename {string} 文件名
 */
function saveTextAsFile(text, filename = 'data.txt') {
    // 创建Blob对象（处理大文本）
    const blob = new Blob([text], {type: 'text/plain'});
    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    // 触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    // 清理
    setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }, 100);
}

/**
 *封装file标签handle的回调，用于读取文件内容
 * @param event
 * @returns {Promise<{any,content:string|string}>}
 */
const handleFileReader = (event) => {
    return new Promise((resolve, reject) => {
        const file = event.target.files[0];
        if (!file) {
            reject('未读取到文件');
            return;
        }
        let reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            resolve({file, content: fileContent});
            reader = null;
        };
        reader.readAsText(file);
    });
}

/**
 * 判断对象是否可迭代
 * 1.array可迭代
 * 2.string可迭代
 * 3.map可迭代
 * 4.set可迭代
 * 5.类数组对象可迭代
 * @param obj {any}
 * @returns {boolean}
 */
const isIterable = (obj) => {
    return obj != null && typeof obj[Symbol.iterator] === 'function';
}

/**
 * 返回当前时间
 * @returns {String}
 */
const toTimeString = () => {
    return new Date().toLocaleString();
}

/**
 * 防抖函数
 * @param func {function} 需要防抖的函数
 * @param wait {number} 等待时间，单位毫秒，默认为 1000毫秒
 * @returns {(function(...[*]): void)|*}
 */
function debounce(func, wait = 1000) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 *  节流函数
 * @param func {function} 需要节流的函数
 * @param limit {number} 节流时间，单位毫秒
 * @returns {(function(...[*]): void)|*}
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 解析 URL
 * @param urlString {string} 要解析的 URL 字符串
 * @returns {{protocol: string, hostname: string, search: string, port: string, queryParams: {}, pathSegments: string[], hash: string, pathname: string}}
 */
const parseUrl = (urlString) => {
    // 创建一个新的 URL 对象
    const url = new URL(urlString);
    // 提取路径部分并分割成数组
    const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
    // 使用 URLSearchParams 来解析查询参数
    const searchParams = new URLSearchParams(url.search.slice(1));
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
    }
    return {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        pathSegments,
        search: url.search,
        queryParams,
        hash: url.hash
    };
}

/**
 *获取localStorage指定key数据
 * 如Key不存在则返回默认值
 * 如指定isList为true,则返回数组
 * @param key {string}
 * @param isList {boolean} 是否是数组
 * @param defaultValue {any}
 * @returns {any|string|boolean|number|[]}
 */
const getLocalStorage = (key, isList = false, defaultValue = null) => {
    const item = localStorage.getItem(key);
    if (item === null) {
        return defaultValue
    }
    if (isList) {
        try {
            return JSON.parse(item)
        } catch (e) {
            console.error(`读取localStorage时尝试转换${key}的值失败`, e)
            return defaultValue
        }
    }
    return item
}

/**
 * 时间戳转时间字符串 (增强版)
 * @param {number|string} timestamp - 支持10位(秒)/13位(毫秒)/字符串数字
 * @param {object} [options] - 配置项
 * @param {string} [options.format='YYYY-MM-DD HH:mm:ss'] - 输出格式，可选标记：
 *    YYYY/YY: 年, MM/M: 月, DD/D: 日, HH/H: 时, mm/m: 分, ss/s: 秒
 * @param {number} [options.timezone] - 时区偏移(小时)，如 +8 或 -5
 * @param {boolean} [options.returnObject=false] - 是否返回时间对象
 * @returns {string|object} 格式化时间字符串 或 时间对象 {year,month,day...}
 */
const formatTimestamp = (timestamp, options = {}) => {
    // 参数校验与转换
    if (!timestamp || isNaN(timestamp)) return 'Invalid Timestamp'
    const ts = String(timestamp).length === 10 ? +timestamp * 1000 : +timestamp

    // 处理时区偏移 (单位: 小时)
    const timezoneOffset = (options.timezone || 0) * 60 * 60 * 1000
    const date = new Date(ts + timezoneOffset)

    // 有效性检查
    if (isNaN(date.getTime())) return 'Invalid Date'

    // 时间组件提取
    const timeObj = {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hours: date.getUTCHours(),
        minutes: date.getUTCMinutes(),
        seconds: date.getUTCSeconds()
    }

    // 返回原始对象
    if (options.returnObject) return timeObj

    // 格式处理
    const format = options.format || 'YYYY-MM-DD HH:mm:ss'
    const pad = (n) => n.toString().padStart(2, '0')

    return format
        .replace(/YYYY/g, timeObj.year)
        .replace(/YY/g, String(timeObj.year).slice(-2))
        .replace(/MM/g, pad(timeObj.month))
        .replace(/M/g, timeObj.month)
        .replace(/DD/g, pad(timeObj.day))
        .replace(/D/g, timeObj.day)
        .replace(/HH/g, pad(timeObj.hours))
        .replace(/H/g, timeObj.hours)
        .replace(/mm/g, pad(timeObj.minutes))
        .replace(/m/g, timeObj.minutes)
        .replace(/ss/g, pad(timeObj.seconds))
        .replace(/s/g, timeObj.seconds)
}

function initVueApp(el, App, props = {}) {
    return new Vue({
        render: h => h(App, {props})
    }).$mount(el);
}

/**
 * 计算未来时间戳
 * @param {number} days - 天数偏移量，默认为0
 * @param {number} hours - 小时数偏移量，默认为0
 * @param {number} minutes - 分钟数偏移量，默认为0
 * @param {number} seconds - 秒数偏移量，默认为0
 * @returns {number} 未来时间戳-毫秒级
 */
export function getFutureTimestamp(days = 0, hours = 0, minutes = 0, seconds = 0) {
    const now = new Date();

    // 将所有时间偏移量转换为毫秒
    const ms = days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000;

    const future = new Date(now.getTime() + ms);

    // 转换为秒级浮点数
    return future.getTime();
}


/**
 *获取url中的uid
 * @param url{string}
 * @return {number}
 */
const getUrlUID = (url) => {
    let uid;
    if (url.startsWith('http')) {
        const parse = parseUrl(url);
        uid = parse.pathSegments[0]?.trim()
        return parseInt(uid)
    }
    //是否有参数
    const isDoYouHaveAnyParameters = url.indexOf('?');
    const lastIndexOf = url.lastIndexOf("/");
    if (isDoYouHaveAnyParameters === -1) {
        if (url.endsWith('/')) {
            // 当url以/结尾时，取倒数第二个/
            const nTheIndexOfTheLastSecondOccurrenceOfTheSlash = url.lastIndexOf('/', url.length - 2);
            uid = url.substring(nTheIndexOfTheLastSecondOccurrenceOfTheSlash + 1, url.length - 1);
        } else {
            // 当没有参数时，取url的最后一个/之后的内容
            uid = url.substring(lastIndexOf + 1);
        }
    } else {
        //当url中有参数时，取参数前的uid
        uid = url.substring(lastIndexOf + 1, isDoYouHaveAnyParameters);
    }
    return parseInt(uid);
}

/**
 * 获取url中的BV号
 * @param url {string}
 * @returns {string|null}
 */
const getUrlBV = (url) => {
    //例子：https://www.bilibili.com/video/BV1gLCWYAE5C/?spm_id_from=333.788.recommend_more_video.1
    let match = url.match(/video\/(.+)\//);
    if (match === null) {
        //例子：https://www.bilibili.com/video/BV1wB421r7NX?spm_id_from=333.1245.recommend_more_video.1
        match = url.match(/video\/(.+)\?/)
    }
    if (match === null) {
        //例子:https://www.bilibili.com/video/BV1B1cxewECr
        match = url.match(/video\/(.+)/)
    }
    if (match !== null) {
        return match?.[1]?.trim();
    }
    const {queryParams: {bvid = null}} = parseUrl(url);
    return bvid;
}

export default {
    wait, fileDownload, toTimeString, getUrlUID, debounce, throttle, initVueApp, saveTextAsFile,
    parseUrl, handleFileReader, isIterable, getLocalStorage, formatTimestamp, getUrlBV
}
