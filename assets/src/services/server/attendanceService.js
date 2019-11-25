import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/attendance/stat`

class AttendanceService {
    getAttendanceList (fetchParam) {
        let finalUrl = `${urlPre}/day`
        return api.get(finalUrl, fetchParam).then((ret) => {
            return ret.data
        })
    }
    getDetails ({type,id,page,page_size}) {
        let finalUrl = `${urlPre}/${type}/${id}`
        return api.get(finalUrl,{page,page_size}).then((ret) => {
            return ret.data
        })
    }
    fileExport (fetchParam) {
        let finalUrl = `${urlPre}/day/export`
        return api.get(finalUrl, fetchParam).then(ret => {
            return ret
        })
    }
}
export default new AttendanceService()
