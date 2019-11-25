// 订单管理
const pathPre = 'comment'
export default {
    path: pathPre,
    name: 'test-comment-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../../views/server/comment/Index.vue'))
        })
    },
    meta: {
        title: '评论管理',
        noback: true
    }
}
