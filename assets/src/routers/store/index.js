const pathPre = '/store'
// import list from './list'
// import detail from './detail'

export default {
    path: pathPre,
    name: 'store',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/store/Index.vue'))
        })
    },
    children: [
        {
            path: 'list',
            name: 'store-list',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/store/List.vue'))
                })
            },
            meta: {
                title: '课程商城',
                noback: true
            }
        },
        {
            path: 'detail',
            name: 'store-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/store/Detail.vue'))
                })
            },
            meta: {
                title: ''
            }
        }
    ]
}
