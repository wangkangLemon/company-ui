import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import action from './store/actions'
import authUtils from './utils/authUtils'
import * as typeUtils from './utils/typeUtils'
import base from './routers/base'
import analytics from './routers/analytics/index'
import course from './routers/course'
import newcourse from './routers/newcourse' // 系列课程
import company from './routers/company'
import checkInActivity from './routers/checkInActivity'
import server from './routers/server'
import client from './routers/client'
import exam from './routers/exam'
import member from './routers/member'
import learning from './routers/learning'
import product from './routers/product'
import finance from './routers/finance'
import teaching from './routers/teaching'
import mall from './routers/store'

Vue.use(VueRouter)

const scrollBehavior = (to, from, savedPosition) => {
    if (to.meta && to.meta.savePosition && savedPosition) {
        return savedPosition
    }

    const position = {}
    if (to.hash) {
        position.selector = to.hash
    } else {
        position.x = 0
        position.y = 0
    }

    return position
}

// 拿到左边的叶子节点
let item = authUtils.getNavMenu()
let firstLeafMenu
if (item) {
    item = item[0]
    while (item.children && item.children.length > 0)
        item = item.children[0]
    firstLeafMenu = item.item.menu_url
} else {
    firstLeafMenu = '/login'
}

const routes = [
    {
        path: '/', redirect: firstLeafMenu || '/main'
    },
    {
        path: '/showdoc', // 文档管理
        name: 'showdoc',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('./views/course/manage/DocShow.vue'))
            })
        }
    },
    {   // 首页
        path: '/',
        name: 'index',
        component: require('./views/Index.vue'),
        children: [
            // 首页
            {
                path: '/main',
                name: 'main',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/index/Main.vue'))
                    })
                },
                meta: {
                    title: '控制台',
                    noback: true
                }
            },
            {
                path: '/message',
                name: 'message',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('./views/index/Message.vue'))
                    })
                },
                meta: {
                    title: '通知中心',
                }
            },
            // 基础路由
            ...base,
            // 数据分析
            analytics,
            // 培训管理
            course,
            // 系列课程
            newcourse,
            // 企业服务
            server,
            //签到活动
            checkInActivity,
            // 企业管理
            company,
            // 客户端
            client,
            // 试题
            exam,
            // 会员
            member,
            // 学习地图
            learning,
            // 产品管理
            product,
            // 企业财务
            finance,
            // 带教
            teaching,
            // 课程商城
            mall,
        ]
    },
    {   // 登录
        path: '/login',
        name: 'login',
        component: require('./views/base/login/Login.vue'),
        meta: {
            title: '登录',
            notAuth: true, //  不需要身份验证
        }
    },
    {   // 二次认证 登录
        path: '/login/twice',
        name: 'login-twice',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('./views/base/login/TwiceValid.vue'))
            })
        },
        meta: {
            title: '二次认证-微信登录',
            notAuth: true, //  不需要身份验证
        }
    }
]

const router = new VueRouter({
    base: '/view',
    mode: 'history',
    scrollBehavior,
    routes
})

let loginouted = false
router.afterEach((route) => {
    let title = route.meta.title
    if (title) {
        document.title = title + ' - 药视通'
    }

    // 设置选中的菜单
    if (route.matched.some(record => record.meta.noback)) store.dispatch('setIndexMenuActive', route.path)
})

router.beforeEach((to, from, next) => {
    // 如果需要登录
    if (!to.matched.some(record => record.meta.notAuth) && (!authUtils.getUserInfo() || !authUtils.getAuthToken())) {
        // 第一次进来不提示超时
        loginouted && xmview.showTip('error', '未登录或登录已超时, 请重新登录!')
        loginouted = true
        next({name: 'login'})
        return
    }
    // if (to.meta.clear) store.dispatch('clearFetchParam', true) // 刷新无效
    if (!store.state.sidebar.isActive) {
        xmview.setContentLoading && xmview.setContentLoading(true)
        setTitle(to.meta.title)
        showBackContent(to, from, next)
        // 如果需要清空筛选条件
        if (store.state.index.clearFetchParam) {
            store.dispatch('clearFetchParam', false)

            if (from.matched.length < 3) return
            // if (!from.matched[2].instances.default) return
            let vm = from.matched[2].instances.default
            vm.initFetchParam ? vm.initFetchParam() : clearObj([vm.fetchParam, vm.fetchParams])
        }

        next()
    }
})

function setTitle (title) {
    // 设置标题
    if (!title) {
        !xmview.setContentTitle && (xmview.setContentTitle = setTitle)
        return
    }
    let titles = title.split('-')
    if (titles.length < 2) {
        titles[1] = ''
    }
    if (titles.length > 2) {
        titles[1] = titles.slice(1).join('-')
    }
    action.setIndexWebpath(store, {main: titles[0], sub: titles[1]})

    !xmview.setContentTitle && (xmview.setContentTitle = setTitle)
}

let backContentTimeoutid
// 设置是否显示返回按钮
function showBackContent (to, from, next) {
    clearTimeout(backContentTimeoutid)
    if (!xmview.setContentBack) {
        backContentTimeoutid = setTimeout(() => {
            showBackContent(to)
        }, 30)
        return
    }
    xmview.setContentBack(true)
    // 如果不需要back 则干掉返回按钮
    if (to.matched.some(record => record.meta.noback)) {
        xmview.setContentBack && xmview.setContentBack(false)
    }
}

function clearObj (obj) {
    if (!obj) return
    if (typeUtils.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) clearObj(obj[i])
    } else {
        for (let k in obj) {
            if (k !== 'page' && k !== 'page_size') obj[k] = void 0
        }
    }
}

export default router
