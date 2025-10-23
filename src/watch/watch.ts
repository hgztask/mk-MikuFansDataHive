/**
 * 监听url变化
 * @param callback {function} 回调函数
 */
const addEventListenerUrlChange = (callback: Function) => {
    let oldUrl = window.location.href;
    setInterval(() => {
        const newUrl = window.location.href;
        if (oldUrl === newUrl) return;
        oldUrl = newUrl;
        const title = document.title;
        callback(newUrl, oldUrl, title)
    }, 1000);
}

/**
 * ，模拟监听网络请求
 * @param callback {function} 回调函数
 */
const addEventListenerNetwork = (callback: Function) => {
    const performanceObserver = new PerformanceObserver(() => {
        const entries: any = performance.getEntriesByType('resource');
        const windowUrl = window.location.href;
        const winTitle = document.title;
        for (let entry of entries) {
            const url = entry.name;
            const initiatorType = entry.initiatorType;
            if (initiatorType === "img" || initiatorType === "css" || initiatorType === "link" || initiatorType === "beacon") {
                continue;
            }
            try {
                callback(url, windowUrl, winTitle, initiatorType);
            } catch (e: any) {
                if (e.message === "stopPerformanceObserver") {
                    performanceObserver.disconnect();
                    console.log("检测到当前页面在排除列表中，已停止性能观察器对象实例", e)
                    break;
                }
                throw e;
            }
        }
        performance.clearResourceTimings();//清除资源时间
    });
    performanceObserver.observe({entryTypes: ['resource']});
}

export default {
    addEventListenerUrlChange,
    addEventListenerNetwork
}
