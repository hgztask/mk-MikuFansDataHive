import {eventEmitter} from "./model/EventEmitter";
import globalValue from "./data/globalValue";

GM_registerMenuCommand('主面板', () => {
    eventEmitter.send('主面板开关')
}, 'Q')
GM_registerMenuCommand('脚本猫更新页', () => {
    GM_openInTab('https://scriptcat.org/zh-CN/script-show-page/4389')
}, 'Q')
GM_registerMenuCommand('加入or反馈', () => {
    GM_openInTab(globalValue.group_url)
}, 'T')
GM_registerMenuCommand('关注作者', () => {
    GM_openInTab(globalValue.b_url)
}, 'G')
