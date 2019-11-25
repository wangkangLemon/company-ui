// 数据订阅

export default [
    {
        path: 'gsp/user',
        name: 'gsp-user',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/analytics/gsp/User.vue'))
            })
        },
        meta: {
            title: 'GSP用户',
            noback: true
        }
    },
    {
        path: 'gsp/testing/:id',
        name: 'gsp-testing',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/analytics/gsp/Testing.vue'))
            })
        },
        meta: {
            title: 'GSP用户考试记录',
            noback: false
        }
    },
]
