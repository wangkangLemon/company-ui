import * as api from '../api'
import authUtils from '../../utils/authUtils'
import config from '../../utils/config'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/course/doc`

class DocService {
    //  获取文档
    getDocList ({page, page_size, keyword, status, company_id, file_type, time_start, time_end}) {
        let url = `${urlPre}/search`
        return api.get(url, {page, page_size, keyword, status, company_id, file_type, time_start, time_end}).then((ret) => {
            return ret.data
        })
    }
    // 查看文档
    readDoc ({doc_id}) {
        let finalUrl = `${urlPre}/${doc_id}/view`
        return api.get(finalUrl)
    }
    deleteDoc ({doc_id}) {
        let url = `${urlPre}/${doc_id}`
        return api.del(url, {}, true)
    }
    retryDoc ({doc_id}) {
        let finalUrl = `${urlPre}/${doc_id}/retry`
        return api.get(finalUrl)
    }
    getDocUploadUrl () {
        return `${urlPre}/upload`
    }
}
export default new DocService()
