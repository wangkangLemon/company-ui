<style lang="scss">
    @import "~utils/mixins/theme_leij";
    .store-detail-course-container {
        width: 70%;
        .rich-media {
            // width: 100%;
            margin-bottom: 20px;
        }
        .favorable-info {
            margin: 10px 0 20px;
        }
        .rich-text {
            // width: 100%;
            // height: 100px;
            color: $color-grey;
            padding: 20px;
            border: 1px solid $color-line-grey;
        }
    }
</style>

<template>
    <main class="store-detail-course-container">
        <div class="rich-media">
            <!-- 视频 show_type:2-->
            <!-- 图片 show_type:1-->
            <img 
                v-if="data.show_type === 1" 
                :src="data.cover | fillImgPath" 
                alt="课程封面">
            <VideoPreview 
                class="video-preview"
                v-else
                :dialog="false"
                :url="data.show_video_url" 
                ref="videoPreview">
            </VideoPreview>
        </div>
        <h2>
            <span>{{data.name}}</span>
            <span v-if="!isGoods">(包含{{data.goods.length}}个单品)</span>
        </h2>
        <p class="favorable-info">
            <template v-if="data.favorable_type !== 2">
                <span class="text-grey" v-if="isGoods">单品优惠价</span>
                <span class="text-grey" v-else-if="data.favorable_type === 1">打包优惠价</span>
                <span class="text__large text__important">¥{{data.favorable_price_com}}/人</span>
                <s class="text__middle">¥{{data.price_com}}/人</s>
            </template>
            <template v-else>
                <span class="text-grey">满折优惠价</span>
                <span class="text__large text__important">
                    满{{data.favorable[0].reach}}打{{data.favorable[0].discount}}折
                </span>
                <s class="text__middle">¥{{discount}}/人</s>
            </template>
        </p>
        <!-- 富文本 -->
        <div class="rich-text" ref="introduce"></div>
    </main>
</template>

<script>
    import VideoPreview from 'components/dialog/VideoPreview.vue'

    export default {
        components: {
            VideoPreview
        },
        props: {
            isGoods: Boolean,
            data: Object,
        },
        activated () {},
        created () {
            this.$nextTick(() => {
                this.$refs.introduce.innerHTML = this.data.introduce
            })
        },
        mounted () {},
        computed: {
            discount () {
                return this.data.goods.reduce((prev, curr) => {
                    return prev + parseFloat(curr.favorable_price_com)
                }, 0).toFixed(2)
            }
        },
        watch: {
            'data.introduce' (val) {
                this.$refs.introduce.innerHTML = val
            }
        },
        data () {
            return {
                loading: false,
            }
        },
        methods: {
        },
        filters: {},
        directives: {},
    }
</script>
