// 报表中心
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/export`

class ExportService {
    // 获取导出列表
    exportSearch ({status, time_start, time_end, page, page_size}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 考试导出创建
    testCreate ({name, params}) {
        let finalUrl = `${urlPre}/testing`
        return api.post(finalUrl, {name, params})
    }
    // 下载文件
    exportDownload ({id, name}) {
        let finalUrl = `${urlPre}/${id}/download`
        return api.downLoad(finalUrl, {}, name)
    }
    // 导出文件取消
    exportCancel ({id}) {
        let finalUrl = `${urlPre}/${id}/delete`
        return api.del(finalUrl)
    }
    // 导出文件重试
    exportRetry ({id}) {
        let finalUrl = `${urlPre}/${id}/retry`
        return api.put(finalUrl)
    }
}
export default new ExportService()
