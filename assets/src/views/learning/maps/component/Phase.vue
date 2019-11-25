<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-phase-container {
        padding-top: 10px;
        border: 2px dashed #dadada;
        border-top: none;
        // margin-bottom: 20px;
        .phase-sort {
            background: #cacaca;
            padding: 10px;
            margin-bottom: 10px;
            font-style: italic;
            font-weight: bold;
            font-size: 17px;
            // color: re;
        }
        .task-add-btn {
            margin: 10px 0;
        }
    }
</style>

<template>
    <main id="learning-map-phase-container">
        <!-- 内容主体 -->
        <!-- <p class="phase-sort">第{{ruleForm.phase}}阶段</p> -->
        <el-form label-width="150px" :rules="rules" :model="ruleForm" ref="ruleForm" inline-message>
            <el-form-item label="学分奖励" prop="study_score">
                <el-input-number 
                    :disabled="disabled"
                    v-model.number="ruleForm.study_score"
                    :controls="false">
                </el-input-number>
            </el-form-item>
            <el-form-item label="必修任务学习顺序" prop="sequence">
                <el-radio-group v-model="ruleForm.sequence" :disabled="disabled">
                    <el-radio :label="1">按计划顺序</el-radio>
                    <el-radio :label="2">自由顺序</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="必修任务" required>
                <el-button 
                    type='primary' 
                    @click="addRequiredTask(1)" 
                    :disabled="disabled"
                    size="medium">
                    添加必修任务
                </el-button>
                <SelectedTask
                    :selected="ruleForm.phase_object_list"
                    :taskType="1"
                    :draggable="ruleForm.sequence === 1 ? true : false"
                    :delete="deleteRequiredTask"
                    @end="onDraggableEnd">
                </SelectedTask>
            </el-form-item>
            <el-form-item label="选修任务" :prop="this.ruleForm.elective === 2 ? 'elective' : ''">
                <el-radio-group v-model="ruleForm.elective" :disabled="disabled">
                    <el-radio :label="2">添加选修</el-radio>
                    <el-radio :label="1">不添加选修</el-radio>
                </el-radio-group>
                <div v-if="ruleForm.elective === 2" class="task-list unrequired-task-list">
                    <el-button 
                        type='primary' 
                        class="task-add-btn" 
                        @click="addUnRequiredTask(2)" 
                        :disabled="disabled"
                        size="medium">
                        添加选修任务
                    </el-button>
                    <SelectedTask 
                        :selected="ruleForm.phase_object_list"
                        :taskType="2"
                        :delete="deleteUnRequiredTask">
                    </SelectedTask>
                </div>
            </el-form-item>
            <el-form-item label="店员需选修任务数量" v-if="ruleForm.elective === 2" prop="elective_count">
                <el-input-number
                    :disabled="disabled"
                    v-model.number="ruleForm.elective_count"
                    :controls="false">
                </el-input-number>
            </el-form-item>
            <el-form-item label="阶段考试">
                <el-button 
                    type='primary' 
                    class="task-add-btn" 
                    @click="addExam(3)" 
                    :disabled="disabled"
                    size="medium">
                    添加考试
                </el-button>
                <SelectedTask 
                    :selected="ruleForm.phase_object_list"
                    :taskType="3"
                    :disabled="disabled"
                    :delete="deleteExamTask">
                </SelectedTask>
            </el-form-item>
<!--             <el-form>
                <el-button icon="el-icon-plus" type='primary' @click="validate('ruleForm')">校验</el-button>
            </el-form> -->
        </el-form>
        
        <!-- 添加必修任务 -->
        <Task
            ref="requiredTaskRef"
            :visible.sync="showRequiredTaskDialog"
            :selected="requiredTaskSelected"
            :initTabs="transferLeft['requiredTaskSelected']"
            :keys="keys"
            :taskType="taskType"
            @close="getTaskData"
            @submit="getTaskData">
        </Task>
        
        <!-- 添加选修任务 -->
        <Task
            ref="unRequiredTaskRef"
            :visible.sync="showUnRequiredTaskDialog"
            :selected="unRequiredTaskSelected"
            :taskType="taskType"
            :initTabs="transferLeft['unRequiredTaskSelected']"
            :keys="keys"
            @close="getTaskData"
            @submit="getTaskData">
        </Task>
        <!-- 添加考试 -->
        <Exam
            title="选取考试"
            :visible.sync="showExamDialog"
            :selected="examTaskSelected"
            :taskType="taskType"
            @pick="getTaskData">
        </Exam>
    </main>
</template>

<script>
    import Task from 'components/dialog/task/Main.vue'
    import Exam from './Exam.vue'
    import SelectedTask from './SelectedTask.vue'
    import { validatePositiveNum } from 'utils/common'

    export default {
        components: {
            Task,
            Exam,
            SelectedTask
        },
        props: {
            phase: Object,
            disabled: Boolean,
            keys: {
                type: Array,
                required: false
            }
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {
            // phase_object_list () {
            //     this.ruleForm.phase_object_list =
            //     [
            //         ...this.ruleForm.createPhaseTask(this.requiredTaskSelected),
            //         ...this.ruleForm.createPhaseTask(this.unRequiredTaskSelected),
            //         ...this.ruleForm.createPhaseTask(this.examTaskSelected),
            //     ]
            //     return this.ruleForm.phase_object_list
            // }
        },
        watch: {},
        data () {
            let positiveNum1 = (rule, value, callback) => {
                if (!validatePositiveNum(value) && !!value) {
                    callback(new Error('请输入正整数'))
                } else {
                    callback()
                }
            }
            let positiveNum2 = (rule, value, callback) => {
                if (!validatePositiveNum(value)) {
                    callback(new Error('请输入正整数'))
                } else {
                    callback()
                }
            }
            let transferRight = this.phase.getTaskSelected(this.keys)['resRight']
            return {
                taskType: void 0,
                showRequiredTaskDialog: false,
                requiredTaskSelected: transferRight['requiredTaskSelected'] || [],
                showUnRequiredTaskDialog: false,
                unRequiredTaskSelected: transferRight['unRequiredTaskSelected'] || [],
                examTaskSelected: transferRight['examTaskSelected'] || [],
                ruleForm: this.phase,
                transferLeft: this.phase.getTaskSelected(this.keys)['resLeft'],
                showExamDialog: false,
                rules: {
                    sequence: { required: true },
                    elective: { required: true },
                    study_score: [
                        { required: false, message: '请输入学分' },
                        { required: false, type: 'number', validator: positiveNum1 }
                    ],
                    elective_count: [
                        { required: true, message: '请输入任务数量' },
                        { type: 'number', validator: positiveNum2 }
                    ]
                }
            }
        },
        methods: {
            addRequiredTask (type) {
                this.showRequiredTaskDialog = true
                this.taskType = type
            },
            addUnRequiredTask (type) {
                this.showUnRequiredTaskDialog = true
                this.taskType = type
            },
            deleteRequiredTask (task, index) {
                let row = task.formatPhaseTask({}, task)
                this.$refs['requiredTaskRef'].deleteRow(index, row)
                this.requiredTaskSelected.splice(index, 1)
            },
            deleteUnRequiredTask (task, index) {
                let row = task.formatPhaseTask({}, task)
                this.$refs['unRequiredTaskRef'].deleteRow(index, row)
                this.unRequiredTaskSelected.splice(index, 1)
            },
            deleteExamTask () {
                this.examTaskSelected.splice(0, 1)
            },
            getTaskData (data, type) {
                this.ruleForm.phase_object_list =
                [
                    ...this.ruleForm.createPhaseTask(this.requiredTaskSelected),
                    ...this.ruleForm.createPhaseTask(this.unRequiredTaskSelected),
                    ...this.ruleForm.createPhaseTask(this.examTaskSelected),
                ]
            },
            addExam (type) {
                this.showExamDialog = true
                this.taskType = type
            },
            onDraggableEnd () {
                this.ruleForm.resetTaskSort()
                this.requiredTaskSelected = this.ruleForm.formatPhaseTask(this.ruleForm.phase_object_list, 1)
            },

            validate (formName, level) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        pass = false
                    }
                })
                if (!this.validateTask(level)) {
                    pass = false
                }
                return pass
            },
            validateTask (level) {
                let pass = true
                let list = [
                    {
                        message: `第${level}阶段没有添加必修任务`,
                        tipsType: 'warning',
                        legality: this.requiredTaskSelected.length > 0
                    },
                    {
                        message: (level) => {
                            return `第${level}阶段没有添加选修任务`
                        },
                        tipsType: 'warning',
                        legality: (this.ruleForm.elective === 2 && this.unRequiredTaskSelected.length > 0) || this.ruleForm.elective === 1
                    },
                    {
                        message: `第${level}阶段必修任务、选修任务和阶段考试有重复的，请仔细检查`,
                        tipsType: 'warning',
                        legality: this.validateRepeatTask(this.ruleForm.phase_object_list)
                    },
                    {
                        message: '店员需选修任务数量应该小于等于实际选修的任务数量，请修改',
                        tipsType: 'warning',
                        legality: (this.ruleForm.elective === 2 && this.ruleForm.elective_count <= this.unRequiredTaskSelected.length) || this.ruleForm.elective === 1
                    }
                ]
                list.forEach(item => {
                    if (!item.legality) {
                        pass = false
                        if (typeof item.message === 'function') {
                            xmview.showTip(item.tipsType, item.message(level))
                        } else {
                            xmview.showTip(item.tipsType, item.message)
                        }
                    }
                })
                return pass
            },
            validateRepeatTask (array) {
                let _array = this.ruleForm.elective === 1 ? array.filter(item => item.type !== 2) : array
                let container = []
                let pass = true
                for (let i = 0; i < _array.length; i++) {
                    let uuid = array[i].object_type + array[i].object_id + array[i].object_name
                    if (container.includes(uuid)) {
                        pass = false
                        return
                    } else {
                        container.push(uuid)
                    }
                }
                return pass
            }
        },
        filters: {},
        directives: {},
    }
</script>
