/**
 * Created by huangrui on 2017/7/25.
 */
// 企业管理
const pathPre = '/company'

export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/company/Index.vue'))
        })
    },
    children: [
        // 组织架构
        {
            path: 'department',
            name: 'company-department',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/department/Index.vue'))
                })
            },
            meta: {
                title: '组织架构',
                noback: true
            }
        },
        // 用户组
        {
            path: 'usergroup',
            name: 'company-usergroup',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/usergroup/Index.vue'))
                })
            },
            meta: {
                title: '用户组',
                noback: true
            }
        },
        // 添加门店支付
        {
            path: 'addDepartmentPay',
            name: 'company-adddepartmentpay',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/department/component/ToAddDepartmentPay.vue'))
                })
            },
            meta: {
                title: '添加门店',
                noback: true
            }
        },
        //  角色
        {
            path: 'role',
            name: 'company-role',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../views/company/role/Index.vue'))
                })
            },
            meta: {
                title: '管理员',
                noback: true
            }
        },
    ]
}
