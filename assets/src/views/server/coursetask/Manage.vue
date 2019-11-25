<style lang="scss" scoped>
@import "~utils/mixins/common";
@import "~utils/mixins/mixins";
@import "~utils/mixins/topSearch";
#task-manager-container{
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
    .top-btn {
        @extend %right-top-btnContainer;
    }
    .el-tabs {
        position: relative;
        .temp-container {
            @extend %justify3;
            padding: 10px 30px;
            .temp-item {
                margin-bottom: 10px;
                margin-right: 3%;
                position: relative;
                vertical-align: top;
                // display: inline-block;
                border: 1px solid #ededed;
                flex-basis: 30%;
                height: 300px;
                font-size: 14px;
                .content {
                    height: 210px;
                    padding: 10px 15px;
                    h2 {
                        font-size: 16px;
                        padding-bottom: 10px;
                    }
                    img {
                        width: 100%;
                        // height: 100%;
                    }
                    .des {
                        line-height: 25px;
                        @include lineCount(2);
                    }
                }
                .bottom {
                    position: absolute;
                    bottom: 0;
                    background: #eee;
                    left: 0;
                    width: 100%;
                    display: flex;
                    > div {
                        margin-top: 5px;
                        margin-bottom: 5px;
                        text-align-last: center;
                        text-align: center;
                        /*line-height: 50px;*/
                        width: 50%;
                        &:first-of-type {
                            border-right: 1px solid #ddd;
                        }
                    }
                }
            }
        }
    }
    .course-list {
        .el-dialog {
            width: 40%;
        }
        .course-section {
            max-height: 500px;
            overflow-y: auto;
        }
        .list-des {
            h2 {
                text-align: center;
                line-height: 40px;
            }
            p {
                // text-indent: 2em;
                word-wrap: break-word;
            }
        }
        .list-item {
            h3 {
                line-height: 35px;
            }
            ul {
                padding: 0 20px;
                li {
                    line-height: 30px;
                }
            }
        }
    }
    .block {
        float: right;
        margin-top: 15px;
    }
}
</style>
<template>
    <article id="task-manager-container">
        <el-button class="top-btn" icon="el-icon-plus" type='primary' @click="()=>{$router.push({name: 'server-manage-create'})}">添加任务</el-button>
        <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
            <el-tab-pane label="任务列表" name="list">
                <section class="search">
                    <section>
                        <i>任务标题</i>
                        <el-input v-model="task.fetchParam.keyword" @keyup.enter.native="getTaskData"></el-input>
                    </section>
                    <section>
                        <i>发布对象</i>
                        <el-select v-model="task.fetchParam.type" placeholder="未选择" @change="getTaskData" :clearable="true">
                            <el-option label="全体员工" value="company"></el-option>
                            <el-option label="指定部门" value="organization"></el-option>
                            <el-option label="指定门店" value="department"></el-option>
                            <el-option label="指定用户组" value="user_group"></el-option>
                            <el-option label="指定员工" value="user"></el-option>
                        </el-select>
                    </section>
                    <section>
                        <i>状态</i>
                        <el-select v-model="task.fetchParam.status" placeholder="未选择" @change="getTaskData" :clearable="true">
                            <el-option label="正常" :value="0"></el-option>
                            <el-option label="下线" :value="1"></el-option>
                            <el-option label="待上线" :value="2"></el-option>
                        </el-select>
                    </section>
                </section>
                <el-table v-loading="task.loading" :data="task.dataList" :fit="true" border>
                    <el-table-column prop="title" min-width="300" label="任务标题" fixed="left"></el-table-column>
                    <el-table-column prop="course_count" width="100" label="课程数量">
                        <template slot-scope="scope">
                            <el-button type="text" @click="courseListFn(scope.row)" :disabled="!scope.row.course_count">{{scope.row.course_count}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exam_count" label="药我说数量" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="speakingListFn(scope.row)"  :disabled="!scope.row.speaking_count">{{scope.row.speaking_count}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exam_count" label="考试数量" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="examListFn(scope.row)"  :disabled="!scope.row.exam_count">{{scope.row.exam_count}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="发布对象" width="120">
                        <template slot-scope="scope">
                            {{type[scope.row.type]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="study_score" label="企业学分" width="100"></el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.status === 0">已上线</el-tag>
                            <el-tag type="danger" v-if="scope.row.status === 1">已下线</el-tag>
                            <el-popover
                                v-else-if="scope.row.status == 2" 
                                placement="top"
                                trigger="hover">
                                <p class="status-popover">{{scope.row.start_time}}</p>
                                <el-tag type="warning" slot="reference">待上线</el-tag>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time_name" label="创建日期" width="180"></el-table-column>
                    <el-table-column prop="end_day" label="截止日期" width="180"></el-table-column>
                    <el-table-column prop="" label="操作" width="210" fixed="right" header-align="center">
                        <template slot-scope="scope">
                            <el-button 
                                type="text" 
                                size="small"
                                @click="()=>{$router.push({name: 'server-manage-edit', query: {id: scope.row.id}})}"
                                :disabled="scope.row.status != 1 || creatorDisabled(scope.row.creator_id)">
                                修改
                            </el-button>
                            <el-button 
                                type="text" 
                                size="small" 
                                @click="dealStatus(scope.row)" 
                                v-if="scope.row.status == 1"
                                :disabled="creatorDisabled(scope.row.creator_id)">
                                上线
                            </el-button>
                            <el-button 
                                type="text" size="small" 
                                @click="timingDialogFn(scope.row)" 
                                v-if="scope.row.status == 1"
                                :disabled="creatorDisabled(scope.row.creator_id)">
                                定时
                            </el-button>
                            <el-button 
                                type="text" size="small" 
                                @click="dealStatus(scope.row)" 
                                v-if="scope.row.status != 1"
                                :disabled="creatorDisabled(scope.row.creator_id)">
                                下线
                            </el-button>
                            <el-button 
                                type="text" 
                                size="small" 
                                @click="deleteTask(scope.row)"
                                :disabled="creatorDisabled(scope.row.creator_id)">
                                删除
                            </el-button>
                            <el-button 
                                type="text" 
                                size="small" 
                                @click="()=>{$router.push({name: 'server-manage-edit', query: {id: scope.row.id, isCopy: true}})}"
                                :disabled="creatorDisabled(scope.row.creator_id)">
                                复制
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="block"
                    @size-change="val=> {task.fetchParam.page_size=val; getTaskData()}"
                    @current-change="val=> {task.fetchParam.page=val; getTaskData()}"
                    :current-page="task.fetchParam.page"
                    :page-size="task.fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes,total, prev, pager, next" :total="task.total">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="模版推荐" name="temp">
                <section class="search">
                    <section>
                        <i>类别</i>
                        <courseTaskTemplate 
                            :onchange="getTempData"
                            v-model="temp.fetchParam.category_id">
                        </courseTaskTemplate>
                    </section>
                    <section>
                        <i>标题搜索</i>
                        <el-input v-model="temp.fetchParam.keyword" @keyup.enter.native="getTempData"></el-input>
                    </section>
                </section>
                <article class="temp-container" v-loading="temp.loading">
                    <section class="temp-item" v-for="(item,index) in temp.dataList">
                        <div class="content">
                            <h2>{{item.title}}</h2>
                            <!--<img :src="item.image" alt="">-->
                            <img :src="item.image | fillImgPath" :alt="item.image">
                            <div class="des">{{item.description}}</div>
                        </div>
                        <div class="bottom">
                            <div><el-button type="text" @click="templateViewFn(item)">课程列表</el-button></div>
                            <div><el-button type="text" @click="()=>{$router.push({name: 'server-manage-create', query: {item: item}})}">使用</el-button></div>
                        </div>
                        <br/>
                    </section>
                </article>
                <el-pagination 
                    class="block"
                    @size-change="val=> {temp.fetchParam.page_size=val; getTempData()}"
                    @current-change="val=> {temp.fetchParam.page=val; getTempData()}"
                    :current-page="temp.fetchParam.page"
                    :page-size="temp.fetchParam.page_size"
                    :page-sizes="[6, 15, 30, 60, 100]"
                    layout="sizes,total, prev, pager, next" 
                    :total="temp.total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
        <el-dialog class="course-list" custom-class="custom-el-dialog" :title="temp.name + '列表'" :visible.sync="temp.listDialog">
            <section v-if="temp.courseList !== null" class="course-section">
<!--                 <div class="list-des">
                    <h2>{{temp.courseList.title}}</h2>
                    <p>{{temp.courseList.description}}</p>
                </div>
                <div class="list-item">
                    <template v-if="temp.courseList.course.length">
                        <h3 class="list-title">此任务共包含{{temp.courseList.total}}项课程：</h3>
                        <ul>
                            <li v-for="(item,index) in temp.courseList.course" :key="index">{{item.name}}</li>
                        </ul>
                    </template>
                </div> -->
                <div class="list-item">
                    <template v-if="temp.count">
                        <h3 class="list-title">此任务共包含{{temp.count}}项{{temp.name}}：</h3>
                        <ul>
                            <li v-for="(item,index) in temp.courseList" :key="index" v-if="temp.type === item.type || !item.type">{{item.name}}</li>
                        </ul>
                    </template>
                </div>
            </section>
        </el-dialog>

        <TimingDialog v-model="timingDialog" :submit="timingDialogSubmit"></TimingDialog>
        <!-- 产品创建/修改时新增弹窗提示是否余额充足 -->
        <el-dialog 
            v-if="productModel.showDialog"
            title="提示" 
            width="40%"
            @close="() => {submitLoading = false}"
            :visible.sync="productModel.showDialog">
            <div style="text-align: center;">
                <p>本次任务包含{{productModel.data.product_number}}个产品，覆盖{{productModel.data.user_number}}人，为期{{productModel.data.month_number}}个月，</p>
                <p>预计花费{{productModel.data.server_money}}元，账户余额{{productModel.data.balance}}元，</p>
<!--                 <p v-if="parseFloat(productModel.data.server_money, 10) <= parseFloat(productModel.data.balance, 10)">是否确认投放？</p>
                <p v-else>请充值后投放</p> -->
                <p>是否确认投放？</p>
            </div>
            <span slot="footer">
                <el-button 
                    type="primary" 
                    @click="submit"
                    :loading="submitLoading">
                    确定
                </el-button>
<!--                 <el-button 
                    v-else
                    type="primary" 
                    @click="$router.push({ name: 'finance-info' })">
                    去充值
                </el-button> -->
                <el-button @click="productModel.showDialog = false;">取消</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
    import courseTaskTemplate from 'components/select/CourseTaskTemplateCategory'
    import TimingDialog from '../../component/dialog/Timing.vue'
    import coursetaskService from 'services/server/coursetaskService'
    import * as _ from 'utils/commonUtils'
    export default {
        components: {
            courseTaskTemplate,
            TimingDialog
        },
        data () {
            return {
                type: {
                    company: '全体员工', 
                    department: '指定门店', 
                    organization: '指定部门',
                    user: '指定员工', 
                    user_group: '指定用户组'
                },
                activeTab: 'list',
                task: {
                    loading: false,
                    dataList: [],
                    total: 0,
                    fetchParam: {
                        status: '',
                        type: '',
                        keyword: '',
                        page: 1,
                        page_size: 15
                    }
                },
                temp: {
                    type: '',
                    count: 0,
                    name: '',
                    listDialog: false, // 课程列表弹窗
                    total: 0,
                    loading: false,
                    dataList: [],
                    fetchParam: {
                        category_id: '',
                        keyword: '',
                        page: 1,
                        page_size: 6
                    },
                    courseList: null
                },
                timingDialog: false,
                timingDialogSubmit: void 0,
                submitLoading: false,
                productModel: {
                    showDialog: false,
                    id: '',
                }
            }
        },
        activated () {
            this.getTaskData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleClick (e) {
                e.name === 'temp' && this.getTempData()
                e.name === 'list' && this.getTaskData()
            },
            getTaskData () {
                this.task.loading = true
                let fetchParam = _.clone(this.task.fetchParam)
                fetchParam.status = fetchParam.status === '' ? -1 : fetchParam.status
                return coursetaskService.getTaskSearch(fetchParam).then((ret) => {
                    this.task.dataList = ret.data
                    this.task.total = ret.total
                    this.task.loading = false
                })
            },
            getTempData () {
                this.temp.loading = true
                return coursetaskService.getCourseTaskTemplateSearch(this.temp.fetchParam).then((ret) => {
                    this.temp.dataList = ret.data
                    this.temp.total = ret.total
                    this.temp.loading = false
                })
            },
            // 获取课程列表
            courseListFn (row) {
                this.temp.listDialog = true
                this.temp.count = row.course_count
                this.temp.name = '课程'
                this.temp.type = 'course'
                coursetaskService.courseTaskDetail({id: row.id}).then((ret) => {
                    this.temp.courseList = ret.object
                })
            },
            // 获取考试列表
            examListFn (row) {
                this.temp.listDialog = true
                this.temp.count = row.exam_count
                this.temp.name = '考试'
                this.temp.type = 'exam'
                coursetaskService.courseTaskDetail({id: row.id}).then((ret) => {
                    this.temp.courseList = ret.object
                })
            },
            // 获取药我说列表
            speakingListFn (row) {
                this.temp.listDialog = true
                this.temp.count = row.speaking_count
                this.temp.name = '药我说'
                this.temp.type = 'speaking'
                coursetaskService.courseTaskDetail({id: row.id}).then((ret) => {
                    this.temp.courseList = ret.object
                })
            },
            templateViewFn (row) {
                this.temp.listDialog = true
                coursetaskService.getCourseTaskTemplate({id: row.id}).then((ret) => {
                    this.temp.count = ret.total
                    this.temp.name = '课程'
                    this.temp.courseList = ret.course
                })
            },
            // 处理状态
            dealStatus (row) {
                // 如果status 0 则执行下线 否则执行上线
                let req
                let msg = ''
                if (row.status != 1) {
                    req = coursetaskService.revokeCourseTask
                    msg = '下线'
                    xmview.showDialog(`确定要执行${msg}吗`, () => {
                        req({id: row.id}).then(() => {
                            xmview.showTip('success', '操作成功')
                            this.getTaskData()
                        })
                    })
                } else {
                    if (Date.parse(row.end_day) - Date.now() < 0) {
                        return xmview.showTip('error', '任务已过期，无法上线')
                    }
                    req = coursetaskService.publishCourseTask
                    msg = '上线'
                    if (row.is_published === 0) {
                        coursetaskService.getFrozenInfo(row.id).then(ret => {
                            this.productModel.showDialog = true
                            this.productModel.type = 'line'
                            this.productModel.data = ret.data
                            this.productModel.id = row.id
                        })
                    } else {
                        xmview.showDialog(`确定要执行${msg}吗`, () => {
                            req({id: row.id}).then(() => {
                                xmview.showTip('success', '操作成功')
                                this.getTaskData()
                            })
                        })
                    }
                }
            },
            submit () {
                if (this.productModel.type === 'line') {
                    coursetaskService.publishCourseTask({id: this.productModel.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.productModel.showDialog = false
                        this.getTaskData()
                    })
                } else {
                    coursetaskService.timingPublish({id: this.productModel.id, start_time: this.productModel.start_time}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.productModel.showDialog = false
                        this.getTaskData()
                    })
                }
            },
            timingDialogFn (row) {
                this.timingDialog = true
                this.timingDialogSubmit = (start_time) => {
                    if (row.is_published === 0) {
                        return coursetaskService.getFrozenInfo(row.id).then(ret => {
                            this.productModel.showDialog = true
                            this.productModel.type = 'time'
                            this.productModel.start_time = start_time
                            this.productModel.data = ret.data
                            this.productModel.id = row.id
                        })
                    } else {
                        return coursetaskService.timingPublish({id: row.id, start_time: start_time}).then(() => {
                            row.status = 2
                            row.start_time = start_time
                            xmview.showTip('success', '操作成功')
                        })
                    }
                }
            },
            deleteTask (row) {
                xmview.showDialog(`确定要删除<span style="color:red;">${row.title}</span>`, () => {
                    coursetaskService.deleteCourseTask({id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.getTaskData()
                    })
                })
            }
        }
    }
</script>
