import storeProduct from './product' // 商品管理
import storeCategory from './category' // 分类管理
import storeOrder from './order' // 订单管理

const pathPre = 'store'

export default {
    path: pathPre,
    name: 'store',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../../views/server/store/Index.vue'))
        })
    },
    children: [
        ...storeProduct,
        storeCategory,
        storeOrder
    ]
}
