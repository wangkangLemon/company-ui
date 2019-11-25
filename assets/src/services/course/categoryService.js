import * as api from 'services/api'
import authUtils from 'utils/authUtils'
import config from 'utils/config'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/course/category`

class CategoryService {
    // 获取栏目树的接口
    getCategory (id = 0) {
        let finalUrl = `${urlPre}/children`
        return api.get(finalUrl, { id }).then(ret => {
            return ret.data
        })
    }
    // 添加栏目的接口
    addCategory ({
        id = 0,
        name,
        image,
        sort
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, { id, name, image, sort }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 修改栏目的接口
    modifyCategory ({
        id,
        name,
        image,
        sort
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, { name, image, sort }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 上传图片
    uploadCategoryImg () {
        return `${urlPre}/image`
    }
    // 删除栏目
    deleteCategory (category_id) {
        let finalUrl = `${urlPre}/${category_id}`
        return api.del(finalUrl).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 移动栏目
    moveCategory (category_id, to_category_id) {
        let finalUrl = `${urlPre}/${category_id}/move`
        return api.put(finalUrl, { to: to_category_id }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
    // 移动内容
    moveCategoryContent (category_id, to_category_id) {
        let finalUrl = `${urlPre}/${category_id}/move/content`
        return api.put(finalUrl, { to: to_category_id }).then(ret => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }
}
export default new CategoryService()
