<style lang='scss' rel='stylesheet/scss'>
    .status-popover {
        text-align: center;
    }
</style>

<template>
    <div id="paper-content-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({ name:'test-paper-add'})"><i>新增试卷</i></el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="试卷名称">
                <el-input v-model="fetchParam.keyword" placeholder="试卷名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="fetchParam.publish_status" @change="fetchData" :clearable="true">
                    <el-option label="已发布" :value="0"></el-option>
                    <el-option label="已撤回" :value="1"></el-option>
                    <el-option label="待发布" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                           @changeStart="val=> {fetchParam.time_start=val}"
                           @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
                </DateRange>
            </el-form-item>
        </el-form>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column
                    type="selection"
                    :selectable="selectable"></el-table-column>
            <el-table-column
                    min-width="200"
                    prop="name"
                    label="试卷名称">
            </el-table-column>
            <el-table-column
                    width="80"
                    label="题目数"
                    prop="subject_total">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="score_total"
                    label="总分数">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="score_pass"
                    label="及格分数">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="100"
                    label="当前状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.publish_status == 0" type="success">已发布</el-tag>
                    <el-tag v-else-if="scope.row.publish_status == 1" type="danger">已撤回</el-tag>
                    <el-popover
                        v-else-if="scope.row.publish_status == 2" 
                        placement="top"
                        trigger="hover">
                        <p class="status-popover">{{scope.row.start_time}}</p>
                        <el-tag type="warning" slot="reference">待发布</el-tag>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    width="180"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="180"
                    prop="end_time"
                    label="截止时间">
            </el-table-column>
            <el-table-column
                    header-align="center"
                    fixed="right"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                        @click="$router.push({name: 'test-paper-edit', params: {exam_id: scope.row.id}})"
                        type="text"
                        size="small"
                        :disabled="scope.row.publish_status != 1 || creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="online(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.publish_status == 1"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        <i>发布</i>
                    </el-button>
                    <el-button 
                        type="text" 
                        @click="timingDialogFn(scope.row)" 
                        size="small" 
                        v-if="scope.row.publish_status == 1"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        <i>定时</i>
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.publish_status != 1"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        <i>撤回</i>
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6">
                <!--底部的批量删除和移动两个按钮-->
                <el-button type="danger" :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
            </el-col>
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

        <TimingDialog v-model="timingDialog" :submit="timingDialogSubmit"></TimingDialog>
        <ErrorDialog :error="error"></ErrorDialog>
    </div>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import testPaperService from 'services/exam/testPagerService'
    import TimingDialog from '../../component/dialog/Timing.vue'
    import ErrorDialog from 'components/dialog/ErrorDialog.vue'
    import * as _ from 'utils/common'

    export default {
        data () {
            return {
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                editDialog: '新建题库',
                timingDialog: false,
                timingDialogSubmit: void 0,
                error: {
                    showDialog: false,
                    message: '',
                    data: []
                }
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.publish_status = (!fetchParam.publish_status && fetchParam.publish_status !== 0) ? -1 : fetchParam.publish_status
                testPaperService.search(fetchParam).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    this.selectedIds = []
                    xmview.setContentLoading(false)
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            del (index, row) {
                this.$confirm('您是否确定删除试题？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testPaperService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    }).catch(ret => {
                        this.error.message = ret.data.message
                        this.error.data = ret.data.list
                        this.error.showDialog = true
                    })
                })
            },
            delMulti () {
                xmview.showDialog(`你将要删除选中的试卷，操作不可恢复确认吗?`, () => {
                    testPaperService.batchDelete(this.selectedIds).then(() => {
                        this.selectedIds = []
                        xmview.showTip('success', '操作成功')
                        setTimeout(() => {
                            this.fetchData() // 重新刷新数据
                        }, 300)
                    })
                })
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            online (index, row) {
                xmview.showDialog(`你将要${row.publish_status === 1 ? '发布' : '撤回'}【<i style="color:red">${row.name || ''}</i>】操作吗？`, () => {
                    testPaperService.online(row.id).then(() => {
                        row.publish_status = 0
                        row.start_time = ''
                        xmview.showTip('success', '操作成功')
                    })
                })
            },
            offline (index, row) {
                xmview.showDialog(`你将要${row.publish_status === 1 ? '发布' : '撤回'}【<i style="color:red">${row.name || ''}</i>】操作吗？`, () => {
                    testPaperService.offline(row.id).then(() => {
                        row.publish_status = 1
                        row.start_time = ''
                        xmview.showTip('success', '操作成功')
                    })
                })
            },
            timingDialogFn (row) {
                this.timingDialog = true
                this.timingDialogSubmit = (start_time) => {
                    return testPaperService.timingOnline(row.id, start_time).then(() => {
                        row.publish_status = 2
                        row.start_time = start_time
                        xmview.showTip('success', '操作成功')
                    })
                }
            },
            selectable (row, index) {
                return row.publish_status === 1
            },
            newFetchParam () {
                return {
                    keyword: void '',
                    publish_status: '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {
            DateRange,
            TimingDialog,
            ErrorDialog
        }
    }
</script>
