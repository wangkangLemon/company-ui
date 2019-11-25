import * as api from './api'
import config from '../utils/config'
import authUtils from '../utils/authUtils'
const urlPre =`${config.apiHost}/com/${authUtils.getUserInfo().company_id}/activity`
const url=`${config.apiHost}/com/activity`
class CheckInActivity {
    //签到二维码
    sign_code({path,protocol,id}){
        const finalUrl = `${url}/qrcode`
        return api.get(finalUrl, {path,protocol,id}).then(ret=>{
            return ret.data
        }).catch(err=>{
           
        })
    }
   
    //下载图片
    exportDownload ({path,id,token},name) {
        let finalUrl = `${url}/qrcode`
        return api.downLoad(finalUrl, {path,id,token}, name)
    }
    //查看信息
    checkList(id) {
        const finalUrl = `${urlPre}/get/${id}`
        return api.get(finalUrl, {}).then(ret => {
            
            return ret.data
        })
    }
    //签到列表
    signinList({department_id,keyword,activity_id,sign_type,effective, page,page_size,signin_effective,signback_effective}) {
        const finalUrl = `${urlPre}/signin/lists`
        return api.get(finalUrl, {department_id,keyword,activity_id,sign_type,effective, page,page_size,signin_effective,signback_effective}).then(ret => {
           
            return ret.data
        })
    }
    //活动列表
    activityList({ keyword,page,page_size,online_type,signin_type}) {
        const finalUrl = `${urlPre}/lists`
        return api.get(finalUrl, {keyword,page,page_size,online_type,signin_type}).then(ret => {
           
            return ret.data
        })
    }
    //创建活动
    createActivity({ title,sdate,start_time,end_time, teacher,online_type, intr, address,signin_type,signin_range,signin_x,signin_y }) {
        const finalUrl = `${urlPre}/create`
        return api.post(finalUrl, {title,sdate,start_time,end_time, teacher,online_type, intr, address,signin_type,signin_range,signin_x,signin_y }).then(ret => {

            return ret
        })
    }
    //更新活动
    editActivity(id,{title,sdate,start_time,end_time, online_type, teacher,intr, address,signin_type,signin_range,signin_x,signin_y}) {
        const finalUrl = `${urlPre}/edit/${id}`
        return api.post(finalUrl, {title,sdate,start_time,end_time, online_type, teacher,intr, address,signin_type,signin_range,signin_x,signin_y }).then(ret => {
            
            return ret
        })
    }
    //删除
    deleteActivity(id) {
        const finalUrl = `${urlPre}/delete/${id}`
        return api.post(finalUrl, {}).then(ret => {

            return ret
        })
    }

}

export default new CheckInActivity()