/**
 * Created by huanghuixin on 2017/3/20.
 * 通过webpack的definePlugin链接node配置文件的/assets/config/index.js文件
 */

let debug = process.env.NODE_ENV == 'development'

const config = {
    isMobile () {
        return window.innerWidth < 767
    },
    apiHost: process.apiHost,
    oldCompanyDomain: process.oldCompanyDomain,
    payUrl: process.payUrl,
    debug
}

export default config
