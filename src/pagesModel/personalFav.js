import elUtil from "../utils/elUtil.js";
import defUtil from "../utils/defUtil.js";
import SFormatUtil from "../utils/SFormatUtil.js";

//获取当前收藏夹名称(视频列表上方标题)
const getCurrentFavName = async () => {
    const el = await elUtil.findElement('.favlist-main .vui_ellipsis.multi-mode');
    return el.textContent.trim();
}

//获取作者信息-适用于我关注了其他用户的收藏夹时获取作者信息
const getMyFollowAuthorInfo = async () => {
    const el = await elUtil.findElement('.favlist-info-detail__title a');
    const text = el.textContent.trim();
    const name = text.match(/UP主：(.+)\s/)[1];
    const uid = defUtil.getUrlUID(el.href);
    return {name, uid}
}

const getVideoDataList = async () => {
    const els = await elUtil.findElements('.items>.items__item');
    const favName = await getCurrentFavName();
    const list = [];
    const queryParams = defUtil.parseUrl(location.href).queryParams;
    const favType = queryParams['ftype'];
    const favId = queryParams['fid'];
    for (const el of els) {
        const titleEl = el.querySelector('.bili-video-card__title');
        const titleAEl = el.querySelector('a');
        const imgEl = el.querySelector('.bili-cover-card__thumbnail>img');
        const title = titleEl.textContent.trim();
        const stats = el.querySelectorAll('.bili-cover-card__stats>div>span');
        let name, uid;
        if (favType === 'create') {
            //是自己创建的收藏夹时
            const userEl = el.querySelector('.bili-video-card__author');
            name = userEl.querySelector('span[title]').textContent.trim();
            uid = defUtil.getUrlUID(userEl.href);
        } else {
            const authorInfo = await getMyFollowAuthorInfo();
            name = authorInfo.name;
            uid = authorInfo.uid;
        }
        const nameMatch = name.match(/(.*?) · 收藏于/);
        if (nameMatch !== null) {
            name = nameMatch[1];
        }
        const bv = defUtil.getUrlBV(titleAEl.href);
        let views, bulletChat, duration, originalDuration = '', imgSrc = null;
        if (stats.length === 0 && title === '已失效视频') {
            views = -1;
            bulletChat = -1;
            duration = -1;
        } else {
            views = SFormatUtil.toPlayCountOrBulletChat(stats[0].textContent.trim());
            bulletChat = SFormatUtil.toPlayCountOrBulletChat(stats[1].textContent.trim());
            originalDuration = stats[2].textContent.trim();
            const durationStr = SFormatUtil.timeStringToSeconds(originalDuration);
            duration = parseInt(durationStr);
            if (imgEl !== null) {
                imgSrc = imgEl.src;
            }
        }
        list.push({title, name, uid, bv, views, bulletChat, duration, imgSrc, originalDuration, favName, favId})
    }
    return list;
}

window.getVideoDataList = getVideoDataList;

//获取当前收藏夹所有页面数据，根据bv号去重
const getCurrenFavAllPageDataList = async () => {
    const list = [];
    const nextPageBut = await elUtil.findElement('.vui_pagenation--btn-side.vui_pagenation--btn:last-child');
    while (nextPageBut.disabled === false) {
        await defUtil.wait(1500);
        const videoList = await getVideoDataList();
        for (let data of videoList) {
            if (list.some((item) => item.bv === data.bv)) {
                continue;
            }
            list.push(data);
        }
        nextPageBut.click();
    }
    return list;
}


export default {
    getVideoDataList, getCurrenFavAllPageDataList, getCurrentFavName
}