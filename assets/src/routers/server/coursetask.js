const pathPre = 'coursetask'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/server/coursetask/Index.vue'))
        })
    },
    children: [
        {
            path: 'stat',
            name: 'server-stat',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/coursetask/Stat.vue'))
                })
            },
            meta: {
                title: '任务统计',
                noback: true
            }
        },
        {
            path: 'stat/:id/user',
            name: 'server-stat-user',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/coursetask/User.vue'))
                })
            },
            meta: {
                title: '详细统计-任务标题',
            }
        },
        {
            path: 'manage',
            name: 'server-manage',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/coursetask/Manage.vue'))
                })
            },
            meta: {
                title: '任务管理',
                noback: true
            }
        },
        {
            path: 'manage/create',
            name: 'server-manage-create',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/coursetask/Create.vue'))
                })
            },
            meta: {
                title: '添加任务',
            }
        },
        {
            path: 'manage/edit',
            name: 'server-manage-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/coursetask/Create.vue'))
                })
            },
            meta: {
                title: '修改任务',
            }
        },
    ]
}
