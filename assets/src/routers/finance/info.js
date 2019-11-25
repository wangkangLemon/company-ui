export default [
    {
        path: 'info',
        name: 'finance-info',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/finance/info/Index.vue'))
            })
        },
        meta: {
            title: '财务信息',
            noback: true,
        },
    }
]
