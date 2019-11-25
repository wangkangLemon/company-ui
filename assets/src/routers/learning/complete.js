export default [
    {
        path: 'complete',
        name: 'learning-maps-complete',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/maps/complete/Complete.vue'))
            })
        },
        meta: {
            title: '员工学习地图数据统计',
            noback: true,
        },
    },
    {
        path: 'record',
        name: 'learning-maps-record',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/maps/complete/Record.vue'))
            })
        },
        meta: {
            title: '学习记录',
        }
    }
]
