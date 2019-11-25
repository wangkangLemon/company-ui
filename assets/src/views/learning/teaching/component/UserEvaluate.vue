<style lang="scss">
    #teaching-userevaluate-container {
        .standard:first-child {
            margin-bottom: 5px;
        }
        .inner {
            width: 30%;
        }
        .inner2 {
            width: 193px;
        }
    }

</style>

<template>
    <main id="teaching-userevaluate-container">
        <el-dialog 
            v-if="showDialog"
            width="60%"
            :title="title" 
            :visible.sync="showDialog">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="150px">
                <el-form-item label="选择学员考核指标:" prop="">
                    <el-checkbox 
                        :true-label="1" 
                        :false-label="0"
                        :disabled="disabled"
                        v-model="ruleForm.is_coacher_appraisal" 
                        label="教员鉴定">
                    </el-checkbox>
                    <el-checkbox 
                        :true-label="1" 
                        :false-label="0"
                        :disabled="disabled"
                        v-model="ruleForm.is_finish_exam" 
                        @change="finishExamCheckbox"
                        label="通过结业考试">
                    </el-checkbox>
                    <el-checkbox 
                        :true-label="1" 
                        :false-label="0"
                        :disabled="disabled"
                        v-model="ruleForm.is_pass_phase" 
                        label="通过周期数">
                    </el-checkbox>
                </el-form-item>
                <el-form-item v-if="ruleForm.is_coacher_appraisal" label="教员鉴定学员标准:">
                    <div v-for="(standard,index) in ruleForm.standards" :key="index" class="standard">
                        <el-select 
                            v-if="index === 0"
                            v-model="standard.level" 
                            :disabled="disabled"
                            filterable>
                            <el-option label="优" :value="0"></el-option>
                            <el-option label="良" :value="1"></el-option>
                            <el-option label="中" :value="2"></el-option>
                        </el-select>
                        <el-input 
                            v-else
                            readonly 
                            class="inner2" 
                            value="差">
                        </el-input>                        
                        <el-input 
                            readonly 
                            class="inner" 
                            :value="standard.inequation | inequation">
                        </el-input>
                        <el-input
                            v-number-only
                            class="inner"
                            :disabled="disabled"
                            v-model.number="standard.value">
                            <span slot="append">个</span>
                        </el-input>
                        <!-- <span v-if="index === 0">且</span> -->
                    </div>
                    <span>考核指标：1.工作态度、2.组织认同、3.专业知识、4.工作技能、5.胜任能力、6.发展潜力</span>
                </el-form-item>
                <el-form-item v-if="ruleForm.is_finish_exam" label="结业考试:">
                    <el-radio 
                        v-model="ruleForm.is_pass_exam" 
                        :label="1" 
                        :disabled="disabled">
                        通过结业考试
                    </el-radio>
                </el-form-item>
                <el-form-item v-if="ruleForm.is_pass_phase" label="通过周期数:" prop="pass_phase_number">
                    <el-input
                        v-number-only
                        class="inner"
                        :disabled="disabled"
                        v-model.number="ruleForm.pass_phase_number">
                        <span slot="append">个</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="考核指标生效逻辑:" v-if="showMultiRule">
                    <el-radio 
                        v-model="ruleForm.multi_rule" 
                        :label="0" 
                        :disabled="disabled">
                        全部满足
                    </el-radio>
                    <el-radio 
                        v-model="ruleForm.multi_rule" 
                        :label="1" 
                        :disabled="disabled">
                        满足其一
                    </el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button 
                    type="primary" 
                    @click="submitForm('ruleForm')" 
                    v-if="!disabled">
                    确定
                </el-button>
                <el-button @click="showDialog = false">关闭</el-button>
                <el-button 
                    type="text" 
                    v-if="!disabled"
                    @click="clear">
                    恢复默认
                </el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    export default {
        components: {},
        props: {
            disabled: Boolean,
            visible: Boolean,
            value: Object,
            model: Function,
            totalPhase: Number,
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {
            showMultiRule () {
                return [this.ruleForm.is_coacher_appraisal, this.ruleForm.is_finish_exam, this.ruleForm.is_pass_phase].filter(item => item === 1).length > 1
            }
        },
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            },
            value (val) {
                this.ruleForm = Object.assign(this.model(), val)
            }
        },
        data () {
            return {
                showDialog: this.visible,
                title: '设置学员系统考核标准',
                ruleForm: Object.assign(this.model(), this.value),
                rules: {
                    pass_phase_number: {validator: (rule, value, callback) => {
                            if (value > this.totalPhase) {
                                callback(new Error('不能大于实际周期数'))
                            } else {
                                callback()
                            }
                        },trigger: 'blur'}
                }
            }
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && this.customValidate()) {
                        this.showDialog = false
                        this.$emit('submit', this.ruleForm)
                    }
                })
            },
            customValidate () {
                let value = this.ruleForm.standards.reduce((pre, cur) => {
                    return pre + cur.value
                }, 0)
                if (value > 6) {
                    xmview.showTip('warning', '标准不能超过6个')
                    return false
                } else {
                    return true
                }
            },
            clear () {
                // 对ruleForm重新赋值，不会影响到传进来的value
                this.ruleForm = this.model()
            },
            finishExamCheckbox (e) {
                this.ruleForm.is_pass_exam = e
            },
        },
        filters: {
            inequation (val) {
                let map = {
                    0: '大于',
                    1: '小于',
                    2: '等于'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
