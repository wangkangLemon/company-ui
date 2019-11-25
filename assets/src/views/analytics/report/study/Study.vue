<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-study-study-container {
    @extend %content-container;
    .block {
        float: right;
        margin-top: 15px;
    }
    .export-btn{
        float:right;
        margin-top: -65px;
    }
}
</style>
<template>
    <main id="analytics-report-study-study-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item label="课程名称：">
                <course-list
                    v-model="fetchParam.course_id"
                    :change="fetchData">
                </course-list>
            </el-form-item>
            <el-form-item>
                <DateRange
                        title="课程任务发布时间："
                        :start="fetchParam.time_start"
                        :end="fetchParam.time_end"
                        v-on:changeStart="val=>{fetchParam.time_start=val}"
                        v-on:changeEnd="val=>{fetchParam.time_end=val}"
                        :change="fetchData">
                </DateRange>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="fetchData">查询</el-button> -->
            </el-form-item>
        </el-form>
        <el-table border :fit="true" v-loading="loading" :data="data">
            <el-table-column
                    prop="course_name"
                    label="课程名称">
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    label="课程发布时间">
            </el-table-column>
            <el-table-column label="学习人数">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.learned_user>0" type='text' @click="$router.push({name: 'analytics-report-study-studycount',query:{course_id:scope.row.course_id}})">{{scope.row.learned_user}}</el-button>
                    <el-button v-else="scope.row.learned_user == 0" type='text' :disabled="true">{{scope.row.learned_user}}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="finished_user"
                    label="完成人数">
            </el-table-column>
            <el-table-column
                    prop="finished_rate"
                    label="课程完成率">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </main>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import reportService from 'services/analytics/reportService'
    import CourseList from 'components/select/Course'
    export default {
        components: {
            DateRange,
            CourseList
        },
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_export: 0,
                    time_start: '',
                    time_end: '',
                    course_id: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                return reportService.searchStudy(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchStudy(this.fetchParam).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            }
        }
    }
</script>
