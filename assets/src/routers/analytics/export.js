// 数据订阅

export default {
    path: 'export',
    name: 'analytics-export',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/analytics/Export.vue'))
        })
    },
    meta: {
        title: '导出',
        noback: true
    }
}
