/**
 * Created by huangrui on 2017/7/25.
 */
// 签到活动
const pathPre = '/checkInActivity'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/checkInActivity/index.vue'))
        })
    },
    children:[
        //创建活动
        {
            path: 'activityAdd',
            name: 'activity-add',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/checkInActivity/activityAdd.vue'))
                })
            },
            meta: {
                title: '创建活动',
                noback: true
            }
        },
        {
            path: 'activityList',
            name: 'activity-list',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/checkInActivity/activityList.vue'))
                })
            },
            meta: {
                title: '活动列表',
                noback: true
            }
        },
        {
            path: 'activityEdit',
            name: 'activity-edit',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/checkInActivity/activityEdit.vue'))
                })
            },
            meta: {
                title: '活动更新',
                noback: false
            }
        },
        {
            path: 'signIn',
            name: 'signIn',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/checkInActivity/signIn.vue'))
                })
            },
            meta: {
                title: '签到清单',
                noback: false
            }
        },
        {
            path: 'map',
            name: 'map',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/checkInActivity/map.vue'))
                })
            },
            meta: {
                title: '地图',
                noback: true
            }
        },
       
    ]
}
