import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/course/store`

class StoreService {
    // 带教模版商品列表
    searchTeachingCourse (id) {
        let finalUrl = `${urlPre}/teaching/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 商品列表
    searchCourse ({
        goods_type,  // 1-单品,2-优惠
        is_purchased,  // 1-未购买,2-已购买
        category_id,  // goods_type为1时有效
        keyword,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { goods_type, is_purchased, category_id, keyword, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 获取单品分类
    getCategoryTree ({id = 'tree', filter = true}) {
        let finalUrl = `${urlPre}/goods/category/children`
        return api.get(finalUrl, {id, filter}).catch((ret) => {
            return ret
        })
    }
    // 单品详情
    getGoodsDetail (id) {
        let finalUrl = `${urlPre}/goods/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 优惠详情
    getFavorableDetail (id) {
        let finalUrl = `${urlPre}/goods/favorable/${id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 立即购买
    genOrder ({
        goods_type,
        goods_id,
        user_count,
        total_price,
        price,
        ids
    }) {
        let finalUrl = `${urlPre}/order`
        return api.post(finalUrl, { goods_type, goods_id, user_count, total_price, price, ids }, false, true).then(ret => ret.data)
    }
}
export default new StoreService()
