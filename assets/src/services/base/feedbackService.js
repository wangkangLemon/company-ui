import * as api from '../api'
import config from '../../utils/config'
const urlPre = config.apiHost + '/feedback'

class FeedbackUserService {
    // 获取我的工单列表
    search ({ page, page_size, status = -1, category_id, time_start, time_end }) {
        let url = `${urlPre}/search`
        if (status == '') {
            status = -1
        }
        return api.get(url, { page, page_size, status, category_id, time_start, time_end }).then((ret) => {
            return ret.data
        })
    }

    // 获取工单分类
    category () {
        let url = `${urlPre}/category`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }

    // 查看工单
    view (id) {
        let url = `${urlPre}/${id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }

    // 提交工单
    create ({ category_id = 1, content, images = [], contact }) {
        let url = `${urlPre}`
        if (images) {
            images = JSON.stringify(images)
        }
        return api.post(url, { category_id, content, images, contact }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 回复工单
    reply ({ id, status, content, images, confirm }) {
        let url = `${urlPre}/${id}/reply`
        if (images) {
            images = JSON.stringify(images)
        }
        if (confirm) {
            confirm = 1
        } else {
            confirm = 0
        }
        return api.put(url, { status, content, images, confirm }).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            } else {
                return ret.data
            }
        })
    }

    // 确认已解决
    confirm (id) {
        let url = `${urlPre}/${id}/confirm`
        return api.put(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 删除工单
    remove (id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then((ret) => {
            if (ret.code) {
                return Promise.reject(ret)
            }
        })
    }

    // 获取上传图片地址
    uploadImageUrl () {
        return `${urlPre}/image`
    }
}

export default new FeedbackUserService()
