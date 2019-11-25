import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/mobile`
//  手机客户端
class MobileService {
// 获取名称
    getAll () {
        let url = `${urlPre}`
        return api.get(url).then((ret) => {
            return ret.data
        })
    }
    // 上传 加载图片
    upLoadBoot ({image, alias}) {
        let url = `${urlPre}/boot/upload`
        return api.post(url, {image, alias}).then((ret) => ret.data)
    }
    // logo 上传
    upLoadLogo ({image, alias}) {
        let url = `${urlPre}/logo/upload`
        return api.post(url, {image, alias}).then((ret) => ret.data)
    }
    // 修改 logo
    upDateLogo ({logo, name}) {
        let url = `${urlPre}/logo`
        return api.put(url, {logo, name}).then((ret) => {
            return ret
        })
    }
    // 修改加载
    upDateBoot ({logo_app_boot}) {
        let url = `${urlPre}/boot`
        return api.put(url, {logo_app_boot}).then((ret) => {
            return ret
        })
    }
}
export default new MobileService()
