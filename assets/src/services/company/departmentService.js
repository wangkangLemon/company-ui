// 门店
import authUtils from '../../utils/authUtils'
import * as api from '../api'
import config from '../../utils/config'
let company_id = authUtils.getUserInfo().company_id
const urlPre = `${config.apiHost}/com/${company_id}/department`

class DepartmentService {
    // 获取门店列表
    departmentSearch ({keyword, organization_id, type, page, page_size}) {
        let finalUrl = `${urlPre}/search`
        return api.get(finalUrl, {keyword, organization_id, type, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 获取门店列表
    departmentSearchByName ({keyword, organization_id, type, page, page_size}) {
        let finalUrl = `${urlPre}/search/name`
        return api.get(finalUrl, {keyword, organization_id, type, page, page_size}).then((ret) => {
            return ret.data
        })
    }
    // 新增门店
    addDepartment ({ name = '', pid = '', tel = '', fax = '', contact = '', mobile = '', address = '', province = 0, city = 0, area = 0, zip = '', description = '', sort = '', isdep, private_id }) {
        let finalUrl = `${urlPre}`
        return api.post(finalUrl, { name, pid, tel, fax, contact, mobile, address, province, city, area, zip, description, sort, isdep, private_id }).then((ret) => {
            if (ret.code) {
                Promise.reject(ret)
            } else {
                return ret.data
            }
        })
    }
    // 修改门店
    updateDepartment ({id, name, sort, tel, fax, province = 0, city = 0, area = 0, address, zip, description, isdep, private_id}) {
        let finalUrl = `${urlPre}/${id}`
        return api.put(finalUrl, {name, sort, tel, fax, province, city, area, address, zip, description, isdep, private_id}).then(ret => ret.data)
    }
    // 获取门店信息
    getDepartmentInfo ({department_id}) {
        let finalUrl = `${urlPre}/${department_id}`
        return api.get(finalUrl).then((ret) => {
            return ret.data
        })
    }
    // 删除门店
    deleteDepartment ({department_id}) {
        let finalUrl = `${urlPre}/${department_id}`
        return api.del(finalUrl).then(ret => {
            if (ret.code) {
                Promise.reject(ret)
            }
        })
    }
    /*
        批量删除门店
        ids 以，分隔的字符串
     */
    batchDelete ({ids}) {
        let finalUrl = `${urlPre}/batchdelete`
        return api.post(finalUrl, {ids})
    }
    // 移动门店
    moveDepartment ({pid, id}) {
        let finalUrl = `${urlPre}/move`
        return api.post(finalUrl, {pid, id})
    }

    getDepartmentUploadUrl () {
        return `${urlPre}/import`
    }

    getDepartmentTemplateUrl () {
        return 'https://upload.yst.vodjk.com/assets/download/import/department_new.xlsx'
    }

    getManagerUploadUrl () {
        return `${urlPre}/import/manager`
    }
    getManagerTemplateUrl () {
        return 'https://upload.yst.vodjk.com/assets/download/import/manager_new.xlsx'
    }
}
export default new DepartmentService()
