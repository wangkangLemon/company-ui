import Vue from 'vue'
import VueCookies from 'vue-cookies'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import store from './store'
import router from './router'
import config from './utils/config'
import authUtils from './utils/authUtils'
import VueAMap from 'vue-amap'
import MixinUtils from './utils/mixinUtils'
import '../theme/index.css'

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  // 高德的key
    key: '80c484eafa4e30657b52624e7946468c',
  // 插件集合
    plugin: ['Geolocation', 'Geocoder', 'Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor']
})

Vue.config.productionTip = false
// 开启本地调试 可以用浏览器vue插件进行调试 并显示警告
Vue.config.devtools = config.debug
Vue.use(VueCookies)
Vue.use(ElementUI)

// 设置html字体大小
document.documentElement.style.fontSize = window.innerWidth / 21.6 + 'px'

let mixinPlugins = {
    install: function (Vue, options) {
        let mixinObj = {}
        Object.getOwnPropertyNames(MixinUtils.prototype).forEach(mixin => {
            mixinObj[mixin] = MixinUtils.prototype[mixin]
        })
        Vue.mixin({
            methods: mixinObj,
            // 权限判断
            created () {
                this.auth = store.state.auth.operations
                this.userInfo = authUtils.getUserInfo()
            }
        })
    }
}
Vue.use(mixinPlugins)
// 定义全局变量
window.xmview = {
    // success/warning/info/error
    showTip: function (type, msg, msgDuring = 3000) {
        return ElementUI.Message({
            type,
            message: msg,
            duration: msgDuring
        })
    },
    closeAllTip () {
        ElementUI.Message.closeAll()
    },
    // 导出查看进度提示
    showExportTip (fun) {
        ElementUI.Message({
            dangerouslyUseHTMLString: true,
            message: '<p>导出任务已创建 <i style="color: #2483d5;cursor: pointer; margin-left:10px;" id="chakan">查看进度</i></p>',
            type: 'success',
            showClose: true,
        })
        typeof fun == 'function' && fun(document.getElementById('chakan'))
    }
}
window.xmrouter = router
window.xmconfig = {
    apiHost: config.apiHost,
    getAuthToken: authUtils.getAuthToken,
    getTwiceToken: authUtils.getTwiceToken
}

// ===保留此处=== 每次构建打印一个日期, 避免app.js的hash值没有变化
console.info(process.buildTime, 'buildTime')

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})

export default {}
