// 审批
import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'

const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/app`

class AppSettingService {
    //  企业应用首页
    getHomeList () {
        let url = `${urlPre}/setting`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 应用列表（小应用+系统应用）
    getSettingList () {
        let url = `${urlPre}/setting/search`
        return api.get(url, {}).then((ret) => {
            return ret.data
        })
    }
    // 小应用添加
    appCreate (form) {
        let url = `${urlPre}`
        return api.post(url, form)
    }
    // 小应用修改
    appUpdate (form) {
        let url = `${urlPre}/${form.id}`
        return api.put(url, form)
    }
    //  小应用删除
    appDelete (id) {
        let url = `${urlPre}/${id}`
        return api.del(url, {})
    }
    // 小应用上线
    appEnable (id) {
        let url = `${urlPre}/${id}/enable`
        return api.post(url, {})
    }
    // 小应用下线
    appDisable (id) {
        let url = `${urlPre}/${id}/disable`
        return api.post(url, {})
    }
    // 系统应用更新
    sysAppUpdate (form) {
        let url = `${urlPre}/setting`
        return api.put(url, form)
    }
    // 系统应用设置联系人权限
    sysAppSetAcaEmployee ({id, aca_type, department_id}) {
        let url = `${urlPre}/setting/aca/employee`
        return api.put(url, {id, aca_type, department_id})
    }
    // 应用图标上传
    upLoadingImg ({image, alias}) {
        let url = `${urlPre}/cover`
        return api.post(url, {image, alias}).then((ret) => ret)
    }
}

export default new AppSettingService()
