const pathPre = '/newcourse'
// 新课程-课程路由
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/newcourse/Main.vue'))
        })
    },
    children: [
        {
            path: 'public',
            name: 'newcourse-course-public',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Public.vue'))
                })
            },
            meta: {
                title: '企业内训-培训',
                noback: true
            }
        },
        {
            path: 'sem',
            name: 'newcourse-course-sem',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/sem.vue'))
                })
            },
            meta: {
                title: '企业实操',
                noback: true
            }
        },
        {
            path: 'add',
            name: 'newcourse-course-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Form.vue'))
                })
            },
            meta: {
                title: '添加系列课程',
            }
        },
        {
            path: 'edit/:course_id',
            name: 'newcourse-course-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Form.vue'))
                })
            },
            meta: {
                title: '更新系列课程',
            }
        },
        {
            path: 'order',
            name: 'newcourse-course-order',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/newcourse/Order.vue'))
                })
            },
            meta: {
                title: '订单查询 - 系列课程 - 公开课 - 课程管理',
                noback: true
            }
        },
    ]
}
