<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    @import "~utils/mixins/mixins";
    #member-customer-dashboard-container {
        @extend %content-container;
        height: 100%;
        .department-analytics {
            height: 100%;
            @extend %justify2;
            margin-bottom: 1.5em;
            aligin-content: center;
            widht: 100%;
            > div {
                position: relative;
                height: 100px;
                flex-grow: 1;
                flex-basis: 30%;
                margin: 0 2em 1.5em 0;
                vertical-align: top;
                border-radius: 5px;
                font-size: 12px;
                text-align: right;
                text-align-last: right;
                color: #fff;
                &:first-of-type {
                    // flex-basis: 31%;
                    background: #FF9966;
                }
                &:nth-child(2) {
                    // flex-basis: 31%;
                    background: #2DB6F4;
                }
                &:last-of-type {
                    background: #6b6b6b;
                    margin-right: 0;
                }
                > i {
                    display: block;
                    line-height: 75px;
                    width: 55px;
                    height: 55px;
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    text-align: center;
                    text-align-last: center;
                    .icon-xiaoxizhongxin:before {
                        font-size: 30px;
                    }
                    img {
                        width: 50%;
                        // height: 35px;
                    }
                }
                > h2 {
                    font-size: 25px;
                    padding-right: 10px;
                }
                p {
                    margin-top: 20px;
                    font-size: 16px;
                    padding-right: 10px;
                    cursor: pointer;
                }
            }
        }
        .analyics-list {
            display: flex;
            flex-flow: row nowrap;
            margin-bottom: 1em;
            .box-card {
                flex-grow: 1;
                // width: 24%;
                .el-card__header {
                    background: orange;
                    font-weight: bold;
                }
                &:last-of-type {
                    flex-basis: 30%;
                }
            }
            .box-card + .box-card {
                margin-left: 1em;
            }
        }
        .chart-content {
            @include clearFloatByAfter()
            // display: flex;
            .box {
                width: 49%;
                #pictorialChart {
                    width: 100%;
                    height: 300px;
                    > div {
                        margin: 0 auto;
                    }
                }
                #pieChart {
                    width: 100%;
                    height: 300px;
                    > div {
                        margin: 0 auto;
                    }
                }
            }
            .box-pictorial {
                // flex-grow: 1;
                float: left;
                margin-right: 1em;
            }
            .box-pie {
                float: right;
                flex-grow: 0.5;
            }
        }
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
        @media (min-width: 1500px) {
            .department-analytics {
                > div {
                    flex-basis: 10%;
                    &:nth-child(3) {
                        background: #7DC856;
                        margin-right: 1.5em;
                    }
                }
            }
        }
        @media (max-width: 1265px) {
            .chart-content {
                .box {
                    width: 100%;
                }
                .box-pictorial {
                    margin-right: 0;
                    margin-bottom: 1.5em
                }
            }
        }
    }
</style>

<template>
    <main id="member-customer-dashboard-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>门店</i>
                <Department 
                    v-model="fetchParam.department_id"
                    :change="fetchData">
                </Department>
            </section>
            <section>
                <DateRange
                    title="创建时间"
                    :start="fetchParam.start_date"
                    :end="fetchParam.end_date"
                    @changeStart="val=>{fetchParam.start_date=val}"
                    @changeEnd="val=>{fetchParam.end_date=val}"
                    :change="fetchData">
                </DateRange>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <section class="department-analytics">
                <div>
                    <i><img src="../../../assets/images/user.png"/></i>
                    <p>会员人数</p>
                    <h2>{{stat.vip_num}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/industry.png"/></i>
                    <p>购买人次数</p>
                    <h2>{{stat.buy_num}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/primary.png"/></i>
                    <p>平均客单价</p>
                    <h2>¥{{stat.average_unit_price}}</h2>
                </div>
            </section>
            <section class="analyics-list">
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">标签人数Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="tagData" border>
                        <el-table-column 
                            label="标签名" 
                            prop="name">
                        </el-table-column>
                        <el-table-column 
                            label="标签人数" 
                            prop="value">
                        </el-table-column>
                    </el-table>  
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">标签人数销售额Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="saleTagData" border>
                        <el-table-column 
                            label="标签名" 
                            prop="name">
                        </el-table-column>
                        <el-table-column 
                            label="销售额" 
                            prop="value">
                            <span slot-scope="{ row }">¥{{row.value}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">会员购药销售额Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="saleMedicineData" border>
                        <el-table-column 
                            label="药品名" 
                            prop="name">
                        </el-table-column>
                        <el-table-column 
                            label="销售额" 
                            prop="value">
                            <span slot-scope="{ row }">¥{{row.value}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
            </section>
            <section class="chart-content">
                <el-card class="box-pictorial box">
                    <span>性别分布</span>
                    <section id="pictorialChart"></section>
                    <input type="hidden" v-model="pictorialChartData.male_count" data-type="male">
                    <input type="hidden" v-model="pictorialChartData.female_count" data-type="female">
                </el-card>
                <el-card class="box-pie box">
                    <span>年龄分布</span>
                    <section id="pieChart"></section>
                </el-card>
            </section>
        </section>
    </main>
</template>

<script>
    import customerService from 'services/member/customerService'
    import Department from 'components/select/Department.vue'
    import DateRange from 'components/form/DateRangePicker2.vue'
    import * as timeUtils from 'utils/timeUtils'
    import Echars from 'echarts'
    import svg from '../component/peopleSvg'

    let d = new Date()

    export default {
        components: {
            Department,
            DateRange
        },
        props: {},
        activated () {},
        created () {
        },
        mounted () {
            this.initChart().then(() => {
                this.fetchData()
            }).catch(err => {
                console.log(err)
            })
        },
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                tagData: [],
                saleTagData: [],
                saleMedicineData: [],
                stat: {},
                pieChartData: {},
                pictorialChartData: {},
                lineChart: {},
                pieChart: {},
                pictorialChart: {},
                fetchParam: {
                    department_id: '',
                    start_date: timeUtils.date2Str(new Date(d.setTime(Date.now() - 3600 * 1000 * 24 * (7 - 1)))),
                    end_date: timeUtils.date2Str(new Date())
                },
                resizeFnArray: [],
            }
        },
        methods: {
            initChart () {
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        this.pieChart = Echars.init(document.getElementById('pieChart'))
                        this.pictorialChart = Echars.init(document.getElementById('pictorialChart'))
                        window.onresize = function (e) {
                            this.pieChart.resize.call(null, e)
                            this.pictorialChart.resize.call(null, e)
                        }.bind(this)
                        resolve()
                    })
                })
            },
            getData () {
                this.loading = true
                return customerService.getCustomerDashboard(this.fetchParam).then(ret => {
                    this.stat = ret.stat  // 卡片数据
                    // 表格数据
                    this.tagData = ret.top_tag
                    this.saleTagData = ret.top_sale_tag
                    this.saleMedicineData = ret.top_sale_medicine
                    // 图表数据
                    this.pieChartData = this.createPieChartData(ret.ages) // 年龄分布
                    this.pictorialChartData = this.createPictorialChartData(ret.sex) // 性别分布
                    this.loading = false
                })
            },
            fetchData () {
                xmview.setContentLoading(true)
                return this.getData().then(() => {
                    this.getPieChart()
                    this.getPictorialChart()
                    xmview.setContentLoading(false)
                })
            },
            createPieChartData (age) {
                let legendData = []
                let seriesData = [];
                ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上'].forEach((item, index) => {
                    let value = age[`num${index + 1}_count`]
                    seriesData.push({
                        name: item,
                        value
                    })
                    legendData.push(item)
                })
                return {
                    legendData,
                    seriesData
                }
            },
            createPictorialChartData (sex) {
                let { male_count, female_count } = sex
                return {
                    male_count,
                    female_count
                }
            },
            getPieChart () { // 饼状
                let option = {
                    title: {
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: this.pieChartData.legendData,
                    },
                    series: [
                        {
                            name: '年龄',
                            type: 'pie',
                            radius: '55%',
                            center: ['40%', '50%'],
                            data: this.pieChartData.seriesData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
                this.pieChart.setOption(option)
            },
            getPictorialChart () { // 自定义
                let maxData = (this.pictorialChartData.male_count + this.pictorialChartData.female_count) || 10
                let option = {
                    tooltip: {
                        trigger: 'item',
                    },
                    xAxis: {
                        max: maxData,
                        splitLine: {show: false},
                        offset: 10,
                        axisLine: {
                            lineStyle: {
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            margin: 10
                        }
                    },
                    yAxis: {
                        data: [],
                        inverse: true,
                        axisTick: {show: false},
                        axisLine: {show: false},
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                color: '#999',
                                fontSize: 16
                            }
                        }
                    },
                    grid: {
                        top: 'center',
                        height: 200,
                        left: '4%',
                    },
                    series: [{
                        // current data
                        type: 'pictorialBar',
                        tooltip: {
                            formatter: '男: {c}'
                        },
                        itemStyle: {
                            normal: {
                                color: '#1296db',
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return '男:\n' + (params.value / maxData * 100).toFixed(1) + '%\n' + params.value + '人'
                                },
                                position: '[0, 0]',
                                // position: 'outside',
                                offset: [150, -60],
                                textStyle: {
                                    color: '#1296db',
                                    fontSize: 18
                                },
                                align: 'center'
                            }
                        },
                        symbolRepeat: 'fixed',
                        symbolMargin: '5%',
                        symbol: svg.people,
                        symbolClip: true,
                        symbolSize: ['30', '45'],
                        symbolBoundingData: maxData,
                        data: [this.pictorialChartData.male_count],
                        z: 10
                    }, {
                        // full data
                        type: 'pictorialBar',
                        tooltip: {
                            formatter: '女: {c}'
                        },
                        itemStyle: {
                            normal: {
                                opacity: !this.pictorialChartData.male_count && !this.pictorialChartData.female_count ? 0.2 : 1,
                                color: '#d4237a',
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return '女:\n' + (params.value / maxData * 100).toFixed(1) + '%\n' + params.value + '人'
                                },
                                // position: '[0, 0]',
                                position: 'outside',
                                offset: [50, 0],
                                textStyle: {
                                    color: '#d4237a',
                                    fontSize: 18
                                },
                                align: 'center'
                            }
                        },
                        animationDuration: 0,
                        symbolRepeat: 'fixed',
                        symbolMargin: '5%',
                        symbol: svg.people,
                        symbolSize: ['30', '45'],
                        symbolBoundingData: maxData,
                        data: [this.pictorialChartData.female_count],
                        z: 5
                    }]
                }
                this.pictorialChart.setOption(option)
                // console.log('maxData: ', maxData)
            },
            clearChartData () {
                for (let value of Object.values(this.lineChartData)) {
                    value.length = 0
                }
            }
        },
        filters: {},
        directives: {},
    }
</script>
