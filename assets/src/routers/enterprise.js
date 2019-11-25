//  企业服务

const pathPre = '/enterprise'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/drugstore/Index.vue'))
        })
    },
    children: [
        {
            path: 'manager',  // 任务管理
            name: 'enterprise-manager',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/enterprise/coursetask/Manager.vue'))
                })
            },
            meta: {
                title: '任务管理',
                noback: true
            }
        },
        {
            path: 'stat', // 任务统计
            name: 'enterprise-stat',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/enterprise/coursetask/Stat.vue'))
                })
            },
            meta: {
                title: '任务统计',
                noback: true
            }
        }
    ]
}
