
const pathPre = '/course'
//  培训管理
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../views/course/Index.vue'))
        })
    },
    children: [
        {
            path: 'courses', // 课程
            name: 'course-courses',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/Courses.vue'))
                })
            },
            meta: {
                title: '课程课程-培训',
                noback: true
            }
        },
        {
            path: 'score', // 课程
            name: 'course-courses',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/course/Score.vue'))
                })
            },
            meta: {
                title: '考试成绩',
                noback: true
            }
        },
    ]
}
