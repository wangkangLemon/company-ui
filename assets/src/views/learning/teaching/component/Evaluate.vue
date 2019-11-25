<style lang="scss">
    #teaching-evaluate-container {
    }
</style>

<template>
    <main id="teaching-evaluate-container">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
            <el-form-item 
                v-for="(item, index) in ruleForm.items" 
                :key="item.key"
                :label="item.name + ':'"
                :prop="'items.' + index + '.value'"
                :rules="[
                  { required: true, message: '请输入/选择'},
                ]">
                <template v-if="item.type === 1">
                    <el-input
                        type="textarea"
                        v-model="item.value">
                    </el-input>
                </template>
                <template v-else-if="item.type === 2">
                    <el-radio 
                        v-for="(option,index) in item.options" 
                        :key="option.value"
                        v-model="item.value"
                        :label="option.value">
                        {{option.label}}
                    </el-radio>
                </template>
                <template v-else>
                    <el-checkbox 
                        v-for="(option,index) in item.options" 
                        :key="index"
                        v-model="option.checked"
                        :true-label="1"
                        :false-label="0">
                        {{option.label}}
                    </el-checkbox>
                </template>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
    import teachingService from 'services/learning/teaching'

    export default {
        components: {},
        props: {
            templateKey: String,
        },
        activated () {},
        created () {
            this.fetchData(this.templateKey)
        },
        mounted () {},
        computed: {},
        watch: {
            templateKey (val) {
                this.fetchData(val)
            }
        },
        data () {
            return {
                ruleForm: {},
                rules: {
                    xx: {required: true, message: '', trigger: 'blur'}
                }
            }
        },
        methods: {
            fetchData (val) {
                teachingService.getAppraisalTemp(val).then(ret => {
                    // 不这么做的话，直接将items添加到template就不是响应式的
                    this.ruleForm = ret.template
                })
            },
            submitForm (formName = 'ruleForm') {
                let pass
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        pass = true
                        this.$emit('submit', this.ruleForm)
                    } else {
                        pass = false
                    }
                })
                return pass
            }
        },
        filters: {},
        directives: {},
    }
</script>
