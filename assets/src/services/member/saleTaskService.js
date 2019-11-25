import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const company_id = authUtils.getUserInfo().company_id
const urlPre = config.apiHost + `/com/${company_id}/saletask`

class SaleTaskService {
    // 销售任务检索
    searchSaleTask ({
        name,
        target_department_id,
        start_date,
        end_date,
        create_start_time,
        create_end_time,
        finished,
        status,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, { name, target_department_id, start_date, end_date, create_start_time, create_end_time, finished, status, page, page_size }).then(ret => ret.data)
    }
    // 销售任务上下线
    disableTask ({
        saletask_id,
        status,  // 2-上线，3-下线
    }) {
        let finalUrl = `${urlPre}/${saletask_id}/disable`
        return api.put(finalUrl, { status }, false, true).then(ret => {
            xmview.showTip('success', ret.message || `${status === 2 ? '上线' : '下线'}成功`)
        })
    }
    // 任务添加
    createTask ({
        name,
        target_department_id,
        target_money,
        start_date,
        end_date,
        medicine_id
    }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, { name, target_department_id, target_money, start_date, end_date, medicine_id }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '添加任务成功')
        })
    }
    // 任务修改
    updateTask ({
        id,
        name,
        target_department_id,
        target_money,
        start_date,
        end_date,
        medicine_id
    }) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, { name, target_department_id, target_money, start_date, end_date, medicine_id }, false, true).then(ret => {
            xmview.showTip('success', ret.message || '更新成功')
        })
    }
    // 获取要修改的任务
    getTaskData (saletask_id) {
        let finalUrl = `${urlPre}/${saletask_id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 销售业绩检索
    searchPerformance ({
        sale_task_id,
        category_id,
        medicine_id,
        status,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/medicine/search`
        return api.get(finalUrl, { sale_task_id, category_id, medicine_id, status, page, page_size }).then(ret => ret.data)
    }
}
export default new SaleTaskService()
