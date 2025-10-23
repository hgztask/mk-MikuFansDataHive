import Vue from "vue";

/**
 * 等待一段时间
 * @param milliseconds{Number} 等待时间，单位毫秒，默认1000毫秒，即1秒
 * @returns {Promise<>}
 */
const wait = (milliseconds: number = 1000): Promise<any> => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * 内容导出为文件
 * @param {String}content 内容
 * @param {String}fileName 文件名
 */
const fileDownload = (content: string, fileName: string) => {
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
 * 解析 URL
 * @param urlString {string} 要解析的 URL 字符串
 * @returns {{protocol: string, hostname: string, search: string, port: string, queryParams: {}, pathSegments: string[], hash: string, pathname: string}}
 */
const parseUrl = (urlString: string): {
    protocol: string,
    hostname: string,
    search: string,
    port: string,
    queryParams: {} | any,
    pathSegments: string[],
    hash: string,
    pathname: string
} => {
    // 创建一个新的 URL 对象
    const url = new URL(urlString);
    // 提取路径部分并分割成数组
    const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
    // 使用 URLSearchParams 来解析查询参数
    const searchParams = new URLSearchParams(url.search.slice(1));
    const queryParams: any = {};
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

function initVueApp(el: Element, App: any, props = {}) {
    return new Vue({
        render: h => h(App, {props})
    }).$mount(el);
}

/**
 *获取url中的uid
 * @param url{string}
 * @return {number}
 */
const getUrlUID = (url: string): number => {
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
const getUrlBV = (url: string) => {
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
    const {queryParams: {bvid}} = parseUrl(url);
    return bvid;
}

export default {
    wait, fileDownload, getUrlUID, initVueApp,
    parseUrl, getUrlBV
}
