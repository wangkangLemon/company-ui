<!--店员列表-->
<style lang="scss" rel='stylesheet/scss' scope>
    #user-container {
        .el-table .el-table__row {
            .cell {
                text-overflow: unset
            }
        }
        .operate {
            .el-input {
                width: 200px;
                float: right;
            }
            margin-bottom: 10px;
        }
        .tip {
            line-height: 50px;
            text-align: center;
            background: #FFEFB2;
            margin-top: 10px;
        }
        .el-pagination {
            margin-top: 20px;
            text-align: right;
        }
        .el-dialog {
            .el-table {
                margin-top: 20px;
            }
        }
        .block {
            float: right;
        }
        .btn__del {
            margin-top: 20px;
        }
    }
</style>
<template>
    <article id="user-container">
        <div class="operate">
            <el-button-group style="margin-right:10px;">
                <el-button :type="isActivity===0 || !isActivity?'primary':'default'" 
                    @click="fetchActivateUser(0)">全部员工</el-button>
                <el-button :type="isActivity===2?'primary':'default'" @click="fetchActivateUser(2)">未激活员工</el-button>
            </el-button-group>
            <el-button 
                icon="el-icon-plus" 
                type="primary" 
                @click="addUser" 
                :disabled="organization.isdep===0">
                新增员工
            </el-button>
            <el-button 
                icon="el-icon-document" 
                type="warning" 
                @click="exportExcel">
                导出Excel
            </el-button>
            <!-- <el-button v-if="!isActivity" @click="fetchActivateUser(2)">未激活员工</el-button>
            <el-button v-else @click="fetchActivateUser(0)">全部员工</el-button> -->
            <el-input
                placeholder="搜索员工姓名，手机号，工号"
                suffix-icon="el-icon-search"
                @keyup.enter.native="fetchData"
                style="width:249px;"
                v-model="fetchParam.keyword">
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
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column
                prop="name"
                label="员工姓名"
                min-width="120">
            </el-table-column>
            <el-table-column
                prop="staff_id"
                label="工号"
                width="90">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号"
                width="110">
            </el-table-column>
            <el-table-column
                prop="dep_name"
                min-width="150"
                label="所属门店">
            </el-table-column>
            <el-table-column
                width="100"
                prop="job"
                label="职位">
            </el-table-column>
            <el-table-column
                width="100"
                prop="join_time"
                label="入职时间">
            </el-table-column>
            <el-table-column
                width="100"
                prop="join_duration"
                label="工龄">
            </el-table-column>
            <el-table-column
                width="160"
                prop="last_active_time_name"
                label="最后使用时间">
            </el-table-column>
            <el-table-column
                prop="address"
                width="150"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showDetailFn(scope.row.id)">详情</el-button>
                    <el-button type="text" size="small" @click="editUser(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="block"
            @size-change="val=>{fetchParam.page_size = val;fetchData()}"
            @current-change="val=>{fetchParam.page = val;fetchData()}"
            :current-page="fetchParam.page"
            :page-sizes="[15, 30, 60, 100]"
            :page-size="fetchParam.page_size"
            layout="total, sizes, prev, pager, next"
            :total="total">
        </el-pagination>
        <!-- <el-button type="warning" :disabled="selectedIds.length===0" @click="moveFn">移动到</el-button> -->
        <el-button type="danger" class="btn__del" :disabled="selectedIds.length===0" @click="deleteMulit">批量删除</el-button>
        <!--新增员工 弹窗-->
        <AddUserDialog
            v-if="dialogShow"
            :visible.sync="dialogShow"
            :title="dialogTitle"
            ref="addUser"
            :form="form"
            @submit="submitUser">
        </AddUserDialog>
<!--         <el-dialog title="未激活员工" :visible.sync="dialogUserList">
            <UserDialog :condition="condition"></UserDialog>
        </el-dialog> -->
        <!--选择门店树-->
<!--         <el-dialog :visible.sync="chooseDepDialog" title="选择所在门店">
            <CompanyTree v-on:nodeClick="nodeClick"
                         v-model="dataList"
                         :isSelect="false"
                         :operate="false"
                         :isSearch="false"></CompanyTree>
        </el-dialog> -->
        <!--移动到-->
        <MoveTreeDialog
            v-if="operateTreeDialog"
            :visible.sync="operateTreeDialog"
            v-model="companyTreeData"
            :currentNode="organization"
            :load="load"
            @success="fetchData">
        </MoveTreeDialog>
        <!-- 员工信息 -->
        <UserDetailDialog
            ref="userDetail"
            :visible.sync="showDetail">
        </UserDetailDialog>
    </article>
</template>
<script>
    import userService from 'services/company/userService'
    import organizationService from 'services/company/organizationService'
    import UserDialog from './UserDialog.vue'
    import MoveTreeDialog from './MoveTreeDialog.vue'
    import AddUserDialog from './AddUserDialog.vue'
    import CompanyTree from '../../../component/tree/CompanyTree.vue'
    import UserDetailDialog from 'components/dialog/UserDetailDialog.vue'
    import {date2Str} from 'utils/timeUtils'
    import {defaultAvatar} from 'utils/filterUtils'
    export default {
        filters: {
            defaultAvatar
        },
        components: {
            UserDialog,
            CompanyTree,
            AddUserDialog,
            MoveTreeDialog,
            UserDetailDialog
        },
        props: {
            organization: Object,
            load: Function,
            isactivity: {
                default: ''
            }
        },
        watch: {
            'organization.id' (val) {
                this.fetchParam.organization_id = val
                this.fetchData()
            }
        },
        computed: {},
        created () {
            this.fetchDataInit()
        },
        data () {
            return {
                operateTreeDialog: false, // 移动员工弹窗
                selectedIds: [],
                showDetail: false,
                clerkDetail: clearFn(),
                companyTreeData: [], // 树的数据
                chooseDepDialog: false, // 选择所在门店
                condition: {}, // 搜索条件
                dialogUserList: false, // 是否显示员工列表
                loading: false,
                data: [],
                total: 0,
                dialogShow: false,
                dialogTitle: '新增员工',
                form: clearFn(),
                fetchParam: {
                    organization_id: this.organization.id || 0,
                    is_activity: 0,
                    keyword: '',
                    page: 1,
                    page_size: 15,
                },
                isActivity: this.isactivity,
            }
        },
        methods: {
            fetchDataInit() {
                if(this.isactivity) {
                    this.fetchParam.is_activity = this.isactivity
                }
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                return organizationService.getOrganizationUser(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            fetchActivateUser (type) {
                this.isActivity = type
                this.fetchParam.is_activity = type
                this.fetchData()
            },
            moveFn () {
                if (this.selectedIds.length < 1) {
                    xmview.showTip('error', '请选择移动项')
                    return
                }
                this.operateTreeDialog = true
            },
            saveMoveData (data) {
                if (data.type !== 2) {
                    xmview.showTip('error', '不能选择部门或连锁')
                    return
                }
                // 获取上级部门数据
                let pid
                data.type === 0 ? pid = 0 : pid = data.id
                userService.moveUser({id: this.selectedIds.toString(), pid}).then(() => {
                    this.operateTreeDialog = false
                    this.fetchData()
                })
            },
            addUser () {
                this.form = clearFn()
                this.form.department_id = this.organization.id
                this.form.dep_name = this.organization.name
                this.dialogShow = true
                this.dialogTitle = '新增员工'
            },
            submitUser () {
                let msg
                let reqFn
                if (this.form.id) {
                    msg = '修改成功'
                    reqFn = userService.updateUser
                } else {
                    msg = '添加成功'
                    reqFn = userService.addUser
                }
                this.form.join_time = date2Str(this.form.join_time)
                this.form.birthday = date2Str(this.form.birthday)
                reqFn(this.form).then(() => {
                    xmview.showTip('success', msg)
                    this.fetchData()
                    this.dialogShow = false
                })
            },
            editUser (row) {
                this.dialogShow = true
                // this.form = clone(row)
                userService.getUserInfo({id: row.id}).then((ret) => {
                    this.form = Object.assign(this.form, ret.data)
                })
                this.dialogTitle = '修改员工信息'
            },
            // 详情
            showDetailFn (id) {
                this.$refs.userDetail.fetchData(id).then(() => {
                    this.showDetail = true
                })
            },
            // 删除单个用户
            deleteUser (id) {
                xmview.showDialog('确定要删除该员工', () => {
                    userService.deleteUser({id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.fetchData()
                        // this.$emit('delSuccess')
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '删除失败')
                    })
                })
            },
            // 批量删除
            deleteMulit () {
                if (this.selectedIds.length < 1) {
                    xmview.showTip('error', '请选择要删除的选项')
                    return
                }
                xmview.showDialog('确定要批量删除吗？', () => {
                    userService.batchDelete({id: [...this.selectedIds].toString()}).then(ret => {
                        let index = ret.manager ? 0 : 1
                        let message = [
                            {
                                type: 'warning',
                                tip: `${ret.manager}为管理员，不可删除`
                            },
                            {
                                type: 'success',
                                tip: '批量删除成功'
                            }
                        ]
                        xmview.showTip(message[index]['type'], message[index]['tip'])
                        this.fetchData()
                        this.$emit('delSuccess')
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '批量删除失败')
                    })
                })
            },
            selectFn (selection) {
                this.selectedIds = []
                selection.forEach((item) => {
                    this.selectedIds.push(item.id)
                })
            },
            exportExcel () {
                userService.organizationExport(this.fetchParam).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '失败')
                })
            },
        }
    }
    function clearFn () {
        return {
            avatar: '',
            name: '',
            staff_id: '',
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
</script>
