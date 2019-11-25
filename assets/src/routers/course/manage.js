// 培训管理
const pathPre = 'manage'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/course/Index.vue'))
        })
    },
    children: [{
        path: 'public', // 公开课管理
        name: 'course-manage-public',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/Public.vue'))
            })
        },
        meta: {
            title: '企业内训-培训',
            noback: true
        }
    },
    {
        path: 'add-course', // 添加和编辑课程
        name: 'course-manage-addCourse',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/AddCourse.vue'))
            })
        },
        meta: {
            title: '添加课程-培训',
        }
    },
    {
        path: 'category', // 添加和编辑课程
        name: 'course-manage-category',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/Category.vue'))
            })
        },
        meta: {
            title: '栏目管理',
        }
    },
    {
        path: 'video', // 视频管理
        name: 'course-manage-video',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/Video.vue'))
            })
        },
        meta: {
            title: '视频管理-培训',
            noback: true
        }
    },
    {
        path: 'video-add', // 视频管理
        name: 'manage-video-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/AddVideo.vue'))
            })
        },
        meta: {
            title: '添加视频',
        }
    },
    {
        path: 'doc', // 文档管理
        name: 'course-manage-doc',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/Doc.vue'))
            })
        },
        meta: {
            title: '文档管理-培训',
            noback: true
        }
    },
    {
        path: 'industry',
        name: 'course-manage-industry',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('@/views/course/manage/Industry.vue'))
            })
        },
        meta: {
            title: '工业课程-培训',
            noback: true
        }
    }]

}
