# 收藏夹数据获取

## 项目介绍

```javascript
// ==UserScript==
// @name      b站收藏夹数据获取
// @namespace http://tampermonkey.net/
// @license   Apache-2.0
// @version   1.0
// @author    byhgz
// @icon      https://static.hdslb.com/images/favicon.ico
// @noframes
// @grant     GM_setValue
// @grant     GM_getValue
// @grant     GM_deleteValue
// @grant     GM_addStyle
// @grant     GM_unregisterMenuCommand
// @grant     GM_registerMenuCommand
// @exclude   http://localhost:3001/
// @match     *://localhost/*
// @match     https://space.bilibili.com/*
// @require   https://unpkg.com/vue@2.7.16/dist/vue.min.js
// @require   https://unpkg.com/element-ui@2.15.14/lib/index.js
// @require     file://E:\js\dist\local_build.js
// ==/UserScript==

/**
 * 上面中的引用地址，根据项目本地实际路径进行修改，这里仅供参考
 * file://E:\js\dist\local_build.js
 *
 */
```

- `@exclude   http://localhost:3002/`