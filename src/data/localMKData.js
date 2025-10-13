import gmUtil from "../utils/gmUtil.js";

export const getDrawerShortcutKeyGm = () => {
    return gmUtil.getData('get_drawer_shortcut_key_gm', '`')
}