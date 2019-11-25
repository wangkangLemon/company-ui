<!--数据订阅-->
<style lang='scss' rel="stylesheet/scss">
@import "../../utils/mixins/common";
#analytics-report-datemail-container {
    @extend %content-container;
    .operate {
        @extend %right-top-btnContainer;
    }
    .block {
        float: right;
        margin-top: 15px;
    }
    .head-title {
        width: 100%;
        background: #ededed;
        padding: 5px 10px;
    }
    .show-detail {
        .info {
            p {
                margin-bottom: 5px;
            }
        }
        .item {
            border-bottom: 1px solid #ededed;
            padding-bottom: 15px;
            h2 {
                font-size: 14px;
                font-weight: 700;
                margin: 3px 0;
                padding-top: 10px;
            }
            span {
                display: inline-block;
                padding: 15px 10px 0 10px;
                font-size: 12px;
                color: #707478;
            }
        }
    }
    .el-form {
        .el-form-item {
            margin-bottom: 0;
        }
        /*邮箱列表样式*/
        .email-list {
            margin-top: 5px;
            .el-input {
                width: 50%;
            }
        }
        .el-form-item__error {
            left: auto;
            right: 176px;
            top: 15px;
        }
        .target {
            border-bottom: 1px solid #aaa;
            padding: 10px 0;
            .checkbox-title {
                font-weight: bold;
            }
            .el-checkbox {
                margin-top: 10px;
            }
            .el-checkbox-group {
                margin-left: 25px;
                .el-checkbox {
                    margin-right: 15px;
                    margin-left: 0;
                }
            }
        }
    }
}
</style>
<template>
    <article id="analytics-report-datemail-container">
        <el-button icon="plus" type="primary" class="operate" @click="addFn">新增订阅</el-button>
        <el-dialog class="show-detail" title="查看数据订阅" :visible.sync="readVisible">
            <div v-if="details !== null">
                <section class="info">
                    <p><i class="title">接收邮箱：</i><span class="value">{{details.mail}}</span></p>
                    <p><i class="title">报告周期：</i><span class="value">{{cycleArr[details.cycle]}}</span></p>
                </section>
                <div class="head-title">订阅指标</div>
                <section class="item" v-for="(pitem,pindex) in detailSelector" :key="pindex">
                    <h2>{{pitem.name}}</h2>
                    <span v-for="(item,index) in pitem.children" :key="index">{{item.name}}</span>
                </section>
            </div>
        </el-dialog>
        <el-dialog title="数据订阅设置" :visible.sync="dialogVisible">
            <el-form label-width="120px" ref="form" :model="form" :rules="rules">
                <el-form-item label="接收邮箱" class="mail" prop="emails">
                    <div class="email-list" v-for="(item,index) in form.emails" :key="index">
                        <el-input v-model="item.value"></el-input>
                        <el-button type="text" v-show="index > 0" @click="removeEmail(index)">删除</el-button>
                    </div>
                    <el-button type="text" @click="addEmail">添加新邮箱</el-button>
                </el-form-item>
                <el-form-item label="报告周期" prop="cycle">
                    <el-radio-group v-model="form.cycle">
                        <el-radio label="day">每日</el-radio>
                        <el-radio label="week">每周</el-radio>
                        <el-radio label="month">每月</el-radio>
                    </el-radio-group>
                    <p class="tip" v-show="form.cycle == 'day'">日报：当日订阅，第二天会收到数据报表</p>
                    <p class="tip" v-show="form.cycle == 'week'">周报：每周一会发送上周的数据报表</p>
                    <p class="tip" v-show="form.cycle == 'month'">月报：每月1日会发送上个月的数据报表</p>
                </el-form-item>
                <div class="head-title">订阅指标</div>
                <section class="target" v-for="(pitem,pindex) in allSelector" :key="pindex">
                    <el-checkbox label="company" class="checkbox-title" v-model="form[signs[pindex]['all']]"
                                 @change="handleCheckedChange($event, pindex)">
                        {{signs[pindex]['name']}}
                    </el-checkbox>
                    <el-checkbox-group v-model="form[signs[pindex]['checked']]"
                                       @change="itemCheckChange($event, pindex)">
                        <el-checkbox v-for="item in pitem" :label="item.value" :key="item.index">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </section>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <el-table
                v-loading="loading"
                border
                stripe
                :data="dataList">
            <el-table-column
                    prop="type_name"
                    min-width="250"
                    label="订阅内容">
            </el-table-column>
            <el-table-column
                    prop="mail"
                    min-width="500"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="cycle"
                    min-width="100"
                    label="发送周期">
                <template slot-scope="scope">
                    {{cycleArr[scope.row.cycle]}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    width="180"
                    label="订阅时间">
            </el-table-column>
            <el-table-column
                    prop="auth"
                    width="100"
                    label="订阅人">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showDetailFn(scope.row)">
                        详情
                    </el-button>
                    <el-button type="text" size="small" @click="editFn(scope.row)">
                        修改
                    </el-button>
                    <el-button type="text" size="small" @click="deleteFn(scope.row)">
                        取消订阅
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="(val)=>{fetchParam.page_size = val;fetchData();}"
                    @current-change="(val)=>{fetchParam.page = val;fetchData();}"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    :page-size="fetchParam.page_size"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </article>
</template>
<script>
    import datamailService from 'services/analytics/datamailService'
    import clone from 'clone'
    let signs = [
        {
            checked: 'checkedCompanys',
            all: 'companyAll',
            name: '企业数据'
        },
        {
            checked: 'checkedUsers',
            all: 'userAll',
            name: '员工培训'
        },
        {
            checked: 'checkedCourses',
            all: 'courseAll',
            name: '课程'
        },
        {
            checked: 'checkedApplys',
            all: 'applyAll',
            name: '企业应用'
        },
    ]
    const allSelector = [
        [
            {
                value: 'department_number',
                name: '门店数量',
                checked: false
            },
            {
                value: 'user_number',
                name: '店员数量',
                checked: false
            },
            {
                value: 'manager_number',
                name: '店长数量',
                checked: false
            },
            {
                value: 'unactive_user_number',
                name: '未激活员工数量（从未使用过）',
                checked: false
            },
            {
                value: 'active_department_number',
                name: '活跃门店数量',
                checked: false
            },
            {
                value: 'active_user_number',
                name: '活跃员工数量',
                checked: false
            },
        ],
        [
            {
                value: 'course_user',
                name: '学习人数',
                checked: false
            },
            {
                value: 'testing_user',
                name: '考试人数',
                checked: false
            },
            {
                value: 'testing_number',
                name: '考试次数',
                checked: false
            },
            {
                value: 'passed_user',
                name: '及格人数',
                checked: false
            },
            {
                value: 'passed_rate',
                name: '及格率',
                checked: false
            },
        ],
        [
            {
                value: 'company_number',
                name: '企业内训课数量',
                checked: false
            },
            {
                value: 'video_number',
                name: '视频上传数量',
                checked: false
            },
            {
                value: 'doc_number',
                name: '文档上传数量',
                checked: false
            },
        ],
        [
            {
                value: 'announce_number',
                name: '公告使用次数',
                checked: false
            },
            {
                value: 'course_task_number',
                name: '课程任务发布数量',
                checked: false
            },
            {
                value: 'approval_number',
                name: '审批使用人数',
                checked: false
            },
            {
                value: 'attendance_number',
                name: '考勤使用人数',
                checked: false
            },
            {
                value: 'article_number',
                name: '企业动态发布数量',
                checked: false
            },
            {
                value: 'practice_number',
                name: '拿药练习发布数量',
                checked: false
            },
            {
                value: 'app_number',
                name: '小应用个数',
                checked: false
            },
        ]
    ]
    export default {
        data () {
            var validateEmail = (rule, value, callback) => {
                value.forEach(item => {
                    if (!item.value.match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                        callback(new Error('请输入正确的邮箱'))
                    }
                })
                callback()
            }
            return {
                signs: signs,
                allSelector: allSelector,
                detailSelector: [],
                details: null,
                cycleArr: {'day': '每日', 'week': '每周', 'month': '每月'},
                loading: false,
                dataList: [],
                fetchParam: {
                    page: 1,
                    page_size: 15,
                },
                total: 0,
                dialogVisible: false, // 是否编辑/添加弹窗
                readVisible: false, // 是否显示查看弹窗
                companyData: [
                    {
                        id: 1,
                        name: '门店数量'
                    },
                    {
                        id: 2,
                        name: '店员数量'
                    },
                ],
                userData: [
                    {
                        id: 1,
                        name: '学习人数'
                    },
                    {
                        id: 2,
                        name: '考试人数'
                    },
                ],
                courseData: [
                    {
                        id: 1,
                        name: '企业内训课数量'
                    },
                    {
                        id: 2,
                        name: '视频上传数量'
                    },
                ],
                applyData: [
                    {
                        id: 1,
                        name: '企业内训课数量'
                    },
                    {
                        id: 2,
                        name: '视频上传数量'
                    },
                ],
                form: clearForm(),
                rules: {
                    emails: [
                        { validator: validateEmail, trigger: 'blur' }
                    ]
                },
                result: [] // 最终选择的订阅指标
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            editFn (row) {
                this.dialogVisible = true
                this.form = clearForm()
                this.form.cycle = row.cycle
                this.form.id = row.id
                let emails = []
                row.mail.split(',').forEach((item) => {
                    emails.push({
                        value: item
                    })
                })
                this.form.emails = emails
                row.data.split(',').forEach((data, dindex) => {
                    this.allSelector.forEach((pitem, pindex) => {
                        pitem.forEach((findItem, findex) => {
                            if (findItem.value === data) {
                                this.form[this.signs[pindex]['checked']].push(findItem.value)
                                this.form[this.signs[pindex]['all']] = this.form[this.signs[pindex]['checked']].length === pitem.length
                            }
                        })
                    })
                })
            },
            deleteFn (row) {
                xmview.showDialog('确定要取消订阅吗？', () => {
                    datamailService.deleteDataMail({id: row.id}).then(() => {
                        xmview.showTip('success', '取消成功')
                        this.fetchData()
                    })
                })
            },
            showDetailFn (row) {
                this.details = row
                this.readVisible = true
                this.detailSelector = []
                this.allSelector = clone(allSelector)
                row.data.split(',').forEach((data, dindex) => {
                    this.allSelector.forEach((pitem, pindex) => {
                        pitem.forEach((findItem, findex) => {
                            if (findItem.value === data) {
                                this.allSelector[pindex][findex].checked = true
                            }
                        })
                    })
                })
                this.allSelector.forEach((pitem, pindex) => {
                    let children = pitem.filter((findItem, findex) => {
                        if (findItem.checked === true) {
                            return findItem
                        }
                    })
                    if (children.length > 0) this.detailSelector.push({
                        name: this.signs[pindex].name,
                        children
                    })
                })
            },
            fetchData () {
                this.loading = true
                return datamailService.datamailSearch(this.fetchParam).then((ret) => {
                    this.dataList = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            submit () {
                this.$refs.form.validate((valid) => {
                    if (!valid) return
                    // 勾选的所有的item
                    this.result = [...this.form.checkedCompanys, ...this.form.checkedUsers, ...this.form.checkedCourses, ...this.form.checkedApplys]
                    if (this.form.emails.length < 2 && this.form.emails[0].value === '') {
                        xmview.showTip('error', '必须添加新邮箱')
                        return
                    } else if (this.result.length < 1) {
                        xmview.showTip('error', '必须选择订阅指标')
                        return
                    }
                    // 所有的邮箱
                    let emails = []
                    this.form.emails.forEach((item) => {
                        emails.push(item.value)
                    })
                    // 勾选的类型
                    let type = []
                    this.form.checkedCompanys.length > 0 && type.push('company')
                    this.form.checkedUsers.length > 0 && type.push('user')
                    this.form.checkedCourses.length > 0 && type.push('course')
                    this.form.checkedApplys.length > 0 && type.push('company_app')
                    let reqFn = datamailService.addDataMail
                    let msg = '添加成功'
                    let params = {
                        mail: emails.join(','),
                        cycle: this.form.cycle,
                        type,
                        data: this.result
                    }
                    if (this.form.id) {
                        params = {...params, id: this.form.id}
                        reqFn = datamailService.updateDataMail
                        msg = '修改成功'
                    }
                    reqFn(params).then(() => {
                        this.dialogVisible = false
                        xmview.showTip('success', msg)
                        this.fetchData()
                    })
                })
            },
            // 添加新邮箱
            addEmail () {
                this.form.emails.push({value: ''})
            },
            addFn () {
                this.dialogVisible = true
                this.form = clearForm()
            },
            removeEmail (index) {
                this.form.emails.splice(index, 1)
            },
            // 选择全部
            handleCheckedChange (e, index) {
                let values = []
                allSelector[index].forEach((item) => {
                    values.push(item.value)
                })
                this.form[signs[index]['checked']] = e.target.checked ? values : []
            },
            itemCheckChange (checked, index) {
                this.form[signs[index]['all']] = checked.length === allSelector[index].length
            },
        }
    }
    function clearForm () {
        return {
            emails: [
                {
                    value: ''
                }
            ],
            cycle: 'day',
            companyAll: false,
            checkedCompanys: [], // 已选择的企业
            userAll: false,
            checkedUsers: [], // 已选择的员工
            courseAll: false,
            checkedCourses: [], // 已选择的课程
            applyAll: false,
            checkedApplys: [], // 已选择的应用
        }
    }
</script>
