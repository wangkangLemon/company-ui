<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-selling-order-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-selling-order-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>门店</i>               
                <Department 
                    v-model="fetchParam.department_id"
                    :change="fetchData">
                </Department>
            </section>
            <section>
                <i>订单编号</i>
                <el-input
                    v-model="fetchParam.num"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>会员姓名</i>
                <el-input
                    v-model="fetchParam.customer_vip_name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>手机号</i>
                <el-input
                    v-model="fetchParam.customer_vip_mobile"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>会员卡号</i>
                <el-input
                    v-model="fetchParam.customer_vip_num"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <DateRange 
                    title="销售时间" 
                    :start="fetchParam.start_date" 
                    :end="fetchParam.end_date"
                    v-on:changeStart="val => { fetchParam.start_date=val }"
                    v-on:changeEnd="val => { fetchParam.end_date=val }"
                    :change="fetchData">
                </DateRange>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="订单编号" 
                    prop="num" 
                    min-width="120">
                    <el-button 
                        slot-scope="{ row }" 
                        type='text' 
                        @click="$router.push({name: 'member-selling-order-detail', query: { order_id: row.id, time }})">
                        {{row.num}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="门店" 
                    prop="department_name" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="会员姓名" 
                    prop="customer_vip_name" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="手机号" 
                    prop="mobile" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="会员卡号" 
                    prop="customer_vip_num" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="销售时间" 
                    prop="created_at" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="总价" 
                    prop="real_money" 
                    width="80">
                    <span slot-scope="{ row }">¥{{row.real_money}}</span>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>
    </main>
</template>

<script>
    import sellingService from 'services/member/sellingService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import Department from 'components/select/Department.vue'

    export default {
        components: {
            DateRange,
            Department
        },
        props: {},
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {
            time () {
                if (this.fetchParam.start_date && this.fetchParam.end_date) {
                    return `${this.fetchParam.start_date} - ${this.fetchParam.end_date}`
                }
            }
        },
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    department_id: '',
                    num: '',
                    customer_vip_name: '',
                    customer_vip_mobile: '',
                    customer_vip_num: '',
                    start_date: '',
                    end_date: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return sellingService.searchOrder(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
