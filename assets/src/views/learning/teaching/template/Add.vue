<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #teaching-template-container {
        @extend %content-container;
        .task-item {
            width: 80%;
            margin: 10px 0;
            border: 1px dashed #dadada;
            padding: 0 10px;
            .delete {
                cursor: pointer;
                line-height: 40px;
                float: right;
                // margin-left: 100px;
            }
        }
        .custom-form {
            max-width: 60%
        }
        .custom-input {
            max-width: 400px;
        }
        .custom-img {
            width: 50%;
            margin-top: 10px;
        }
        .el-collapse {
            div.phaes-task.el-collapse-item {
                margin-bottom: 5px;
            }
            .el-collapse-item__header {
                padding-left: 10px;
                background: aliceblue;
            }
        }
        .phase-operation {
            cursor: pointer;
            position: fixed;
            top: 260px;
            right: 26%;
            i {
                color: orange;
                font-size: 70px;
            }
        }
    }
</style>

<template>
    <main id="teaching-template-container" :key="ruleForm.template_id">
        <Pad
            v-if="!view && can_edit" 
            @addPhase="addPhase"
            title="周期"
            :total="ruleForm.phase_list && ruleForm.phase_list.length">
        </Pad>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="custom-form">
            <el-form-item label="创建方式" v-if="!view && can_edit">
<!--                 <el-radio-group v-model="templateModel.label" @change="chooseTemplate">
                    <el-radio-button label="自定义"></el-radio-button>
                    <el-radio-button label="模版"></el-radio-button>
                </el-radio-group> -->
                <el-button 
                    type='primary' 
                    @click="chooseTemplate('模版')">
                    模版
                </el-button>
            </el-form-item>
            <el-form-item label="带教名称" prop="title">
                <el-input
                    :disabled="view || !can_edit"
                    class="custom-input"
                    v-model="ruleForm.title">
                </el-input>
            </el-form-item>
            <el-form-item label="统计周期" prop="phase_type">
                <el-radio 
                    v-model="ruleForm.phase_type" 
                    :label="1" 
                    :disabled="view || !can_edit || !!ruleForm.template_id">
                    天
                </el-radio>
                <el-radio 
                    v-model="ruleForm.phase_type" 
                    :label="2" 
                    :disabled="view || !can_edit || !!ruleForm.template_id">
                    周
                </el-radio>
                <el-radio 
                    v-model="ruleForm.phase_type" 
                    :label="3" 
                    :disabled="view || !can_edit || !!ruleForm.template_id">
                    月
                </el-radio>
            </el-form-item>
            <el-form-item label="封面" prop="image">
                <ImagEcropperInput 
                    v-if="!view && can_edit"
                    :isRound="false" 
                    :confirmFn="cropperFn">
                </ImagEcropperInput>
                <img 
                    class="custom-img" 
                    v-if="ruleForm.image" 
                    :src="ruleForm.image | fillImgPath"  
                    alt="封面图">
            </el-form-item>
            <el-form-item label="周期任务" prop="phase_list">
                <el-collapse v-model="activeNames" @change="collapseChange">
                    <el-collapse-item 
                        class="phase-task"
                        v-for="(phase, index) in ruleForm.phase_list"
                        :key="phase.phase_id"
                        :name="phase.phase">
                        <template slot="title">
                            <span class="phase-sort">第{{phase.phase}}{{ruleForm.phase_type | phaseType}}</span>
                            <el-button 
                                v-if="index!==0 && (!view && can_edit)"
                                type='text' 
                                @click.stop="deletePhase(phase, index)">
                                删除阶段
                            </el-button>
                            <!-- <input type="hidden" :value="phase.data.id"> -->
                       </template>
                        <Phase
                            :disabled="view || !can_edit"
                            ref="phase"
                            :keys="['course', 'speaking', 'exam', 'medicine_task', 'practical_operation']"
                            :phase="phase">
                        </Phase>
                    </el-collapse-item>
                </el-collapse>
            </el-form-item>
            <el-form-item label="阶段学习顺序" prop="learning_sequence">
                <el-radio-group v-model="ruleForm.learning_sequence" :disabled="view || !can_edit">
                    <el-radio :label="1">按计划学习</el-radio>
                    <el-radio :label="2">跨周期学习</el-radio>
                </el-radio-group>
                <el-tooltip class="item" effect="dark" content="开启后，学员学完当前周期内容可提前学习下一周期内容" placement="top">
                    <i class="el-icon-question" style="color: orange"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="结业考试">
                <el-button 
                    type='primary' 
                    class="task-add-btn" 
                    @click="addExam" 
                    :disabled="view || !can_edit"
                    size="medium">
                    添加考试
                </el-button>
                <div class="task-item" v-if="ruleForm.finish_exam_name">
                    <span>{{ruleForm.finish_exam_name}}</span>
                    <i 
                        class="el-icon-delete delete" 
                        title="删除任务" 
                        v-if="!view && can_edit"
                        @click="deleteFinishExam()">
                    </i>
                </div>
            </el-form-item>
            <el-form-item label="设置学员-教员" prop="publish_users">
                <AssignMember 
                    :select="ruleForm.publish_users" 
                    :is-edit="!!ruleForm.id"
                    :disabled="view || !can_edit">
                </AssignMember>
            </el-form-item>
            <el-form-item label="考评">
                <el-button 
                    type='primary' 
                    @click="openEvaluate('user')">
                    学员自动考评
                </el-button>
                <el-button 
                    type='warning' 
                    @click="openEvaluate('coacher')">
                    教员自动考评
                </el-button>
            </el-form-item>
            <!-- <el-form-item label="其他">
                <el-checkbox 
                    v-model="ruleForm.appraisal.hidden_coacher_appraisal"
                    :disabled="view"
                    :true-label="1"
                    :false-label="0">
                    对学员屏蔽教员评价
                </el-checkbox>
            </el-form-item> -->
            <el-form-item>
                <el-button 
                    v-if="!view"
                    type="primary" 
                    @click="submitForm('ruleForm')" 
                    v-loading="submitLoading">
                    {{ruleForm.id ? '更新' : '发布'}}
                </el-button>
                <el-button 
                    type='primary' 
                    @click="$router.replace({name: 'teaching-template'})">
                    关闭
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 选取模版 -->
        <CustomTemplate 
            :visible.sync="templateModel.showDialog"
            @submit="getTemplateInfo"
            @cancel="cancelChooseTemplate">
        </CustomTemplate>
        <!-- 添加考试 -->
        <Exam
            title="选取考试"
            :visible.sync="examModel.showDialog"
            @pick="getFinishedExamData">
        </Exam>
        <!-- 员工考评 -->
        <UserEvaluate
            :visible.sync="user.showDialog"
            v-model="ruleForm.appraisal.appraisal_user"
            :model="ruleForm.initUserEvaluate.bind(ruleForm)"
            v-if="user.showDialog"
            :disabled="view || !can_edit"
            :total-phase="ruleForm.phase_list.length"
            @submit="dealUserEvaluate">
        </UserEvaluate>
        <!-- 教员考评 -->
        <CoacherEvaluate 
            v-model="ruleForm.appraisal.appraisal_coacher"
            :model="ruleForm.initCoacherEvaluate.bind(ruleForm)"
            v-if="coacher.showDialog"
            :disabled="view || !can_edit"
            :visible.sync="coacher.showDialog"
            @submit="dealCoacherEvaluate">
        </CoacherEvaluate>
    </main>
</template>

<script>
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import Pad from '../../component/Pad.vue'
    import CustomTemplate from '../../component/Template.vue'
    import Phase from '../../maps/component/Phase.vue'
    import Exam from '../../maps/component/Exam.vue'
    import AssignMember from '../component/AssignMember.vue'
    import UserEvaluate from '../component/UserEvaluate.vue'
    import CoacherEvaluate from '../component/CoacherEvaluate.vue'

    import teachingService from 'services/learning/teaching'
    import commonService from 'services/commonService'
    import Maps from 'models/teachingMaps'

    export default {
        components: {
            ImagEcropperInput,
            Pad,
            CustomTemplate,
            Phase,
            Exam,
            AssignMember,
            UserEvaluate,
            CoacherEvaluate,
        },
        name: 'teaching-template-add',
        props: {},
        activated () {
        },
        created () {
            this.initMapsData(this.$route.query.id)
            if (!this.$route.query.id) {
                this.templateModel.showDialog = true
            }
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                view: !!this.$route.query.view,   // 是否是查看状态，查看状态下也不可修改
                can_edit: 1,   // 由后端返回控制编辑状态下是否可以编辑
                examModel: {
                    showDialog: false,
                },
                templateModel: {
                    label: '自定义',
                    showDialog: false,
                },
                user: {
                    showDialog: false,
                },
                coacher: {
                    showDialog: false,
                },
                submitLoading: false,
                activeNames: [1],
                ruleForm: {
                    appraisal: {}
                },
                rules: {
                    title: {required: true, message: '请输入模版名称', trigger: 'blur'},
                    type: { required: true, message: '请选择发布对象' },
                    publish_users: { required: true, message: '请设置学员-教员'},
                    learning_sequence: {required: true}
                }
            }
        },
        methods: {
            initMapsData (id, isTemp) {
                if (id) {
                    let service = isTemp ? 'viewTeachingTemp' : 'viewTeaching'
                    xmview.setContentLoading(true)
                    return teachingService[service](id).then(ret => {
                        console.log(ret)
                        // 后端将发布对象列表没有和data一起返回
                        if (isTemp) {
                            var { publish_users, appraisal } = this.ruleForm
                        } else {
                            this.can_edit = ret.data.can_edit
                        }
                        this.ruleForm = new Maps({
                            data: ret.data,
                        })
                        if (isTemp) {
                            this.ruleForm.publish_users = publish_users
                            this.ruleForm.appraisal = appraisal
                        }
                    }).then(() => {
                        xmview.setContentLoading(false)
                        // console.log(this.ruleForm)
                    }).catch(err => console.log(err))
                } else {
                    return Promise.resolve(this.ruleForm = new Maps({
                        phase_type: 1,
                    }))
                }
            },
            chooseTemplate (e) {
                if (e === '模版') {
                    this.templateModel.showDialog = true
                } else {
                    let tip = this.ruleForm.id ? '切换到自定义会填充初始值，是否切换' : '切换到自定义会清除填入的数据，是否切换？'
                    this.$confirm(tip, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.initMapsData(this.ruleForm.id)
                    }).catch(() => {
                        this.templateModel.label = '模版'
                    })
                }
            },
            cancelChooseTemplate () {
                if (!this.$route.query.id && !this.ruleForm.template_id) {
                    this.$router.replace({name: 'teaching-template'})
                }
            },
            getTemplateInfo (id) {
                let _id = this.ruleForm.id
                this.templateModel.showDialog = false
                this.initMapsData(id, true).then(ret => {
                    this.ruleForm.template_id = id
                    // 创建和编辑的id处理
                    !_id ? delete this.ruleForm.id : (this.ruleForm.id = _id)
                })
            },
            cropperFn (data, ext) {
                commonService.uploadCover({
                    upload_type: 'image',
                    image: data,
                    alias: `${Date.now()}.${ext}`
                }).then((ret) => {
                    this.ruleForm.image = ret.url
                })
            },
            addPhase () {
                this.ruleForm.insert()
            },
            deletePhase (phase, index) {
                this.$confirm('确定要删除该阶段吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // if (phase.data) {
                    //     learningService.deletePhase({
                    //         learning_maps_id: this.$route.query.id,
                    //         phase_id: phase.id
                    //     })
                    // }
                    this.ruleForm.deletePhase(index)
                })
            },
            addExam (type) {
                this.examModel.showDialog = true
            },
            getFinishedExamData (data) {
                this.ruleForm.finish_exam_name = data.name
                this.ruleForm.finish_exam_id = data.id
            },
            deleteFinishExam () {
                this.ruleForm.finish_exam_name = ''
                this.ruleForm.finish_exam_id = ''
            },
            openEvaluate (type) {
                this[type].showDialog = true
            },
            dealUserEvaluate (val) {
                this.ruleForm.appraisal.is_default_user_rule = 0
                this.ruleForm.appraisal.appraisal_user = val
            },
            dealCoacherEvaluate (val) {
                this.ruleForm.appraisal.is_default_coacher_rule = 0
                this.ruleForm.appraisal.appraisal_coacher = val
            },
            submitForm (formName) {
                if (this.validateAllForm(formName)) {
                    console.log(this.ruleForm)
                    this.deleteElective()
                    this.submitLoading = true
                    let service = this.ruleForm.id ? teachingService.updateTeaching : teachingService.createTeaching
                    service(this.ruleForm.save()).then(() => {
                        this.submitLoading = false
                        this.$router.replace({name: 'teaching-template'})
                    }).catch(ret => {
                        // 数量不足时弹窗提示并跳转课程商城购买
                        if (ret.code === 8) {
                            this.navigateToBuy(ret)
                        }
                        this.submitLoading = false
                    })
                }
            },
            // 不添加选修时 删除选修任务
            deleteElective() {
                this.ruleForm.phase_list.forEach(item => {
                    if(item.elective === 1) {
                        let arr = item.phase_object_list
                        item.phase_object_list = arr.filter(f => {
                            return f.type === 1
                        })
                    }
                })
            },
            navigateToBuy (ret) {
                this.$confirm(ret.data && ret.data.data || ret.message, '提示', {
                    confirmButtonText: '购买',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({name: 'store-list', query: { id: this.ruleForm.template_id }})
                })
            },
            validateAllForm (formName) {
                return ![...this.$refs.phase.map(item => item), this]
                        .some((item, index) => !item.validate(formName, index + 1))
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid || !this.customValidate()) pass = false
                })
                return pass
            },
            customValidate () {
                let pass = true
                if (this.ruleForm.data.is_free != 1 && this.ruleForm.publish_users.length > this.ruleForm.data.unused) {
                    pass = false
                    this.navigateToBuy({message: `可发放人数为${this.ruleForm.data.unused}，添加的人数超过可发放人数，请购买后再添加`})
                }
                this.ruleForm.publish_users.forEach(item => {
                    for (let [key, value] of Object.entries(item)) {
                        if(!value) {
                            pass = false
                            xmview.showTip('warning', '请设置学员-教员')
                            break
                        }
                    }
                })
                let finish_exam_id = this.ruleForm.finish_exam_id
                if (finish_exam_id) {
                    phase:
                    for (let i = 0, len1 = this.ruleForm.phase_list.length; i < len1; i++) {
                        obj:
                        for (let j = 0, len2 =this.ruleForm.phase_list[i].phase_object_list.length; j < len2; j++) {
                            let item = this.ruleForm.phase_list[i].phase_object_list[j]
                            if (item.object_type === 'exam') {
                                if (item.object_id === finish_exam_id) {
                                    pass = false
                                    xmview.showTip('warning', `结业考试和第${i + 1}阶段所选考试重复，请重新选择`)
                                    break phase
                                }
                            }
                        }
                    }
                }
                if (!this.ruleForm.template_id) {
                    pass = false
                    xmview.showTip('error', '您没有通过模版来创建')
                }
                return pass
            },
            collapseChange (e) {
                if (e.length > 0) return
            }
        },
        filters: {
            phaseType (val) {
                let map = {
                    1: '天',
                    2: '周',
                    3: '月'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
