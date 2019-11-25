import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/attendance/wifi`

class WifiService {
    getWifiList (fetchParam) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, fetchParam).then((ret) => {
            return ret.data
        })
    }
    deleteWifi (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl, {})
    }
    addWifi (form) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, form).then((ret) => {
            return ret.data
        })
    }
    updateWifi (form) {
        let finalUrl = `${urlPre}/${form.id}`
        return api.put(finalUrl, form).then((ret) => {
            return ret.data
        })
    }
}

export default new WifiService()
