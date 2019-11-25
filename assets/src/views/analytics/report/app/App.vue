<style lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-app-app-container {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
    .top-btn {
        @extend %right-top-btnContainer;
    }

    .block {
        float: right;
        margin-top: 15px;
    }
}
</style>

<template>
    <main id="analytics-report-app-app-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <DateRange 
                    title="统计周期：" 
                    :start="fetchParam.time_start" 
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button class="top-btn" icon="el-icon-document" type='warning' @click="fileExport">导出Excel</el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    fixed
                    label="统计日期" 
                    prop="create_date_name"
                    min-width="180">
                </el-table-column>
                <el-table-column 
                    label="APP使用人数"
                    width="180">
                    <el-button slot-scope="scope" type='text' @click="$router.push({name: 'analytics-report-app-used',query: {date: scope.row.create_date_name}})">{{scope.row.used_user}}</el-button>
                </el-table-column>
                <el-table-column 
                    label="APP未使用人数" 
                    width="180">
                    <el-button slot-scope="scope" type='text' @click="$router.push({name: 'analytics-report-app-unused',query: {date: scope.row.create_date_name}})">{{scope.row.unused_user}}</el-button>
                </el-table-column>
                <el-table-column 
                    label="连锁总人数" 
                    prop="total_user" 
                    width="180">
                </el-table-column>
                <el-table-column 
                    label="APP使用率" 
                    prop="usage_rate" 
                    width="180">
                </el-table-column>
                <el-table-column 
                    label="Android设备启动次数" 
                    prop="android" 
                    width="180">
                </el-table-column>
                <el-table-column 
                    label="iOS设备启动次数" 
                    prop="ios" 
                    width="180">
                </el-table-column>
            </el-table>
            <el-pagination class="block"
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
    import DateRange from 'components/form/DateRangePicker.vue'
    import reportService from 'services/analytics/reportService'

    export default {
        components: {
            DateRange
        },
        props: {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
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
                    is_export: 0,
                    time_start: '',
                    time_end: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                return reportService.searchAppReport(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchAppReport(this.fetchParam).then(ret => {
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

