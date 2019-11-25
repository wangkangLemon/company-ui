// 药我锁

const pathPre = 'speaking'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/server/speaking/Index.vue'))
        })
    },
    children: [
        {
            path: 'content',
            name: 'speaking-content',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/speaking/Content.vue'))
                })
            },
            meta: {
                title: '药我说管理',
                noback: true
            }
        },
        {
            path: 'add-content',
            name: 'speaking-content-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/speaking/AddContent.vue'))
                })
            },
            meta: {
                title: '药我说',
            }
        },
        {
            path: 'stat',
            name: 'server-speaking-stat',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/speaking/Stat.vue'))
                })
            },
            meta: {
                title: '药我说统计',
                noback: true
            }
        },
        {
            path: 'history',
            name: 'server-speaking-history',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/speaking/History.vue'))
                })
            },
            meta: {
                title: '录音记录',
                noback: true
            }
        },
    ],
}
