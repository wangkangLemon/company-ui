<style>
    #course-docshow {
        width: 100%;
    }
</style>
<template>
    <iframe id="course-docshow" ref="container" :src="dataUrl"  frameborder="0" scrolling="yes"></iframe>
</template>

<script>
    import authUtils from '../../../utils/authUtils'
    export default{
        props: ['docurl'],
        data () {
            return {
                loading: true,
                url: void 0,
                token: void 0,
                dataUrl: void 0,
            }
        },
        created () {
            this.getdoc()
        },
        mounted () {
            this.$refs.container.style.height = 500 + 'px'
        },
        watch: {
            'docurl' (val) {
                document.querySelector('#course-docshow').innerHTML = ''
                this.getdoc()
            }
        },
        methods: {
            getdoc () {
                this.token = authUtils.getAuthToken()
                // this.url = this.$route.query.url
                if (!this.docurl) return
                var xhr = new window.XMLHttpRequest()
                xhr.open('GET', this.docurl)
                xhr.onreadystatechange = handler
                xhr.responseType = 'blob'
                xhr.setRequestHeader('Authorization', 'Bearer ' + authUtils.getAuthToken())
                xhr.setRequestHeader('TwoStep', `Bearer ${authUtils.getTwiceToken()}`)
                xhr.send()
                let _this = this

                function handler () {
                    if (this.readyState === this.DONE) {
                        if (this.status === 200) {
                            // this.response is a Blob, because we set responseType above
                            var data_url = window.URL.createObjectURL(this.response)
                            _this.dataUrl = data_url
                            this.loading = false
                        } else {
                            xmview.showTip('error', '文档初始化错误')
                        }
                    }
                }
            }
        },
        components: {}
    }
</script>
