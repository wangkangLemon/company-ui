// 数据订阅
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/datamail`

class DatamailService {
    // 获取数据列表
    datamailSearch (param) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, param).then((ret) => {
            return ret.data
        })
    }
    // 创建数据订阅
    addDataMail ({mail, cycle, type, data}) {
        return api.post(urlPre, {mail, cycle, type, data})
    }
    // 修改数据订阅
    updateDataMail ({id, mail, cycle, type, data}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {mail, cycle, type, data})
    }
    // 删除订阅
    deleteDataMail ({id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl)
    }
}
export default new DatamailService()
