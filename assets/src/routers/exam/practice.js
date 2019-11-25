// 题库管理
const pathPre = 'practice'
export default [
    {
        path: pathPre,
        name: 'exam-practice-index',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/Index.vue'))
            })
        },
        meta: {
            title: '练习管理',
            noback: true
        }
    },
    {
        path: `${pathPre}/add`,
        name: 'exam-practice-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/Create.vue'))
            })
        },
        meta: {
            title: '练习管理-添加',
        }
    },
    {
        path: `${pathPre}/edit/:practice_id`,
        name: 'exam-practice-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/Create.vue'))
            })
        },
        meta: {
            title: '练习管理-编辑',
        }
    },
    {
        path: `${pathPre}/stat`,
        name: 'exam-practice-stat',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/Stat.vue'))
            })
        },
        meta: {
            title: '练习模拟考试统计',
            noback: true
        }
    },
    {
        path: `${pathPre}/:practice_id/stat/department`,
        name: 'exam-practice-stat-department',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/DepartmentStat.vue'))
            })
        },
        meta: {
            title: '练习模拟考试统计-门店',
        }
    },
    {
        path: `${pathPre}/:practice_id/stat/:department_id/user`,
        name: 'exam-practice-stat-user',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/UserStat.vue'))
            })
        },
        meta: {
            title: '练习模拟考试统计-用户',
        }
    },
    {
        path: `${pathPre}/stat/subject`,
        name: 'exam-practice-stat-subject',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/exam/practice/SubjectStat.vue'))
            })
        },
        meta: {
            title: '练习错题统计',
            noback: true
        }
    }
]
