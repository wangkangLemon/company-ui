import * as api from '../api'
import config from '../../utils/config'
import authUtils from '../../utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/slider`

class SliderService {
    getSliderList (fetchParam) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, fetchParam).then((ret) => {
            return ret.data
        })
    }
    deleteSlider (id) {
        let finalUrl = `${urlPre}/${id}`
        return api.del(finalUrl, {})
    }
    uploadImg ({image, alias}) {
        let url = `${urlPre}/cover`
        return api.post(url, {image, alias}).then((ret) => ret.data)
    }
    addSlider (form) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, form)
    }
    updateSlider (form) {
        let finalUrl = `${urlPre}/${form.id}`
        return api.put(finalUrl, form)
    }
}

export default new SliderService()
