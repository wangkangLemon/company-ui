export default {
    path: 'customer',
    name: 'member-customer',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/member/customer/Index.vue'))
        })
    },
    children: [
        {
            path: 'dashboard',
            name: 'member-customer-dashboard',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/customer/Dashboard.vue'))
                })
            },
            meta: {
                noback: true,
                title: '会员画板'
            }
        },
        {
            path: 'info',
            name: 'member-customer-info',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/customer/Info.vue'))
                })
            },
            meta: {
                noback: true,
                title: '会员信息'
            }
        },
        {
            path: 'tags',
            name: 'member-customer-tags',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/customer/Tags.vue'))
                })
            },
            meta: {
                noback: true,
                title: '标签列表'
            }
        },
        {
            path: 'tags/detail',
            name: 'member-customer-tags-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/customer/TagsDetail.vue'))
                })
            },
            meta: {
                title: '标签会员'
            }
        }
    ]
}
