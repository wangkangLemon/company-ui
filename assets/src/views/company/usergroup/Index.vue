<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #company-usergroup-container {
        @extend %content-container;
        padding: 19px;
        .usergroup-search {
            width:100%;
            margin-bottom:10px;
        }
        .search {
            @extend %top-search-container;
            margin-bottom: 10px;
            .el-input {
                float: right;
                width: 200px;
            }
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
        .block2 {
            @extend .block;
            float: left;
        }
        .customtree__node {
            position: relative;
            width: 100%;
            .customtree__node--operation {
                position: absolute;
                right: 5px;
                bottom: -10px;
            }
        }
        .tree {
            overflow: auto;
            height: 400px;
            width: 100%;
        }
    }
    .el-popover--custom {
        min-width: 100px;
        .operate__btngroup {
            margin: 0;
            text-align: center;
        }
    }
</style>

<template>
    <main id="company-usergroup-container">
        <section>
            <!-- 内容主体 -->
        </section>
        <el-row :gutter="10">
            <el-col :span="5">
                <aside class="xm_left_container">
                    <el-button style="margin-bottom: 7px;" icon="el-icon-plus" type='primary' size="full" @click="openUserGroupDialog('add', '新建用户组')">新建用户组</el-button>
                        <!-- 搜索条件 -->
                        <section class="usergroup-search">
                            <el-input
                                v-model="fetchGroupParam.keyword"
                                placeholder="请输入用户组"
                                suffix-icon="el-icon-search"
                                @keyup.enter.native="fetchGroupData">
                            </el-input>
                        </section>
                    <el-tree 
                        id="usergroup_tree"
                        class="tree"
                        v-loading="groupLoading"
                        :data="groupData"
                        ref="groupTree"
                        highlight-current
                        :props="groupTreeProps"
                        @current-change="groupTreeClick"
                        :render-content="renderContent">
                    </el-tree>
                       <!--  @node-click="groupTreeClick2" -->
                </aside>
            </el-col>
            <el-col :span="19">
                <aside class="xm_right_container">
                    <section class="search">
                        <!-- 搜索条件 -->
                        <!-- <el-button icon="plus" type='primary' @click="addToGroup">添加成员至用户组</el-button> -->
                        <el-button v-if="treeCaozuo.show" type="primary" 
                            @click="addToGroup()">添加用户</el-button>
                        <el-button icon="el-icon-document" type='warning' @click="exportExcel">导出Excel</el-button>
                        <el-input
                            v-model="fetchParam.keyword"
                            placeholder="搜索员工姓名，手机号"
                            suffix-icon="el-icon-search"
                            @keyup.enter.native="fetchData">
                        </el-input>
                    </section>
                    <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
                    <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
                    <!-- 固定列通过配置fixed="right || left"-->
                    <el-table 
                        class="data-table" 
                        v-loading="loading" 
                        :data="data" 
                        :fit="true" 
                        border
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column 
                            label="员工姓名" 
                            prop="name" 
                            width="93">
                        </el-table-column>
                        <el-table-column
                            prop="staff_id"
                            label="工号"
                            min-width="100">
                        </el-table-column>
                        <el-table-column 
                            label="手机号" 
                            prop="mobile" 
                            width="125">
                        </el-table-column>
                        <el-table-column 
                            label="所属门店" 
                            prop="dep_name"
                            min-width="150">
                        </el-table-column>
                        <el-table-column 
                            label="职位" 
                            prop="job"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            width="110"
                            prop="join_time"
                            label="入职时间">
                        </el-table-column>
                        <el-table-column
                            width="80"
                            prop="join_duration"
                            label="工龄">
                        </el-table-column>
                        <el-table-column 
                            label="最后使用时间" 
                            prop="last_login_time_name"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作" 
                            prop="operate" 
                            width="165">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="showUserDetail(scope.row.id)">详情</el-button>
                                <el-button 
                                    v-if="groupNode"
                                    type="text" 
                                    size="small" 
                                    @click="moveOutGroup(scope.row.id)" 
                                    :disabled="creatorDisabled(groupNode && groupNode.creator_id)">
                                    移出用户组
                                </el-button>
                                <el-button 
                                    v-else
                                    type="text" 
                                    size="small" 
                                    @click="openMoveInGroup(scope.row.id)" 
                                    :disabled="creatorDisabled(groupNode && groupNode.creator_id)">
                                    移入用户组
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <template v-if="!creatorDisabled(groupNode && groupNode.creator_id)">
                        <el-button 
                            type='primary' 
                            class="block2" 
                            @click="batchDel" 
                            :disabled="multipleSelection.length===0"
                            v-if="groupNode">
                            批量移出用户组
                        </el-button>
                        <el-button 
                            v-else
                            type='primary' 
                            class="block2" 
                            @click="openMoveInGroup" 
                            :disabled="multipleSelection.length===0">
                            批量移入用户组
                        </el-button>
                    </template>
                    <el-pagination class="block"
                        @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                        @current-change="val=> {fetchParam.page=val; fetchData()}"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="sizes, total, prev, pager, next" 
                        :total="total">
                    </el-pagination>
                </aside>
            </el-col>
        </el-row>
        
        <!-- 用户组新增/详情/修改 -->
        <CreateGroupDialog
            v-if="showDialog.showUserGroupDialog"
            :title="dialogTitle"
            :visible.sync="showDialog.showUserGroupDialog"
            :id="fetchParam.group_id"
            :type="dialogType"
            @success="fetchGroupData">
        </CreateGroupDialog>
        <!-- 添加至用户组 -->
        <AddToGroupDialog 
            v-if="showDialog.showAddToGroupDialog"
            title="添加至用户组"
            :groupNode="groupNode"
            :visible.sync="showDialog.showAddToGroupDialog"
            @success="fetchData">
        </AddToGroupDialog>
        <MoveInGroupDialog
            :visible.sync="showDialog.moveInGroupDialog"
            :data="groupData.slice(1)"
            @submit="moveInGroup">
        </MoveInGroupDialog>
        <!-- 员工详情 -->
        <UserDetailDialog 
            v-if="showDialog.showUserDetailDialog"
            title="员工信息"
            :id="userDetailId"
            :visible.sync="showDialog.showUserDetailDialog">
        </UserDetailDialog>
    </main>
</template>

<script>
    import AddToGroupDialog from './component/AddToGroupDialog.vue'
    import CreateGroupDialog from './component/CreateGroupDialog.vue'
    import MoveInGroupDialog from './component/MoveInGroupDialog.vue'
    import UserDetailDialog from './component/UserDetailDialog.vue'
    import userService from 'services/company/userService'

    export default {
        components: {
            CreateGroupDialog,
            UserDetailDialog,
            AddToGroupDialog,
            MoveInGroupDialog
        },
        created () {
            this.fetchGroupData().then(group_id => {
                if (group_id !== 'no-group') {
                    this.fetchParam.group_id = group_id
                    this.$nextTick(() => {
                        document.body.querySelectorAll('#usergroup_tree')[0].children[0].classList.add('is-current')
                        this.groupTreeClick(this.groupData[0], 'firstNode')
                    })
                }
                xmview.setContentLoading(false)
            })
        },
        deactivated () {
            this.groupNode = null
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                groupLoading: false,
                data: [],
                groupData: [],
                groupNode: null,
                groupTreeProps: {
                    label: 'name'
                },
                total: 0,
                showDialog: {
                    showUserGroupDialog: false,
                    showAddToGroupDialog: false,
                    showUserDetailDialog: false,
                    moveInGroupDialog: false,
                },
                currId: '',
                showOperation: false,
                dialogType: '',
                dialogTitle: '',
                fetchGroupParam: {
                    keyword: '',
                    page_size: 0,
                },
                fetchParam: {
                    group_id: '',
                    keyword: '',
                    page: 1,
                    page_size: 15,
                },
                userDetailId: '',
                multipleSelection: [],
                treeCaozuo: {
                    data:{},
                    show: false
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return userService.userGroupUserSearch(this.fetchParam).then(ret => {
                    this.data = ret.data || []
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            fetchGroupData () {
                this.groupLoading = true
                return userService.userGroupSearch(this.fetchGroupParam).then(ret => {
                    ret.data.unshift({
                        name :"未分组用户",
                        id: 0,
                    })
                    this.groupData = ret.data
                    this.groupLoading = false
                    return ret.data.length ? ret.data[0]['id'] : 'no-group'
                })
            },
            groupTreeClick (node, type) {
                if (type !== 'firstNode') {
                    // remove the class that dom doesn't have will not raise an error
                    document.body.querySelectorAll('#usergroup_tree')[0].children[0].classList.remove('is-current')
                }
                if (node.id) {
                    this.groupNode = node
                    this.treeCaozuo.show = true
                } else {
                    this.groupNode = null
                     this.treeCaozuo.show = false
                }
                this.fetchParam.group_id = node.id
                this.fetchData()
            },
            // groupTreeClick2 () {
            //     debugger
            // },
            openUserGroupDialog (type, title, group_id) {
                group_id && (this.fetchParam.group_id = group_id)
                this.showDialog.showUserGroupDialog = true
                this.dialogType = type
                this.dialogTitle = title
            },
            addToGroup () {
                if (!this.groupNode) {
                    xmview.showTip('warning', '请选择用户组')
                    return
                }
                this.showDialog.showAddToGroupDialog = true
            },
            showUserDetail (id) {
                this.showDialog.showUserDetailDialog = true
                this.userDetailId = id
            },
            moveOutGroup (user_id) {
                xmview.showDialog('是否要移除用户组?', () => {
                    let group_id = this.fetchParam.group_id
                    userService.batchGroupDelete({ user_id, group_id }).then(() => {
                        xmview.showTip('success', '成功')
                        this.fetchData()
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '失败')
                    })
                })
            },
            openMoveInGroup (user_id) {
                this.showDialog.moveInGroupDialog = true
                if (typeof user_id === 'number') {
                    this.currId = user_id
                } else {
                    this.currId = null
                }
            },
            moveInGroup (group_id) {
                let user_id = this.currId ? this.currId : this.multipleSelection.map(item => item.id).join(',')
                userService.bachMove({ user_id, group_id }).then(() => {
                    this.showDialog.moveInGroupDialog = false
                    this.fetchData()
                })
            },
            exportExcel () {
                userService.userGroupExport(this.fetchParam).then(()=> {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            batchDel () {
                this.$confirm('确定要移出吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let group_id = this.fetchParam.group_id
                    let user_id = this.multipleSelection.map(item => item.id).join(',')
                    userService.batchGroupDelete({ user_id, group_id }).then(() => {
                        xmview.showTip('success', '成功')
                        this.fetchData()
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '失败')
                    })
                })
            },
            deleteUserGroup (id) {
                if (this.data.length) {
                    return this.$message({
                        type: 'warning',
                        message: '该用户组下有员工，不能删除'
                    })
                }
                xmview.showDialog('是否删除该用户组?', () => {
                    userService.deleteUserGroup({id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.fetchGroupData()
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '失败')
                    })
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            renderContent (h, { node, data, store }) {
                // <el-button type="text" slot="reference">操作</el-button>
                // <el-button type="text" v-popover={{ name: 'v-popover', value: 'popover5' }}>操作</el-button>
                // if (this.groupNode.id!=node.id) {
                //     <el-button type="text" slot="reference" disabled>操作</el-button>
                // } else {
                //     <el-button type="text" slot="reference">操作</el-button>
                // }
                return (
                    <span class="customtree__node">
                        <span>
                            <span>{ this.truncateStr(node.label, 10) }</span>
                        </span>
                        <span class="customtree__node--operation">
                            <el-popover
                                popper-class="el-popover--custom"
                                ref="popover5"
                                placement="right"
                                trigger="hover">
                                <el-button type="text" slot="reference" v-show={this.groupNode && this.groupNode.id === data.id}>操作</el-button>
                                <div class="operate__btngroup">
                                    <el-button type="text" nativeOnClick={this.openUserGroupDialog.bind(this, 'detail', '用户组详情', data.id)}>详情</el-button>
                                </div>
                                <div class="operate__btngroup">
                                    <el-button type="text" nativeOnClick={this.openUserGroupDialog.bind(this, 'edit', '修改用户组', data.id)} disabled={this.creatorDisabled(data.creator_id)}>修改</el-button>
                                </div>
                                <div class="operate__btngroup">
                                    <el-button type="text" nativeOnClick={this.deleteUserGroup.bind(this, data.id)} disabled={this.creatorDisabled(data.creator_id)}>删除</el-button>
                                </div>
                                <div class="operate__btngroup">
                                    <el-button type="text" nativeOnClick={this.addToGroup.bind(this, data.id)} disabled={this.creatorDisabled(data.creator_id)}>添加用户</el-button>
                                </div>
                            </el-popover>
                        </span>
                    </span>
                )
            },
        },
        filters: {}
    }
</script>
