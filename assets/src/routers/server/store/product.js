// 商品管理
const pathPre = 'product'
export default [
    {
        path: pathPre,
        name: 'test-store-index',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../../views/server/store/product/Index.vue'))
            })
        },
        meta: {
            title: '商品管理',
            noback: true
        }
    },
    // 商品详情
    {
        path: `${pathPre}/detail/:id`,
        name: 'test-store-detail',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../../views/server/store/product/Detail.vue'))
            })
        },
        meta: {
            title: '商品管理-详情',
        }
    },
    // 添加商品
    {
        path: `${pathPre}/add`,
        name: 'test-store-add',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../../views/server/store/product/Add.vue'))
            })
        },
        meta: {
            title: '商品管理-添加',
        }
    },
    // 修改商品
    {
        path: `${pathPre}/edit/:id`,
        name: 'test-store-edit',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../../views/server/store/product/Edit.vue'))
            })
        },
        meta: {
            title: '商品管理-编辑',
        }
    }
]
