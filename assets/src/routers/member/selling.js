export default {
    path: 'selling',
    name: 'member-selling',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/member/selling/Index.vue'))
        })
    },
    children: [
        {
            path: 'dashboard',
            name: 'member-selling-dashborad',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/Dashboard.vue'))
                })
            },
            meta: {
                noback: true,
                title: '销售画板'
            }
        },
        {
            path: 'order',
            name: 'member-selling-order',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/Order.vue'))
                })
            },
            meta: {
                noback: true,
                title: '销售统计'
            }
        },
        {
            path: 'order/detail',
            name: 'member-selling-order-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/OrderDetail.vue'))
                })
            },
            meta: {
                title: '销售统计详情'
            }
        },
        {
            path: 'category',
            name: 'member-selling-category',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/Category.vue'))
                })
            },
            meta: {
                noback: true,
                title: '品类销售'
            }
        },
        {
            path: 'category/detail',
            name: 'member-selling-category-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/CategoryDetail.vue'))
                })
            },
            meta: {
            }
        },
        {
            path: 'medicine',
            name: 'member-selling-medicine',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/Medicine.vue'))
                })
            },
            meta: {
                noback: true,
                title: '药品销售'
            }
        },
        {
            path: 'medicine/detail',
            name: 'member-selling-medicine-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/MedicineDetail.vue'))
                })
            },
            meta: {
            }
        },
        {
            path: 'department',
            name: 'member-selling-department',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/Department.vue'))
                })
            },
            meta: {
                noback: true,
                title: '门店销售'
            }
        },
        {
            path: 'department/detail',
            name: 'member-selling-department-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/DepartmentDetail.vue'))
                })
            },
            meta: {
            }
        },
        {
            path: 'staff',
            name: 'member-selling-staff',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/Staff.vue'))
                })
            },
            meta: {
                noback: true,
                title: '店员销售'
            }
        },
        {
            path: 'staff/detail',
            name: 'member-selling-staff-detail',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('@/views/member/selling/StaffDetail.vue'))
                })
            },
            meta: {
            }
        }
    ]
}
