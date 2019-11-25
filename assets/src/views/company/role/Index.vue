<style lang="scss" rel="stylesheet/scss">
    @import "~utils/mixins/showDetail";
    @import "~utils/mixins/mixins";
    // @import "../../../utils/mixins/common";
    #company-role {
        padding: 20px;
        background: #fff;
        display: flex;
        // .top-btn {
        //     @extend %right-top-btnContainer;
        // }
        .left-container {
            // width: 250px;
            width: 20%;
            .category {
                border: 1px solid #d1dbe5;
                padding-left: 10px;
                margin-top: 10px;
                margin-right: 10px;
                line-height: 30px;
                h2 {
                    i {
                        margin-right: 10px;
                    }
                    font-size: 16px;
                    &:first-of-type {
                        margin-top: 10px;
                    }
                }
                p {
                    margin-left: -10px;
                    cursor: pointer;
                    font-size: 14px;
                    padding-left: 20px;
                    i {
                        margin-right: 10px;
                    }
                    .el-dropdown {
                        display: none;
                        float: right;
                        color: #20A0FF;
                        padding-right: 10px;
                    }
                }
                .active {
                    background-color: #edf7ff;
                }
            }
        }
        .right-container {
            flex-grow: 1;
            width: 80%;
            .operate {
                @include clearFloatByAfter();
                // padding: 10px 0;
                .el-input {
                    float: right;
                    width: 200px;
                }
                margin-bottom: 10px;
            }
            .el-pagination {
                float: right;
                margin-top: 20px;
            }
        }
        .el-tabs--card {
            width: 100%;
        }
    }
</style>
<template>
    <article id="company-role">
        <section class="left-container">
            <div class="button-group">
                <el-button type="primary" @click="addAdminFn">添加管理员</el-button>
                <el-button type="success" @click="addRoleFn">新增角色</el-button>
            </div>
            <div class="category" v-loading="treeLoading">
                <h2><i class="fa fa-folder" aria-hidden="true"></i>系统默认角色</h2>
                <p @click="()=>{fetchData(item.id);currentNode=item}" v-for="(item,index) in sysList" :key="index" :class="{active: currentNode.id === item.id}">
                    <!-- <i class="fa fa-circle-o"></i>{{item.role_name}}（{{item.user_count}}人） -->
                    <i class="fa fa-circle-o"></i>{{item.role_name}}
                </p>
                <h2><i class="fa fa-folder" aria-hidden="true"></i>自定义角色</h2>
                <div class="customs">
                    <p @click="customsClickFn($event, item)" v-for="(item,index) in customsList" :key="index" :class="{active: currentNode.id === item.id}">
                        <i class="fa fa-circle-o"></i>
<!--                         <el-tooltip :content="item.role_name" placement="left" effect="light" v-if="item.role_name.length>8">
                            <span>{{truncateStr(item.role_name, 8, 4)}}（{{item.user_count}}人)</span>
                        </el-tooltip> -->
                        <!-- <span>{{truncateStr(item.role_name, 8, 4)}}（{{item.user_count}}人)</span> -->
                        <span>{{truncateStr(item.role_name, 8, 4)}}</span>
                        <el-dropdown @command="tranfer($event, item, index)">
                            <span class="el-dropdown-link">编辑</span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="edit">编辑角色</el-dropdown-item>
                                <el-dropdown-item command="delete">删除角色</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </p>
                </div>
            </div>
        </section>
        <section class="right-container">
            <!-- <h2>店长（34人）</h2> -->
            <div class="operate">
                <el-button><a :href="fileUrl" target="_blank">默认角色权限</a></el-button>
                <el-button type="warning" class="top-btn" icon="el-icon-document" @click="fileExport">导出Excel</el-button>
                <el-button type="primary" @click="fileImport" v-operation="auth.com_department_import_manager">导入门店管理员</el-button>
                <!-- <el-button type="danger" @click="deleteMulit">批量删除</el-button> -->
                <el-input
                        placeholder="搜索员工姓名，手机号"
                        suffix-icon="el-icon-search"
                        @keyup.enter.native="fetchData('')"
                        v-model="fetchParams.keyword">
                </el-input>
            </div>
            <el-table
                    @selection-change="selectFn"
                    v-loading="loading"
                    tooltip-effect="dark"
                    ref="multipleTable"
                    border
                    :data="data"
                    stripe>
<!--                 <el-table-column
                        type="selection"
                        width="55">
                </el-table-column> -->
                <el-table-column
                    prop="name"
                    label="员工姓名"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="staff_id"
                    label="工号"
                    width="93">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号"
                    width="110">
                </el-table-column>
                <el-table-column
                    min-width="200"
                    prop="department_name"
                    label="所属门店">
                </el-table-column>
                <el-table-column
                    width="100"
                    prop="join_time"
                    label="入职时间">
                </el-table-column>
                <el-table-column
                    width="80"
                    prop="join_duration"
                    label="工龄">
                </el-table-column>
                <el-table-column
                    prop="last_login_time_name"
                    width="180"
                    label="上次登录时间">
                </el-table-column>
                <!-- <el-table-column
                        prop="disabled"
                        width="120"
                        label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.disabled === 0" type="success">启用</el-tag>
                        <el-tag v-else type="info">禁用</el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column
                        fixed="right"
                        width="150"
                        prop="address"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="showDetailFn(scope.row)">
                            详情
                        </el-button>
                        <el-button 
                            v-operation="auth.com_rbac_role_admin_update" 
                            type="text" 
                            size="small" 
                            @click="editAdminFn(scope.row)">
                            修改
                        </el-button>
                        <!-- <el-button type="text" @click="disableAdmin(scope.row)">{{scope.row.disabled ? '启用' : '禁用'}}</el-button> -->
                        <el-button 
                            v-operation="auth.com_rbac_role_admin_delete" 
                            type="text" 
                            size="small" 
                            @click="deleteAdmin(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="(val)=>{fetchParams.page_size = val;fetchData(currentNode.id)}"
                @current-change="(val)=>{fetchParams.page = val;fetchData(currentNode.id)}"
                :current-page="fetchParams.page"
                :page-size="fetchParams.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
        </section>
        <!-- 选择用户 -->
        <ChooseUser
            v-if="showChooseUser"
            v-model="showChooseUser"
            @result="getChooseUser">
        </ChooseUser>
        <!--添加管理员-->
        <AddAdminDialog
            ref="addAdmin"
            v-model="chooseDepDialog"
            v-if="admin.showAddAdmin"
            :showChooseUser.sync="showChooseUser"
            :visible.sync="admin.showAddAdmin"
            :admin="admin"
            :rangeList="rangeList"
            :load="loadAdminTreeService"
            :defaultTopNode="initDefaultTopNode"
            @submit="submitAdmin">
        </AddAdminDialog>
        <!--新增角色-->
        <AddRoleDialog
            ref="addRole"
            v-if="role.showAddRole" 
            :visible.sync="role.showAddRole"
            :role="role"
            @submit="submitRole">
        </AddRoleDialog>
        <!--选择门店树-->
        <el-dialog :visible.sync="chooseDepDialog" title="选择所在门店">
            <CompanyTree 
                v-model="rangeList"
                :load="loadAdminTreeService"
                :expandOnClickNode="true"
                :defaultTopNode="initDefaultTopNode"
                :defaultExpandedKeys="[0]"
                @currentNode="chooseDepFn">
            </CompanyTree>
        </el-dialog>
        <!-- 管理员信息 -->
        <AdminDetail
            v-if="admin.showDetail"
            :visible.sync="admin.showDetail"
            :admin="admin">
        </AdminDetail>
        <!-- 导入店长 -->
        <LocalImportDialog
            ref="localImportDialog"
            title="导入门店管理员"
            :uploadUrl="uploadUrl"
            :templateUrl="templateUrl"
            @success="importSuccess">
            <article slot="footer">
                <hr style="margin-bottom: 15px;">
                <h5>注意事项：</h5>
                <h5>1.模板中字段轻对照填写，不能为空</h5>
                <h5>2.如果有某些内容为空，导入时将跳过</h5>
            </article>
        </LocalImportDialog>
    </article>
</template>
<script>
    import organizationService from 'services/company/organizationService'
    import adminService from 'services/company/adminService'
    import roleService from 'services/company/roleService'
    import departmentService from 'services/company/departmentService'
    import CompanyTree from '../../component/tree/CompanyTree.vue'
    import ChooseUser from './component/ChooseUser.vue'
    import AddAdminDialog from './component/AddAdminDialog.vue'
    import AddRoleDialog from './component/AddRoleDialog.vue'
    import AdminDetail from './component/AdminDetail.vue'
    import LocalImportDialog from '@/views/exam/component/LocalImportDialog.vue'
    import * as _ from 'utils/common'

    export default {
        components: {
            CompanyTree,
            ChooseUser,
            AddAdminDialog,
            AddRoleDialog,
            AdminDetail,
            LocalImportDialog
        },
        data () {
            let validateMobile = (rule, value, callback) => {
                if (!(value || '').match(/^1[345789]\d{9}$/)) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }
            let validateUserID = (rule, value, callback) => {
                // console.log('vv', parseInt(value, 10), this.admin.form.name);
                if (parseInt(value, 10) == 0 && this.admin.form.name == '') {
                    callback(new Error('请输入管理员名称或选择已有店员'))
                } else {
                    callback()
                }
            }
            let validatePass = (rule, value, callback) => {
                if (value === '' && this.admin.form.user_id == 0) {
                    callback(new Error('请输入管理员密码'))
                } else {
                    callback()
                }
            }
            return {
                fileUrl: roleService.getFile(),
                uploadUrl: departmentService.getManagerUploadUrl(),
                templateUrl: departmentService.getManagerTemplateUrl(),
                showChooseUser: false, // 选择则员工
                chooseDepDialog: false,
                treeLoading: false,
                rangeList: [], // 管理范围数据
                loading: false,
                treeList: [], // 权限树
                customsList: [], // 自定义角色树
                sysList: [], // 系统角色树
                data: [], // table数据
                currentNode: {},
                admin: {
                    selectedIds: [],
                    showDetail: false,
                    clerkDetail: clearAdminFn(),
                    allRole: [], // 角色分配 所有启用的角色
                    addAdminTitle: '添加管理员',
                    showAddAdmin: false,
                    form: clearAdminFn(),
                    defaultCheckeds: [],
                    defaultExpandedKeys: [],
                    rules: {
                        user_id: { required: true, validator: validateUserID, trigger: 'change' },
                        // passwd: {validator: validatePass, trigger: 'change'},
                        roles: { required: true, message: '请填分配角色' },
                        department_name: { required: true, message: '选择门店', trigger: 'change' },
                        mobile: [
                            { required: true, message: '必须填写', trigger: 'blur' },
                            { validator: validateMobile, trigger: 'blur' }
                        ]
                    }
                },
                role: {
                    addRoleTitle: '新增角色',
                    showAddRole: false,
                    permissionList: [],
                    form: {
                        description: '',
                        role_name: '',
                        ids: ''
                    },
                    defaultCheckeds: [3],
                    rules: {
                        role_name: {required: true, message: '请填写角色名称'},
                        description: {required: true, message: '请填写角色描述'},
//                      ids: {type: 'string', required: true, message: '请选择权限', trigger: 'change'},
                    }
                },
                fetchParams: {
                    keyword: '',
                    page: 1,
                    page_size: 15
                },
                total: 0,
            }
        },
        created () {
            this.treeLoading = true
            this.getAllRoles().then(() => {
                xmview.setContentLoading(false)
            })
            this.fetchData()
        },
        methods: {
            // 获取选择的员工
            getChooseUser (item) {
                this.admin.form.name = item.name
                this.admin.form.user_id = item.id
                this.admin.form.department_name = item.dep_name
                this.admin.form.department_id = item.department_id
                this.admin.form.mobile = item.mobile
                this.showChooseUser = false
            },
            getAllRoles () {
                return roleService.getAllRolls().then((ret) => {
                    this.customsList = ret.customs
                    this.sysList = ret.syss
                    this.sysList.unshift(this.sysList.pop())
                    this.treeLoading = false
                })
            },
            addRoleFn () {
                this.role.form = {
                    description: '',
                    role_name: '',
                    ids: ''
                }
                this.role.defaultCheckeds = []
                this.role.showAddRole = true
                this.$nextTick(() => {
                    this.$refs.addRole.$refs.roleForm.resetFields()
                })
            },
            tranfer (e, row, index) {
                if (e === 'edit') {
                    // 获取角色信息
                    this.role.addRoleTitle = '修改角色'
                    roleService.roleInfo({role_id: row.id}).then((ret) => {
                        this.role.form = ret.role
                        this.role.defaultCheckeds = ret.to
                        this.role.form.ids = ret.to === null ? '' : ret.to.toString()
                        this.role.showAddRole = true
                    })
                } else {
                    roleService.deleteRoll({role_id: row.id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getAllRoles()
                    })
                }
            },
            // 新增或修改角色
            submitRole () {
                let keys = this.$refs.addRole.$refs.permissionTree.getCheckedKeys()
                this.role.form.ids = keys.length < 1 ? '' : keys.toString()
                let msg = '添加成功'
                let reqFn = roleService.addRoll
                if (this.role.form.id) {
                    msg = '修改成功'
                    reqFn = roleService.updateRoll
                }
                reqFn(this.role.form).then((ret) => {
                    xmview.showTip('success', msg)
                    this.getAllRoles()
                    this.role.showAddRole = false
                })
            },
            customsClickFn (e, item) {
                let ps = document.querySelector('.customs').querySelectorAll('p')
                ps.forEach((item) => {
                    item.querySelector('.el-dropdown').style.display = 'none'
                })
                e.currentTarget.querySelector('.el-dropdown').style.display = 'block'
                this.currentNode = item
                this.fetchData(item.id)
            },
            // admin树的获取
            loadAdminTreeService (param) {
                return organizationService.getOrganizationTree(param).then(ret => {
                    return ret
                })
            },
            // 获取数据
            fetchData (id = '') {
                adminService.adminSearch({
                    role_id: id,
                    keyword: this.fetchParams.keyword,
                    page: this.fetchParams.page,
                    page_size: this.fetchParams.page_size
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                })
            },
            // 添加管理员的时候选择门店树
            chooseDepFn (data) {
                if (data.has_children) {
                    return
                }
                if (data.isdep === 0) {
                    xmview.showTip('error', '不能选择部门或连锁')
                    return
                }
                this.admin.form.department_name = data.name
                this.admin.form.department_id = data.id
                this.chooseDepDialog = false
            },
            // 显示详情
            showDetailFn (row) {
                this.admin.showDetail = true
                // this.admin.clerkDetail = row
                adminService.adminInfo({id: row.user_id}).then((ret) => {
                    this.admin.clerkDetail = ret.data
                })
            },
            // 添加管理员
            addAdminFn () {
                this.admin.form = clearAdminFn()
                this.admin.defaultCheckeds = []
                this.admin.defaultExpandedKeys = []
                this.admin.showAddAdmin = true
                this.admin.addAdminTitle = '添加管理员'
                this.$nextTick(() => {
                    this.$refs.addAdmin.$refs.adminForm.resetFields()
                })
                this.fetchAdminData()
            },
            fetchAdminData () {
                // 获取所有启用角色
                return roleService.getAllUseRolls().then((ret) => {
                    this.admin.allRole = ret.data
                })
            },
            // 修改管理员
            editAdminFn (row) {
                xmview.setContentLoading(true)
                Promise.all([adminService.adminInfo({id: row.user_id}), this.fetchAdminData()]).then(ret => {
                    this.admin.showAddAdmin = true
                    this.admin.addAdminTitle = '修改管理员'
                    xmview.setContentLoading(false)
                    this.$nextTick(() => {
                        // this.$refs.addAdmin.$refs.adminForm.resetFields()
                        this.admin.form.roles = ret[0].data.role_id || []
                        this.admin.form.department_name = ret[0].data.dep_name
                        this.admin.form.name = ret[0].data.name
                        this.admin.form.mobile = ret[0].data.mobile
                        this.admin.form.id = this.admin.form.user_id = ret[0].data.id
                        this.admin.form.department_id = ret[0].data.department_id
                        this.admin.defaultCheckeds = ret[0].data.departments || []
                        this.admin.defaultExpandedKeys = ret[0].data.parent_departments || []
                        this.admin.form.passwd = ''

                    })
                }).catch(err => {
                    console.log(err)
                    xmview.setContentLoading(false)
                })
            },
            deleteAdmin (row) {
                xmview.showDialog(`是否要删除${row.name}`, () => {
                    adminService.deleteAdmin({id: row.user_id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.fetchData(this.currentNode.id)
                        this.getAllRoles()
                    })
                })
            },
            // 批量删除
            deleteMulit () {
                if (this.admin.selectedIds.length < 1) {
                    xmview.showTip('error', '请选择要删除的选项')
                    return
                }
                xmview.showDialog('确定要批量删除吗？', () => {
                    adminService.batchDelete({id: this.admin.selectedIds.join(',')}).then(() => {
                        xmview.showTip('success', '批量删除成功')
                        this.fetchData(this.currentNode.id)
                    })
                })
            },
            selectFn (selection) {
                this.admin.selectedIds = []
                selection.forEach((item) => {
                    this.admin.selectedIds.push(item.user_id)
                })
            },
            disableAdmin (row) {
                let name = row.disabled ? '启用' : '禁用'
                xmview.showDialog(`是否要${name}<span style="color:red">${row.name}</span>`, () => {
                    adminService.disableAdmin({id: row.user_id, disabled: row.disabled ? 0 : 1}).then(() => {
                        xmview.showTip('success', `${name}成功`)
                        this.fetchData(this.currentNode.id)
                    })
                })
            },
            submitAdmin (datas) {
                let form = _.clone(this.admin.form)
                let supperRole = false
                if (form.roles && form.roles.indexOf(201) > -1) {
                    supperRole = true
                }
                if (!supperRole && datas.length < 1) {
                    xmview.showTip('error', '请选择管理范围')
                    return
                }
                datas.forEach((item) => {
                    if (item.id !== 0 && item.id !== -1) {
                        form.departments.push({
                            level: item.type,
                            department_id: item.id,
                            isdep: item.isdep
                        })
                    }
                })
                form.departments = JSON.stringify(form.departments)
                form.roles = form.roles.toString()
                let msg = '添加成功'
                let reqFn = adminService.addAdmin
                if (form.id) {
                    msg = '修改成功'
                    reqFn = adminService.updateAdmin
                }
                reqFn(form).then((ret) => {
                    xmview.showTip('success', msg)
                    this.fetchData(this.currentNode.id)
                    this.getAllRoles()
                    this.admin.showAddAdmin = false
                })
            },
            fileExport () {
                adminService.fileExport({
                    role_id: this.currentNode.id || '',
                    keyword: this.fetchParams.keyword
                }).then((ret) => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            fileImport () {
                this.$refs['localImportDialog'].open()
            },
            importSuccess () {
                if (this.currentNode.id === 202) this.fetchData(this.currentNode.id)
            },
            initDefaultTopNode () {
                return [
                    {
                        has_children: true,
                        id: 0,
                        isdep: 0,
                        name: this.userInfo.company,
                        pid: 0,
                        godPid: 0,
                    }
                ]
            },
        }
    }

    function clearAdminFn () {
        return {
            user_id: 0,
            roles: [],
            departments: [],
            name: '',
            department_id: 0,
            department_name: '',
            mobile: '',
            passwd: '',
        }
    }
</script>
