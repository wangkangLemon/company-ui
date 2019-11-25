<!--用户组-->
<style lang="scss" rel='stylesheet/scss'>
    @import "~utils/mixins/topSearch";
    #user-group {
        .operate {
            padding: 10px 0;
            .el-input {
                float: right;
                width: 200px;
            }
        }
        .el-pagination {
            float: right;
            margin-top: 20px;
        }
        .user-group-dialog {
            .search {
                @extend %top-search-container;
            }
            h2 {
                font-size: 14px;
                background: #ededed;
                color: #333;
                padding: 5px 10px;
                margin-bottom: 10px;
            }
        }
    }
</style>
<template>
    <article id="user-group">
        <div class="operate">
            <el-button type="primary" @click="addUserFn(0)">添加成员</el-button>
            <!--<el-button type="danger">批量删除</el-button>-->
            <el-input
                    placeholder="搜索员工，姓名/手机号"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData"
                    v-model="fetchParams.search">
            </el-input>
        </div>
        <el-table
                v-loading="loading"
                tooltip-effect="dark"
                ref="multipleTable"
                border
                :data="data"
                stripe>
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="员工姓名"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号"
                    width="180">
            </el-table-column>
            <el-table-column
                    min-width="180"
                    prop="dep_name"
                    label="所属门店">
            </el-table-column>
            <el-table-column
                    prop="job"
                    width="120"
                    label="职位">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="address"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="showDetailFn(scope.row)">详情</el-button>
                    <!--<el-button type="text">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="(val)=>{fetchParams.page_size = val;}"
                @current-change="(val)=>{fetchParams.page = val;}"
                :current-page="fetchParams.page"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="fetchParams.page_size"
                layout="total, sizes, prev, pager, next"
                :total="total">
        </el-pagination>
        <!--新增用户组 弹窗-->
        <el-dialog :visible.sync="dialogShow" 
                   :title="dialogTitle"
                   @open="dialogOpen"
                   size="small" 
                   class="user-group-dialog">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="用户组名称" prop="name">
                    <el-input :disabled="addUser" v-model="form.name" placeholder="例如：新入职员工"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input :disabled="addUser" v-model="form.description" placeholder="例如：2017年1月1日之后入职的员工"></el-input>
                </el-form-item>
                <h2 class="title">选择员工</h2>
                <div class="search">
                    <section>
                        <i>选择门店</i>
                        <Department v-model="department_id" :change="()=>{page=1;users=[];getAllUser();}"></Department>
                    </section>
                </div>
                <Transfer placeholder="搜索用户"
                          @searchFn="(val)=>{page=1;users=[];keyword=val;getAllUser();}"
                          @moreFn="()=>{page++;getAllUser();}" :total="usersTotal" 
                          :data="users" 
                          v-model="selectUser"></Transfer>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogShow=false">取消</el-button>
                <el-button type="primary" @click="submitUserGroup">保存</el-button>
            </div>
        </el-dialog>
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
    </article>
</template>
<script>
    import userService from 'services/company/userService'
    import Department from '../../../component/select/Department.vue'
    import Transfer from '../../../component/dialog/Transfer.vue'
    export default {
        components: {
            Department,
            Transfer
        },
        props: {
            organization: Object
        },
        watch: {
            organization (val) {
                this.organization = val
                this.fetchData()
            },
            selectUser (val) {
                this.selectUser = val
            },
        },
        data () {
            return {
                department_id: '', // 搜索门店条件
                showDetail: false,
                clerkDetail: {
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
                },
                loading: false,
                data: [],
                total: 0,
                dialogShow: false,
                dialogTitle: '用户组管理',
                addUser: false,
                users: [],
                selectUser: [],
                form: {
                    name: '',
                    description: '',
                    user_id: [], // 已选择的数据id的[1, 4]
                },
                fetchParams: {
                    search: '',
                    page: 1,
                    page_size: 15,
                },
                rules: {
                    name: {required: true, message: '必须填写用户组名称'},
//                    description: {required: true, message: '必须填写用户组描述'},
                },
                page: 1,
                page_size: 4,
                usersTotal: 0,
                keyword: ''
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            // 当弹窗显示的时候
            dialogOpen () {
                this.page = 1
                this.keyword = ''
                this.department_id = ''
                this.users = []
                // 获取全部员工
                this.getAllUser()
            },
            // 获取所有用户
            getAllUser () {
                userService.userSearch({
                    department_id: this.department_id,
                    page: this.page,
                    page_size: this.page_size,
                    keyword: this.keyword
                }).then((ret) => {
                    this.usersTotal = ret.total
                    if (this.users.length > 0 && this.users.length < ret.total) {
                        this.users.splice(-1, 1)
                    }
                    this.users.push(...ret.data, {id: -1})
                    this.users.forEach((item) => {
                        item.disabled = !!item.disabled
                    })
                })
            },
            fetchData () {
                this.loading = true
                return userService.userGroupUserSearch({
                    group_id: this.organization.id,
                    keyword: this.fetchParams.search,
                    page: this.fetchParams.page,
                    page_size: this.fetchParams.page_size
                }).then((ret) => {
                    this.loading = false
                    this.data = ret.rows
                    this.selectUser = ret.rows
                    this.total = ret.total
                })
            },
            addUserFn (type) {
                this.dialogShow = true
                this.addUser = true
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                    if (type) {
                        this.form = {
                            name: '',
                            description: '',
                            user_id: []
                        }
                    } else {
                        this.form.name = this.organization.name
                        this.form.description = this.organization.description
                    }
                })
            },
            editUserGroup () {
                // 清空已选数据
                this.form.user_id = []
                // 设置是否可编辑名称
                this.addUser = false
                // 文本框
                this.form.id = this.organization.id
                this.form.name = this.organization.name
                this.form.description = this.organization.description
                this.organization.user_id.split(',').forEach((item) => {
                    this.form.user_id.push(parseInt(item))
                })
                this.dialogShow = true
            },
            showDetailFn (row) {
                this.clerkDetail = row
                this.showDetail = true
            },
            submitUserGroup () {
                this.$refs.form.validate((valid) => {
                    if (!valid) return
                    this.form.user_id = []
                    this.selectUser.forEach((item) => {
                        this.form.user_id.push(item.id)
                    })
                    let msg
                    let reqFn
                    let type
                    let params = {
                        name: this.form.name,
                        description: this.form.description,
                        user_id: this.form.user_id.toString()
                    }
                    if (this.form.id) {
                        msg = '修改成功'
                        reqFn = userService.updateUserGroup
                        type = 1
                        params.id = this.form.id
                    } else {
                        msg = '添加成功'
                        reqFn = userService.addUserGroup
                        type = 0
                    }
                    reqFn(params).then((ret) => {
                        xmview.showTip('success', msg)
                        this.$emit('pushUserGroup', {
                            type, // 1 编辑 0 追加
                            data: {
                                name: this.form.name,
                                description: this.form.description,
                                id: this.form.id !== undefined ? this.form.id : ret.id,
                                user_id: this.form.user_id.toString()
                            }
                        })
                        this.dialogShow = false
                    })
                })
            },
            moveUserFn (keys) {
                this.form.user_id = keys
            }
        }
    }
</script>
