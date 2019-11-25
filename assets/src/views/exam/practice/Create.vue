<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/topSearch";
    #exam-practice-create {
        .form {
            width: 630px;
            hr{
                margin-bottom: 15px;
            }
            .el-button + .el-button{
                margin-left: 0;
            }
        }
        .practice-table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            border: solid #bfcbd9;
            border-width: 1px 0 0 1px;
            layout: fixed;
            td, th {
                white-space: nowrap;
                border: solid #bfcbd9;
                border-width: 0 1px 1px 0;
                padding: 6px 8px;
                text-align: left;
            }
        }
        .library {
            margin-bottom: 10px;
            min-width: 500px;
            border: 2px dashed #E6EAEE;
            // box-sizing: border-box;
            .library-operation {
                padding: 0 4%;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #E6EAEE;
                background-color: #EFF1F6;
                .library-icon {
                    float: right;
                    cursor: pointer;
                    line-height: 50px;
                }
            }
            .library-info {
                padding: 0 4%;
                .library-subject {
                    .library-type {
                        color: #7F8FA4;
                    }
                }
                .library-subject2 {
                    text-align: center;
                }
                .library-subject3 {
                    text-align: right;
                }
            }
        }
        .search {
            margin: 0 0 20px 27px;
            @extend %top-search-container;
        }
    }
</style>
<template>
    <main id="exam-practice-create">
        <el-form class="form" ref="form" :model="fetchParam" :rules="rules" label-width="120px">
            <el-form-item label="练习名称" prop="name">
                <el-input v-model="fetchParam.name" placeholder="请输入试卷名称"></el-input>
            </el-form-item>
            <el-form-item label="练习简介" prop="description">
                <el-input type="textarea" :rows="3" v-model="fetchParam.description"></el-input>
            </el-form-item>
            <el-form-item label="调用题库" prop="subject_group">
                <el-button type='primary' @click="openImportDialog()">关联题库</el-button>            
            </el-form-item>
            <el-form-item>
                <section v-for="(subject, index) in fetchParam.subject_group" class="library" :key="subject.group_id">
                    <div class="library-operation">
                        <span>题库名称：{{subject.name}}({{subject.subject_num}})</span>
                        <i class="el-icon-delete library-icon" @click="deleteSubject(index)"></i>
                    </div>
                    <div class="library-info">
                        <el-row type="flex" justify="space-between">
                            <el-col :span="6">
                                <div class="library-subject1 library-subject">
                                    <p class="library-type">单选题</p>
                                    <p>{{subject.single_num}}题</p>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="library-subject2 library-subject">
                                    <p class="library-type">多选题</p>
                                    <p>{{subject.multi_num}}题</p>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="library-subject3 library-subject">
                                    <p class="library-type">判断题</p>
                                    <p>{{subject.judge_num}}题</p>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </section>
            </el-form-item>
            <el-form-item label="模拟考试题目数及分值" :required="true">
                <table class="practice-table">
                    <thead>
                        <tr>
                            <th>题目类型</th>
                            <th>题目总数</th>
                            <th>选取数量(应小于对应的总数)</th>
                            <th>每题分值</th>
                            <th>题型总分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>单选题</td> 
                            <td>{{fetchParam.subject_group.reduce((accu, item) => accu + item['single_num'],0)}}</td>
                            <td>
                                <el-form-item prop="single_num">
                                    <el-input-number
                                        v-model.number="fetchParam.single_num"
                                        :controls="false"
                                        placeholder="请输入单选题数量">
                                    </el-input-number>
                                </el-form-item>
                            </td> 
                            <td>
                                <el-form-item prop="single_score">
                                    <el-input-number
                                        v-model.number="fetchParam.single_score"
                                        :controls="false"
                                        placeholder="请输入单选题分数">
                                    </el-input-number>
                                </el-form-item>
                            </td> 
                            <td>{{fetchParam.single_num * fetchParam.single_score | num}}</td> 
                        </tr>
                        <tr>
                            <td>多选题</td> 
                            <td>{{fetchParam.subject_group.reduce((accu, item) => accu + item['multi_num'],0)}}</td>
                            <td>
                                <el-form-item prop="multi_num">
                                    <el-input-number
                                        v-model="fetchParam.multi_num"
                                        :controls="false"
                                        placeholder="请输入多选题数量">
                                    </el-input-number>
                                </el-form-item>
                            </td> 
                            <td>
                                <el-form-item prop="multi_score">
                                    <el-input-number
                                        v-model="fetchParam.multi_score"
                                        :controls="false"
                                        placeholder="请输入多选题分数">
                                    </el-input-number>
                                </el-form-item>
                            </td>
                            <td>{{fetchParam.multi_num * fetchParam.multi_score | num}}</td> 
                        </tr>
                        <tr>
                            <td>判断题</td> 
                            <td>{{fetchParam.subject_group.reduce((accu, item) => accu + item['judge_num'],0)}}</td>
                            <td>
                                <el-form-item prop="judge_num">
                                    <el-input-number
                                        v-model="fetchParam.judge_num"
                                        :controls="false"
                                        placeholder="请输入判断题数量">
                                    </el-input-number>
                                </el-form-item>
                            </td> 
                            <td>
                                <el-form-item prop="judge_score">
                                    <el-input-number
                                        v-model="fetchParam.judge_score"
                                        :controls="false"
                                        placeholder="请输入判断题分数">
                                    </el-input-number>
                                </el-form-item>
                            </td>
                            <td>{{fetchParam.judge_num * fetchParam.judge_score | num}}</td> 
                        </tr>
                        <tr>
                            <td>合计</td> 
                            <td>
                                {{
                                    fetchParam.subject_group.reduce((accu, item) => accu + item['single_num'],0) +
                                    fetchParam.subject_group.reduce((accu, item) => accu + item['multi_num'],0) +
                                    fetchParam.subject_group.reduce((accu, item) => accu + item['judge_num'],0)
                                }}
                            </td>
                            <td colspan="2">
                                {{(fetchParam.single_num + fetchParam.multi_num + fetchParam.judge_num) | num}}
                            </td>
                            <td>
                                {{
                                    (fetchParam.single_num * fetchParam.single_score  +
                                    fetchParam.multi_num * fetchParam.multi_score  +
                                    fetchParam.judge_num * fetchParam.judge_score) | num
                                }}
                            </td> 
                        </tr>
                    </tbody>
                </table>
            </el-form-item>
            <el-form-item label="考试时间" prop="limit_time">
                <el-input v-model.number="fetchParam.limit_time" style="width: 300px" v-number-only>
                    <template slot="append">分钟</template>
                </el-input>
            </el-form-item>
            <el-form-item label="及格分数" prop="score_pass">
                <el-input v-model.number="fetchParam.score_pass" style="width: 300px" v-number-only>
                    <template slot="append">分</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="submitLoading" @click="submit()">保存</el-button>
            </el-form-item>
        </el-form>
        
        <el-dialog 
            v-if="subjectDialog.showDialog"
            title="关联题库" 
            :visible.sync="subjectDialog.showDialog">
            <section class="search">
                <i>题库名称：</i>
                <el-input v-model="subjectDialog.fetchParam.keyword" placeholder="题库名称" @keyup.enter.native="fetchSubjectGroup"></el-input>
            </section>
            <Transfer 
                :data="subjectDialog.data" 
                v-model="subjectDialog.subject_group"
                @searchFn="val => {subjectDialog.fetchParam.keyword = val;subjectDialog.fetchParam.page=1;fetchSubjectGroup()}"
                @current-change="val => {subjectDialog.fetchParam.page = val; fetchSubjectGroup()}"
                @size-change="val => {subjectDialog.fetchParam.page_size = val; fetchSubjectGroup()}"
                :current-page="subjectDialog.fetchParam.page"
                :page-size="subjectDialog.fetchParam.page_size"
                :total="subjectDialog.total">
            </Transfer>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmSubjectGroup">确定</el-button>
                <el-button @click="subjectDialog.showDialog= false">取消</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    import testPracticeService from 'services/exam/testPracticeService'
    import testLibraryService from 'services/exam/testLibraryService'
    import Transfer from 'components/dialog/Transfer2.vue'
    export default{
        name: 'grade-practice-create',
        components: {
            Transfer
        },
        created () {
            this.init()
        },
        activated () {
            this.init()
        },
        computed: {
            id () {
                return this.$route.params.practice_id
            }
        },
        watch: {
            'fetchParam.subject_group' (val) {
                this.fetchParam.subject_group_id = val.map(item => item.id)
            }
        },
        data () {
            const validateScorePass = (rule, value, callback) => {
                if (value > (this.fetchParam.single_num * this.fetchParam.single_score +
                    this.fetchParam.multi_num * this.fetchParam.multi_score +
                    this.fetchParam.judge_num * this.fetchParam.judge_score)) {
                    return callback(new Error('及格分数应小于题型总分'))
                } else {
                    callback()
                }
            }
            return {
                fetchParam: initForm(),
                submitLoading: false,
                subjectDialog: initSubjectDialog(),
                rules: {
                    name: [
                        { required: true, message: '请输入练习名称', trigger: 'blur' },
                    ],
                    description: [
                        { required: true, message: '请输入练习简介', trigger: 'blur' },
                    ],
                    single_num: [
                        { type: 'number', required: true, message: '请输入单选题数量', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    single_score: [
                        { type: 'number', required: true, message: '请输入单选题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    multi_num: [
                        { type: 'number', required: true, message: '请输入多选题数量', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    multi_score: [
                        { type: 'number', required: true, message: '请输入多选题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    judge_num: [
                        { type: 'number', required: true, message: '请输入判断题数量', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    judge_score: [
                        { type: 'number', required: true, message: '请输入判断题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    limit_time: [
                        { type: 'number', required: true, message: '请输入考试时间', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    score_pass: [
                        { type: 'number', required: true, message: '请输入及格分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                        { validator: validateScorePass }
                    ],
                    subject_group: { type: 'array', required: true, message: '请选择关联题库' }
                },
            }
        },
        methods: {
            init () {
                if (this.id) {
                    testPracticeService.view(this.id).then((ret) => {
                        this.fetchParam = Object.assign(this.fetchParam, ret.practice)
                        this.subjectDialog.subject_group = this.fetchParam.subject_group.slice(0)
                        xmview.setContentLoading(false)
                    })
                } else {
                    this.fetchParam = initForm()
                    this.subjectDialog = initSubjectDialog()
                    xmview.setContentLoading(false)
                }
            },
            submit () {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    if (!this.subjectNumValidate()) {
                        return this.$alert('您所设置的模拟考试题目大于题库中对应题目数量，请重新设置；', '提示', {confirmButtonText: '确定'})
                    }
                    this.submitLoading = true
                    if (this.id) {
                        testPracticeService.update(this.id, this.fetchParam).then((ret) => {
                            xmview.showTip('success', '操作成功')
                            this.submitLoading = false
                            this.$router.push({name: 'exam-practice-index'})
                        })
                    } else {
                        testPracticeService.create(this.fetchParam).then((ret) => {
                            xmview.showTip('success', '操作成功')
                            this.submitLoading = false
                            this.$router.push({name: 'exam-practice-index'})
                        })
                    }
                    this.submitLoading = false
                })
            },
            openImportDialog (ref) {
                this.subjectDialog.fetchParam = initSubjectFetchParam()
                this.fetchSubjectGroup()
                this.subjectDialog.showDialog = true
            },
            fetchSubjectGroup () {
                var params = this.subjectDialog.fetchParam
                params.subject_status = 0
                testLibraryService.search(params).then(ret => {
                    this.subjectDialog.data = ret.list
                    this.subjectDialog.total = ret.total
                })
            },
            deleteSubject (index) {
                this.fetchParam.subject_group.splice(index, 1)
                this.subjectDialog.subject_group.splice(index, 1)
            },
            confirmSubjectGroup () {
                this.fetchParam.subject_group = this.subjectDialog.subject_group.slice(0)
                this.subjectDialog.showDialog = false
            },
            subjectNumValidate () {
                const num = ['single_num', 'multi_num', 'judge_num']
                let pass = true
                for (let i = 0; i < num.length; i++) {
                    let type = num[i]
                    let sum = this.fetchParam.subject_group.reduce((accu, item) => accu + item[type], 0)
                    if (this.fetchParam[type] > sum) {
                        pass = false
                        break
                    }
                }
                return pass
            }
        },
        filters: {
            num (val) {
                if (isNaN(val)) {
                    return 0
                }
                return val
            }
        }
    }

    function initForm () {
        return {
            name: '',
            description: '',
            single_num: void 0,
            single_score: void 0,
            multi_num: void 0,
            multi_score: void 0,
            judge_num: void 0,
            judge_score: void 0,
            limit_time: void 0,
            score_pass: void 0,
            subject_group_id: [],
            subject_group: []
        }
    }

    function initSubjectFetchParam () {
        return {
            keyword: '',
            page: 1,
            page_size: 15
        }
    }

    function initSubjectDialog() {
        return {
            showDialog: false,
            fetchParam: initSubjectFetchParam(),
            data: [],
            total: 0,
            subject_group: [],
        }
    }
</script>
