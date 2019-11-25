<style lang='scss' rel='stylesheet/scss'>
    .toexpire-department {
        background: rgba(0,0,0,0.5);
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
        .el-form-item__content{
            text-align:left;
        }
        .el-input {
            width: 200px;
            .el-input__inner {
                text-align:right;
            }
        }
        .pay-txt {
            font-size: 16px;
            color: #666;
        }
        .inner-dialog {
            .el-dialog__body{
                padding:10px;
            }
        }
    }
</style>

<template>
    <el-dialog 
        append-to-body
        class="toexpire-department" 
        :visible.sync="expiredepartment.dialogShow" 
        title="续费门店">
        <el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
            <!-- <el-form-item label="门店数量" prop="number">
                <el-input v-model="ruleForm.number" v-onlyNumber @keyup.native="keyup" :disabled='true'>
                    <template slot="append">家</template>
                </el-input>
            </el-form-item> -->
            <el-form-item>
                <p class="pay-txt">门店数量为 {{Math.abs(ruleForm.number) || 0}} 家, 服务1年  费用: <span class="red">¥ {{money}}</span></p>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">前往支付</el-button>
            </el-form-item>
        </el-form>
        <el-dialog class="inner-dialog"
            width="40%"
            title="温馨提示"
            :visible.sync="innerVisible"
            append-to-body>
            <p>{{`签约门店${this.department_count}家,使用门店${this.cur_department_count}家,若续签${this.ruleForm.number}家门店，剩余门店将不可使用。`}}</p>
            <el-button @click="innerVisible=false" style="margin-top:40px;">取消</el-button>
            <el-button type="primary" @click="submit">确定支付</el-button>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import {time2String} from '../../../utils/timeUtils'
    import * as common from 'utils/common'
    import signingService from 'services/company/signingService'
    import config from 'utils/config'
    import authUtils from 'utils/authUtils'

    export default {
        props: {
            toExpiredepartment: Object
        },
        data () {
            var isNumber = (rule, value, callback) => {
                const newVal = value === '' ? undefined : Number(value)
                if (value === '') {
                    callback(new Error('请输入门店数量'));
                } else if (isNaN(newVal) || value <= 0) {
                    this.ruleForm.number = 0
                    callback(new Error('输入的门店数量必须是大于0的整数'));
                } else if(value < this.cur_department_count){
                    if(authUtils.getUserInfo()){
                        callback(new Error('续签门店数量不可低于之前门店数,要减少请先去删除门店'));
                    }else {
                        callback(new Error('续签门店数量不可低于之前门店数,要减少请联系客服删除门店'));
                    }
                }else if(value.toString().indexOf('.') != -1){
                    this.ruleForm.number = 0
                    callback(new Error('输入的门店数量不能是小数，请重新输入。'));
                }else {
                    callback();

                }
              };
            return {
                expiredepartment: this.toExpiredepartment,
                ruleForm: {
                    number: 0
                },
                money: 0,
                rules: {
                    number: [
                        { required: true, validator: isNumber, trigger: 'blur' },
                    ],
                    
                },
                priceinfo:{},
                cur_department_count: 0,
                innerVisible: false,
                department_count:0
            }
        },
        mounted () {
            this.fetchData()
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
                this.expiredepartment.dialogShow = false
                this.$router.push({name:'company-adddepartmentpay'})
            },
            fetchData() {
                signingService.getsigningPriceinfo({type:'renew'}).then(ret => {
                    this.priceinfo = ret
                    this.money = ret.single_money * ret.department_count
                    this.cur_department_count = ret.department_count
                    this.ruleForm.number = ret.department_count
                    // this.department_count = 40
                    this.department_count = ret.department_count
                })
            },
            keyup(val) {
                if(this.ruleForm.number > 0){
                    this.money = common.foatMul(this.priceinfo.single_money,this.ruleForm.number,2)
                }else {
                    this.money = 0
                }
            },
            // 前往支付
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.ruleForm.number < this.department_count){
                            this.innerVisible = true
                        }else {
                            this.submit()
                        }
                    }
                });
                
            },
            submit() {
                // 去下单
                signingService.expireDepartment({department_count:Number(this.ruleForm.number)}).then(ret => {
                    // 去支付
                    window.location.href = `${config.payUrl}/?order_id=${ret.order_id}&hide=offlinepay`
                    // window.location.href = `https://paydemo.yst.vodjk.com/?order_id=${ret.order_id}&hide=offlinepay`
                })
                // window.location.href = `${config.payUrl}/?order_id=1&hide=offlinepay`
            }
        }
    }
</script>
