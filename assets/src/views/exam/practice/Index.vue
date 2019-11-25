<style lang='scss' rel='stylesheet/scss'>

</style>
<template>
    <div id="paper-content-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({ name:'exam-practice-add'})"><i>新增练习</i>
            </el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="练习名称">
                <el-input v-model="fetchParam.keyword" placeholder="练习名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                    <el-option label="正常" :value="0"></el-option>
                    <el-option label="下线" :value="1"></el-option>
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
            <el-table-column type="selection" :selectable="selectable"></el-table-column>
            <el-table-column prop="name" label="练习名称"></el-table-column>
            <el-table-column prop="subject_total" label="题目总数" width="95"></el-table-column>
            <el-table-column prop="score_total" label="试卷总分" width="95"></el-table-column>
            <el-table-column prop="score_pass" label="及格分数" width="95"></el-table-column>
            <el-table-column
                align="center"
                width="95"
                label="当前状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
                    <el-tag v-else-if="scope.row.status == 1" type="danger">下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="170"></el-table-column>
            <el-table-column
                    align="center"
                    fixed="right"
                    width="140"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                        @click="$router.push({name: 'exam-practice-edit', params: {practice_id: scope.row.id}})"
                        type="text"
                        size="small"
                        :disabled="scope.row.status != 1 || creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="online(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.status == 1"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        <i>上线</i>
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.status != 1"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        <i>下线</i>
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status != 1 || creatorDisabled(scope.row.creator_id)">
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
    </div>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import testPracticeService from 'services/exam/testPracticeService'
    import * as _ from 'utils/common'

    export default {
        data () {
            return {
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                editDialog: '新建练习',
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
                fetchParam.status = (!fetchParam.status && fetchParam.status !== 0) ? -1 : fetchParam.status
                testPracticeService.search(fetchParam).then((ret) => {
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
                this.$confirm('您是否确定删除练习？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testPracticeService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            delMulti () {
                xmview.showDialog(`你将要删除选中的练习，操作不可恢复确认吗?`, () => {
                    testPracticeService.batchDelete(this.selectedIds).then(() => {
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
                return testPracticeService.online(row.id).then(() => {
                    row.status = 0
                    row.start_time = ''
                    xmview.showTip('success', '操作成功')
                })
            },
            offline (index, row) {
                return testPracticeService.offline(row.id).then(() => {
                    row.status = 1
                    row.start_time = ''
                    xmview.showTip('success', '操作成功')
                })
            },
            selectable (row, index) {
                return row.status === 1
            },
            newFetchParam () {
                return {
                    keyword: void '',
                    status: '',
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
        }
    }
</script>
