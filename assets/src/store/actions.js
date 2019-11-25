import * as types from './mutations'

const actions = {
    // 设置首页网站路径
    setIndexWebpath (store, {main, sub}) {
        store.commit(types.INDEX_SETWEBPATH, {main, sub})
    },
    // 设置导航菜单
    setIndexNavMenu (store, {menu}) {
        store.commit(types.INDEX_SET_NAVMENU, {menu})
    },
    //  设置选中的导航
    setIndexMenuActive (store, url) {
        store.commit(types.INDEX_SET_MENU_ACTIVE, url)
    },
    // 清空列表的筛选条件
    clearFetchParam (store, need) {
        store.commit(types.INDEX_SET_CLEARFETCHPARAM, need)
    },
    setSidebarActive (store, isActive) {
        store.commit(types.SIDEBAR_SET_ACTIVE, isActive)
    },
    // 设置权限信息
    setAuthOperation (store, operations) {
        store.commit(types.AUTH_SET_OPERATION, operations)
    },
}

export default actions
