export default [
    {
        path: 'info',
        name: 'learning-maps-info',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/maps/info/Info.vue'))
            })
        },
        meta: {
            title: '学习地图任务模板管理',
            noback: true
        }
    },
    {
        path: 'create',
        name: 'learning-maps-create',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/maps/info/Create.vue'))
            })
        },
        meta: {
            title: '创建模板'
        }
    }
]
