// 正式
const fs = require('fs')
const runENV = process.env.RUN_ENV
const path = require('path')
const filePath = path.resolve('./public', 'statistics.js')
const template = {
    prod: `
            // 正式环境统计代码
            var _mtac = {};
            (function() {
                var mta = document.createElement("script");
                mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.4";
                mta.setAttribute("name", "MTAH5");
                mta.setAttribute("sid", "500611729");

                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(mta, s);
            })();`,
    dev: `
            // 测试环境统计代码
            var _mtac = {"performanceMonitor":1,"senseQuery":1};
            (function() {
                var mta = document.createElement("script");
                mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.4";
                mta.setAttribute("name", "MTAH5");
                mta.setAttribute("sid", "500611770");
                mta.setAttribute("cid", "500611771");
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(mta, s);
            })();`
}
console.log('正在导入统计代码...')
runENV === 'dev' ? fs.writeFileSync(filePath, template['dev']) : fs.writeFileSync(filePath, template['prod'])
console.log('统计代码导入完成')
