import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}`

class CommonService {
    uploadCover ({
        upload_type,
        alias,
        image
    }) {
        const finalUrl = `${urlPre}/image/base64`
        return api.post(finalUrl, { upload_type, alias, image }).then(ret => {
            xmview.showTip('success', '图片上传成功')
            return ret.data
        })
    }
}

export default new CommonService()
