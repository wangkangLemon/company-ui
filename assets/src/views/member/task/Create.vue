<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-task-create-container {
        @extend %content-container;
        .task-form {
            width: 50%;
            .line {
                text-align: center;
            }
        }
        .input-number {
            .el-input {
                display: inline-table;
            }
        }
    }
</style>

<template>
    <main id="member-task-create-container">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="task-form">
            <el-form-item label="任务名称" prop="name">
                <el-input
                    class="input"
                    v-model="ruleForm.name"
                    placeholder="请输入任务名称，25字以内">
                </el-input>
            </el-form-item>
            <el-form-item label="选择门店" prop="target_department_id">
                <Department 
                    :disabled="offline"
                    v-model="ruleForm.target_department_id"
                    :placeholder="ruleForm.target_department_name">
                </Department>
            </el-form-item>
            <el-form-item label="目标销售额" prop="target_money">
                <el-input-number 
                    class="input-number"
                    v-model.number="ruleForm.target_money"
                    :controls="false">
                    <template slot="append">元</template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="任务周期" required>
                <el-col :span="11">
                    <el-form-item prop="start_date">
                        <el-date-picker
                            :disabled="offline"
                            type="date" 
                            placeholder="选择开始日期" 
                            v-model="ruleForm.start_date" 
                            value-format="yyyy-MM-dd"
                            style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="end_date">
                        <el-date-picker 
                            :disabled="offline"
                            type="date" 
                            placeholder="选择日期" 
                            v-model="ruleForm.end_date" 
                            value-format="yyyy-MM-dd"
                            style="width: 100%;">
                        </el-date-picker>
                    </el-form-item> 
                </el-col>
            </el-form-item>
            <el-form-item label="选择药品" prop="medicine_id">
                <el-button type='primary' @click="addMedicine" size="small">添加药品</el-button>
                <el-table class="data-table" :data="ruleForm.cache_medicines" :fit="true" border style="width: 100%;">
                    <el-table-column 
                        label="已选择药品" 
                        prop="name">
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">{{id ? '修改' : '立即创建'}}</el-button>
            </el-form-item>
        </el-form>
        
        <el-dialog
            width="60%"
            title="选择药品"
            :visible.sync="showDialog">
            <CascaderTransfer 
                title="选择药品"
                :options="options"
                v-model="ruleForm.medicines"
                :transferLoader="getTransferData">
            </CascaderTransfer>
            <el-button slot="footer" @click="insert" type="primary">确定</el-button>
        </el-dialog>
    </main>
</template>

<script>
    import Task from './task'
    import saleTaskService from 'services/member/saleTaskService'
    import Department from 'components/select/Department.vue'
    import CascaderTransfer from 'components/dialog/CascaderTransfer.vue'
    import medicineService from 'services/member/medicineService'

    export default {
        components: {
            Department,
            CascaderTransfer
        },
        props: {},
        activated () {},
        created () {
            this.id = this.$route.query.sale_task_id
            this.offline = +this.$route.query.offline ? true : false
            this.initTaskData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {
        },
        watch: {},
        data () {
            let validateName = (rule, value, callback) => {
                // if (!/^[\u4e00-\u9fa5\d\w\s]{1,25}$/.test(value)) {
                //     callback(new Error('字数超过25字'))
                // } else {
                //     callback()
                // }
                if (value.length > 25) {
                    callback(new Error('字数超过25字'))
                } else {
                    callback()
                }
            }
            let validateTime = (rule, value, callback) => {
                if (this.ruleForm.end_date && value > this.ruleForm.end_date) {
                    callback(new Error('开始时间应小于结束时间'))
                } else {
                    callback()
                }
            }
            return {
                showDialog: false,
                ruleForm: {},
                id: '',
                options: null,
                rules: {
                    name: [
                        { required: true, message: '请输入任务名称', trigger: 'blur' },
                        { validator: validateName }
                    ],
                    target_department_id: { required: true, message: '请选择门店' },
                    target_money: { required: true, message: '请输入目标销售额', trigger: 'blur' },
                    start_date: [
                        { required: true, message: '请选择开始时间' },
                        { validator: validateTime }
                    ],
                    end_date: { required: true, message: '请选择结束时间' },
                    medicine_id: { required: true, message: '请选择药品' }
                },
            }
        },
        methods: {
            initTaskData () {
                return new Promise((resolve, reject) => {
                    if (this.id) {
                        saleTaskService.getTaskData(this.id).then(ret => {
                            this.ruleForm = new Task(ret.sale_task)
                        }).then(() => {
                            resolve()
                        })
                    } else {
                        this.ruleForm = new Task()
                        resolve()
                    }
                })
            },
            addMedicine () {
                this.getCascaderData().then(() => {
                    this.showDialog = true
                })
            },
            getCascaderData () {
                return medicineService.searchCategory({
                    page: 1,
                    page_size: 1000
                }).then(ret => {
                    this.options = ret.list
                })
            },
            getTransferData (param, cb) {
                return medicineService.searchMedicine(param).then(ret => {
                    cb(ret)
                })
            },
            insert () {
                this.ruleForm.medicine_id = this.ruleForm.medicines.map(val => val.id)
                this.ruleForm.cache_medicines = Object.assign([], this.ruleForm.medicines)
                this.showDialog = false
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let service = this.id ? saleTaskService.updateTask : saleTaskService.createTask
                        service(this.ruleForm).then(() => {
                            this.$router.replace({name: 'member-task-sale'})
                        })
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
