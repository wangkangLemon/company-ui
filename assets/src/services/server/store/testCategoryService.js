import authUtils from 'utils/authUtils'
import * as api from '../../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/score/store/category`

class TestCategoryService {
    search ({keyword, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/search`
        if (keyword === '' || keyword === undefined) keyword = ''
        if (time_start === '' || time_start === undefined) time_start = ''
        if (time_end === '' || time_end === undefined) time_end = ''
        if (page === '' || page === undefined) page = ''
        if (page_size === '' || page_size === undefined) page_size = ''
        return api.get(url, {keyword, company_id, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    create ({name, description}) {
        let url = `${urlPre}`
        return api.post(url, JSON.stringify({company_id, name, description})).then((ret) => {
            return ret.data
        })
    }

    update (categoryId, {name, description}) {
        let url = `${urlPre}/${categoryId}`
        return api.put(url, JSON.stringify({name, description})).then((ret) => {
            return ret.data
        })
    }

    batchCreateQuestion (examId, questions) {
        let url = `${urlPre}/${examId}/subject`
        return api.post(url, JSON.stringify(questions)).then((ret) => {
            return ret.data
        })
    }

    delete (categoryId) {
        let url = `${urlPre}/${categoryId}`
        return api.del(url).then((ret) => {
            return ret.data
        })
    }

    /**
     * 批量删除
     * @param data
     */
    batchDelete (data) {
        let url = `${urlPre}/exam/deletion`
        return api.put(url, JSON.stringify(data)).then((ret) => {
            return ret.data
        })
    }

    view (examId) {
        let url = `${urlPre}/${examId}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }

    searchQuestion (examId, {type, tags, page, page_size}) {
        let url = `${urlPre}/${examId}/subject/search`
        return api.get(url, {type, tags, page, page_size}).then((ret) => {
            return ret.data
        })
    }

    online (examId) {
        let url = `${urlPre}/${examId}/disable`
        return api.put(url, JSON.stringify({status: 0})).then((ret) => {
            return ret.data
        })
    }

    offline (examId) {
        let url = `${urlPre}/${examId}/disable`
        return api.put(url, JSON.stringify({status: 1})).then((ret) => {
            return ret.data
        })
    }
    // 获取添加编辑课程上传图片的url
    getUploadUrl ({image, alias}) {
        let url = `${urlPre}/image`
        return api.post(url, {image, alias}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestCategoryService()
