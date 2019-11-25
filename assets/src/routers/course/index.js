//  培训管理
const pathPre = '/course'
import manage from './manage'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/course/Index.vue'))
        })
    },
    children: [
        manage,   // 课程
        {
            path: 'study', //  成绩
            name: 'course-study',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/study/Index.vue'))
                })
            },
            meta: {
                title: '学习成绩',
                noback: true
            }
        },
        {
            path: 'study/detail',
            name: 'course-study-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/study/TestingDetail.vue'))
                })
            },
            meta: {
                title: '答题详情',
            },
            beforeEnter: (to, from, next) => {
                from.meta.tab = true
                next()
            }
        },
        {
            path: 'study/unlearned',
            name: 'course-study-unlearned',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/course/study/Unlearned.vue'))
                })
            },
            meta: {
                title: '未学习员工名单'
            }
        }

    ]

}
