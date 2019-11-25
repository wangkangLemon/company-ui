import authUtils from 'utils/authUtils'
import * as api from '../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/subject/group`

class TestLibraryService {
    search ({keyword, time_start, time_end, page, page_size, subject_status}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, keyword, time_start, time_end, subject_status}).then((ret) => {
            return ret.data
        })
    }
    create ({name, description}) {
        let url = `${urlPre}`
        return api.post(url, JSON.stringify({name, description})).then((ret) => {
            return ret.data
        })
    }
    update (id, {name, description}) {
        let url = `${urlPre}/${id}`
        return api.put(url, JSON.stringify({name, description})).then((ret) => {
            return ret.data
        })
    }
    delete (id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {}).then((ret) => {
            return ret.data
        }).catch(ret => Promise.reject(ret.data))
    }
    batchDelete (data) {
        let url = `${urlPre}/deletion`
        return api.put(url, JSON.stringify(data)).then((ret) => {
            return ret.data
        })
    }
    /**
     *
     * @param group_id
     */
    view (group_id) {
        let url = `${urlPre}/${group_id}`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
}

export default new TestLibraryService()
