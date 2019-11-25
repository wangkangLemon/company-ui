import authUtils from 'utils/authUtils'
import * as api from '../../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/score/store/product`

class TestProductService {
    search ({name, category_id, status, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/search`
        if (status === '' || status === undefined) status = -1
        return api.get(url, {name, category_id, status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 新建商品
    create ({name, score, image, category_id, description,stock}) {
        let url = `${urlPre}`
        return api.post(url, JSON.stringify({name, score, image, category_id, description,stock})).then((ret) => {
            return ret.data
        })
    }
    update (id, {score, description, image, name, category_id,stock}) {
        let url = `${urlPre}/${id}`
        return api.put(url, JSON.stringify({score, description, image, name, category_id,stock})).then((ret) => {
            return ret.data
        })
    }
    getProductById (id) {
        let url = `${urlPre}/${id}/view`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 上架
    online (productId) {
        let url = `${urlPre}/${productId}`
        return api.put(url, JSON.stringify({status: 0})).then((ret) => {
            return ret.data
        })
    }
    // 下架
    offline (productId) {
        let url = `${urlPre}/${productId}`
        return api.put(url, JSON.stringify({status: 1})).then((ret) => {
            return ret.data
        })
    }
    updateScore (productId, score) {
        let url = `${urlPre}/${productId}`
        return api.put(url, JSON.stringify({score: score})).then((ret) => {
            return ret.data
        })
    }
    // 获取url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/cover`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestProductService()
