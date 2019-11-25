<style lang="scss">
</style>

<template>
    <el-dialog 
        v-if="showDialog"
        :title="title" 
        :visible.sync="showDialog">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px">
            <el-form-item label="选择分组" prop="checkList">
                <el-checkbox-group v-model="ruleForm.checkList">
                    <el-checkbox 
                        v-for="item in data"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name">
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </el-form-item>
        </el-form>
        
<!-- 
        <span slot="footer">
            <el-button type="primary" @click="">保存</el-button>
        </span> -->
    </el-dialog>
</template>

<script>
    export default {
        components: {},
        props: {
            visible: Boolean,
            data: Array
        },
        mounted () {},
        computed: {},
        watch: {
            visible (val) {
                this.showDialog = val
                if (!val) {
                    this.ruleForm.checkList = []
                }
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                title: '移入用户组',
                loading: false,
                showDialog: false,
                ruleForm: {
                    checkList: [],
                },
                rules: {
                    checkList: { type: 'array', required: true, message: '请至少选择一项', trigger: 'change' }
                }
            }
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let ans = this.data.filter(item => !!~this.ruleForm.checkList.indexOf(item.name)).map(item => item.id).join(',')
                        this.$emit('submit', ans)
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
