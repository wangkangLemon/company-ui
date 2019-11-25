// 基础模块
export default [
    { // 个人信息
        path: '/mine',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/base/mine/Main.vue'))
            })
        },
        children: [
            {
                path: 'safeset',
                name: 'mine-safeset',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/mine/SafeSet.vue'))
                    })
                },
                meta: {
                    title: '安全设置 - 我的',
                    noback: true, //  不需要身份验证
                }
            },
            {
                path: 'profile',
                name: 'mine-profile',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/mine/Profile.vue'))
                    })
                },
                meta: {
                    title: '个人信息 - 我的',
                    noback: true
                }
            },
            {
                path: 'company',
                name: 'mine-company',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/mine/Company.vue'))
                    })
                },
                meta: {
                    title: '企业信息',
                    noback: true
                }
            },
            {
                path: 'password',
                name: 'mine-password',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/mine/Password.vue'))
                    })
                },
                meta: {
                    title: '修改密码 - 我的',
                    noback: true
                }
            },
        ]
    },
    { // 问题反馈
        path: '/feedback',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../views/base/feedback/Main.vue'))
            })
        },
        children: [
            {
                path: 'index',
                name: 'feedback-index',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/feedback/Index.vue'))
                    })
                },
                meta: {
                    title: '我的反馈 - 问题反馈',
                    noback: true
                }
            },
            {
                path: 'add',
                name: 'feedback-add',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/feedback/Add.vue'))
                    })
                },
                meta: {
                    title: '提交问题 - 问题反馈',
                    noback: true,
                }
            },
            {
                path: 'view',
                name: 'feedback-view',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(require('../views/base/feedback/View.vue'))
                    })
                },
                meta: {
                    title: '反馈详情 - 问题反馈',
                    noback: true,
                }
            },
        ]
    }
]
