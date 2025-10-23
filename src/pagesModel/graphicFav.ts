import elUtil from "../utils/elUtil";

const getDataList = async () => {
    const elList = await elUtil.findElements('.container>.item');
    const list = [];
    for (let el of elList) {
        const imgEl = el.querySelector('img');
        const titleEl = el.querySelector('.opus-card__title')
        const subTitleEl = el.querySelector('.opus-card__subtitle')!;
        const aEl: HTMLAreaElement = el.querySelector('a[href*="www.bilibili.com/opus/"]')!;
        const stats = el.querySelectorAll('.bili-cover-card__stats span:not(:empty),.opus-card__icons>span');
        let desc, imgSrc;
        //没有图的情况
        if (imgEl === null) {
            const txtEl = el.querySelector('.opus-card__text');
            desc = txtEl?.textContent.trim();
        } else {
            desc = titleEl?.textContent.trim();
            //图文首图
            imgSrc = imgEl.src;
        }
        const href = aEl.href;
        const subTitle = subTitleEl.textContent.trim();
        const subTitleList = subTitle.split('·');
        const name = subTitleList[0].trim();
        const date = subTitleList[1].trim();
        const view = parseInt(stats[0].textContent.trim());
        const like = parseInt(stats[1].textContent.trim());
        list.push({desc, name, date, imgSrc, view, like, href});
    }
    return list;
}

//图文操作
export default {getDataList}