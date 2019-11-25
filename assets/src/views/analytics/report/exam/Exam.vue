<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-exam-exam-container {
    @extend %content-container;
    .block {
        float: right;
        margin-top: 15px;
    }
    .export-btn{
        float:right;
        margin-top: -65px;
    }
    .paper {
        margin-right: 140px;
    }
    .notify {
        font-size: 10px;
        color: #c0c4cc;
    }
}
</style>
<template>
    <main id="analytics-report-exam-exam-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-button class="export-btn paper" icon="el-icon-document" type='primary' @click="paperExport">导出试卷</el-button>
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item  label="考试名称：" >
                <el-input v-model="fetchParam.exam_name" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item>
                <DateRange
                        title="考试发布时间："
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
        <el-table :data="data" border :fit="true" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                    label="考试名称"
                    min-width="300">
                <el-button slot-scope="scope" type='text' @click="$router.push({name: 'analytics-report-exam-examrank',query: {id: scope.row.exam_id, title: scope.row.exam_name}})">{{scope.row.exam_name}}</el-button>
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    label="考试发布时间"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    prop="exam_user_all"
                    label="发布人数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="exam_user"
                    label="已考人数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="exam_pass_user"
                    label="及格人数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="full_marks_user"
                    label="满分人数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="exam_pass_rate"
                    label="考试通过率"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="exam_average_score"
                    label="考试平均分"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="duration"
                    label="平均考试用时"
                    width="130">
            </el-table-column>
            <el-table-column
                fixed="right"            
                label="操作"
                width="133">
                <template slot-scope="scope">
                    <div v-if="scope.row.exam_auto === 0">
                        <el-button 
                             type="text"
                             size="small"
                             @click="view(scope.row)"
                             :disabled="scope.row.exam_auto === 1">
                             查看试卷
                        </el-button>
                        <el-button 
                             type="text"
                             size="small"
                             @click="download(scope.row)">
                             下载
                        </el-button>
                    </div>
                    <div v-else class="notify">
                        随机试卷无法查看和下载
                    </div>
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
    export default {
        components: {
            DateRange,
        },
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_export: 0,
                    exam_name: '',
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
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                return reportService.searchExamReport(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            view (row) {
                let win = window.open('')
                reportService.viewGsp(row.exam_id)
                    .then(ret => {
                        win.document.write(ret.data)
                        win.focus()
                    })
                    .catch(() => win.close())
            },
            download (row) {
                xmview.setContentLoading(true)
                let win = window.open('')
                win.document.write('正在加载中请稍后...')
                reportService.downloadGsp(row.exam_id)
                    .then(ret => {
                        win.location.href = ret.data.download_url
                    })
                    .catch(() => win.close())
                    .then(() => xmview.setContentLoading(false))
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchExamReport(this.fetchParam).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            paperExport () {
                if (!this.selectedExamId) return xmview.showTip('error', '请勾选要导出的试卷')
                reportService.gzipGsp(this.selectedExamId).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            handleSelectionChange (val) {
                this.selectedExamId = val.map(item => item.exam_id).join(',')
            }

        }
    }
</script>
