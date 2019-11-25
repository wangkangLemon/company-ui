export default [
    {
        path: 'log',
        name: 'finance-log',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/finance/log/Index.vue'))
            })
        },
        meta: {
            title: '培训账单',
            noback: true,
        },
    }
]
