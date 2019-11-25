<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-exam-examrank-container {
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
    <main id="analytics-report-exam-examrank-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item label="员工姓名：">
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="工号：">
                <el-input v-model="fetchParam.staff_id" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="考试成绩：">
                <el-select v-model="fetchParam.score_grade" placeholder="请选择" clearable @change="fetchData">
                    <el-option  v-for="item in grades"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="fetchData">查询</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="data" border v-loading="loading" :fit="true">
            <el-table-column
                    prop="user_name"
                    label="员工姓名"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="staff_id"
                    label="工号">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    label="所属门店">
            </el-table-column>
            <el-table-column
                    prop="score"
                    label="考试最高分">
            </el-table-column>
            <el-table-column
                    prop="score_grade"
                    label="考试成绩">
                    <el-tag slot-scope="scope" :type="scope.row.score_grade | gradesMap('tag')">{{scope.row.score_grade | gradesMap('label')}}</el-tag>
            </el-table-column>
            <el-table-column
                    prop="exam_count"
                    label="考试次数">
            </el-table-column>
            <el-table-column
                    prop="ranking"
                    label="排名">
            </el-table-column>
            <el-table-column
                    prop="duration"
                    label="考试用时">
            </el-table-column>
            <el-table-column
                    prop="exam_time"
                    label="交卷时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="record"
                    label="考试记录">
                <el-button slot-scope="scope" type='text' @click="$router.push({name: 'gsp-testing',params: {id: scope.row.user_id}, query: {name: scope.row.user_name, exam_id: scope.row.exam_id}})">查看</el-button>
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
    import reportService from 'services/analytics/reportService'
    import * as _ from 'utils/common'
    import Exam from './model'

    export default {
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_export: 0,
                    user_name: '',
                    staff_id: '',
                    exam_id: '',
                    department_id: '',
                    score_grade: '',
                    page: 1,
                    page_size: 15,
                },
                grades: Exam.grades,
            }
        },
        created () {
            xmview.setContentTitle(this.$route.meta.title + '-' + this.$route.query.title)
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                this.fetchParam.exam_id = this.$route.query.id
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.score_grade = !fetchParam.score_grade ? -1 : fetchParam.score_grade
                return reportService.searchExam(fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchExam(this.fetchParam).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            }
        },
        filters: {
            gradesMap (val, type) {
                let exam = Exam.grades.filter(exam => exam.value === val)
                return exam.length > 0 ? exam[0][type] : ''
            }
        }
    }
</script>
