// 订单管理
const pathPre = 'order'
export default {
    path: pathPre,
    name: 'test-order-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../../views/server/store/order/Index.vue'))
        })
    },
    meta: {
        title: '订单管理',
        noback: true
    }
}
