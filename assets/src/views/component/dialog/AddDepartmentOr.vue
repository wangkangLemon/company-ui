<style lang='scss' rel='stylesheet/scss'>
    .toadd-department {
        .el-dialog {
            width: 500px;
        }
        .el-dialog__header {
            padding: 10px 10px;
            border-bottom: 1px solid #EDF2FC;
        }
        .el-dialog__body{
            text-align: center;
            padding: 30px 0;
        }
        .el-date-editor {
            width: 260px;
        }
        .red{
            color:red;
        }
    }
</style>

<template>
    <el-dialog class="toadd-department" :visible.sync="department.dialogShow" title="温馨提示您">
        <p>根据合同,贵连锁只能添加{{toAdddepartment.department_count}}家门店,目前已达上限.</p>
        <p>您可以点击<span class="red">立即增加</span>门店数量</p>
        <span slot="footer">
            <el-button @click="department.dialogShow = false" size="small">取 消</el-button>
            <el-button type="primary" size="small" @click="submitFn">立即增加</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {time2String} from '../../../utils/timeUtils'

    export default {
        props: {
            toAdddepartment: Object
        },
        data () {
            return {
                department: this.toAdddepartment
            }
        },
        watch: {
            value (val) {
                this.curValue = val
            },
            curValue (val) {
                this.curValue = val
                this.form = {}
                this.$emit('input', val)
            }
        },
        methods: {
            submitFn () {
                this.department.dialogShow = false
                this.$router.push({name:'company-adddepartmentpay'})
            }
        }
    }
</script>
