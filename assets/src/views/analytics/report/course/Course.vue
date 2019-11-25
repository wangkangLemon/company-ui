<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-course-course-container {
    @extend %content-container;
    .block {
        float: right;
        margin-top: 15px;
    }
    .export-btn{
        float:right;
        margin-top: -65px;
    }
    .button--wrap {
        white-space: normal;
        text-align: left;
    }
}
</style>
<template>
    <main id="analytics-report-course-course-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item  label="课程任务名称：">
                <el-input v-model="fetchParam.task_name" @keyup.enter.native="fetchData"></el-input>
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
        <el-table :data="data" border v-loading="loading" :fit="true">
            <el-table-column
                    fixed
                    label="课程任务名称"
                    min-width="200">
                <el-button class="button--wrap" slot-scope="scope" type='text' @click="$router.push({name: 'analytics-report-course-courserank',query: {task_id: scope.row.course_task_id, title: scope.row.course_task_name}})">{{scope.row.course_task_name}}</el-button>
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    label="课程任务发布时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="total_user"
                    label="发布人数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="finished_user"
                    label="完成学习人数"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="finished_rate"
                    label="完成学习占比"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="part_finished_user"
                    label="部分完成人数"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="part_finished_rate"
                    label="部分完成占比"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="unlearned_user"
                    label="未学习人数"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="unlearned_rate"
                    label="未学习占比"
                    width="110">
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
    export default {
        components: {
            DateRange
        },
        data() {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_export: 0,
                    task_name: '',
                    time_start: '',
                    time_end: '',
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
        methods:{
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                return reportService.searchCourseReport(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchCourseReport(this.fetchParam).then(ret => {
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
