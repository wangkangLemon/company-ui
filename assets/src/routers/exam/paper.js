// 试卷管理
const pathPre = 'paper'
export default [
    {
        path: pathPre,
        name: 'test-paper-index',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/paper/Index.vue'))
            })
        },
        meta: {
            title: '试卷管理',
            noback: true
        }
    },
    {
        path: `${pathPre}/view/:id`,
        name: 'test-paper-view',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/paper/View.vue'))
            })
        },
        meta: {
            title: '试卷管理-详情',
        }
    },
    {
        path: `${pathPre}/add`,
        name: 'test-paper-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/paper/Add.vue'))
            })
        },
        meta: {
            title: '试卷管理-添加',
        }
    },
    {
        path: `${pathPre}/edit/:exam_id`,
        name: 'test-paper-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/paper/Edit.vue'))
            })
        },
        meta: {
            title: '试卷管理-编辑',
        }
    }
]
