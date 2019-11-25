<style lang='scss' rel='stylesheet/scss'>
    #dialog-view {
        .el-form-item{
            margin-bottom: 15px;
        }
    }
</style>
<template>
    <div>
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="add()"><i>新增题库</i>
            </el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="题库名称">
                <el-input v-model="fetchParam.keyword" placeholder="题库名称" @keyup.enter.native="fetchData"></el-input>
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
                    :selectable="selectable">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="题库名称">
            </el-table-column>
            <el-table-column
                    width="80"
                    label="题目数">
                <template slot-scope="scope">
                    <el-button 
                        style="width: 100%"
                        @click="routeToQuestion(scope.row)"
                        type="text" size="small">
                        {{scope.row.subject_num}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    width="207"
                    label="操作">
                <template slot-scope="scope">
                    <el-button 
                        @click="preview(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        详情
                    </el-button>
                    <el-button 
                        @click="edit(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.subject_num > 0 || creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6">
                <!--底部的批量删除和移动两个按钮-->
                <el-button :disabled='selectedIds.length < 1' @click="delMulti" type="danger">批量删除</el-button>
            </el-col>
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
        </el-row>

        <el-dialog :title="editDialog" :visible.sync="dialog.edit">
            <el-form :model="model" label-width="80px" :rules="rules" ref="libraryForm">
                <el-form-item label="题库名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>
                <el-form-item label="题库简介" prop="description">
                    <el-input type="textarea" v-model="model.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">确定</el-button>
                    <el-button @click="dialog.edit = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog id="dialog-view" title="详情" :visible.sync="dialog.view">
            <div class="el-form-item">
                <label class="el-form-item__label" style="width: 100px;">题库名称：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">
                    <div class="el-input">
                        {{model.name}}
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label" style="width: 100px;">题库简介：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">
                    <div class="el-input">
                        {{model.description}}
                    </div>
                </div>
            </div>
            <el-table
                    :data="[model]"
                    border
                    style="width: 100%">
                <el-table-column
                        label="单选题">
                    <template slot-scope="scope">
                        <p>{{ scope.row.single_total }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="多选题">
                    <template slot-scope="scope">
                        <p>{{ scope.row.multi_total }}</p>
                    </template>
                </el-table-column>
                <el-table-column
                        label="判断题">
                    <template slot-scope="scope">
                        <p>{{ scope.row.judge_total }}</p>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <ErrorDialog :error="error"></ErrorDialog>
    </div>

</template>

<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import testLibraryService from 'services/exam/testLibraryService'
    import ErrorDialog from 'components/dialog/ErrorDialog.vue'
    import Library from 'models/library'

    export default{
        data () {
            return {
                dialog: {
                    edit: false,
                    view: false,
                    del: false,
                },
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                model: {},
                editDialog: '新建题库',
                rules: {
                    name: [{required: true, message: '请输入题库名称', trigger: 'blur'}],
                    description: [{required: true, message: '请输入题库描述', trigger: 'blur'}],
                },
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
                this.loadingData = true
                return testLibraryService.search(this.fetchParam).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    this.loadingData = false
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
            delMulti () {
                xmview.showDialog(`你将要删除选中的数据，操作不可恢复确认吗?`, () => {
                    testLibraryService.batchDelete(this.selectedIds).then(() => {
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
            add () {
                this.editDialog = '新建题库'
                this.dialog.edit = true
                this.model = new Library()
            },
            edit (index, row) {
                this.editDialog = '编辑题库'
                this.dialog.edit = true
                let library = new Library()
                library.setModel(row)
                this.model = library
            },
            del (index, row) {
                this.$confirm('您是否确定删除本题库？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testLibraryService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    }).catch(ret => {
                        this.error.message = ret.message
                        this.error.data = ret.list
                        this.error.showDialog = true
                    })
                })
            },
            preview (index, row) {
                this.dialog.view = true
                let library = new Library()
                library.findById(row.id)
                this.model = library
            },
            submitForm () {
                this.$refs['libraryForm'].validate((pass) => {
                    if (!pass) {
                        return
                    }

                    if (this.model.id == 0) {
                        return testLibraryService.create(this.model).then(() => {
                            this.dialog.edit = false
                            this.fetchData()
                        })
                    } else {
                        return testLibraryService.update(this.model.id, this.model).then(() => {
                            this.dialog.edit = false
                            this.fetchData()
                        })
                    }
                })
            },
            selectable (row) {
                return row.subject_num === 0
            },
            newFetchParam () {
                return {
                    keyword: void '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                    subject_status: -1,
                }
            },
            routeToQuestion (row) {
                this.$router.push({name: 'test-question-index', query: {subject_group_id: row.id}})
                this.$store.dispatch('setIndexMenuActive', `/exam/question`)
            }
        },
        components: {DateRange, ErrorDialog}
    }
</script>
