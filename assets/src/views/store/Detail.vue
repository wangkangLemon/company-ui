<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/theme_leij";
    #store-detail-container {
        @extend %content-container;
        .radio-table {
            margin-bottom: 20px;
        }
        .el-radio-group {
            .el-radio-button__inner {
                border: 1px solid #52bff1;
                width: 200px;
            }
            .is-active {
                .el-radio-button__inner {
                    background: #52bff1;
                }
            }
        }
        .pay-btn {
            margin: 5% 0 0 0;
        }
    }
</style>

<template>
    <main id="store-detail-container" v-loading="loading">
        <el-radio-group v-model="radio" class="radio-table">
            <el-radio-button label="课程"></el-radio-button>
            <el-radio-button label="目录"></el-radio-button>
        </el-radio-group>
        <template v-if="data.id">
            <Catalog 
                v-show="component"
                :is-goods="isGoods"
                :data="data">
            </Catalog>
            <Course 
                v-show="!component"
                :is-goods="isGoods"
                :data="data">
            </Course>
        </template>
<!--         <component 
            :is="component"
            :is-goods="isGoods"
            :data="data">
        </component> -->
        <section class="pay-btn">
            <el-button 
                class="custom-btn"
                type="primary" 
                @click="buy">
                前往支付
            </el-button>
        </section>
        <BuyDialog
            v-if="buyObject.showDialog"
            :visible.sync="buyObject.showDialog"
            :data="buyObject.data">
        </BuyDialog>
    </main>
</template>

<script>
    import storeService from 'services/store/storeService'
    import Catalog from './component/Catalog.vue'
    import Course from './component/Course.vue'
    import BuyDialog from './component/BuyDialog.vue'

    export default {
        components: {
            Catalog,
            Course,
            BuyDialog
        },
        props: {},
        activated () {},
        created () {
            xmview.setContentTitle(this.$route.query.name)
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {
            component () {
                return this.radio === '目录'
            }
        },
        watch: {},
        data () {
            return {
                loading: false,
                radio: '目录',
                id: this.$route.query.id,
                data: {},
                isGoods: this.$route.query.goods_type === 'goods',
                buyObject: {
                    showDialog: false,
                    data: {},
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                let service = this.isGoods ? 'getGoodsDetail' : 'getFavorableDetail'
                return storeService[service](this.id).then(ret => {
                    this.data = ret.data || {}
                    if (this.isGoods) {
                        let obj = {
                            id: this.data.id,
                            name: this.data.name,
                            price: this.data.price,
                            favorable_price: this.data.favorable_price,
                            price_app: this.data.price_app,
                            favorable_price_app: this.data.favorable_price_app,
                            category: this.data.category
                        }
                        this.data.goods = [obj]
                    }
                    this.loading = false
                    console.log(this.data)
                })
            },
            buy () {
                this.buyObject.showDialog = true
                this.buyObject.data = this.data
                this.buyObject.data.goods_type = this.$route.query.goods_type
            }
        },
        filters: {},
        directives: {},
    }
</script>
