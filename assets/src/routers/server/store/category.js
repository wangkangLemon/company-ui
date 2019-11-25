// 分类管理
const pathPre = 'category'
export default {
    path: pathPre,
    name: 'test-category-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../../views/server/store/category/Index.vue'))
        })
    },
    meta: {
        title: '分类管理',
        noback: true
    }
}
