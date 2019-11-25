<style lang="scss">
    #teaching-userevaluate-container {
        .standard:first-child {
            margin-bottom: 5px;
        }
        .inner {
            width: 25%;
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
            width="55%"
            :title="title" 
            :visible.sync="showDialog">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="150px">
                <el-form-item label="选择学员考核指标:" prop="">
                    <el-checkbox 
                        :true-label="1" 
                        :false-label="0"
                        :disabled="disabled"
                        v-model="ruleForm.is_user_appraisal" 
                        label="学员鉴定">
                    </el-checkbox>
                    <el-checkbox 
                        :true-label="1" 
                        :false-label="0"
                        :disabled="disabled"
                        v-model="ruleForm.is_user_pass" 
                        @change="usrPassCheckbox"
                        label="学员通过">
                    </el-checkbox>
                </el-form-item>
                <el-form-item v-if="ruleForm.is_user_appraisal" label="学员鉴定教员标准:">
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
                    <span>考核指标：1.辅导态度、2.计划指定、3.辅导即时性、4.辅导面谈、5.辅导成效</span>
                </el-form-item>
                <el-form-item v-if="ruleForm.is_user_pass" label="学员通过:">
                    <el-radio 
                        v-model="ruleForm.user_pass" 
                        :label="1"
                        :disabled="disabled">
                        学员通过管理员考核
                    </el-radio>
                </el-form-item>
                <el-form-item label="考核指标生效逻辑:" v-if="showMultiRule">
                    <el-radio 
                        v-model="ruleForm.multi_rule" 
                        :disabled="disabled"
                        :label="0">
                        全部满足
                    </el-radio>
                    <el-radio 
                        v-model="ruleForm.multi_rule" 
                        :disabled="disabled"
                        :label="1">
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
                <el-button @click="close">关闭</el-button>
                <el-button 
                    type="text" 
                    @click="clear"
                    v-if="!disabled">
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
            model: Function
        },
        activated () {},
        created () {

        },
        mounted () {},
        computed: {
            showMultiRule () {
                return [this.ruleForm.is_user_appraisal, this.ruleForm.is_user_pass].filter(item => item === 1).length > 1
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
            },
        },
        data () {
            return {
                showDialog: this.visible,
                title: '设置教员系统考核标准',
                ruleForm: Object.assign(this.model(), this.value),
                rules: {
                    xx: [
                        {required: true, message: '', trigger: 'blur'}
                    ]    
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
                if (value > 5) {
                    xmview.showTip('warning', '标准不能超过5个')
                    return false
                } else {
                    return true
                }
            },
            close () {
                this.showDialog = false
            },
            clear () {
                this.ruleForm = this.model()
            },
            usrPassCheckbox (e) {
                this.ruleForm.user_pass = e
            }
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
