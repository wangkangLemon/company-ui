<!--预览视频-->
<style lang='scss' rel='stylesheet/scss'>
    .comp-dialog-videopreview {

    }
</style>

<template>
    <el-dialog 
        v-if="dialog"
        :title="title || '视频预览'" 
        :visible.sync="isShow">
        <div id="J_prismPlayer" class="prism-player"></div>
    </el-dialog>
    <div v-else id="J_prismPlayer" class="prism-player"></div>
</template>

<script>
    export default{
        props: {
            url: String,
            dialog: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                isShow: false,
                title: '',
            }
        },
        beforeCreate () {
            if (window.prismplayer) return

            let loadCount = 0
            let script = document.createElement('script')
            script.src = '//g.alicdn.com/de/prismplayer/1.5.7/prism-flash-min.js'
            script.onload = () => {
                loadCount++
                loadCount >= 2 && this.initPlayer()
            }

            let link = document.createElement('link')
            link.href = '//g.alicdn.com/de/prismplayer/1.5.7/skins/default/index.css'
            link.rel = 'stylesheet'
            link.onload = () => {
                loadCount++
                loadCount >= 2 && this.initPlayer()
            }
            document.head.appendChild(script)
            document.head.appendChild(link)
        },
        created () {
            this.initPlayer()
        },
        watch: {
            'isShow' (val) {
                if (val) {
                    this.initPlayer()
                }
            },
            'url' (val) {
                if (val && !this.dialog) {
                    this.initPlayer()
                }
            }
        },
        methods: {
            show (title) {
                this.title = title
                this.isShow = true
            },
            initPlayer () {
                if (!window.prismplayer || !this.url) return
                /* eslint-disable no-new,new-cap */
                this.$nextTick(() => {
                    new window.prismplayer({
                        id: 'J_prismPlayer', // 容器id
                        source: this.url, // 视频地址
                        autoplay: true,    // 自动播放：否
                        width: '100%',       // 播放器宽度
                        height: '360px'      // 播放器高度
                    })
                })
            }
        },
        components: {}
    }
</script>
