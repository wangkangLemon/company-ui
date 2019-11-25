<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-study-studycount-container {
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
    <main id="analytics-report-study-studycount-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item label="员工姓名:">
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="员工工号:">
                <el-input v-model="fetchParam.staff_id" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="手机号:">
                <el-input v-model="fetchParam.mobile" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item>
                <DateRange
                    title="学习时间："
                    :start="fetchParam.time_start"
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
            </el-form-item>
            <el-form-item label="学习进度：">
                <el-select v-model="fetchParam.progress" placeholder="请选择" @change="fetchData" :clearable="true">
                    <el-option label="未完成" :value="0"></el-option>
                    <el-option label="已完成" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="fetchData">查询</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="data" border :fit="true" v-loading="loading">
            <el-table-column
                    prop="user_name"
                    label="员工姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="staff_id"
                    label="员工工号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    label="所属门店">
            </el-table-column>
            <el-table-column
                    prop="update_time_name"
                    label="学习时间">
            </el-table-column>
            <el-table-column
                    prop="progress"
                    label="学习进度">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.progress == 0" type="danger">未完成</el-tag>
                    <el-tag v-else>已完成</el-tag>
                </template>
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
    import * as _ from 'utils/common'
    export default {
        components: {
            DateRange
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
                    name: '',
                    course_id: null,
                    staff_id: '',
                    department_id: null,
                    progress: '',
                    mobile: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        created () {
            this.fetchParam.course_id = this.$route.query.course_id
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.progress = !fetchParam.progress && fetchParam.progress !== 0 ? -1 : fetchParam.progress
                return reportService.searchExamUser(fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.progress = !fetchParam.progress && fetchParam.progress !== 0 ? -1 : fetchParam.progress
                return reportService.searchExamUser(fetchParam).then(ret => {
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
