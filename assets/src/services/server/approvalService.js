// 审批
import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/approval`

class ApprovalService {
    // formid：1为请假，2为加班，3为外出，4为通用
    getApprovalList (fetParam) {
        let url = `${urlPre}/search`
        return api.get(url, fetParam).then((ret) => {
            return ret.data
        })
    }
    fileExport (params) {
        let url = `${urlPre}/export`
        return api.post(url, params).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
            return ret
        })
    }
}
export default new ApprovalService()
