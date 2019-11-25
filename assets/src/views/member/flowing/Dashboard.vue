<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    @import "~utils/mixins/mixins";
    #member-flowing-dashboard-container {
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
                &:nth-child(3) {
                    background: #7DC856;
                    margin-right: 0;
                }
                &:nth-child(4) {
                    background: #f16e6e;
                }
                &:nth-child(5) {
                    background: #5D6977;
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
        .chart-content {
            .box-card {
                margin-bottom: 1.5em;
                color: #333;
                width: 100%;
                #lineChart {
                    width: 100%;
                    height: 300px;
                }
            }
        }
        .chart-content2 {
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
        @media (min-width: 1601px) {
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
            .chart-content2 {
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
    <main id="member-flowing-dashboard-container">
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
                    title="查找时间"
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
                    <p>进店人次</p>
                    <h2>{{stat.flowing_count}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/industry.png"/></i>
                    <p>进店人数</p>
                    <h2>{{stat.flowing_number}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/primary.png"/></i>
                    <p>购买人次</p>
                    <h2>{{stat.purchase_count}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/user.png"/></i>
                    <p>新增会员数</p>
                    <h2>{{stat.add_vip_count}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/industry.png"/></i>
                    <p>客流转化率</p>
                    <h2>{{stat.customer_conversion_rate}}%</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/primary.png"/></i>
                    <p>连带率</p>
                    <h2>{{stat.related}}</h2>
                </div>
            </section>
            <section class="chart-content">
                <el-card class="box-card">
                    <span>进店客流</span>
                    <section id="lineChart"></section>
                </el-card>
            </section>
            <section class="chart-content2">
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
    import flowingService from 'services/member/flowingService'
    import Department from 'components/select/Department.vue'
    import DateRange from 'components/form/DateRangePicker2.vue'
    import * as timeUtils from 'utils/timeUtils'
    import Echars from 'echarts'
    import svg from '../component/peopleSvg'
    import lineChartJSON from '../component/lineChart'

    let d = new Date()
    let defaultStartTime = timeUtils.date2Str(new Date(d.setTime(Date.now() - 3600 * 1000 * 24 * (7 - 1))))
    let defaultEndTime = timeUtils.date2Str(new Date())
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
                stat: {},
                lineChartData: {},
                pieChartData: {},
                pictorialChartData: {},
                lineChart: {},
                pieChart: {},
                pictorialChart: {},
                fetchParam: {
                    department_id: '',
                    start_date: defaultStartTime,
                    end_date: defaultEndTime
                },
                resizeFnArray: [],
            }
        },
        methods: {
            initChart () {
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        this.lineChart = Echars.init(document.getElementById('lineChart'))
                        this.pieChart = Echars.init(document.getElementById('pieChart'))
                        this.pictorialChart = Echars.init(document.getElementById('pictorialChart'))
                        window.onresize = function (e) {
                            this.lineChart.resize.call(null, e)
                            this.pieChart.resize.call(null, e)
                            this.pictorialChart.resize.call(null, e)
                        }.bind(this)
                        resolve()
                    })
                })
            },
            getData () {
                return flowingService.getFlowingDashboard(this.fetchParam).then(ret => {
                    this.stat = ret.stat  // 卡片数据
                    this.lineChartData = this.createLineChartData(ret.flowing_count, ret.purchase_count) // 进店人次  // 购买人次
                    this.pieChartData = this.createPieChartData(ret.age_distribution) // 年龄分布
                    this.pictorialChartData = this.createPictorialChartData(ret.sex_distribution) // 性别分布
                })
            },
            fetchData () {
                if (this.handleDate()) {
                    xmview.setContentLoading(true)
                    return this.getData().then(() => {
                        this.getLineChart()
                        this.getPieChart()
                        this.getPictorialChart()
                        xmview.setContentLoading(false)
                    }).catch(e => {
                        console.log(e)
                    })
                }
            },
            handleDate () {
                if (!this.fetchParam.start_date && !this.fetchParam.end_date) {
                    this.fetchParam.start_date = defaultStartTime
                    this.fetchParam.end_date = defaultEndTime
                }
                if (timeUtils.getSubDay(this.fetchParam.start_date, this.fetchParam.end_date) > 90) {
                    xmview.showTip('warning', '最多只能查询90天')
                    return false
                } else {
                    return true
                }
            },
            createLineChartData (flowing_count, purchase_count) {
                let xData = []
                let flowingData = []
                let purchaseData = []
                flowing_count.forEach(item => {
                    xData.push(item.day)
                    flowingData.push(item.count)
                })
                purchase_count.forEach(item => {
                    purchaseData.push(item.count)
                })
                return {
                    xData,
                    flowingData,
                    purchaseData
                }
            },
            createPieChartData (age) {
                let legendData = []
                let seriesData = [];
                ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上'].forEach((item, index) => {
                    seriesData.push({
                        name: item,
                        value: age[`num${index + 1}_count`]
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
            getLineChart () { // 线性
                // this.clearLineChartData()
                var max1 = this.lineChartData.flowingData.reduce(function (a, b) {
                    return Math.max(a, b)
                }, 0)
                var max2 = this.lineChartData.purchaseData.reduce(function (a, b) {
                    return Math.max(a, b)
                }, 0)
                var arr = [max1, max2]
                this.maxResult = arr.reduce(function (a, b) {
                    return Math.max(a, b)
                }, 0)
                const intervalMap = lineChartJSON.intervalMap
                let day = timeUtils.getSubDay(this.fetchParam.start_date, this.fetchParam.end_date)
                let dayLen = day > 3 && day <= 10 ? 10 : day
                let interval = 0
                if (intervalMap[dayLen] != undefined) {
                    interval = intervalMap[dayLen]
                } else {
                    interval = Math.ceil(dayLen / 10)
                }
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['进店人次', '购买人次']
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: 20, // 通过bottom调整图表的高度 使得x轴label可以全部显示
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: this.lineChartData.xData,
                            axisLabel: {
                                interval,
                                showMaxLabel: true,
                                showMinLabel: true,
                                rotate: interval === 5 ? 20 : 0
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            max: Math.ceil(this.maxResult * 2),
                            axisLabel: {
                                formatter: '{value} 次'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '进店人次',
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: this.lineChartData.flowingData
                        },
                        {
                            name: '购买人次',
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: this.lineChartData.purchaseData
                        },
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                this.lineChart.setOption(option)
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
                let maxData = this.pictorialChartData.male_count + this.pictorialChartData.female_count || 10
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
                        symbol: 'image://../../../assets/images/user-default-female.jpg',
                        symbolSize: 30,
                        symbol: svg.people,
                        symbolSize: ['30', '45'],
                        symbolBoundingData: maxData,
                        data: [this.pictorialChartData.female_count],
                        z: 5
                    }]
                }
                this.pictorialChart.setOption(option)
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
