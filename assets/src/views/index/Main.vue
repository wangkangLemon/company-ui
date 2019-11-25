<style lang='scss' rel="stylesheet/scss">
@import "~utils/mixins/mixins";
.index-main-container {
    .department-analytics {
        height: 120px;
        @extend %justify;
        > div {
            height: 100%;
            color: #fff;
            position: relative;
            width: 24%;
            display: inline-block;
            vertical-align: top;
            border-radius: 5px;
            font-size: 12px;
            text-align: right;
            text-align-last: right;
            &:first-of-type {
                background: #FF9966;
            }
            &:nth-child(2) {
                background: #2DB6F4;
            }
            &:nth-child(3) {
                background: #7DC856;
            }
            &:nth-child(4) {
                background: #5D6977;
            }
            > i {
                display: block;
                line-height: 82px;
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
                    width: 35px;
                    height: 35px;
                }
            }
            > h2 {
                margin-top: 20px;
                font-size: 25px;
                padding-right: 10px;
            }
            p {
                font-size: 16px;
                padding-right: 10px;
                cursor: pointer;
            }
            > div {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.3);
                padding: 5px 10px;
                text-align: left;
                text-align-last: left;
                > a {
                    float: right;
                    color: #fff;
                }
            }
        }
    }
    .course-analytics {
        @extend %justify;
        margin: 15px 0;
        height: 120px;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 5px;
        padding: 25px 0;
        > div {
            display: inline-block;
            vertical-align: top;
            height: 100%;
            border-right: 1px solid #ddd;
            &:last-of-type {
                border-right: none;
            }
            width: 24%;
            > * {
                display: inline-block;
                vertical-align: top;
            }
                #no-activity {
                        font-size: 16px;
                        color:red;
                    }
            .sign {
                width: 55px;
                height: 55px;
                text-align: center;
                text-align-last: center;
                border-radius: 50%;
                margin: 10px 20px;
                
                &.test {
                    background: #2DB7F5;
                }
                &.public {
                    background: #808BC6;
                }
                &.primary {
                    background: #7DC856;
                }
                &.industry {
                    background: #F9BF00;
                }
                line-height: 76px;
                img {
                    width: 30px;
                    height: 30px;
                }
            }
            > div {
                margin-top: 10px;
                > i {
                    font-size: 12px;
                    color: #666;
                }
                > p {
                    font-size: 25px;
                    color: #333;
                    cursor: pointer;
                }
            }
        }
    }
    .box-card {
        margin-bottom: 15px;
        color: #333;
        .header-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .header-right {
                display: inline-block;
            }
        }
        .clearfix {
            text-align: left;
            clear: right;
        }
        .el-card__header {
            padding: 10px 15px;
            background: #f0f3f5;
            font-size: 16px;
        }

        #lineChart {
            width: 100%;
            height: 300px;
        }
    }
    .chart-content {
        position: relative;
        .dialogContent {
            img {
                min-width: 100%;
            }
        }
        .box-chart {
            margin-right: 25.3%;
            
        }
        .message {
            position: absolute;
            width: 24%;
            right:0;
            top: 0;
            .message__ul {
                height: 313px;
                overflow: hidden;

                >.message__li {
                    width: 100%;
                    // height: 25%;
                    padding: 5px 0;
                    border-bottom: 1px solid #ccc;
                    list-style: none;
                    cursor: pointer;
                    color: #6d6d6d;
                    // p:first-child {
                    //     float: left;
                    //     width: 50%;
                    //     overflow:hidden; 
                    //     text-overflow:ellipsis;
                    //     display:-webkit-box; 
                    //     -webkit-box-orient:vertical;
                    //     -webkit-line-clamp:2; 
                    // }
                    // p:nth-child(2) {
                    //     // text-align: right;
                    //     float:right;
                    //     // line-height: 2em;
                    // }
                    
                }
            }            
        }
    }
    
    .analyics-list {
        @extend %justify;
        .el-loading-mask {
            text-align: center;
            text-align-last: center;
        }
        > .box-card {
            width: 32%;
            display: inline-block;
            vertical-align: top;
            .right {
                float: right;
                .z-bang {
                    font-size: 14px;
                    margin-left: 5px;
                    cursor: pointer;
                }
            }
            .el-table {
                border: none;
                th {
                    font-weight: normal;
                }
                .cell {
                    text-align: left;
                    text-align-last: left;
                    height: 30px !important;
                    line-height: 30px !important;
                    // @extend %singline;
                    padding-right: 0;
                }
                td {
                    height: 20px !important;
                    line-height: 20px !important;
                    border-bottom: none;
                }
            }
            .el-card__body {
                padding: 0;
            }
            th {
                background: none;
            }
            thead {
                div {
                    background: none;
                }
            }
        }
    }
}
</style>

<template>
    <main class="index-main-container" v-if="mainData != null">
        <section class="department-analytics">
            <div>
                <i><img src="../../assets/images/user.png"/></i>
                <h2>{{mainData.using_user}}</h2>
                <p>昨日使用人数</p>
                <!--<router-link tag="p" :to="{name: 'company-index'}">连锁总数量</router-link>-->
                <div>
                    <i>比前一日{{mainData.using_user_inc >= 0 ? '增加' : '减少'}} {{Math.abs(mainData.using_user_inc)}} 人</i>
                    <!--<router-link tag="a" :to="{name: 'company-index', query: {yesterday}}">查看详情</router-link>-->
                </div>
            </div>
            <div>
                <i><img src="../../assets/images/industry.png"/></i>
                <h2>{{mainData.learn_user}}</h2>
                <p>昨天学习人数</p>
                <!--<router-link tag="p" :to="{name: 'company-learn_user'}">门店总数量</router-link>-->
                <div>
                    <i>比前一日{{mainData.learn_user_inc >= 0 ? '增加' : '减少'}} {{Math.abs(mainData.learn_user_inc)}} 人</i>
                    <!--<router-link tag="a" :to="{name: 'company-department', query: {yesterday}}">查看详情</router-link>-->
                </div>
            </div>
            <div>
                <i><img src="../../assets/images/primary.png"/></i>
                <h2>{{mainData.testing}}</h2>
                <p>昨日考试人数</p>
                <!--<router-link tag="p" :to="{name: 'company-testing', query: {status: 1}}">店员总数量</router-link>-->
                <div>
                    <i>比前一日{{mainData.testing_inc >= 0 ? '增加' : '减少'}} {{Math.abs(mainData.testing_inc)}} 人</i>
                    <!--<router-link tag="a" :to="{name: 'company-user', query: {status: 1, yesterday}}">查看详情</router-link>-->
                </div>
            </div>
            <div>
                <i><img src="../../assets/images/r_user.png"/></i>
                <h2>{{mainData.testing_pass}}</h2>
                <!--<router-link tag="p" :to="{name: 'company-user', query: {status: 2}}">用户总数量</router-link>-->
                <p>考试合格人数</p>
                <div>
                    <i>比前一日{{mainData.testing_pass_inc >= 0 ? '增加' : '减少'}} {{Math.abs(mainData.testing_pass_inc)}} 人</i>
                    <!--<router-link tag="a" :to="{name: 'company-user', query: {status: 2, yesterday}}">查看详情</router-link>-->
                </div>
            </div>
        </section>
        <section class="course-analytics">
            <div>
                <i class="sign test"><img src="../../assets/images/user.png"/></i>
                <div>
                    <i>员工数量</i>
                    <p @click="$router.push({ name: 'company-department',params: { person: 0 } })">{{mainData.user}} 
                        <span @click="$router.push({ name: 'company-department',params: { person: 2 } })" 
                            id="no-activity">{{mainData.no_activity}}人未激活</span>
                    </p>
                </div>
            </div>
            <div>
                <i class="sign public"><img src="../../assets/images/company.png"/></i>
                <div>
                    <i>门店数量</i>
                    <p @click="$router.push({ name: 'company-department' })">{{mainData.department}}</p>
                </div>
            </div>
            <div>
                <i class="sign primary"><img src="../../assets/images/primary.png"/></i>
                <div>
                    <i>内训课数量</i>
                    <!-- <p @click="$router.push({ name: 'newcourse-course-public' })">{{mainData.private_course}}</p> -->
                    <p @click="jumpTo('newcourse-course-public')">{{mainData.private_course}}</p>
                </div>
            </div>
            <div>
                <i class="sign industry"><img src="../../assets/images/industry.png"/></i>
                <div>
                    <i>课程任务</i>
                    <!-- <p @click="$router.push({ name: 'server-manage' })">{{mainData.course_task}}</p> -->
                    <p @click="jumpTo('server-manage')">{{mainData.course_task}}</p>
                </div>
            </div>
        </section>

        <section class="chart-content">
            <el-card class="box-card  box-chart" v-loading="chartLoading">
                <div slot="header" class="clearfix header-title">
                    店员活跃和学习情况    
                    <el-radio-group v-model="chartRadio" class="header-right" @change="getChartData(chartRadio)">
                        <el-radio-button label="month">过去一个月</el-radio-button>
                        <el-radio-button label="two-week">过去两周</el-radio-button>
                    </el-radio-group>
                </div>
                <section id="lineChart"></section>
            </el-card>

            <el-card class="box-card message">
                <div slot="header" class="clearfix">
                    通知  
                    <el-button v-if="notifications" style="float:right" size="small" type="text" @click=" $router.push({name:'message', query:notifications})">更多</el-button>
                </div>
                <ul v-if="notifications" class="message__ul">
                    <li v-for="item in notifications" :key="item.id" class="message__li">
                        <span @click="showArticle(item.title, item.id)">
                            <p>{{item.title}}</p>  
                            <!-- <p>{{item.create_time_name | timeUtlis}}</p> -->
                        </span>
                    </li>
                </ul>
                <ul v-else>暂无通知</ul>
            </el-card>

            <!-- 通知资讯 -->
            <el-dialog :title="dialogTitle" :visible.sync="showDialog">
                <div class="dialogContent" v-html="dialogContent"></div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="showDialog = false">确 定</el-button>
                    </div>
            </el-dialog>

        </section>
        <section class="analyics-list" v-loading="listLoading">
        
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    学习榜TOP 10
                    <div class="right">
                        <el-switch
                          v-model="learn_top"
                          active-text="昨日"
                          inactive-text="总"
                          inactive-color="#13ce66"
                          active-color="#ff4949">
                        </el-switch>
                        <span class="z-bang" @click="showBang('learn')">总榜 ></span> 
                    </div>
                </div>
                <el-table
                        :data="mainData.learn_list"
                        style="width: 100%">
                    <el-table-column
                            :show-overflow-tooltip="true"
                            prop="item1"
                            width="120"
                            label="员工姓名">
                    </el-table-column>
                    <el-table-column
                            prop="item2"
                            label="所属门店">
                    </el-table-column>
                    <el-table-column
                            prop="num1"
                            width="100"
                            label="学习课程数">
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    活跃门店TOP 10
                    <div class="right">
                        <el-switch
                          v-model="department_top"
                          active-text="昨日"
                          inactive-text="总"
                          inactive-color="#13ce66"
                          active-color="#ff4949">
                        </el-switch>
                        <span class="z-bang" @click="showBang('active')">总榜 ></span> 
                    </div>
                </div>
                <el-table
                        :data="mainData.act_department_list"
                        style="width: 100%">
                    <el-table-column
                            :show-overflow-tooltip="true"
                            prop="item1"
                            label="门店名称">
                    </el-table-column>
                    <el-table-column
                            prop="num1"
                            width="90"
                            label="使用人数">
                    </el-table-column>
                    <el-table-column
                            prop="num2"
                            width="90"
                            label="学习人数">
                    </el-table-column>
                </el-table>
            </el-card>
                <el-card class="box-card">
                <div slot="header" class="clearfix">
                    最受欢迎课程TOP 10
                    <div class="right">
                        <el-switch
                          v-model="course_top"
                          active-text="昨日"
                          inactive-text="总"
                          inactive-color="#13ce66"
                          active-color="#ff4949">
                        </el-switch>
                        <span class="z-bang" @click="showBang('course')">总榜 ></span> 
                    </div>
                </div>
                <el-table
                        :data="mainData.course_list"
                        style="width: 100%">
                    <el-table-column
                            :show-overflow-tooltip="true"
                            prop="item1"
                            label="课程名称">
                    </el-table-column>
                    <el-table-column
                            prop="item2"
                            width="90"
                            label="课程类型">
                    </el-table-column>
                    <el-table-column
                            prop="num1"
                            width="90"
                            label="考试次数">
                    </el-table-column>
                    <el-table-column
                            prop="num2"
                            width="90"
                            label="考试人数">
                    </el-table-column>
                </el-table>
            </el-card>
        </section>

        <el-dialog 
            v-if="bangDialog.show"
            :visible.sync="bangDialog.show" 
            :title="bangDialog.title">
            <el-button type="primary" style="margin-bottom:15px;float:right;" :disabled="total2 === 0" @click="fileExport">导出Excel</el-button>
            <el-table border :data="bangDialog.list" v-loading="loading">
               <el-table-column
                   label="序号"
                   prop="serial_number"
                   min-width="70">
                   <!-- <span slot-scope="{$index}">{{$index+1}}</span> -->
               </el-table-column>
               <el-table-column
                    prop ='item1'
                    :label="bangDialog.label1"
                    min-width="100">
                </el-table-column>
                <el-table-column
                    v-if="bangDialog.type === 'learn' || bangDialog.type === 'course'"
                    prop ='item2'
                    :label="bangDialog.label2"
                    min-width="150">
                </el-table-column>
                <el-table-column
                    prop ='num1'
                    :label="bangDialog.label3"
                    min-width="70">
                </el-table-column>
                <el-table-column
                    v-if="bangDialog.type === 'active' || bangDialog.type === 'course'"
                    prop ='num2'
                    :label="bangDialog.label4"
                    min-width="70">
                </el-table-column>
            </el-table>
            <el-pagination class="block" style="margin: 10px 0;text-align: right;"
                @size-change="val=> {bangParams.page_size=val; getBangList()}"
                @current-change="val=> {bangParams.page=val; getBangList()}"
                :current-page="bangParams.page"
                :page-size="bangParams.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total2">
            </el-pagination> 
        </el-dialog>

    </main>
</template>

<script>
    import Echars from 'echarts'
    import mainService from 'services/base/mainService'
    import ArticleService from 'services/server/articleService'
    import * as timeUtils from 'utils/timeUtils'
    import authUtils from 'utils/authUtils'
    let d = new Date()
    export default {
        data () {
            return {
                yesterday: timeUtils.date2Str(new Date(d.setTime(Date.now() - 24 * 60 * 60 * 1000))),
                mainData: null,
                notifications: null,
                xData: [],
                wapData: [],
                appData: [],
                testData: [],
                timeData: [],
                maxResult: 0,
                chartRadio: 'month',
                showDialog: false,
                dialogTitle: '',
                dialogContent: '',
                learn_top: false,
                department_top: false,
                course_top: false,
                axisLabelRatio: 5,
                bangDialog: {
                    show: false,
                    title: '',
                    list: [],
                    type: '',
                    status: '',
                    label1: '',
                    label2: '',
                    label3: '',
                    label4: ''
                },
                mapo: {'learn':'学习榜','active':'活跃门店榜','course':'最受欢迎课程榜'},
                mapSta: {'learn':'learn_top','active':'department_top','course':'course_top'},
                bangParams: clearBangInfo(),
                total2: 0,
                loading: false,
                chartLoading: false,
                listLoading: false,
                roles: authUtils.getUserInfo().roles
            }
        },
        watch: {
            learn_top (val) {
                this.mainData.learn_list  = !val ? this.mainData.learn_list_total : this.mainData.learn_list_yesterday
            },
            department_top (val) {
                this.mainData.act_department_list  = !val ? this.mainData.act_department_list_total : this.mainData.act_department_list_yesterday
            },
            course_top (val) {
                this.mainData.course_list  = !val ? this.mainData.course_list_total : this.mainData.course_list_yesterday
            },
        },
        filters: {
            timeUtlis (value) {
                return value.slice(0, 10)
            }
        },
        created() {
            xmview.setContentLoading(true)
            mainService.getMain().then(ret => {
                this.mainData = ret.stat
                this.mainData.learn_list = []
                this.mainData.act_department_list = []
                this.mainData.course_list = []
                this.notifications = ret.notifications
            }).then(() => {
                xmview.setContentLoading(false)
            }).then(() => {
                this.chartLoading = true
                mainService.getChart().then(ret => {
                    let chartData = ret.data
                    chartData.forEach((item) => {
                        this.xData.push(item.date)
                        this.appData.push(item.user_passed)  // x: 考试通过
                        this.wapData.push(item.user_not_passed)  // h: 考试未通过
                        this.testData.push(item.users) // y: 考试人数
                        this.timeData.push(item.user_not_attend) //  // z: 没出席人数
                    })
                }).then(() => {
                    this.getLineChart()
                    var max1 = this.appData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    var max2 = this.wapData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    var max3 = this.testData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    var max4 = this.timeData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    var arr = [max1, max2, max3, max4]
                    this.maxResult = arr.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                }).then(() => {
                    this.chartLoading = false
                })
            }).then(() => {
                this.listLoading = true
                mainService.getList().then(ret => {
                    this.mainData.learn_list_total = ret.list.learn_list_total
                    this.mainData.learn_list_yesterday = ret.list.learn_list_yesterday
                    this.mainData.learn_list = this.mainData.learn_list_total
                    this.mainData.act_department_list_total = ret.list.act_department_list_total
                    this.mainData.act_department_list_yesterday = ret.list.act_department_list_yesterday
                    this.mainData.act_department_list = this.mainData.act_department_list_total
                    this.mainData.course_list_total = ret.list.course_list_total
                    this.mainData.course_list_yesterday = ret.list.course_list_yesterday
                    this.mainData.course_list = this.mainData.course_list_total
                }).then(() => {
                    this.listLoading = false
                })
            })
        },
        mounted () {
            
        },
        methods: {
            getLineChart () { // 线性
                this.$nextTick(() => {
                    let myChart = Echars.init(document.getElementById('lineChart'))
                    let option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['考试通过', '考试未通过', '考试人数', '未参加考试人数']
                        },
                        grid: {
                            left: '3%',
                            right: '0%',
                            bottom: 20, // 通过bottom调整图表的高度 使得x轴label可以全部显示
                            containLabel: true,
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: this.xData,
                                axisLabel: {
                                    interval: this.axisLabelRatio,
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                max: Math.ceil(this.maxResult * 2)
                            }
                        ],
                        series: [
                            {
                                name: '考试通过',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.appData
                            },
                            {
                                name: '考试未通过',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.wapData
                            },
                            {
                                name: '考试人数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.testData
                            },
                            {
                                name: '未参加考试人数',
                                type: 'line',
                                areaStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)'
                                    }
                                },
                                data: this.timeData
                            }
                        ]
                    }
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option)
                    window.onresize = myChart.resize
                })
            },
            getChartData (type) {
                this.axisLabelRatio = type === 'month' ? 5 : 2
                this.clearChartData()
                mainService.getChart(type).then((ret) => {
                    let chartData = ret.data
                    chartData.forEach((item) => {
                        this.xData.push(item.date)
                        this.appData.push(item.user_passed)  // x: 考试通过
                        this.wapData.push(item.user_not_passed)  // h: 考试未通过
                        this.testData.push(item.users) // y: 考试人数
                        this.timeData.push(item.user_not_attend) //  // z: 没出席人数
                    })
                }).then(() => {
                    this.getLineChart()
                    var max1 = this.appData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    var max2 = this.wapData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    // var max3 = this.testData.reduce(function (a, b) {
                    //     return Math.max(a, b)
                    // })
                    var max4 = this.timeData.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                    var arr = [max1, max2, max4]
                    this.maxResult = arr.reduce(function (a, b) {
                        return Math.max(a, b)
                    })
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            },
            showArticle (title, id) {
                this.dialogTitle = title
                ArticleService.getEditDetail(id).then((ret) => {
                    this.dialogContent = ret.data.content
                })
                this.showDialog = true
            },
            clearChartData () {
                this.xData = []
                this.wapData = []
                this.appData = []
                this.testData = []
                this.timeData = []
            },
            showBang(type) {
                
                this.bangDialog.type = type
                this.bangDialog.show = true
                let maparr = getBangTableLabel()
                this.bangDialog.label1 = maparr[0][type]
                this.bangDialog.label2 = maparr[1][type]
                this.bangDialog.label3 = maparr[2][type]
                this.bangDialog.label4 = maparr[3][type]
                this.bangDialog.title = this.mapo[type]

                this.bangParams = clearBangInfo()
                this.bangDialog.status = this.bangDialog.type === 'learn' ? this.learn_top : 
                    this.bangDialog.type === 'active' ? this.department_top : 
                    this.bangDialog.type === 'course' ? this.course_top : false
                this.getBangList()
            },
            getBangList() {
                this.loading = true
                this.bangParams.is_export = 0
                this.getBangData()
            },
            getBangData() {
                
                // 获取排行榜列表
                if(this.bangDialog.status !== '') {
                    this.bangParams.category = this.bangDialog.status ? 1 : 0
                }else {
                    this.bangParams.category = 1
                }
                
                let funName = this.bangDialog.type === 'learn' ? mainService.getLearnBang : 
                this.bangDialog.type === 'active' ? mainService.getActiveBang : 
                this.bangDialog.type === 'course' ? mainService.getCourseBang : ''
                if (funName) {
                    funName(this.bangParams).then( (res) => {
                        this.loading = false
                        if(res.data) {
                            this.bangDialog.list = res.data.list
                            this.total2 = res.data.total
                        }else {
                            xmview.showExportTip((id) => {
                                id.onclick = () => {
                                    this.$router.push({name:'analytics-export'})
                                }
                            })
                        }
                    })
                }
            },
            fileExport () {
                this.bangParams.is_export = 1
                this.getBangData()
            },
            jumpTo(name) {
                if(this.roles.indexOf('202') === -1) {
                    this.$router.push({ name: name })
                }
            }
        }
    }
    function clearBangInfo () {
        return {
            page:1,
            page_size:15,
            category: 0, // 0全部 1昨日 false全部 true昨日
            is_export: 0
        }
    }
    function getBangTableLabel() {
        return [{
            'learn': '员工姓名',
            'active': '门店名称',
            'course': '课程名称'
        },{
            'learn': '所属门店',
            'active': '',
            'course': '课程类型'
        },{
            'learn': '学习课程数',
            'active': '使用人数',
            'course': '考试次数'
        },{
            'learn': '',
            'active': '学习人数',
            'course': '考试人数'
        }]
    }

</script>
