import * as api from '../api'
import config from 'utils/config'
import authUtils from 'utils/authUtils'
const urlPre = config.apiHost + `/com/${authUtils.getUserInfo().company_id}/selling`

class SellingService {
    // 销售画板
    getSellingDashboard ({
        department_id,
        start_date,
        end_date,
    }) {
        let finalUrl = `${urlPre}/dashboard`
        return api.get(finalUrl, { department_id, start_date, end_date }).then(ret => ret.data)
    }
    // 销售画板-门店销售额图表
    getDepartmentDashboard ({
        department_id,
        start_date,
        end_date,
    }) {
        let finalUrl = `${urlPre}/dashboard/chart/department`
        return api.get(finalUrl, { department_id, start_date, end_date }).then(ret => ret.data)
    }
    // 销售画板-购买人次数图表
    getUserDashboard ({
        department_id,
        start_date,
        end_date,
    }) {
        let finalUrl = `${urlPre}/dashboard/chart/user`
        return api.get(finalUrl, { department_id, start_date, end_date }).then(ret => ret.data)
    }
    // 销售画板-平均客单价图表
    getAvgMoneyDashboard ({
        department_id,
        start_date,
        end_date,
    }) {
        let finalUrl = `${urlPre}/dashboard/chart/avgmoney`
        return api.get(finalUrl, { department_id, start_date, end_date }).then(ret => ret.data)
    }
    // 销售统计检索
    searchOrder ({
        department_id,
        num,
        customer_vip_name,
        customer_vip_mobile,
        customer_vip_num,
        start_date,
        end_date,
        page,
        page_size,
    }) {
        let finalUrl = `${urlPre}/order/search`
        return api.get(finalUrl, { department_id, num, customer_vip_name, customer_vip_mobile, customer_vip_num, start_date, end_date, page, page_size }).then(ret => ret.data)
    }
    // 销售订单详情
    getOrderDetail (order_id) {
        let finalUrl = `${urlPre}/order/${order_id}`
        return api.get(finalUrl).then(ret => ret.data)
    }
    // 品类销售检索
    searchCategroy ({
        medicine_category_id,
        sort_type,
        sort_field,
        start_date,
        end_date,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/category`
        return api.get(finalUrl, { medicine_category_id, sort_type, sort_field, start_date, end_date, page, page_size }).then(ret => ret.data)
    }
    // 品类销售详情检索
    searchDetailedCategory ({
        medicine_category_id,
        department_id,
        sort_type,
        sort_field,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/category/${medicine_category_id}`
        return api.get(finalUrl, { department_id, sort_type, sort_field, page, page_size }).then(ret => ret.data)
    }
    // 药品销售检索
    searchMedicine ({
        medicine_category_id,
        department_id,
        medicine_id,
        start_date,
        end_date,
        sort_type,
        sort_field,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/medicine`
        return api.get(finalUrl, { medicine_category_id, department_id, medicine_id, start_date, end_date, sort_type, sort_field, page, page_size }).then(ret => ret.data)
    }
    // 药品销售详情检索
    searchDetailedMedicine ({
        medicine_id,
        department_id,
        sort_type,
        sort_filed,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/medicine/${medicine_id}`
        return api.get(finalUrl, { department_id, sort_type, sort_filed, page, page_size }).then(ret => ret.data)
    }
    // 门店销售检索
    searchDepartment ({
        department_id,
        start_date,
        end_date,
        sort_type,
        sort_field,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/department`
        return api.get(finalUrl, { department_id, start_date, end_date, sort_type, sort_field, page, page_size }).then(ret => ret.data)
    }
    // 门店销售详情检索
    searchDetailedDepartment ({
        department_id,
        medicine_category_id,
        medicine_id,
        start_date,
        end_date,
        sort_type,
        sort_field,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/department/${department_id}`
        return api.get(finalUrl, { medicine_category_id, medicine_id, start_date, end_date, sort_type, sort_field, page, page_size }).then(ret => ret.data)
    }
    // 店员销售检索
    searchStaff ({
        department_id,
        user_id,
        start_date,
        end_date,
        sort_type,
        sort_field,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/user`
        return api.get(finalUrl, { department_id, user_id, start_date, end_date, sort_type, sort_field, page, page_size }).then(ret => ret.data)
    }
    // 店员销售详情检索
    searchDetailedStaff ({
        user_id,
        medicine_category_id,
        medicine_id,
        start_date,
        end_date,
        sort_type,
        sort_field,
        page,
        page_size
    }) {
        let finalUrl = `${urlPre}/user/${user_id}`
        return api.get(finalUrl, { user_id, medicine_category_id, medicine_id, start_date, end_date, sort_type, sort_field, page, page_size }).then(ret => ret.data)
    }
}
export default new SellingService()
