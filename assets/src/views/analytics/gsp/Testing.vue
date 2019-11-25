<template>
    <article id="user-container">
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item label="考试" v-if="!$route.query.exam_id">
                <ExamSelect v-model="fetchParam.exam_id" :change="fetchData"></ExamSelect>
            </el-form-item>
            <el-form-item label="课程" v-if="!$route.query.exam_id">
                <CourseSelect v-model="fetchParam.course_id" :change="fetchData" type="course" ></CourseSelect>
            </el-form-item>
            <el-form-item label="成绩">
                <el-select v-model="fetchParam.grade" placeholder="请选择" clearable @change="fetchData">
                    <el-option
                            v-for="item in grades"
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
        <el-table
                border
                stripe
                :data="data"
                ref="tableGsp"
                @select="selectRow"
                @select-all="selectRow">
            <el-table-column
                    type="selection"></el-table-column>
            <el-table-column
                    prop="exam_name"
                    label="考试"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="course_name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    prop="dep_name"
                    label="门店">
            </el-table-column>
            <el-table-column
                    prop="user_name"
                    label="店员">
            </el-table-column>
            <el-table-column
                    prop="job"
                    label="职位">
            </el-table-column>
            <el-table-column
                    prop="score"
                    label="分数">
            </el-table-column>
            <el-table-column
                    prop="grade"
                    label="成绩">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.grade === 1" type="success">满分</el-tag>
                    <el-tag v-if="scope.row.grade === 2">及格</el-tag>
                    <el-tag v-if="scope.row.grade === 3" type="info">不及格</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="costed_name"
                    label="用时">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="考试时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    width="100"
                    label="操作">
                <template slot-scope="scope">
                    <el-button 
                        type="text"
                        size="small"
                        @click="view(scope.row)">
                        查看
                    </el-button>
                    <el-button 
                        type="text"
                        size="small"
                        @click="download(scope.row)">
                        下载
                   </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6">
                <!--底部的批量删除和移动两个按钮-->
                <el-button type="primary" :disabled='selectedIds.length < 1' @click="openBatchExportDialog">批量导出</el-button>
            </el-col>
            <el-dialog
                    title="提示"
                    :visible.sync="batchExportDialog.visible"
                    size="tiny">
                <span v-if="batchExportDialog.ok === false">你将要导出选中的考试记录吗？</span>
                <span v-else>{{ batchExportDialog.text }}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="batchExportDialog.visible = false" v-if="batchExportDialog.ok === false">取 消</el-button>
                    <el-button @click="onBatchExportSuccess" v-if="batchExportDialog.ok === true">好 的</el-button>
                    <el-button type="primary" @click="batchExport" :loading="batchExportDialog.loading" v-if="batchExportDialog.ok === false">确 定</el-button>
                </span>
            </el-dialog>
            <el-col :span="12" :offset="6">
                <el-pagination
                        style="text-align: right"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="sizes,total, prev, pager, next"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        :total="fetchParam.page_total">
                </el-pagination>
            </el-col>
        </el-row>
    </article>
</template>

<script>
    import ExamSelect from 'components/select/Exam.vue'
    import CourseSelect from 'components/select/LoadMoreSelect.vue'
    import testingService from 'services/course/testingService'
    import hisotyService from 'services/course/hisotyService'

    export default {
        components: {
            ExamSelect,
            CourseSelect
        },
        name: 'user',
        data () {
            return {
                fetchParam: {
                    user_id: 0,
                    exam_id: '',
                    course_id: '',
                    grade: '',
                    start_time: void 0,
                    end_time: void 0,
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                },
                data: [],
                grades: [{
                    value: 1,
                    label: '满分'
                }, {
                    value: 2,
                    label: '及格'
                }, {
                    value: 3,
                    label: '不及格'
                }],
                selectedIds: [],
                batchExportDialog: {
                    visible: false,
                    loading: false,
                    ok: false,
                    text: '',
                },
                download_url: '',
            }
        },
        created () {
            xmview.setContentTitle(this.$route.meta.title + '-' + this.$route.query.name)
            if (this.$route.params.id === undefined) {
                return
            }
            this.fetchParam.user_id = this.$route.params.id
            this.fetchParam.exam_id = this.$route.query.exam_id
            this.fetchData()
        },
        methods: {
            fetchData () {
                hisotyService.getHistory(this.fetchParam).then((ret) => {
                    xmview.setContentLoading(false)
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page !== val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            view (row) {
                let win = window.open('')
                testingService.viewGsp(row.id).then(ret => {
                    win.document.write(ret.data)
                    win.focus()
                }).catch(() => win.close())
            },
            download (row) {
                xmview.setContentLoading(true)
                let win = window.open('')
                win.document.write('正在加载中请稍后...')
                testingService.downloadGsp(row.id).then(ret => {
                    win.location.href = ret.data.download_url
                }).catch(() => win.close())
                    .then(() => xmview.setContentLoading(false))
            },
            openBatchExportDialog () {
                this.batchExportDialog.visible = true
                this.batchExportDialog.loading = false
                this.batchExportDialog.ok = false
                this.batchExportDialog.text = ''
            },
            batchExport () {
                this.batchExportDialog.visible = false
                // this.batchExportDialog.loading = true
                testingService.batchExportGsp(this.selectedIds).then((ret) => {
                    // this.batchExportDialog.loading = false
                    // this.batchExportDialog.text = ret.message
                    // this.batchExportDialog.ok = true
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                    this.selectedIds = []
                    this.$refs['tableGsp'].clearSelection()
                })
            },
            onBatchExportSuccess () {
                this.batchExportDialog.visible = false
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
        }
    }
</script>

<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    #user-container {
        @extend %content-container;
    }

</style>
