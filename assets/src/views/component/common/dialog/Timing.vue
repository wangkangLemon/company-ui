<style lang='scss' rel='stylesheet/scss'>
    .timing-dialog {
        .el-dialog {
            width: 300px;
        }
        .el-dialog__header {
            padding: 10px 10px;
            border-bottom: 1px solid #EDF2FC;
        }
        .el-dialog__body{
            text-align: center;
            padding: 10px 20px;
            height: 60px;
            line-height: 60px;
        }
        .el-date-editor {
            width: 260px;
        }
    }
</style>

<template>
    <el-dialog class="timing-dialog" :visible.sync="curValue" title="选择时间">
        <el-form :model="form" ref="form" :inline="true" label-width="100px">
            <el-form-item >
                <el-date-picker v-model="form.start_time" type="datetime" placeholder="请选择时间" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button @click="curValue = false" size="small">取 消</el-button>
            <el-button type="primary" size="small" @click="submitFn">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {time2String} from '../../../utils/timeUtils'

    export default {
        props: {
            value: Boolean,
            submit: Function
        },
        data () {
            return {
                curValue: this.value,
                form: {},
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
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
                if (this.form.start_time) {
                    this.form.start_time = time2String(new Date(this.form.start_time), false, false)
                } else {
                    xmview.showTip('error', '未选择时间')
                    return
                }

                if (this.submit) {
                    this.submit(this.form.start_time).then(() => {
                        this.form = {}
                        this.curValue = false
                    })
                }
            }
        }
    }
</script>
