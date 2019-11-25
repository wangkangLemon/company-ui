/**
 * Created by huanghuixin on 2017/3/29.
 */
import {
    INDEX_SETWEBPATH,
    INDEX_SET_NAVMENU,
    INDEX_SET_MENU_ACTIVE,
    INDEX_SET_CLEARFETCHPARAM
} from '../mutations'

const INDEX = {
    state: {
        webpathMain: '主页',
        webpathSub: '',
        navMenu: [], // 导航菜单
        navMenueActive: '', // 当前菜单的选中项
        clearFetchParam: false // 是否清空筛选条件
    },

    mutations: {
        [INDEX_SETWEBPATH] (state, {main, sub}) {
            state.webpathMain = main
            state.webpathSub = sub
        },
        [INDEX_SET_NAVMENU] (state, {menu}) {
            state.navMenu = menu
        },
        [INDEX_SET_MENU_ACTIVE] (state, url) {
            state.navMenueActive = url
        },
        [INDEX_SET_CLEARFETCHPARAM] (state, need) {
            state.clearFetchParam = need
        }
    }
}

export default INDEX
