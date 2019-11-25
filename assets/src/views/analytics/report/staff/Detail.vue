<style lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-staff-detail-container {
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
    <main id="analytics-report-staff-detail-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>课程名称</i>
                <el-input
                    v-model="fetchParam.course_name"
                    @keyup.enter.native="fetchData">
                </el-input>
<!--                 <CourseSelect 
                    :change="fetchData" 
                    type="course" 
                    @change="val => {fetchParam.course_id=val}" 
                    v-model="fetchParam.course_id">
                </CourseSelect> -->
            </section>
            <section>
                <i>学习进度</i>
                <el-select v-model="fetchParam.progress" filterable clearable placeholder="请选择" @change="fetchData">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option label="完成" :value="1"></el-option>
                    <el-option label="未完成" :value="2"></el-option>
                </el-select>
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
            <el-button class="top-btn" icon="el-icon-document" type='warning' @click="fileExport">导出Excel</el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="课程名称" 
                    min-width="120">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.course_type | taskType('tag')"
                            close-transition>
                            {{scope.row.course_type | taskType('label')}}
                        </el-tag>
                        {{scope.row.course_name}}
                    </template>
                </el-table-column>
                <el-table-column 
                    label="学习进度" 
                    prop="progress">
                </el-table-column>
                <el-table-column 
                    label="考试次数" 
                    prop="testing_number">
                </el-table-column>
                <el-table-column 
                    label="最高成绩" 
                    prop="grade">
                </el-table-column>
                <el-table-column 
                    label="最高分数" 
                    prop="highest_score">
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
    import CourseSelect from 'components/select/LoadMoreSelect.vue'
    import DateRange from 'components/form/DateRangePicker.vue'
    import reportService from 'services/analytics/reportService'

    export default {
        components: {
            CourseSelect,
            DateRange
        },
        props: {},
        activated () {},
        created () {
            this.fetchParam.user_id = this.$route.query.user_id
            this.fetchParam.time_start = this.$route.query.time_start
            this.fetchParam.time_end = this.$route.query.time_end
            xmview.setContentTitle(this.$route.query.user_name + this.$route.meta.title)
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
                    user_id: '',
                    course_name: '',
                    progress: '',
                    is_export: '',
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
                return reportService.searchStaffDetail(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchStaffDetail(this.fetchParam).then(ret => {
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
