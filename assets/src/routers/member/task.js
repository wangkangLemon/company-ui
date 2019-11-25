export default {
    path: 'task',
    name: 'member-task',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/member/task/Index.vue'))
        })
    },
    children: [
        {
            path: 'sale',
            name: 'member-task-sale',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/task/Sale.vue'))
                })
            },
            meta: {
                noback: true,
                title: '销售任务'
            }
        },
        {
            path: 'sale/create',
            name: 'member-task-sale-create',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/task/Create.vue'))
                })
            },
            meta: {
                title: '添加任务'
            }
        },
        {
            path: 'sale/edit',
            name: 'member-task-sale-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/task/Create.vue'))
                })
            },
            meta: {
                title: '修改任务'
            }
        },
        {
            path: 'sale/performance',
            name: 'member-task-sale-performance',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/task/Performance.vue'))
                })
            },
            meta: {
                title: '销售业绩'
            }
        }
    ]
}
