export default [
    {
        path: 'statistics',
        name: 'product-statistics',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/product/statistics/Index.vue'))
            })
        },
        meta: {
            title: '产品统计',
            noback: true,
        },
    }
]
