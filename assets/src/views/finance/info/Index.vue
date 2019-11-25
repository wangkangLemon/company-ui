<style lang='scss' rel="stylesheet/scss" scoped>
@import "~utils/mixins/common";
@import "~utils/mixins/mixins";
#finance-index-container {
    .dashboard-analytics {
        margin-bottom: 0;
        @extend %justify;
        margin: 15px 0;
        height: 120px;
        border: 1px solid #fff;
        background: #fff;
        border-radius: 5px;
        padding: 25px 0;
        >div {
            position: relative;
            display: inline-block;
            vertical-align: top;
            height: 100%;
            // border-right: 1px solid #ddd;
            &:last-of-type {
                border-right: none;
                margin-right: 10px;
            }
            >* {
                display: inline-block;
                vertical-align: top;
            }
            .stat {
                width: 55px;
                height: 55px;
                margin: 10px 20px;
                border-radius: 50%;
                text-align: center;
                text-align-last: center;
                color: #fff;
                font-size: 30px;
                line-height: 56px;
                &.col1 {
                    background: #2DB7F5;
                }
                &.col2 {
                    background: #808BC6;
                }
                &.col3 {
                    background: #7DC856;
                }
                &.col4 {
                    background: #F9BF00;
                }
            }
            >div {
                margin-top: 10px;
                >p {
                    font-size: 25px;
                    color: #666;
                    span {
                        font-size: 12px;
                    }
                }
                >i {
                    font-size: 12px;
                    color: #333;
                }
            }
            .margin-consume {
                margin-top: 0;
                >p {
                    font-size: 15px;
                    text-align: right;
                    color: #666;
                    span {
                        font-size: 12px;
                    }
                }
                >i {
                    font-size: 12px;
                    color: #333;
                }
            }
            >.top-btn {
                position: absolute;
                top: -26px;
                right: -12px;
            }
        }
    }

    .dashboard-log {
        border: 1px solid #fff;
        border-radius: 5px;
        margin-bottom: 15px;
        padding: 0 15px 15px 15px;
        background: #fff;
        >.header {
            position: relative;
            >h3 {
                text-align: left;
                font-size: 20px;
            }
            >.top-btn {
                position: absolute;
                top: 15px;
                right: 0;
            }
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
        .in {
            color: #4caf50;
        }
        .out {
            color: #03a9f4;
        }
    }
}
</style>

<template>
    <main id="finance-index-container" v-if="mainData != null">
        <section class="dashboard-analytics">
            <div>
                <i class="stat col1 fa fa-file"></i>
                <!-- <div class="margin-consume"> -->
                <div style="margin: 0;">
                    <p>
                        <span>推广收入：</span>{{ mainData.promote_course }}
                    </p>
                    <p>
                        <span>支出：</span>{{ mainData.server_money }}
                    </p>
<!--                     <p>
                        <span>总数：</span>{{mainData.consume_course_total}}
                    </p> -->
                </div>
            </div>
<!--             <div>
                <i class="stat col2 fa fa-file"></i>
                <div>
                    <i>
                        本月冻结金额
                        <el-popover
                            placement="top-start"
                            width="200"
                            trigger="hover"
                            content="根据本月产品培训计划冻结资金,每月5日冻结资金解冻后结算实际消费">
                            <i slot="reference" class="el-icon-question"></i>
                        </el-popover>
                    </i>
                    <p>{{ mainData.frozen_money }}</p>
                </div>
            </div> -->
            <div>
                <i class="stat col3 fa fa-bar-chart"></i>
                <div>
                    <i>累计充值金额</i>
                    <p>{{ mainData.recharge_total }}</p>
                </div>
            </div>
            <div>
                <i class="stat col4 fa fa-money"></i>
                <div>
                    <i>账户余额</i>
                    <p>{{ mainData.balance }}</p>
                </div>
                <el-button 
                    class="top-btn" 
                    icon="el-icon-warning" 
                    type="success" 
                    size="small" 
                    @click.native="recharge">
                    充值
                </el-button>
            </div>
        </section>

        <section class="dashboard-log">
            <section class="header">
                <h3 class="right-title">财务记录</h3>
                <el-button 
                    class="top-btn" 
                    icon="el-icon-document" 
                    type='warning' 
                    size="small" 
                    :loading="exportLoading" 
                    @click="fileExport">
                    导出
                </el-button>
            </section>
            <section class="search">
                <section>
                    <i>类型</i>
                    <el-select 
                        v-model="fetchParam.category" 
                        filterable 
                        placeholder="请选择" 
                        @change="fetchData">
                        <el-option 
                            v-for="item in logList" 
                            :key="item.value"
                            :label="item.label" 
                            :value="item.value">
                        </el-option>
                    </el-select>
                </section>
                <section>
                    <DateRange 
                        title="时间" 
                        :start="fetchParam.time_start" 
                        :end="fetchParam.time_end"
                        v-on:changeStart="val=>{fetchParam.time_start=val}"
                        v-on:changeEnd="val=>{fetchParam.time_end=val}"
                        :change="fetchData">
                    </DateRange>
                </section>
            </section>
            <section class="table-container">
                <el-table class="data-table" v-loading="loadingData" :data="logData" border>
                    <el-table-column prop="money" label="金额">
                        <span slot-scope="{row}"><span :class="row.type">{{row.type | incomeType}}</span>{{row.money}}</span>
                    </el-table-column>
                    <el-table-column prop="val_new" label="余额"></el-table-column>
                    <el-table-column prop="category_str" label="细则"></el-table-column>
                    <el-table-column width="180" prop="create_time" label="时间"></el-table-column>
                </el-table>
                <el-pagination 
                    class="block"
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next" 
                    :total="total">
                </el-pagination>
            </section>
        </section>
        <el-dialog 
            title="去充值" width="30%" 
            :visible.sync="rechargeDialog" v-if="rechargeDialog">
            <el-form :model="rechargeForm" ref="rechargeForm" :rules="rechargrules">
                <el-form-item label="充值金额" label-width="80px" prop="money">
                  <el-input v-model="rechargeForm.money"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelRechergeForm">取 消</el-button>
                <el-button type="primary" @click="submitRechergeForm('rechargeForm')">充值</el-button>
            </div>
        </el-dialog>
    </main>
</template>

<script>
    import financeService from 'services/finance/financeService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import config from 'utils/config'

    let logList = [
        {
            label: '全部',
            value: '',
        },
        {
            label: '收入',
            value: 'transfer_in',
        },
        {
            label: '支出',
            value: 'transfer_out',
        },
        // {
        //     label: '充值',
        //     value: 'recharge',
        // },
        // {
        //     label: '增加门店',
        //     value: 'promote_course',
        // },
        // {
        //     label: '培训服务费',
        //     value: 'server_fee',
        // }
    ]

    export default {
        components: {
            DateRange
        },
        data() {
            var checkNumber = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('请输入充值金额'));
                }else if (!(/^[1-9]+\d*$/.test(value))) {
                    return callback(new Error('请输入正整数'));
                }else if((value + '').length > 7){
                    return callback(new Error('充值金额小于1000万'));
                }else {
                    callback()
                }
            };
            return {
                loadingData: false,
                mainData: {},
                logData: [],
                exportLoading: false,
                logList: logList,
                fetchParam: {
                    category: '',
                    time_start: '',
                    time_end: '',
                    page: 1,
                    page_size: 15,
                },
                total: 0,
                rechargeDialog: false,
                rechargeForm: {
                    money: void 0
                },
                rechargrules: {
                    money: [
                        { required: true, validator: checkNumber, trigger: 'blur' }
                    ]
                }
            }
        },
        watch: {
            rechargeDialog(val) {
                if(!val){
                    this.rechargeForm.money = ''
                }
            }
        },
        activated() {
            Promise.all([this.fetchData(), this.fetchInfo()]).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loadingData = true
                return financeService.searchFinance(this.fetchParam).then((ret) => {
                    this.logData = ret.list || []
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            fetchInfo () {
                return financeService.getFinanceInfo().then((ret) => {
                    this.mainData = ret.data
                })
            },
            fileExport () {
                this.exportLoading = true
                // let type = 'industry_recharge'
                financeService.export(this.fetchParam).then(ret => {
                    this.exportLoading = false
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            recharge () {
                this.rechargeDialog = true
                // this.$alert(`联系电话: 400-686-5262`, '充值', {
                //     confirmButtonText: '关闭'
                // })
            },
            submitRechergeForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.rechargeForm.money = 0.01
                        financeService.toRecharge(this.rechargeForm).then( res => {
                            if(res.order_id) {
                                this.rechargeDialog = false
                                window.location.href = `${config.payUrl}/?order_id=${res.order_id}&hide=offlinepay`
                                // window.location.href = `http://paydemo.yst.vodjk.com/view/order?order_id=${res.order_id}&hide=offlinepay`
                            }
                        })
                    } 
                });
            },
            cancelRechergeForm() {
                this.rechargeDialog = false
            }
        },
        filters: {
            incomeType (val) {
                let map = {
                    'in': '+',
                    'out': '-',
                }
                return map[val]
            }
        }
    }
</script>
