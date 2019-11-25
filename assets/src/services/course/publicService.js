import * as api from '../api'
import authUtils from '../../utils/authUtils'
import config from '../../utils/config'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/course`
class PubliServive {

    // 上下线课程
    offlineCourse ({companyid, course_id, disabled}) {
        let finalUrl = `${urlPre}/${course_id}/disable`
        return api.put(finalUrl, {disabled})
    }
       // 批量删除课程
    deleteCourseMulty ({companyid, id}) {
        let finalUrl = `${config.apiHost}/com/${companyid}/course/batchdel`
        return api.post(finalUrl, {id})
    }
       // 批量移动课程到指定分类
    moveCourseToCategoryMulty ({companyid, id, catid}) {
        let finalUrl = `${config.apiHost}/com/${companyid}/course/batchmove`
        return api.post(finalUrl, {id, catid})
    }

}

export default PubliServive()
