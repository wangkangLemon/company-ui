<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    @import "~utils/mixins/mixins";
    #member-selling-dashboard-container {
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
            margin: 1em 0;
            .box-card {
                flex-grow: 1;
                .el-card__header {
                    background: #ffad15;
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
            // @include clearFloatByAfter()
            // display: flex;
            // justify-content: space-between;
            // flex-wrap: wrap;
            width: 100%;
            .box {
                // flex-grow: 1;
                .header-title {
                    text-align: center;
                }
                #sexPieChart {
                    // width: 33%;
                    height: 300px;
                }
                #agePieChart {
                    // width: 33%;
                    height: 300px;
                }
                #tagPieChart {
                    // width: 33%;
                    height: 300px;
                }
                #lineChart {
                    height: 300px;
                }
            }
            .box + .box {
                margin-left: 1%;
            }
            .box-sex {
                // flex-shrink: 2;
                float: left;
                width: 24%;
            }
            .box-age {
                // flex-basis: 00px;
                // flex-grow: 1.5;
                float: left;
                width: 42%;
            }
            .box-tag {
                // flex-grow: 0.5;
                float: left;
                width: 32%;
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
        @media (max-width: 1265px) {
            .chart-content {
                .box {
                    width: 100%;
                }
                .box + .box {
                    margin: 1em 0 0;
                }
            }
        }
    }
</style>

<template>
    <main id="member-selling-dashboard-container">
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
                    <p>门店销售额</p>
                    <h2>¥{{stat.selling_money}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/industry.png"/></i>
                    <p>购买人次数</p>
                    <h2>{{stat.selling_count}}</h2>
                </div>
                <div>
                    <i><img src="../../../assets/images/primary.png"/></i>
                    <p>平均客单价</p>
                    <h2>¥{{stat.avg_customer_price}}</h2>
                </div>
            </section>
            <section class="chart-content">
                <el-card class="box-line box">
                    <div slot="header" class="clearfix header-title">
                        <el-radio-group v-model="chartRadio" class="header-right" @change="switchLine">
                            <el-radio-button 
                                v-for="(value, key, index) in lineMap" 
                                :label="key" 
                                :key="key">
                                {{value.name}}
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                    <section id="lineChart"></section>
                </el-card>
            </section>
            <section class="analyics-list">
                <el-card class="box-card" v-show="!fetchParam.department_id">
                    <div slot="header" class="box-card-header">门店销售额Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="departmentData" border>
                        <el-table-column 
                            label="门店名" 
                            prop="department_name">
                        </el-table-column>
                        <el-table-column 
                            label="销售额" 
                            prop="selling_money">
                            <span slot-scope="{ row }">¥{{row.selling_money}}</span>
                        </el-table-column>
                    </el-table>  
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">品类销售额Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="categoryData" border>
                        <el-table-column 
                            label="品类类型" 
                            prop="medicine_category_name">
                        </el-table-column>
                        <el-table-column 
                            label="销售额" 
                            prop="selling_money">
                            <span slot-scope="{ row }">¥{{row.selling_money}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">药品销售额Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="medicineData" border>
                        <el-table-column 
                            label="药品名" 
                            prop="medicine_name">
                        </el-table-column>
                        <el-table-column 
                            label="销售额" 
                            prop="selling_money">
                            <span slot-scope="{ row }">¥{{row.selling_money}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="box-card-header">店员销售额Top3</div>
                    <el-table class="data-table" v-loading="loading" :data="userData" border>
                        <el-table-column 
                            label="店员姓名" 
                            prop="user_name">
                        </el-table-column>
                        <el-table-column 
                            label="所属门店" 
                            prop="department_name">
                        </el-table-column>
                        <el-table-column 
                            label="销售额" 
                            prop="selling_money">
                            <span slot-scope="{ row }">¥{{row.selling_money}}</span>
                        </el-table-column>
                    </el-table>
                </el-card>
            </section>
            <section class="chart-content">
                <el-card class="box-sex box">
                    <span>性别人群贡献分布</span>
                    <section id="sexPieChart"></section>
                </el-card>
                <el-card class="box-age box">
                    <span>年龄人群贡献分布</span>
                    <section id="agePieChart"></section>
                </el-card>
                <el-card class="box-tag box">
                    <span>标签人群贡献分布</span>
                    <section id="tagPieChart"></section>
                </el-card>
            </section>
        </section>
    </main>
</template>

<script>
    import sellingService from 'services/member/sellingService'
    import Department from 'components/select/Department.vue'
    import DateRange from 'components/form/DateRangePicker2.vue'
    import * as timeUtils from 'utils/timeUtils'
    import Echars from 'echarts'
    import lineChartJSON from '../component/lineChart'

    let d = new Date()
    let defaultStartTime = timeUtils.date2Str(new Date(d.setTime(Date.now() - 3600 * 1000 * 24 * (7 - 1))))
    let defaultEndTime = timeUtils.date2Str(new Date())
    let lineMap = {
        department: {
            service: sellingService.getDepartmentDashboard,
            name: '门店销售额',
            unit: '元'
        },
        user: {
            service: sellingService.getUserDashboard,
            name: '购买人次数',
            unit: '次'
        },
        avgmoney: {
            service: sellingService.getAvgMoneyDashboard,
            name: '平均客单价',
            unit: '元'
        }
    }
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
                chartRadio: 'department',
                departmentData: [],
                categoryData: [],
                medicineData: [],
                userData: [],
                stat: {},
                sexPieChartData: {},
                agePieChartData: {},
                tagPieChartData: {},
                sexPieChart: {},
                agePieChart: {},
                tagPieChart: {},
                lineChart: {},
                lineChartData: {},
                lineMap: lineMap,
                fetchParam: {
                    department_id: '',
                    start_date: defaultStartTime,
                    end_date: defaultEndTime
                },
            }
        },
        methods: {
            initChart () {
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        this.lineChart = Echars.init(document.getElementById('lineChart'))
                        this.sexPieChart = Echars.init(document.getElementById('sexPieChart'))
                        this.agePieChart = Echars.init(document.getElementById('agePieChart'))
                        // setTimeout(() => {
                        //     let agePieChart = document.querySelector('#agePieChart')
                        //     agePieChart.children[0].children[0].style.width = agePieChart.clientWidth + 'px'
                        // }, 500)
                        this.tagPieChart = Echars.init(document.getElementById('tagPieChart'))
                        window.onresize = function (e) {
                            this.lineChart.resize.call(null, e)
                            this.sexPieChart.resize.call(null, e)
                            this.agePieChart.resize.call(null, e)
                            this.tagPieChart.resize.call(null, e)
                        }.bind(this)
                        resolve()
                    })
                })
            },
            getData (type) {
                this.loading = true
                return Promise.all([sellingService.getSellingDashboard(this.fetchParam), this.switchLine(type)]).then(ret => {
                    this.stat = ret[0].stat  // 卡片数据
                    // 表格数据
                    this.departmentData = ret[0].department_selling_top
                    this.categoryData = ret[0].medicine_category_selling_top
                    this.medicineData = ret[0].medicine_selling_top
                    this.userData = ret[0].user_selling_top
                    // 图表数据
                    this.sexPieChartData = this.createSexPieChartData(ret[0].sex_distribution) // 年龄分布
                    this.agePieChartData = this.createAgePieChartData(ret[0].age_distribution) // 性别分布
                    this.tagPieChartData = this.createTagPieChartData(ret[0].tag_distribution) // 标签分布
                    this.loading = false
                }).catch(err => {
                    console.log('getData: ', err)
                })
            },
            fetchData (type = this.chartRadio) {
                if (this.handleDate()) {
                    xmview.setContentLoading(true)
                    return this.getData(type).then(() => {
                        this.getSexPieChart()
                        this.getAgePieChart()
                        this.getTagPieChart()
                        xmview.setContentLoading(false)
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
                }
                return true
            },
            switchLine (type) {
                this.lineMap[type]['service'](this.fetchParam).then(ret => {
                    // 折线图数据
                    this.lineChartData = this.createLineChartData(ret.chart, this.lineMap[type]['name'])
                    this.lineChartData.unit = this.lineMap[type]['unit']
                }).then(() => {
                    this.getLineChart()
                }).catch(e => {
                    console.log(e)
                })
            },
            createLineChartData (chartData, name) {
                let xData = []
                let yData = []
                chartData.forEach(item => {
                    xData.push(item.time)
                    yData.push(item.money || item.count)
                })
                return {
                    xData,
                    yData,
                    name
                }
            },
            createSexPieChartData (sex) {
                // debugger
                let legendData = []
                let seriesData = []
                let map = [
                    {
                        name: '男',
                        value: 'male_money'
                    },
                    {
                        name: '女',
                        value: 'female_money'
                    }
                ]
                map.forEach(item => {
                    seriesData.push({
                        name: item.name,
                        value: sex[item.value]
                    })
                    legendData.push(item.name)
                })
                return {
                    legendData,
                    seriesData
                }
            },
            createAgePieChartData (age) {
                let legendData = []
                let seriesData = [];
                ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上'].forEach((item, index) => {
                    seriesData.push({
                        name: item,
                        value: age[`num${index + 1}_money`]
                    })
                    legendData.push(item)
                })
                return {
                    legendData,
                    seriesData
                }
            },
            createTagPieChartData (tag) {
                let legendData = []
                let seriesData = []
                tag.forEach(item => {
                    seriesData.push({
                        name: item.tag_name,
                        value: item.selling_money
                    })
                    legendData.push(item.tag_name)
                })
                return {
                    legendData,
                    seriesData
                }
            },
            getLineChart () { // 线性
                // this.clearLineChartData()
                let maxResult = this.lineChartData.yData.reduce(function (a, b) {
                    return Math.max(a, b)
                })
                const intervalMap = lineChartJSON.intervalMap
                let day = timeUtils.getSubDay(this.fetchParam.start_date, this.fetchParam.end_date)
                let dayLen = day > 3 && day <= 10 ? 10 : day
                let interval = 0
                if (intervalMap[dayLen] != undefined) {
                    interval = intervalMap[dayLen]
                } else {
                    interval = Math.ceil(dayLen / 10) - 1
                }
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [this.lineChartData.name]
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
                            max: Math.ceil(maxResult * 2),
                            axisLabel: {
                                formatter: '{value} ' + this.lineChartData.unit
                            }
                        }
                    ],
                    series: [
                        {
                            name: this.lineChartData.name,
                            type: 'line',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            },
                            data: this.lineChartData.yData
                        },
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                this.lineChart.setOption(option)
            },
            getSexPieChart () { // 性别饼状
                let option = {
                    title: {
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : ¥{c} ({d}%)',
                        position: (pos, params, dom, rect, size) => {
                            var obj = {top: 60}
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                            return obj
                        }
                    },
                    grid: {
                        left: 30,
                    },
                    legend: {
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: this.sexPieChartData.legendData,
                    },
                    series: [
                        {
                            name: '性别',
                            avoidLabelOverlap: false,
                            type: 'pie',
                            radius: ['40%', '55%'], // 环
                            center: ['50%', '50%'],
                            data: this.sexPieChartData.seriesData,
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                    color: ({name}) => {
                                        return name === '男' ? '#1296db' : '#d4237a'
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold',
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: ({name}) => {
                                        return name === '男' ? '#1296db' : '#d4237a'
                                    },
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                    label: {
                                        show: true,
                                        position: 'outer'
                                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    labelLine: {
                                        show: true,
                                        length: 20,
                                        lineStyle: {
                                            // color: 各异,
                                            width: 1,
                                            type: 'solid'
                                        }
                                    }
                                },
                                emphasis: {
                                    // color: 各异,
                                    borderColor: 'rgba(0,0,0,0)',
                                    borderWidth: 1,
                                    label: {
                                        show: true,
                                        position: 'outer'
                                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    labelLine: {
                                        show: true,
                                        length: 20,
                                        lineStyle: {
                                            // color: 各异,
                                            width: 1,
                                            type: 'solid'
                                        }
                                    }
                                }
                            },
                        }
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                this.sexPieChart.setOption(option)
            },
            getAgePieChart () { // 年龄饼状
                let option = {
                    title: {
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : ¥{c} ({d}%)'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 0,
                        top: 20,
                        bottom: 20,
                        data: this.agePieChartData.legendData,
                    },
                    series: [
                        {
                            name: '年龄',
                            type: 'pie',
                            radius: '55%',
                            center: ['40%', '50%'],
                            data: this.agePieChartData.seriesData,
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
                this.agePieChart.setOption(option)
            },
            getTagPieChart () { // 标签饼状
                let option = {
                    title: {
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : ¥{c} ({d}%)'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: this.tagPieChartData.legendData.length ? this.tagPieChartData.legendData : ['无数据'],
                    },
                    series: [
                        {
                            name: '年龄',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: this.tagPieChartData.seriesData.length ? this.tagPieChartData.seriesData : [{name: '无数据', value: 0}],
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
                this.tagPieChart.setOption(option)
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
