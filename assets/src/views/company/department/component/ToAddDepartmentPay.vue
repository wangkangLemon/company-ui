<style lang="scss">
    .to-add-department-pay {
        background: #fff;
        padding: 20px;
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
        .red {
            color: red;
        }
    }
</style>

<template>
    <section class="to-add-department-pay">
        <el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="门店数量" prop="number">
                <el-input v-model="ruleForm.number" v-onlyNumber @keyup.native="keyup">
                    <template slot="append">家</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <p class="pay-txt">门店 {{ruleForm.number || 0}} 家, 服务{{priceinfo.duration_month}}个月  费用: <span class="red">¥ {{money}}</span></p>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">前往支付</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    import departmentService from 'services/company/departmentService'
    import * as common from 'utils/common'
    import signingService from 'services/company/signingService'
    import config from 'utils/config'

    export default {
        components: {
        },
        props: {
        },
        mounted () {
            // let a = document.referrer
            this.fetchData()
        },
        computed: {
        },
        watch: {},
        data () {
            var isNumber = (rule, value, callback) => {
                const newVal = value === '' ? undefined : Number(value)
                if (value === '') {
                    callback(new Error('请输入门店数量'));
                } else if (isNaN(newVal) || value <= 0) {
                    this.ruleForm.number = 0
                    callback(new Error('输入的门店数量必须是大于0的整数'));
                }else if(value.toString().indexOf('.') != -1){
                    this.ruleForm.number = 0
                    callback(new Error('输入的门店数量不能是小数，请重新输入。'));
                }else {
                    callback();
                }
              };
            return {
                ruleForm: {
                    number: void 0
                },
                money: 0,
                rules: {
                    number: [
                        { required: true, validator: isNumber, trigger: 'blur' },
                    ],
                    
                },
                priceinfo:{}
            }
        },
        methods: {
            fetchData() {
                signingService.getsigningPriceinfo({type:'add'}).then(ret => {
                    this.priceinfo = ret
                    this.money = ret.single_money
                    this.ruleForm.number = 1
                    xmview.setContentLoading(false)
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
                        // 去下单
                        signingService.addDepartment({department_count:Number(this.ruleForm.number)}).then(ret => {
                            // 去支付
                            window.location.href = `${config.payUrl}/?order_id=${ret.order_id}&hide=offlinepay`
                            // window.location.href = `https://paydemo.yst.vodjk.com/?order_id=${ret.order_id}&hide=offlinepay`
                            // window.location.href = `http://localhost:8009/?order_id=${ret.order_id}&hide=offlinepay`
                        })
                        // window.location.href = `${config.payUrl}/?order_id=1&hide=offlinepay`
                    }
                });
                
            }
        }
    }
</script>
