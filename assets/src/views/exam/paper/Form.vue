<style lang='scss' rel='stylesheet/scss'>
    #form {
        width: 630px;
        hr{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
        .el-button + .el-button{
            margin-left: 0;
        }
        .u-course-tag {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
        .collection {
            align-items: center;
            min-height: 36px;
            border-radius: 4px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
            background: #fff;
            .tag {
               margin-right: 10px;
           }
        }
    }

    .bottom-bar{
        position: fixed;
        height: 90px;
        bottom: 0;
        left: 0;
        background: #FBFDFF;
        border: 1px solid #E6EAEE;
        border-radius: 0 0 4px 4px;
        z-index: 1001;
        .el-input-group__append {
            padding: 0 8px
        }
        .btn-save {
            float: right;
            display: inline-block;
            height: 88px;
            width: 100px;
            line-height: 60px;
            border-radius: 0;
        }
        .info {
            width: 90px;
            float: left;
            text-align: center;
            margin: 21px auto;
            font-size: 15px;
            color: #354053;
            .title {
                margin-bottom: 8px;
                font-size: 15px;
                color: #7F8FA4;
            }
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

    .el-input-number .el-input {
        display: inline-table;
    }
</style>
<template>
    <el-tabs type="card" v-model="activeTab" class="tab" id="tab-exam" style="position: relative;" @tab-click="onTabChange">
        <el-tab-pane label="试卷信息" name="info">
            <el-form id="form" ref="form" :model="paper" :rules="rules" label-width="120px">
                <el-form-item label="试卷名称" prop="name">
                    <el-input v-model="paper.name" placeholder="请输入试卷名称"></el-input>
                </el-form-item>
                <el-form-item label="试卷封面" prop="image">
                    <img :src="paper.image | fillImgPath" width="200" height="112" v-show="paper.image">
                    <CropperImg ref="imgCropper" :aspectRatio="16/9" :confirmFn="cropperImgSuccess"></CropperImg>
                </el-form-item>
                <el-form-item label="试卷描述" prop="description">
                    <el-input type="textarea"
                              :rows="3"
                              v-model="paper.description"
                              placeholder="请输入试卷描述"></el-input>
                </el-form-item>
                <el-form-item label="考试时间" prop="limit_time">
                    <el-input-number v-model.number="paper.limit_time" style="width: 300px" :controls="false" :min="0">
                        <template slot="append">分钟</template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="考试次数限制" prop="limit_repeat">
                    <el-input-number v-model.number="paper.limit_repeat" style="width: 300px" placeholder="留空或为0表示不限制" :controls="false" :min="0">
                        <template slot="append">次</template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="试卷类型" prop="auto">
                    <el-radio-group v-model="paper.auto" :disabled="paper.id !== 0">
                        <el-radio :label="0">普通试卷</el-radio>
                        <el-radio :label="1">随机试卷</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="试题解析时间" prop="answer_show_type">
                    <el-radio-group v-model="paper.answer_show_type">
                        <el-radio label="now">立即</el-radio>
                        <el-radio label="timing">延迟</el-radio>
                    </el-radio-group>
                    <el-form-item prop="answer_show_time" v-if="paper.answer_show_type === 'timing'" style="display: inline-block">
                        至
                        <el-date-picker
                                v-model="paper.answer_show_time"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                        之后显示
                    </el-form-item>
                </el-form-item>
                <el-form-item label="学分设置" prop="study_score_type" v-if="needStudyScore">
                    <el-radio-group v-model="paper.study_score_type">
                        <el-radio label="no">不设置学分</el-radio>
                        <el-radio label="fullscore">满分领取学分</el-radio>
                        <el-radio label="pass">合格领取学分</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="学分奖励" prop="study_score" v-if="paper.study_score_type === 'pass' || paper.study_score_type === 'fullscore'">
                    <el-input v-model.number="paper.study_score" v-number-only placeholder="请输入企业学分">
                    </el-input>
                </el-form-item>
                <!-- 发布对象 -->
                <Pusher
                    ref="pusher"
                    :ruleForm="paper"
                    type="publish_type"
                    parentRef="form"
                    labelWidth="120px"
                    v-model="paper.push_type_list">
                </Pusher>
                <el-form-item label="截止日期" prop="end_time">
                    <el-date-picker
                            v-model="paper.end_time"
                            type="datetime"
                            placeholder="截止日期"
                            :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onNext">下一步</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane :disabled="paper.id === 0" label="设置题目" name="subject" style="position: relative">
            <div v-if="paper.auto === 0">
                <el-form  id="form" ref="subjectForm" :model="paper" :rules="rules" label-width="120px" style="padding-bottom: 90px">
                    <ImportQuestion :questions="paper.questions" :scores="paper" ref="importQuestion"></ImportQuestion>
                </el-form>

                <div class="bottom-bar" v-show="activeTab === 'subject' && showBottomBar" ref="bottom-bar" @click.stop>
                    <el-row style="width: 580px;float: left;">
                        <div class="info">
                            <div class="title">判断题</div>
                            <div>{{ judgeCount }}题</div>
                        </div>
                        <div class="info">
                            <div class="title">单选题</div>
                            <div>{{ singleCount }}题</div>
                        </div>
                        <div class="info">
                            <div class="title">多选题</div>
                            <div>{{ multiCount }}题</div>
                        </div>
                        <div class="info" style="margin: 38px auto; width: 130px;">
                            <span class="title">总计：</span>
                            <span>{{ questionCount }}题/{{ scoreCount }}分</span>
                        </div>
                        <div class="info" style="margin: 31px auto; width: 180px;">
                            <el-form :model="paper" :rules="rules" label-width="95px" ref="formScore">
                                <el-form-item label="及格分数：" prop="score_pass">
                                    <el-input-number v-model.number="paper.score_pass" :controls="false" style="width: 99px;" :min="0">
                                        <template slot="append">分</template>
                                    </el-input-number>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-row>
                    <el-button type="primary" class="btn-save" @click.stop="submit">保存</el-button>
                </div>
            </div>
            <div v-if="paper.auto === 1">
                <el-form  id="form" ref="subjectGroupForm" :model="paper" :rules="rules" label-width="120px" style="padding-bottom: 90px">
                    <el-form-item label="调用题库" prop="subject_groups">
                        <SubjectGroup :paper="paper"></SubjectGroup>
                    </el-form-item>
                    <el-form-item label="题目数及分值" :required="true">
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
                                <td>{{paper.subject_groups.reduce((accu, item) => accu + item['single_total'],0)}}</td>
                                <td>
                                    <el-form-item prop="random_setting.single_total">
                                        <el-input-number
                                                v-model.number="paper.random_setting.single_total"
                                                :controls="false"
                                                placeholder="请输入单选题数量"
                                                :min="0">
                                        </el-input-number>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item prop="random_setting.single_score">
                                        <el-input-number
                                                v-model.number="paper.random_setting.single_score"
                                                :controls="false"
                                                placeholder="请输入单选题分数"
                                                style="width: 70px;"
                                                :min="0">
                                        </el-input-number>
                                    </el-form-item>
                                </td>
                                <td>{{ paper.random_setting.single_total * paper.random_setting.single_score }}</td>
                            </tr>
                            <tr>
                                <td>多选题</td>
                                <td>{{paper.subject_groups.reduce((accu, item) => accu + item['multi_total'],0)}}</td>
                                <td>
                                    <el-form-item prop="random_setting.multi_total">
                                        <el-input-number
                                                v-model="paper.random_setting.multi_total"
                                                :controls="false"
                                                placeholder="请输入多选题数量"
                                                :min="0">
                                        </el-input-number>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item prop="random_setting.multi_score">
                                        <el-input-number
                                                v-model="paper.random_setting.multi_score"
                                                :controls="false"
                                                placeholder="请输入多选题分数"
                                                style="width: 70px;"
                                                :min="0">
                                        </el-input-number>
                                    </el-form-item>
                                </td>
                                <td>{{ paper.random_setting.multi_total * paper.random_setting.multi_score }}</td>
                            </tr>
                            <tr>
                                <td>判断题</td>
                                <td>{{paper.subject_groups.reduce((accu, item) => accu + item['judge_total'],0)}}</td>
                                <td>
                                    <el-form-item prop="random_setting.judge_total">
                                        <el-input-number
                                                v-model="paper.random_setting.judge_total"
                                                :controls="false"
                                                placeholder="请输入判断题数量"
                                                :min="0">
                                        </el-input-number>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item prop="random_setting.judge_score">
                                        <el-input-number
                                                v-model="paper.random_setting.judge_score"
                                                :controls="false"
                                                placeholder="请输入判断题分数"
                                                style="width: 70px;"
                                                :min="0">
                                        </el-input-number>
                                    </el-form-item>
                                </td>
                                <td>{{ paper.random_setting.judge_total * paper.random_setting.judge_score }}</td>
                            </tr>
                            <tr>
                                <td>合计</td>
                                <td>
                                    {{
                                        paper.subject_groups.reduce((accu, item) => accu + item['single_total'],0) +
                                        paper.subject_groups.reduce((accu, item) => accu + item['multi_total'],0) +
                                        paper.subject_groups.reduce((accu, item) => accu + item['judge_total'],0)
                                    }}
                                </td>
                                <td colspan="2">
                                    {{ paper.random_setting.single_total + paper.random_setting.multi_total + paper.random_setting.judge_total }}
                                </td>
                                <td>
                                    {{ randomScoreCount }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </el-form-item>
                    <el-form-item label="及格分数" prop="score_pass">
                        <el-input-number v-model.number="paper.score_pass" :controls="false" :min="0">
                            <template slot="append">分</template>
                        </el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="submit">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import CropperImg from 'components/upload/ImagEcropperInput.vue'
    import ImportQuestion from '../component/ImportQuestion.vue'
    import CompanySelect from 'components/select/IndustryCompany.vue'
    import DepSelect from 'components/select/Department.vue'
    import Transfer from 'components/dialog/Transfer2'
    import testPaperService from 'services/exam/testPagerService'
    import depService from 'services/departmentService'
    import {userList} from 'services/userService'
    import userService from 'services/company/userService'
    import SubjectGroup from '../component/SubjectGroup'
    import Pusher from 'components/select/pusher/Main.vue'

    export default{
        props: {
            paper: {
                type: Object,
                required: true
            },
            needStudyScore: {
                type: Boolean,
                required: false,
                default: true,
            },
            publishType: {
                type: Boolean,
                required: false,
                default: true,
            },
            onSubmit: {
                type: Function,
                required: true,
            },
        },
        components: {
            CropperImg, 
            ImportQuestion, 
            CompanySelect, 
            DepSelect, 
            Transfer, 
            SubjectGroup,
            Pusher
        },
        data () {
            var validateMax = (rule, value, callback) => {
                let count = rule.max()

                if (value > count) {
                    callback(new Error(rule.message))
                } else {
                    callback();
                }
            }

            return {
                pickerOptions0: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                activeTab: 'info',
                rules: {
                    name: [
                        { required: true, message: '请输入试卷名称', trigger: 'blur' },
                    ],
                    description: [
                        { required: true, message: '请输入试卷描述', trigger: 'blur' },
                    ],
                    auto: [
                        { required: true, type: 'number', message: '请输入试卷描述', trigger: 'blur' },
                    ],
                    single_score: [
                        { type: 'number', required: true, message: '请输入单选题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    multi_score: [
                        { type: 'number', required: true, message: '请输入多选题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    judge_score: [
                        { type: 'number', required: true, message: '请输入判断题分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    limit_time: [
                        { type: 'number', required: true, message: '请输入考试时间', trigger: 'blur' },
                        { type: 'number', min: 1, message: '请输入大于0的数字', trigger: 'blur' },
                    ],
                    score_pass: [
                        { type: 'number', required: true, message: '请输入及格分数', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                        { validator: validateMax, message: '不能大于总分数', trigger: 'blur', max: () => {
                                let count = 0
                                    if (this.paper.auto === 0) {
                                        count = this.scoreCount
                                    } else {
                                        count = this.randomScoreCount
                                }

                                return count
                            }},
                    ],
                    study_score_type: [
                        { required: true, message: '请选择学分设置', trigger: 'blur' },
                    ],
                    answer_show_type: [
                        { required: true, message: '请选择试题解析类型', trigger: 'blur' },
                    ],
                    answer_show_time: [
                        { type: 'date', required: true, message: '请输入试题解析时间', trigger: 'blur' },
                    ],
                    publish_type: [
                        { required: true, message: '请选择发布对象', trigger: 'change' }
                    ],
                    subject_groups: [
                        { type: 'array', required: true, message: '请选择题库' }
                    ],
                    'random_setting.single_total': [
                        { validator: validateMax, message: '不能大于总数', trigger: 'blur', max: () => {
                                return this.paper.subject_groups.reduce((accu, item) => accu + item['single_total'],0)
                            }},
                    ],
                    'random_setting.multi_total': [
                        { validator: validateMax, message: '不能大于总数', trigger: 'blur', max: () => {
                                return this.paper.subject_groups.reduce((accu, item) => accu + item['multi_total'],0)
                            }},
                    ],
                    'random_setting.judge_total': [
                        { validator: validateMax, message: '不能大于总数', trigger: 'blur', max: () => {
                                return this.paper.subject_groups.reduce((accu, item) => accu + item['judge_total'],0)
                            }},
                    ]
                },
                showBottomBar: false
            }
        },
        computed: {
            judgeCount: function () {
                let count = 0
                this.paper.questions.forEach(question => {
                    if (question.type === 0) {
                        count += 1
                    }
                })

                return count
            },
            singleCount: function () {
                let count = 0
                this.paper.questions.forEach(question => {
                    if (question.type === 1) {
                        count += 1
                    }
                })

                return count
            },
            multiCount: function () {
                let count = 0
                this.paper.questions.forEach(question => {
                    if (question.type === 2) {
                        count += 1
                    }
                })

                return count
            },
            questionCount: function () {
                return this.paper.questions.length
            },
            scoreCount: function () {
                let count = 0
                this.paper.questions.forEach(question => {
                    if (question.score === undefined) {
                        count += 0
                    } else {
                        count += Number(question.score)
                    }
                })

                return count
            },
            randomScoreCount: function () {
                let paper = this.paper
                return (paper.random_setting.single_total * paper.random_setting.single_score) +
                    (paper.random_setting.multi_total * paper.random_setting.multi_score) +
                    (paper.random_setting.judge_total * paper.random_setting.judge_score)
            },
        },
        mounted() {
            window.addEventListener('resize', this.onResize)
            let bar = this.$refs['bottom-bar']
            if (bar) {
                document.body.appendChild(bar)
            }
        },
        watch: {
            'paper.subject_groups': function () {
                if (this.$refs['subjectGroupForm']) {
                    this.$refs['subjectGroupForm'].validate()
                }
            }
        },
        deactivated () {
            this.removeBottomBar()
        },
        beforeDestroy () {
            this.removeBottomBar()
        },
        methods: {
            validateForm (func) {
                if (this.paper.auto === 0) {
                    if (!this.$refs['importQuestion'].validateQuestionForm()) {
                        return
                    }

                    this.$refs['formScore'].validate((valid) => {
                        if (valid) {
                            this.$refs['subjectForm'].validate(func)
                        }
                    })
                } else {
                    this.$refs['subjectGroupForm'].validate(func)
                }
            },
            cropperImgSuccess (data, ext) {
                testPaperService.getUploadUrl({
                    image: data,
                    alias: Date.now() + ext
                }).then((ret) => {
                    this.paper.image = ret.url
                })
            },
            onNext () {
                if (this.validateAllForm('form')) {
                    this.activeTab = 'subject'
                    this.showBottomBar = true
                    if (this.paper.auto === 0) {
                        this.$nextTick(this.onResize)
                    }
                }
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            validateAllForm (formName) {
                return ![this, this.$refs.pusher]
                        .some((item, index) => !item.validate(formName, index + 1))
            },
            onResize() {
                let bar = document.querySelector('.bottom-bar')
                let parent = document.querySelector('#tab-exam')

                bar.style.left = (parent.getBoundingClientRect().left - 15) + 'px'
                bar.style.width = (parent.offsetWidth + 30) + 'px'
            },
            submit () {
                this.onSubmit()
            },
            closeBottomBar() {
                this.showBottomBar = false
            },
            openBottomBar() {
                this.showBottomBar = true
            },
            removeBottomBar() {
                let bar = this.$refs['bottom-bar']
                document.body.contains(bar) && document.body.removeChild(bar)
            },
            onTabChange (tab) {
                if (tab.index === '1') {
                    this.onNext()
                }
            }
        }
    }
</script>
