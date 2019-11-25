import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/product`

class ProductService {
    // 搜索产品列表
    searchProduct ({
        product_name,
        industry_name,
        time_start,
        time_end,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { product_name, industry_name, time_start, time_end, page, page_size }).then(ret => {
            return ret.data
        })
    }
    // 上传产品图
    getImageUrl () {
        return `${urlPre}/image`
    }
    // 产品详情
    getProduct (product_id) {
        let finalUrl = `${urlPre}/${product_id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 新建产品
    createProduct ({
        name,
        image,
        description,
        industry_name
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, { name, image, description, industry_name }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '创建成功')
        })
    }
    // 产品修改
    editProduct ({
        product_id,
        name,
        image,
        description,
        industry_name
    }) {
        let finalUrl = `${urlPre}/${product_id}`
        return api.put(finalUrl, { name, image, description, industry_name }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '修改成功')
        })
    }
    // 产品删除
    deleteProduct (product_id) {
        let finalUrl = `${urlPre}/${product_id}`
        return api.del(finalUrl).then(ret => {
            xmview.showTip('success', ret.message || '删除成功')
        })
    }
    // 产品统计列表
    searchStat ({
        product_name,
        industry_name,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/stat`
        return api.get(finalUrl, { product_name, industry_name, stat_month, page, page_size }).then(ret => ret.data)
    }
    export ({
        is_export = 1,
        product_name,
        industry_name,
        stat_month,
    }) {
        let finalUrl = `${urlPre}/stat`
        return api.get(finalUrl, { is_export, product_name, industry_name, stat_month }).then(ret => {
        })
    }
    // 产品统计-关联课件
    searchCourseware ({
        product_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/courseware`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 产品统计-关联课程
    searchCourse ({
        product_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/course`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 产品统计-关联任务 
    searchTask ({
        product_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/task`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 产品统计-关联任务-学习人数
    searchTaskLearn ({
        product_id,
        task_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/${task_id}/learn`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 产品统计-覆盖人数
    searchUser ({
        product_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/user`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 产品统计-学习人次
    searchUserTime ({
        product_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/user/times`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
    // 产品统计-学习人数
    searchUserTotal ({
        product_id,
        stat_month,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/${product_id}/user/total`
        return api.get(finalUrl, { stat_month, page, page_size }).then(ret => ret.data)
    }
}
export default new ProductService()
