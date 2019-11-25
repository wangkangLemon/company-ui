// 企业服务
const pathPre = '/server'
import attendance from './attendance'
import speaking from './speaking'
import coursetask from './coursetask'
import store from './store'
import comment from './comment'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/server/Index.vue'))
        })
    },
    children: [
        {
            path: 'announce',
            name: 'server-announce',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/Announce.vue'))
                })
            },
            meta: {
                title: '公告',
                noback: true
            }
        },
        {
            path: 'announce/add',
            name: 'server-announce-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/AddAnnounce.vue'))
                })
            },
            meta: {
                title: '公告',
            }
        },
        {
            path: 'article',
            name: 'server-article',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/Article.vue'))
                })
            },
            meta: {
                title: '资讯',
                noback: true
            }
        },
        {
            path: 'article/add',
            name: 'server-article-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/AddArticle.vue'))
                })
            },
            meta: {
                title: '资讯',
            }
        },
        {
            path: 'slider',  // 幻灯片
            name: 'server-slider',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/Slider.vue'))
                })
            },
            meta: {
                title: '幻灯片',
                noback: true
            }
        },
        attendance,  // 考勤打卡
        speaking,
        coursetask, // 课程任务
        store,
        comment,
        {
            path: 'approval',
            name: 'server-approval',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/approval/Index.vue'))
                })
            },
            meta: {
                title: '流程审批',
                noback: true
            }
        },
        {
            path: 'score',
            name: 'server-score',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/Score.vue'))
                })
            },
            meta: {
                title: '企业学分',
                noback: true
            }
        },
        {
            path: 'setting',
            name: 'server-setting',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/Setting.vue'))
                })
            },
            meta: {
                title: '企业应用设置',
                noback: true
            }
        },
        {
            path: 'sale-finance',
            name: 'server-sale-finance',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/SaleFinance.vue'))
                })
            },
            meta: {
                title: '推广信息',
                noback: true
            }
        },
    ]
}
