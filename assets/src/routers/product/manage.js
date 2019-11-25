export default [
    {
        path: 'manage',
        name: 'product-manage',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/product/manage/Index.vue'))
            })
        },
        meta: {
            title: '产品管理',
            noback: true,
        },
    }
]
