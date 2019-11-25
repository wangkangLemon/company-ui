<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";
    @import "~utils/mixins/showDetail";
    #test-comment-container {
        @extend %content-container;
        border: none;
        .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }
            .add {
                background: rgb(0, 204, 255);
            }
            .catmange {
                background: rgb(153, 102, 204);
            }
        }
    }
    #comment-content-container {
        .el-form-item{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
    }
</style>
<template>
    <section id="test-comment-container">
        <div id="comment-content-container">
            <el-form :inline="true" :model="fetchParam" class="search">
                <el-form-item label="课程名称">
                    <el-input v-model="fetchParam.course_name" placeholder="请输入课程名称" @keyup.enter.native="fetchData"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="fetchParam.user_name" placeholder="请输入用户名称" @keyup.enter.native="fetchData"></el-input>
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                        <el-option label="待审核" :value="0"></el-option>
                        <el-option label="不通过" :value="1"></el-option>
                        <el-option label="通过" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <DateRange title="发表时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                               @changeStart="val=> {fetchParam.time_start=val}"
                               @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
                    </DateRange>
                </el-form-item>
            </el-form>
            
             <el-table class="data-table" v-loading="loadingData"
                      :data="data"
                      :fit="true"
                      @select="selectRow"
                      @select-all="selectRow"
                      border>
                <el-table-column
                    type="selection"
                    width="55"
                    :selectable="selectableFn">
                </el-table-column>
                <el-table-column
                    min-width="100"
                    prop="course_name"
                    label="课程名称">
                </el-table-column>
                <el-table-column
                    min-width="100"
                    prop="score"
                    label="课程评分">
                </el-table-column>
                <el-table-column
                    width="150"
                    label="课程评论"
                    prop="content">
                </el-table-column>
                <el-table-column
                    width="100"
                    prop="user_name"
                    label="用户名称">
                    <template slot-scope="scope">
                        <el-button @click="showUserInfo(scope.row.user_id)" type="text" size="small">{{scope.row.user_name }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    width="190"
                    prop="create_time"
                    label="评论发表时间">
                </el-table-column>
                <el-table-column
                    width="100"
                    label="当前状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
                        <el-tag v-if="scope.row.status === 1" type="danger">不通过</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="success">通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="150"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="recovery(scope.$index, scope.row)" type="text" size="small"
                                   :disabled="scope.row.can_edit === 0 || scope.row.status === 2">通过</el-button>
                        <el-button @click="del(scope.$index, scope.row)" type="text" size="small"
                                   :disabled="scope.row.can_edit === 0 || scope.row.status === 1">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-row class="utils-top-15">
                <el-col :span="12">
                    <el-button type='primary' @click="batchOperate(2)" :disabled="!selectedIds.length">批量通过</el-button>
                    <el-button type='warning' @click="batchOperate(1)" :disabled="!selectedIds.length">批量驳回</el-button>
                </el-col>
                <el-col :span="12">
                    <el-pagination
                        style="text-align: right"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="fetchParam.page_total">
                    </el-pagination>
                </el-col>
            </el-row>

            <el-dialog class="show-detail" title="员工信息" :visible.sync="showDetail">
                <div class="avatar">
                    <img :src="{url:clerkDetail.avatar, sex: clerkDetail.sex} | defaultAvatar" />
                </div>
                <div class="info">
                    <p><i class="title">姓名：</i><span class="value">{{clerkDetail.name}}</span></p>
                    <p><i class="title">所属门店：</i><span class="value">{{clerkDetail.dep_name}}</span></p>
                    <p><i class="title">职位：</i><span class="value">{{clerkDetail.job}}</span></p>
                    <p><i class="title">手机号：</i> <span class="value">{{clerkDetail.mobile}}</span></p>
                    <p>
                        <i class="title">状态：</i>
                        <span class="value">
                            <el-tag type="success" v-if="!clerkDetail.disabled">正常</el-tag>
                            <el-tag type="danger" v-else>异常</el-tag>
                        </span>
                    </p>
                    <p><i class="title">性别：</i> <span class="value">{{clerkDetail.sex ? '男' : '女'}}</span></p>
                    <p><i class="title">生日：</i> <span class="value">{{clerkDetail.birthday}}</span></p>
                    <p><i class="title">入职时间：</i> <span class="value">{{clerkDetail.join_time}}</span></p>
                    <p><i class="title">最后使用时间：</i> <span class="value">{{clerkDetail.last_active_time_name}}</span></p>
                    <p><i class="title">最后登录时间：</i> <span class="value">{{clerkDetail.last_login_time_name}}</span></p>
                    <p><i class="title">地址：</i> <span class="value">{{clerkDetail.address}}</span></p>
                    <p><i class="title">注册时间：</i><span class="value">{{clerkDetail.create_time_name}}</span></p>
                </div>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import {defaultAvatar} from 'utils/filterUtils'
    import testCommentService from 'services/server/comment/testCommentService'
    import userService from 'services/company/userService'
    import * as _ from 'utils/common'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                showDetail: false,
                fetchParam: this.newFetchParam(),
                clerkDetail: this.clearFn(),
                selectedIds: []
            }
        },
        activated () {
            this.fetchData()
        },
        created () {
        },
        filters: {
            defaultAvatar
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.status = (!fetchParam.status && fetchParam.status !== 0) ? -1 : fetchParam.status
                testCommentService.search(fetchParam).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    this.selectedIds = []
                    xmview.setContentLoading(false)
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            del (index, row) {
                this.$confirm('您是否确定驳回此评论？', '驳回', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testCommentService.updateCommentStatus(row.id, 1).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            recovery (index, row) {
                this.$confirm('通过后该评论将在评论区中显示，您是否确定通过该评论？', '通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return testCommentService.updateCommentStatus(row.id, 2).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            batchOperate (status) {
                let confirmMap = {
                    1: '您是否确定批量驳回选中的评论？',
                    2: '通过后该评论将在评论区中显示，您是否确定批量通过选中的评论？',
                }
                let tipMap = {
                    1: '批量驳回',
                    2: '批量通过',
                }
                this.$confirm(confirmMap[status], tipMap[status], {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    testCommentService.batch({
                        comment_id: this.selectedIds.join(','),
                        status
                    }).then(() => {
                        this.fetchData()
                    })
                })
            },
            newFetchParam () {
                return {
                    course_name: '',
                    user_name: '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            },
            // 用户信息
            showUserInfo (id) {
                this.showDetail = true
                userService.getUserInfo({id}).then((ret) => {
                    this.clerkDetail = ret.data
                })
            },
            selectableFn (row, index) {
                return !(row.can_edit === 0 || (row.status === 1 && row.status === 2))
            },
            clearFn () {
                return {
                    avatar: '',
                    name: '',
                    department_id: '',
                    dep_name: '',
                    sex: '',
                    job: '',
                    birthday: '',
                    join_time: '',
                    mobile: '',
                    passwd: '',
                    address: '',
                    last_login_time_name: '',
                    last_active_time_name: ''
                }
            }
        },
        components: {
            DateRange,
        }
    }
</script>
