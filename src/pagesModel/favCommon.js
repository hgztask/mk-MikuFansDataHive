import elUtil from "../utils/elUtil.js";

//获取左侧栏当前选中项
const getLeftSidebarItemActive = () => {
    const el = document.querySelector('.vui_sidebar-item--active .vui_ellipsis.multi-mode');
    if (el === null) return null;
    return el.textContent.trim();
}

//获取顶部导航栏当前选中项
const getNavTabItemActive = async () => {
    const el = await elUtil.findElement('.nav-tab a.active .nav-tab__item-text');
    return el.textContent.trim();
}

export default {
    getLeftSidebarItemActive, getNavTabItemActive
}