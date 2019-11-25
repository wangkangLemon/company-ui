<style lang='scss' rel='stylesheet/scss'>
    #question-content-container {
        .el-form-item{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
    }
    #view {
        .el-form-item__label {
            width: 100px;
        }
        .el-form-item__content{
            margin-left: 100px;
        }
    }
</style>
<template>
    <div id="question-content-container">
        <section class="manage-container">
            <el-button type="warning" icon="el-icon-plus" @click="$refs['localImportDialog'].open()"><i>导入试题</i></el-button>
            <el-button type="primary" icon="el-icon-plus" @click="openAddDialog()"><i>新增试题</i></el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="所属题库">
                <SelectScroll :requestCb="fetchLibrary" v-model="fetchParam.subject_group_id" :changeCb="changeLibrary" ref="selectScroll"></SelectScroll>
            </el-form-item>
            <el-form-item label="试题标签">
                <el-input type="text" v-model="fetchParam.tags" placeholder="请输入标签" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="试题类型">
                <el-select v-model="fetchParam.type" placeholder="试题类型" @change="fetchData" :clearable="true">
                    <el-option label="判断题" value="0"></el-option>
                    <el-option label="单选题" value="1"></el-option>
                    <el-option label="多选题" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="试题状态">
                <el-select v-model="fetchParam.status" placeholder="试题状态" @change="fetchData" :clearable="true">
                    <el-option label="上线" value="0"></el-option>
                    <el-option label="下线" value="1"></el-option>
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
                    prop="description"
                    label="试题题目">
            </el-table-column>
            <el-table-column
                    prop="subject_group_name"
                    label="所属题库">
            </el-table-column>
            <el-table-column
                    prop="type"
                    width="93"
                    label="试题类型">
                <template slot-scope="scope">
                    <p v-if="scope.row.type == 0">判断题</p>
                    <p v-if="scope.row.type == 1">单选题</p>
                    <p v-if="scope.row.type == 2">多选题</p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="tags"
                    label="试题标签">
            </el-table-column>
            <el-table-column
                    prop="status"
                    align="status"
                    width="100"
                    label="当前状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == 0">上线</el-tag>
                    <el-tag type="danger" v-if="scope.row.status == 1">下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    width="170"
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
                        :disabled="scope.row.status == 0 || creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="online(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.status == 1"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        上线
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.status == 0"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        下线
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6">
                <!--底部的批量删除和移动两个按钮-->
                <el-button :disabled='selectedIds.length < 1' @click="delMulti" type="danger">批量删除</el-button>
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
        <el-dialog append-to-body :title="editDialog" :visible.sync="dialog.edit">
            <el-form :model="model" label-width="80px" :rules="rules" ref="form">
                <el-form-item label="试题类型" class="is-required">
                    <el-radio-group v-model="model.type" @change="onQuestionTypeChange" :disabled="model.id !== 0">
                        <el-radio :label=0>判断题</el-radio>
                        <el-radio :label=1>单选题</el-radio>
                        <el-radio :label=2>多选题</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="试题题目" prop="description">
                    <el-input type="textarea" v-model="model.description" placeholder="请输入试题题目"></el-input>
                </el-form-item>
                <el-form-item label="配图">
                    <UploadImg :url="uploadImageUrl" :defaultImg="model.image | fillImgPath" :onSuccess="res => {model.image = res.data.url}" :onRemove="onRemove"></UploadImg>
                    <h5 style="color: #FF4949">只允许上传以下格式：.jpg;.jpeg;.png</h5>
                </el-form-item>

                <!--判断题的正确错误选项-->
                <div v-if="model.type === 0">
                    <el-form-item label="答案选项">
                        <el-radio class="radio" v-model="model.correct" :label="1">
                            <i>正确</i>
                        </el-radio>
                        <el-radio class="radio" v-model="model.correct" :label="0">
                            <i>错误</i>
                        </el-radio>
                    </el-form-item>
                </div>
                <!--单选的答案部分-->
                <div v-if="model.type === 1">
                    <el-form-item label="答案选项">
                        <h5>请选中正确答案</h5>
                        <div class="multy-choose-item" v-for="(option, index) in model.options" :key="index">
                            <el-radio v-model="model.correct" :label="index">&nbsp;</el-radio>
                            <el-input placeholder="填写描述" v-model="option.description" style="width: 530px;"></el-input>
                            <el-button type="text" @click="model.options.splice(index, 1)">
                                删除
                            </el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-button type="text" @click="addMoreTestingOption()">添加更多选项</el-button>
                        </div>
                    </el-form-item>
                </div>
                <!--多选的答案部分-->
                <div v-if="model.type === 2">
                    <el-form-item label="答案选项">
                        <h5>请至少选中2个正确答案</h5>
                        <div class="multy-choose-item" v-for="(option, index) in model.options" :key="index">
                            <el-checkbox v-model="option.correct" :true-label="1">&nbsp;</el-checkbox>
                            <el-input placeholder="填写描述" v-model="option.description" style="width: 530px;"></el-input>
                            <el-button type="text" @click="model.options.splice(index, 1)">
                                删除
                            </el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-button type="text" @click="addMoreTestingOption()">添加更多选项</el-button>
                        </div>
                    </el-form-item>
                </div>

                <el-form-item label="答案详解" prop="explain">
                    <el-input v-model="model.explain" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入答案详解">
                    </el-input>
                </el-form-item>
                <el-form-item label="所属题库" prop="group_id">
                    <SelectScroll :requestCb="fetchLibrary" :changeCb="onLibraryChange" :placeholder="model.group_name" v-model="model.group_id"></SelectScroll>
                </el-form-item>
                <el-form-item label="试题标签">
                    <Tags v-model="model.tags"></Tags>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog >

        <el-dialog append-to-body id="view" title="详情" :visible.sync="dialog.view">
            <div class="el-form-item">
                <label class="el-form-item__label">试题类型：</label>
                <div class="el-form-item__content">
                    <div class="el-input">
                        {{model.typeName}}
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label">试题题目：</label>
                <div class="el-form-item__content">
                    <div class="el-input">
                        {{model.description}}
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label">试题配图：</label>
                <div class="el-form-item__content">
                    <div class="el-input">
                        <img :src="model.image" alt="" style="width: 100px; height: 100px;">
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label">答案选项：</label>
                <div class="el-form-item__content" v-if="model.type == 0">
                    <el-tag type="success" v-if="model.correct == 1">正确</el-tag>
                    <el-tag type="danger" v-if="model.correct == 0">错误</el-tag>
                </div>
                <div class="el-form-item__content" v-if="model.type == 1">
                    <p v-for="(option, index) in model.options">
                        {{ option.description }}
                        <el-tag type="success" v-if="index == model.correct">正确</el-tag>
                        <el-tag type="danger" v-if="index != model.correct">错误</el-tag>
                    </p>
                </div>
                <div class="el-form-item__content" v-if="model.type == 2">
                    <p v-for="(option, index) in model.options">
                        {{ option.description }}
                        <el-tag type="success" v-if="option.correct == 1">{{ option.correctName }}</el-tag>
                        <el-tag type="danger" v-if="option.correct == 0">{{ option.correctName }}</el-tag>
                    </p>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label">答案详解：</label>
                <div class="el-form-item__content">
                    <div class="el-input">
                        {{model.explain}}
                    </div>
                </div>
            </div>

            <div class="el-form-item">
                <label class="el-form-item__label">试题标签：</label>
                <div class="el-form-item__content">
                    <div class="el-input">
                        {{model.tagString}}
                    </div>
                </div>
            </div>
            <div class="el-form-item">
                <label class="el-form-item__label">所属题库：</label>
                <div class="el-form-item__content">
                    <div class="el-input">
                        {{model.group_name}}
                    </div>
                </div>
            </div>
        </el-dialog >

        <LocalImportDialog
                :onSuccess="importQuestion"
                ref="localImportDialog"
                title="导入题库"
                :uploadUrl="uploadUrl"
                templateUrl="https://upload.yst.vodjk.com/assets/download/import/subject_group.xlsx">
            <article slot="footer">
                <hr style="margin-bottom: 15px;">
                <h5>注意事项：</h5>
                <h5>1.模板中字段轻对照填写，不能为空</h5>
                <h5>2.如果有某些内容为空，导入时将跳过</h5>
            </article>
        </LocalImportDialog>

        <ErrorDialog :error="error"></ErrorDialog>
    </div>

</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import testQuestionService from 'services/exam/testQuestionService'
    import testLibraryService from 'services/exam/testLibraryService'
    import UploadImg from 'components/upload/UploadImg.vue'
    import SelectScroll from 'components/form/SelectScroll.vue'
    import Tags from 'components/form/Tags.vue'
    import Question from 'models/quesion'
    import Option from 'models/option'
    import LocalImportDialog from '../component/LocalImportDialog.vue'
    // import NestedDialog  from 'components/dialog/NestedDialog.vue'
    import ErrorDialog from 'components/dialog/ErrorDialog.vue'

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
                uploadUrl: testQuestionService.getUploadUrl(),
                uploadImageUrl: testQuestionService.getUploadImageUrl(),
                rules: {
                    description: [
                        { required: true, message: '请输入试题题目', trigger: 'blur' },
                    ],
                    group_id: [
                        { type: 'number', required: true, message: '请选择题库', trigger: 'blur' },
                    ],
                    correct: [
                        { type: 'number', required: true, message: '请选择正确答案', trigger: 'blur' },
                    ],
                    options: [
                        { type: 'array', min: 1, required: true, message: '请选择正确答案', trigger: 'blur' },
                    ]
                },
                error: {
                    showDialog: false,
                    message: '',
                    data: []
                }
            }
        },
        activated () {
            if (this.$route.query.subject_group_id) {
                this.fetchParam.subject_group_id = this.$route.query.subject_group_id
            }
            this.fetchData()
            this.$refs['selectScroll'].filter('')
        },
        methods: {
            // initFetchParam () {
            //     this.fetchParam = this.newFetchParam()
            //     this.fetchData()
            // },
            fetchData () {
                this.loadingData = true
                let data = Object.assign({}, this.fetchParam)
                if (data.status === '' || data.status === undefined) {
                    data.status = -1
                }
                return testQuestionService.search(data).then((ret) => {
                    this.data = ret.data
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
            changeLibrary (val) {
                this.fetchParam.subject_group_id = val
                this.fetchData()
            },
            delMulti () {
                xmview.showDialog(`你将要删除选中的数据，操作不可恢复确认吗?`, () => {
                    testQuestionService.batchDelete(this.selectedIds).then(() => {
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
            openAddDialog () {
                let question = new Question()
                this.model = question
                this.editDialog = '新建试题'
                this.dialog.edit = true
            },
            edit (index, row) {
                let question = new Question()
                question.findById(row.id)
                this.model = question
                this.editDialog = '编辑试题'
                this.dialog.edit = true
            },
            del (index, row) {
                this.$confirm('您是否确定删除试题？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testQuestionService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            online (index, row) {
                return testQuestionService.online(row.id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.fetchData()
                })
            },
            offline (index, row) {
                return testQuestionService.offline(row.id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.fetchData()
                }).catch(ret => {
                    this.error.message = ret.data.message
                    this.error.data = ret.data.list
                    this.error.showDialog = true
                })
            },
            preview (index, row) {
                this.dialog.view = true
                let question = new Question()
                question.findById(row.id)
                console.log(question)
                this.model = question
            },
            submitForm () {
                this.$refs['form'].validate((pass) => {
                    if (!pass) {
                        return
                    }

                    this.model.save().then(() => {
                        this.dialog.edit = false
                        this.fetchData()
                    })
                })
            },
            // 添加多选 单选的选项
            addMoreTestingOption () {
                let option = new Option()
                this.model.addOption(option)
            },
            fetchLibrary (keyword, length) {
                let page = parseInt(length / 10) + 1
                return testLibraryService.search({keyword, page}).then((ret) => {
                    let result = {
                        data: [],
                        total: ret.total
                    }
                    if (ret.list == null) {
                        ret.list = []
                    }
                    ret.list.forEach((value) => {
                        result.data.push({
                            id: value.id,
                            name: value.name,
                        })
                    })

                    return result
                })
            },
            importQuestion (response) {
                return testQuestionService.batchCreate(response.data).then((ret) => {
                    this.fetchData()
                    this.$refs['selectScroll'].data = []

                    let reasons = []
                    if (response.errs) {
                        response.errs.forEach((message) => {
                            reasons.push({
                                message: message
                            })
                        })
                    }
                    return {
                        success: response.success,
                        error: response.failure,
                        reasons: reasons,
                    }
                })
            },
            selectable (row, index) {
                return row.status === 1
            },
            onRemove () {
                this.model.image = ''
            },
            newFetchParam () {
                return {
                    subject_group_id: void '',
                    tags: '',
                    type: void '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                    status: '',
                }
            },
            onLibraryChange (val) {
                this.model.group_id = val
                this.$refs['form'].validate()
            },
            onQuestionTypeChange (val) {
                if (this.model.id === 0) {
                    this.model.setDefaultOption(val)
                }
            }
        },
        components: {DateRange, UploadImg, SelectScroll, Tags, LocalImportDialog, ErrorDialog}
    }
</script>
