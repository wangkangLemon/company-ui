const pathPre = 'attendance'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/server/attendance/Index.vue'))
        })
    },
    children: [
        {
            path: 'stat',
            name: 'server-attendance-stat',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/attendance/Stat.vue'))
                })
            },
            meta: {
                title: '考勤统计',
                noback: true
            }
        },
        {
            path: 'setting',
            name: 'server-attendance-setting',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/server/attendance/Setting.vue'))
                })
            },
            meta: {
                title: '考勤设置',
                noback: true
            }
        },
    ]
}
