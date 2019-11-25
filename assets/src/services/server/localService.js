import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/attendance/location`

class LocalService {
    getLocalList (fetchParam) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, fetchParam).then((ret) => {
            return ret.data
        })
    }
    deleteLocal (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl, {})
    }
    addLocal (form) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, form)
    }
    updateLocal (form) {
        let finalUrl = `${urlPre}/${form.id}`
        return api.put(finalUrl, form)
    }
}

export default new LocalService()
