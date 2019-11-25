<!--全屏显示图片-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .fullScreen-container {
        overflow: hidden;
        position: fixed;
        height: 100%;
        background: rgba(0, 0, 0, 0.6) !important;
        top: 0;
        left: 0;
        z-index: 99999999 !important;

        /*transition: all 300ms ease;*/

        img {
            position: absolute;
            max-width: 100%;
            max-height: 100%;
            @extend %absoluteCenter
        }
    }
</style>

<template>
    <article class="fullScreen-container orignContainer" ref="container" v-show='isShow' @click="hidden()">
        <img :src="imgsrc | fillImgPath" @touchmove="imgEvent($event)">
    </article>
</template>

<script>
    let _this
    export default{
        data () {
            return {
                imgsrc: '',
                position: null,
                isShow: false,
                container: null
            }
        },
        created () {
            _this = this
            document.addEventListener('keyup', (e) => {
                if (e.keyCode == 27) {
                    this.isShow = false
                }
            })
        },
        mounted () {
            let container = this.container = this.$refs.container
            container.style.width = window.innerWidth + 'px'
            container.style.height = window.innerHeight + 'px'
            setCssVal(this.container, 'transform', 'translateX(100%)')
            setTimeout(() => {
                setCssVal(this.container, 'transition', 'all 300ms ease')
            }, 0)
        },
        methods: {
            imgEvent (e) {
                e.preventDefault()
            },
            hidden () {
                this.isShow = false
                setCssVal(this.container, 'transform', 'translateX(100%)')
            }
        },
        setShow (image) {
            _this.imgsrc = image
            _this.isShow = true
            setTimeout(() => {
                setCssVal(_this.container, 'transform', 'translateX(0)')
            }, 0)
        }
    }

    function setCssVal (dom, key, val) {
        dom.style[key] = val
        dom.style['-webkit-' + key] = val
    }
</script>
