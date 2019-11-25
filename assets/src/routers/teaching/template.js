export default [
    {
        path: 'template',
        name: 'teaching-template',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/template/Main.vue'))
            })
        },
        meta: {
            title: '带教管理',
            noback: true,
        },
    },
    {
        path: 'template/add',
        name: 'teaching-template-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/template/Add.vue'))
            })
        },
        meta: {
            title: '创建带教',
        }
    },
    {
        path: 'template/edit',
        name: 'teaching-template-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/template/Add.vue'))
            })
        },
        meta: {
            title: '编辑带教',
        }
    },
    {
        path: 'template/view',
        name: 'teaching-template-view',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/template/Add.vue'))
            })
        },
        meta: {
            title: '查看带教',
        }
    },
    {
        path: 'instructor',
        name: 'teaching-instructor',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/instructor/main.vue'))
            })
        },
        meta: {
            title: '教员管理',
            noback:true
        }
    },
    {
        path: 'instructor/add',
        name: 'teaching-instructor-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/learning/teaching/instructor/add.vue'))
            })
        },
        meta: {
            title: '教员管理',
            noback:false
        }
    }
]
