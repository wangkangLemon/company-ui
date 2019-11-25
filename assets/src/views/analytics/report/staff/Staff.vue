<style lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-staff-staff-container {
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

.u-loadmore {
    color: #63bdea;
    margin-left: 10px;
    padding-top: 4px;
    display: block;
    cursor: pointer;
}
</style>

<template>
    <main id="analytics-report-staff-staff-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>员工名称</i>
                <el-input
                    v-model="fetchParam.name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>门店名称</i>
                <DepSelect v-model="fetchParam.department_id"  :change="fetchData"></DepSelect>
            </section>
            <section>
                <DateRange 
                    title="统计周期" 
                    :start="fetchParam.time_start" 
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <i>排序方式</i>
                <el-select v-model="fetchParam.sort_type" filterable placeholder="请选择" @change="fetchData">
                    <el-option label="学习课程数量" :value="0"></el-option>
                    <el-option label="考试课程数量" :value="1"></el-option>
                    <el-option label="考试次数" :value="2"></el-option>
                    <el-option label="及格课程数量" :value="3"></el-option>
                </el-select>
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
                    label="员工姓名" 
                    min-width="100">
                    <el-button 
                        slot-scope="scope" 
                        type='text' 
                        @click="$router.push({name: 'analytics-report-staff-detail',query: {user_id: scope.row.user_id, user_name: scope.row.user_name, time_start: fetchParam.time_start, time_end: fetchParam.time_end}})">
                        {{scope.row.user_name}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="工号" 
                    prop="staff_id" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="职务" 
                    prop="job"
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="所属门店" 
                    prop="department_name" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="学习课程数量" 
                    prop="study_course_count" 
                    width="110">
                </el-table-column>
                <el-table-column 
                    label="考试课程数量" 
                    prop="testing_course_count" 
                    width="110">
                </el-table-column>
                <el-table-column 
                    label="考试次数" 
                    prop="testing_number" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="及格课程数量" 
                    prop="passed_course_count" 
                    width="110">
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
    import DepSelect from 'components/select/Department.vue'
    import DateRange from 'components/form/DateRangePicker.vue'
    import reportService from 'services/analytics/reportService'

    export default {
        components: {
            DepSelect,
            DateRange
        },
        props: {},
        activated () {},
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
                    name: '',
                    department_id: '',
                    is_export: '',
                    time_start: '',
                    time_end: '',
                    sort_type: 0,
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                return reportService.searchStaff(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchStaff(this.fetchParam).then(ret => {
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
