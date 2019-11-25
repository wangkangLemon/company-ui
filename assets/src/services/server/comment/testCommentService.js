import authUtils from 'utils/authUtils'
import * as api from '../../api'
import config from 'utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/course/comment`

class TestCommentService {
    search ({course_name, department_id, user_name, status, time_start, time_end, page, page_size}) {
        let url = `${urlPre}/search`
        if (status === '' || status === undefined) status = -1
        return api.get(url, {course_name, department_id, user_name, status, time_start, time_end, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 删除评论
    updateCommentStatus (commentId, status) {
        let url = `${urlPre}/${commentId}`
        return api.put(url, JSON.stringify({status: status})).then((ret) => {
            return ret.data
        })
    }

    batch ({
        comment_id,
        status
    }) {
        let url = `${urlPre}/batch`
        return api.put(url, { comment_id, status }, false, true).then(ret => {
            xmview.showTip('success', ret.message || `批量${status === 1 ? '驳回' : '通过'}成功`)
        })
    }
}

export default new TestCommentService()
