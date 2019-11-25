// 统计报表

export default {
    path: 'report',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/analytics/report/Index.vue'))
        })
    },
    children: [
        {
            path: '',
            name: 'analytics-report',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/Report.vue'))
                })
            },
            meta: {
                title: '统计报表',
                noback: true
            },
        },
        {
            path: 'app',
            name: 'analytics-report-app',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/app/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-app-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/app/App.vue'))
                        })
                    },
                    meta: {
                        title: '连锁开启APP及使用率报表',
                    },
                },
                {
                    path: 'used',
                    name: 'analytics-report-app-used',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/app/Used.vue'))
                        })
                    },
                    meta: {
                        title: 'APP使用人数'
                    }
                },
                {
                    path: 'unused',
                    name: 'analytics-report-app-unused',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/app/Unused.vue'))
                        })
                    },
                    meta: {
                        title: 'APP未使用人数'
                    }
                }
            ]
        },
        {
            path: 'course',
            name: 'analytics-report-course',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/course/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-course-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/course/Course.vue'))
                        })
                    },
                    meta: {
                        title: '课程任务完成比率报表',
                    },
                },
                {
                    path: 'courserank',
                    name: 'analytics-report-course-courserank',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/course/CourseRank.vue'))
                        })
                    },
                    meta: {
                        title: '课程任务完成排名报表',
                    },
                },
            ]
        },
        {
            path: 'exam',
            name: 'analytics-report-exam',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/exam/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-exam-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/exam/Exam.vue'))
                        })
                    },
                    meta: {
                        title: '考试成绩与通过率报表',
                    },
                },
                {
                    path: 'examrank',
                    name: 'analytics-report-exam-examrank',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/exam/Examrank.vue'))
                        })
                    },
                    meta: {
                        title: '考试成绩排名',
                    },
                }
            ]
        },
        {
            path: 'study',
            name: 'analytics-report-study',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/study/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-study-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/study/Study.vue'))
                        })
                    },
                    meta: {
                        title: '连锁学习情况统计报表',
                    },
                },
                {
                    path: 'studycount',
                    name: 'analytics-report-study-studycount',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/study/Studycount.vue'))
                        })
                    },
                    meta: {
                        title: '课程学习情况统计',
                    },
                },
            ]
        },
        {
            path: 'error',
            name: 'analytics-report-error',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/error/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-error-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/error/Error.vue'))
                        })
                    },
                    meta: {
                        title: '连锁练习错题统计报表',
                    }
                },
            ]

        },
        {
            path: 'test',
            name: 'analytics-report-test',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/test/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-test-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/test/Test.vue'))
                        })
                    },
                    meta: {
                        title: '连锁模拟考试概况统计报表',
                    }
                },
            ]
        },
        {
            path: 'staff',
            name: 'analytics-report-staff',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/Index.vue'))
                })
            },
            children: [
                {
                    path: 'index',
                    name: 'analytics-report-staff-index',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/staff/Staff.vue'))
                        })
                    },
                    meta: {
                        title: '店员学习情况'
                    }
                },
                {
                    path: 'detail',
                    name: 'analytics-report-staff-detail',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/staff/Detail.vue'))
                        })
                    },
                    meta: {
                        title: '学习课程统计'
                    }
                },
                {
                    path: 'task',
                    name: 'analytics-report-staff-task',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/staff/Task.vue'))
                        })
                    },
                    meta: {
                        title: '店员学习任务统计'
                    }
                },
                {
                    path: 'taskdetail',
                    name: 'analytics-report-staff-taskdetail',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/staff/TaskDetail.vue'))
                        })
                    },
                    meta: {
                        title: '店员学习任务详情'
                    }
                }
            ]
        },
        {
            path: 'department',
            name: 'analytics-report-department',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/analytics/report/Index.vue'))
                })
            },
            children: [
                {
                    path: 'task',
                    name: 'analytics-report-department-task',
                    component: resolve => {
                        require.ensure([], () => {
                            resolve(require('@/views/analytics/report/department/Task.vue'))
                        })
                    },
                    meta: {
                        title: '部门学习任务统计表'
                    }
                }
            ]
        }
    ]
}
