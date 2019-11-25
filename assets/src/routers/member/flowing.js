export default {
    path: 'flowing',
    name: 'member-flowing',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/member/flowing/Index.vue'))
        })
    },
    children: [
        {
            path: 'dashboard',
            name: 'member-flowing-dashboard',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/flowing/Dashboard.vue'))
                })
            },
            meta: {
                noback: true,
                title: '客流情况'
            }
        },
        {
            path: 'customer',
            name: 'member-flowing-customer',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/flowing/Customer.vue'))
                })
            },
            meta: {
                noback: true,
                title: '进店人群'
            }
        },
        {
            path: 'flowing/medicine',
            name: 'member-flowing-medicine',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/flowing/FlowingMedicine.vue'))
                })
            },
            meta: {
                title: '购药详情'
            }
        },
        {
            path: 'overlook',
            name: 'member-flowing-overlook',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/flowing/Overlook.vue'))
                })
            },
            meta: {
                noback: true,
                title: '忽略列表'
            }
        }
    ]
}
