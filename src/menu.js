import gmUtil from "./utils/gmUtil.js";
import {eventEmitter} from "./model/EventEmitter.js";
import globalValue from "./data/globalValue.js";

gmUtil.addGMMenu('主面板', () => {
    eventEmitter.send('主面板开关')
}, 'Q')
gmUtil.addGMMenu('脚本猫更新页', () => {
    gmUtil.openInTab('https://scriptcat.org/zh-CN/script-show-page/4389')
}, 'Q')
gmUtil.addGMMenu('加入or反馈', () => {
    gmUtil.openInTab(globalValue.group_url)
}, 'T')
gmUtil.addGMMenu('关注作者', () => {
    gmUtil.openInTab(globalValue.b_url)
}, 'G')
