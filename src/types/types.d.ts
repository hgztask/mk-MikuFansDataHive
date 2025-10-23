// src/types.d.ts
interface Window {
    mk_vue_app: Vue; // 或者更具体的类型，如: ElUtilType
    // 其他需要的全局属性...
    mkFavWin: Window;
}

interface videoDataType {
    title: string,
    name: string,
    uid: number,
    bv: string,
    views: number,
    bulletChat: number,
    duration: number,
    imgSrc: string | null,
    originalDuration: string,
    favName: string,
    favId: string
}