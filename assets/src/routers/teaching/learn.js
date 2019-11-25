export default [
    {
        path: 'learn',
        name: 'teaching-learn',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/learn/Main.vue'))
            })
        },
        meta: {
            title: '带教跟踪',
            noback: true,
        },
    },
    {
        path: 'learn/detail',
        name: 'teaching-learn-detail',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/learn/Detail.vue'))
            })
        },
        meta: {
            title: '带教详情',
        }
    },
]
