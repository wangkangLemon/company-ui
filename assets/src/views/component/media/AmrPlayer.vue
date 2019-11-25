<!--<VueAmrPlayer url="model.url"></VueAmrPlayer>-->
<template>
    <el-button type="text"  @click="play">
        <svg class="icon" style="font-size: 30px; width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1389"><path d="M371.873684 526.37193C350.315789 503.017544 314.385965 503.017544 291.031579 526.37193c-21.557895 21.557895-21.557895 57.487719 0 80.842105 21.557895 21.557895 57.487719 21.557895 80.842105 0C393.431579 583.859649 393.431579 547.929825 371.873684 526.37193L371.873684 526.37193zM458.105263 359.298246l-55.691228 55.691228c82.638596 82.638596 82.638596 217.375439 0 301.810526L458.105263 772.491228C571.284211 657.515789 571.284211 474.273684 458.105263 359.298246L458.105263 359.298246zM573.080702 244.322807l-55.691228 55.691228c147.312281 147.312281 147.312281 384.449123 0 531.761404l55.691228 55.691228C750.933333 709.614035 750.933333 422.175439 573.080702 244.322807L573.080702 244.322807z" p-id="1390"></path></svg>
    </el-button>
</template>

<script>
export default {
    name: 'VueAmrPlayer',
    props: {
        amrPath: {
            // amrPlayer 代码的路径
            type: String,
            default: '/vendor/amr/'
        },
        url: {
            // amr http地址
            type: String,
            default: function () {
                return {}
            }
        },
    },
    data () {
        return {
        }
    },
    created () {
        // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
        this.insertScriptTag()
    },
    methods: {
        insertScriptTag () {
            let armScriptTag = document.getElementById('armScriptTag')
            let playerScriptTag = document.getElementById('playerScriptTag')
            // 如果这个tag不存在，则生成相关代码tag以加载代码
            if (armScriptTag === null) {
                armScriptTag = document.createElement('script')
                armScriptTag.type = 'text/javascript'
                armScriptTag.src = this.amrPath + 'amrnb.js'
                armScriptTag.id = 'armScriptTag'
                playerScriptTag = document.createElement('script')
                playerScriptTag.type = 'text/javascript'
                playerScriptTag.src = this.amrPath + 'amrplayer.js'
                playerScriptTag.id = 'playerScriptTag'
                let s = document.getElementsByTagName('head')[0]
                s.appendChild(armScriptTag)
                s.appendChild(playerScriptTag)
            }
        },
        play () {
            window.playAmr(this.url)
        },
    }
}
</script>
