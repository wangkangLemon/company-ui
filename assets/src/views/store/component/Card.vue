<style lang="scss" scoped>
    @import "~utils/mixins/theme_leij";
    @import "~utils/mixins/mixins";
    .card {
        position: relative;
        height: 190px;
        border: 1px solid #ddd;
        border-radius: 5px;
        // background: linear-gradient(133deg, #E2D1C2 20%, #fdfcfb);
        background: radial-gradient(#fdfcfb 20%, #E2D1C2);
        overflow: hidden;
        .cover {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            // height: 50px;
            padding: 5px 20px;
            background: rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .btn {
            @extend %btn-with-radius;
            transition: background .5s;
            &:hover {
                background: #c1c1c1;
            }
        }
        .left {
            color: #fff;
            .title {
                word-break: break-all;
                // @extend %singline;
            }
            .sub-title {
                font-size: 11px;
                opacity: 0.6;
            }
        }
        &:hover {
            img {
                transform: scale(1.2);
            }
        }
        img {
            transition: transform .6s;
        }
    }
</style>

<template>
    <div class="card">
        <img :src="data.cover | fillImgPath" alt="" width="100%" height="100%">
        <div class="cover">
            <div class="left">
                <p class="title">{{data.name}}</p>
                <template v-if="data.is_free === 1">
                    <p>免费使用</p>
                </template>
                <template v-else>
                    <p class="sub-title" v-if="data.is_purchased === 2">
                        已购买 {{data.user_total}}人
                    </p>
                    <p class="sub-title">
                        <span v-if="data.goods_type === 'goods'">
                            优惠价：¥{{data.favorable_price_com}}/人
                        </span>
                        <span v-else-if="data.favorable_type === 1">
                            打包优惠价：¥{{data.favorable_price_com}}/人
                        </span>
                        <span v-else-if="data.favorable_type === 2">
                            满{{data.favorable[0].reach}}打{{data.favorable[0].discount}}折
                        </span>
                        <span>原价：¥{{data.price_com}}/人</span>
                    </p>
                </template>
            </div>
            <div class="right">
                <p 
                    v-if="data.is_purchased"
                    class="btn"
                    @click.stop="buy(data)">
                    {{data.is_purchased === 1 ? '立即' : '再次'}}购买
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        props: {
            url: String,
            data: Object
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                total: 0,
                fetchParam: {
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            buy (data) {
                this.$emit('buy', data)
            }
        },
        filters: {},
        directives: {},
    }
</script>
