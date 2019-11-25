<style lang='scss' rel='stylesheet/scss'>
    #category-content-container {
        .el-form-item{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
    }
</style>
<template>
    <div id="category-content-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="add()"><i>新增分类</i></el-button>
        </section>
        <el-form :inline="true" :model="fetchParam" class="search">
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
                    min-width="100"
                    prop="name"
                    label="分类名称">
            </el-table-column>
            <el-table-column
                    width="200"
                    label="分类简介"
                    prop="description">
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="update_time"
                    label="最后操作时间">
            </el-table-column>

            <el-table-column
                    width="100"
                    prop="sales"
                    label="当前销量">
            </el-table-column>
            
            <el-table-column
                    fixed="right"
                    width="207"
                    label="操作">
                <template slot-scope="scope">
                    
                     <el-button
                        type="text"
                        size="small"
                        :disabled="scope.row.status == 0"
                        @click="edit(scope.$index, scope.row)">
                        修改
                    </el-button>
                    <el-button 
                    @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="12" :offset="12">
                <el-pagination
                    style="text-align: right"
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="fetchParam.page_total">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog :title="editDialog" :visible.sync="dialog.edit">
            <el-form :model="model" label-width="80px" :rules="rules" ref="categoryForm">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>
                <el-form-item label="分类简介" prop="description">
                    <el-input type="textarea" v-model="model.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">确定</el-button>
                    <el-button @click="dialog.edit = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import DateRange from '../../../component/form/DateRangePicker.vue'
    import testCategoryService from 'services/server/store/testCategoryService'
    import * as _ from 'utils/common'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                dialog: {
                    edit: false,
                    del: false,
                },
                editDialog: '新建分类',
                model: {
                    id: '',
                    name: '',
                    description: ''
                },
                rules: {
                    name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
                    description: [{required: true, message: '请输入分类描述', trigger: 'blur'}],
                },
            }
        },
        activated () {
            this.fetchData()
        },
        created () {
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let fetchParam = _.clone(this.fetchParam)
                testCategoryService.search(fetchParam).then((ret) => {
                    this.data = ret.data
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
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            newFetchParam () {
                return {
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            },
            add () {
                this.editDialog = '新增分类'
                this.dialog.edit = true
                this.model = {
                    id: '',
                    name: '',
                    description: ''
                }
            },
            edit (index, row) {
                this.editDialog = '修改分类'
                this.dialog.edit = true
                this.model = {
                    id: row.id,
                    name: row.name,
                    description: row.description
                }
            },
            del (index, row) {
                this.$confirm('删除当前分类后，原该分类下商品将无分类属性，您是否确定删除本分类？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testCategoryService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            // 提交分类
            submitForm () {
                this.$refs['categoryForm'].validate((pass) => {
                    if (!pass) {
                        return
                    }

                    if (this.model.id == 0) {
                        return testCategoryService.create(this.model).then(() => {
                            this.dialog.edit = false
                            this.fetchData()
                        })
                    } else {
                        return testCategoryService.update(this.model.id, this.model).then(() => {
                            this.dialog.edit = false
                            this.fetchData()
                        })
                    }
                })
            },
        },
        components: {
            DateRange
        }
    }
</script>
