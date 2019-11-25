// 数据订阅
export default {
    path: 'sign',
    name: 'analytics-datamail',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/analytics/Datamail.vue'))
        })
    },
    meta: {
        title: '数据订阅-说明：选择想要订阅的数据项，我们会按时发送邮件到您指定的邮箱，方便您了解企业数据和员工学习情况',
        noback: true
    }
}
