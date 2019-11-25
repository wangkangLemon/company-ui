<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #finance-log-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <main id="finance-log-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>账单月份</i>
                <el-date-picker
                    value-format="yyyy-MM"
                    type="month"
                    v-model="fetchParam.stat_month"
                    @change="fetchData">
                </el-date-picker>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-document" 
                type='warning' 
                @click="exportFile">
                导出
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="产品名称" 
                    prop="product_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="工业名称" 
                    prop="industry_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="学习人数" 
                    prop="learn_user_count" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="支出" 
                    prop="money" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="月份" 
                    prop="stat_month" 
                    width="100">
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
    import financeService from 'services/finance/financeService'
    import DateRange from 'components/form/DateRangePicker.vue'

    export default {
        components: {
            DateRange
        },
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    stat_month: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return financeService.searchBill(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            exportFile () {
                return financeService.exportBill(this.fetchParam).then((ret) => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
