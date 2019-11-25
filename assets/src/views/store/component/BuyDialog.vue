<style lang="scss">
    @import "~utils/mixins/theme_leij";

    $color: #ff5939;
    #store-buydialog-container {
        margin-bottom: 20px;
        .text__weight {
            font-weight: 700;
        }
        .top {
            h2 {
                font-weight: 700;
            }
        }
        .middle {
            display: flex;
            flex-wrap: wrap; // 换行
            padding-top: 20px;
            border-top: 1px solid #ddd;
            margin: 20px 0;
            .goods {
                // width: 100px;
                padding: 10px 20px;
                border: 1px solid $color;
                margin: 0 10px 10px 0;
                text-align: center;
                color: $color;
                transition: all .3s cubic-bezier(0.37, 0.14, 0.3, 1.07);
            }
            .goods_deactive {
                border-color: #eee;
                color: #eee;
            }
            .goods_choose {
                cursor: pointer;
            }
        }
        .bottom {
            padding: 20px;
            background: #ececec;
            .custom-input {
                padding: 0 5px;
                width: 70px;
                height: 28px;
                margin: 0 5px;
            }
            .bottom-middle {
                margin: 14px 0 0;
            }
            .favorable-block {
                display: inline-block;
                vertical-align: top;
            }
            .favorable-block + .favorable-block {
                margin-left: 15px;
            }
        }
    }
    .custom-dialog {
        .el-dialog {
            padding: 20px;
        }
        .el-dialog__footer {
            text-align: left;
        }
    }
</style>

<template>
    <el-dialog 
        v-if="showDialog"
        :title="title" 
        class="custom-dialog"
        :visible.sync="showDialog">
        <main id="store-buydialog-container" v-loading="loading">
            <section class="top">
                <h2>{{data.name}}</h2>
                <!-- 已选择的单品，如果类型为单品，则不显示 -->
                <p class="text__middle" v-if="!isGoods">
                    <span v-if="data.favorable_type === 1">打包购买：{{names}}</span>
                    <span v-else>已选：{{names}}</span>
                </p>
                <!-- 每人优惠价和原价 -->
                <!-- 优惠价根据优惠阶梯前端计算 -->
                <!-- 单品和打包的原价直接去拿传过来的favorable_price，满折的原价根据包含的所选的单品动态计算得来 -->
                <p class="">
                    <span class="text__large text__important">
                        ¥{{favorable_price}}&nbsp;
                    </span>
                    <s class="text__middle">¥{{price}}</s>
                </p>
            </section>
            <section class="middle">
                <div 
                    v-for="(good, index) in goods"
                    :key="good.id"
                    @click="chooseGood(good, index)"
                    :class="['goods', { 'goods_deactive': good.deactive }, {'goods_choose': data.favorable_type === 2}]">
                    {{good.name}}
                </div>
            </section>
            <section class="bottom">
                <p>
                    使用店员数
                    <input 
                        class="el-input__inner custom-input"
                        v-model.number="person" 
                        v-pnumberOnly>人
                </p>
                <p class="bottom-middle">
                    <span class="text__large text__important text__weight">
                        总计：¥{{favorable_price_all}}&nbsp;
                    </span>
                    <s class="text__middle">¥{{price_all}}</s>
                </p>
                <p class="text__small">
                    <span>享受优惠：</span>
<!--                     <span v-if="data.favorable_type === 1">
                        商品打包优惠(优惠¥{{discount_combine}})，
                    </span> -->
                    <template v-if="data.favorable || data.favorable_group_buying">
                        <div class="favorable-block" v-if="data.favorable_type === 2">
                            <p 
                                v-for="(item,index) in data.favorable || []"
                                :key="index">
                                商品优惠满{{item.reach}}元打{{item.discount}}折
                                (优惠¥{{discount_reduce[index] || '0.00'}})
                            </p>
                        </div>
                        <div class="favorable-block">
                            <p 
                                v-for="(item,index) in data.favorable_group_buying || []"
                                :key="index">
                                团购优惠满{{item.reach}}人打{{item.discount}}折
                                (优惠¥{{discount_group[index] || '0.00'}})
                            </p>
                        </div>
                    </template>
                    <template v-else>无团购优惠</template>
                </p>
            </section>
        </main>
        <span slot="footer" v-loading="loading">
            <el-button 
                class="custom-btn"
                type="primary" 
                @click="buy">
                前往支付
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import storeService from 'services/store/storeService'
    import config from 'utils/config'
    import * as math from 'mathjs'
    math.config({
        number: 'BigNumber',
        precision: 64
    })
    export default {
        components: {},
        props: {
            title: String,
            visible: Boolean,
            data: Object,
        },
        activated () {},
        created () {
            console.log('buydialog', this.data)
            // 如果不是单品则需要请求优惠接口
            if (!this.isGoods) {
                this.fetchData()
            } else {
                this.goods = [this.data]
            }
            this.sortFavorable(this.data.favorable)
            this.sortFavorable(this.data.favorable_group_buying)
        },
        mounted () {},
        computed: {
            names () {
                return this.goods.filter(item => !item.deactive).map(item => item.name).join(',')
            },
            ids () {
                return this.goods.filter(item => !item.deactive).map(item => item.id)
            },
            // 每人单品优惠价
            favorable_price () {
                let result = parseFloat(this.data.favorable_price_com)
                // 满折
                if (this.data.favorable_type === 2) {
                    if (this.price) {
                        result = parseFloat(this.price);
                        let _maxReach1 = (this.data.favorable || [])
                                .filter(item => parseFloat(this.price) >= item.reach)
                        let maxReach1 = _maxReach1.slice(-1)[0]
                        if (maxReach1 && maxReach1.discount > 0) {
                            let len = _maxReach1.length - 1
                            let _discount = math.eval(`${maxReach1.discount}/ 10`)
                            // result *= _discount
                            result = math.eval(`${result} * ${_discount}`)
                            this.discount_reduce.forEach((item, index, arr) => {arr[index] = 0})
                            this.discount_reduce[len] = (parseFloat(this.price) * (1 - _discount) * this.person).toFixed(2)
                        } else {
                            this.discount_reduce.forEach((item, index, arr) => {arr[index] = 0})
                        }
                    }
                }
                // 团购
                let _maxReach2 = (this.data.favorable_group_buying || [])
                                    .filter(item => this.person >= item.reach)
                let maxReach2 = _maxReach2.slice(-1)[0]
                if (maxReach2 && maxReach2.discount > 0) {
                    let len = _maxReach2.length - 1
                    // let _discount = maxReach2.discount / 10
                    let _discount = math.eval(`${maxReach2.discount}/ 10`)
                    // 如果有满折，应先在满折后的价格基础上计算团购优惠了的价格
                    this.discount_group.forEach((item, index, arr) => {arr[index] = 0})
                    this.discount_group[len] = 
                        (parseFloat(this.data.favorable_type === 2 ? result : this.price)
                        * (1 - _discount) 
                        * this.person).toFixed(2)
                    // result *= _discount
                    result = math.eval(`${result} * ${_discount}`)
                } else {
                    // 如果person小于团购阶梯最小的直接置为0
                    this.discount_group.forEach((item, index, arr) => {arr[index] = 0})
                }
                return isNaN(result) ? 0 : Math.floor(result * 100) / 100
            },
            // 每人单品价原价单品，打包一样，满折根据所选动态计算
            price () {
                // 单品和打包直接取favorable_price_com
                if (this.data.favorable_type !== 2) {
                    return parseFloat(this.data.favorable_price_com).toFixed(2)
                }
                // 满折用goods中的favorable_price_com的和计算得到
                return this.goods.reduce((prev, curr) => {
                    if (!curr.deactive) {
                        return prev + parseFloat(curr.favorable_price_com)
                    }
                    return prev + 0
                }, 0).toFixed(2)
            },
            // 总人优惠价总价
            favorable_price_all () {
                let result = this.person * parseFloat(this.favorable_price)
                return isNaN(result) ? 0 : result.toFixed(2)
            },
            // 总人原价总价
            price_all () {
                let result = this.person * parseFloat(this.price)
                return isNaN(result) ? 0 : result.toFixed(2)
            },
            // 打包优惠的价钱
            discount_combine () {
                let result = (this.goods.reduce((prev, curr) => {
                    return (prev + parseFloat(curr.favorable_price_com))
                }, 0) - this.favorable_price_com) * this.person 
                return isNaN(result) ? 0 : result.toFixed(2)
            }
        },
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            },
            person (val) {
                return isNaN(parseInt(val)) ? 0 : val
            },
        },
        data () {
            return {
                showDialog: this.visible,
                isGoods: this.data.goods_type !== 'favorable',
                loading: false,
                goods: [],
                person: 0,
                discount_reduce: [],
                discount_group: [],
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return storeService.getFavorableDetail(this.data.id).then(ret => {
                    this.goods = ret.data.goods
                    this.loading = false
                })
            },
            sortFavorable (list) {
                if (!list) return
                list.sort((a, b) => a.reach - b.reach)
            },
            chooseGood (good, index) {
                if (this.data.favorable_type == 2) {
                    good.deactive = !good.deactive
                    // 需要$set一下，否则vue检测不到数组中的某项改变
                    this.$set(this.goods, index, good)
                }
            },
            // 前往支付页面
            buy () {
                if (!this.person || isNaN(this.person)) {
                    return xmview.showTip('warning', '请输入人数')
                }
                if (this.data.favorable_type === 2 && !this.names) {
                    return xmview.showTip('warning', '请至少选择一个单品')
                }
                let param = {
                    goods_type: this.data.goods_type,
                    goods_id: this.data.id,
                    user_count: this.person,
                    price: this.favorable_price_all,
                    ids: this.ids,
                }
                storeService.genOrder(param).then(ret => {
                    window.location.href = `${config.payUrl}/?order_id=${ret.data}&hide=offlinepay`
                    // window.location.href = `https://paydemo.yst.vodjk.com/view/order?order_id=${ret.data}&hide=offlinepay`
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
