export default [
    {
        path: 'statistics',
        name: 'teaching-statistics',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/statistics/Main.vue'))
            })
        },
        meta: {
            title: '带教统计',
            noback: true,
        },
    }
]
