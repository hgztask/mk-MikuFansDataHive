import './menu.js'
import './data/globalValue.js'
import "./layout_init.js";
import router from './router.js'
import watch from './watch/watch.js'
import elUtil from "./utils/elUtil.js";

window.globalElUtil = elUtil;

window.addEventListener('load', () => {
    console.log('页面加载完成');
    router.staticRoute(document.title, window.location.href);
    watch.addEventListenerUrlChange((newUrl, oldUrl, title) => {
        router.dynamicRouting(title, newUrl);
    })
})