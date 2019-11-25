<!--组织架构-->
<style lang="scss" rel='stylesheet/scss'>
    #company-organization {
        padding: 20px;
        background: #fff;
        display: flex;
        -webkit-display: flex;
        .left-container {
            width: 25%;
            .button-group {
                .el-button {
                    margin-bottom: 10px;
                    text-align: left;
                }
                &.add-user-group-btn {
                    text-align: center;
                }
            }
            .company-tree {
                width: 100%;
                
            }
        }
        .right-container {
            flex-grow: 1;
            -webkit-flex-grow: 1;
            width: 74%;
            margin-left: 20px;
        }
        .el-tree {
            .edit {
                display: none;
            }
        }
    }
</style>

<template>
    <!--组织架构-->
    <article id="company-organization">
        <!--左侧容器-->
        <section class="left-container">
            <div class="button-group">
                <el-button type="primary" @click="fileImport(0)">导入门店</el-button>
                <el-button type="success" @click="fileImport(1)">导入员工</el-button>
            </div>
            <!--企业管理树-->
            <div class="company-tree">
                <CompanyTree
                    ref="companyTree"
                    v-model="companyTreeData"
                    :load="loadTreeService"
                    :operate="true"
                    :isSearch="true"
                    :isSearching.sync="isSearching"
                    :defaultTopNode="initDefaultTopNode"
                    :changeEditOption="changeEditOption"
                    :defaultExpandedKeys="[0]"
                    :updateTree.sync="updateTree"
                    :needUpdate="true"
                    :truncatedNum="14"
                    @update="getTreeResolve"
                    @currentNode="fetchCurrentNode"
                    @action="handleAction">
                </CompanyTree>
            </div>
        </section>
        <!--右侧容器-->
        <section class="right-container">
            <user
                ref="user"
                :organization="currentNode"
                :load="loadTreeService"
                :isactivity="isActivity"
                @delSuccess="updateCompanyTree">
            </user>
        </section>
        <!--增加部门 弹窗-->
        <AddSectionDialog
            v-if="section.dialogShow"
            :form="section"
            @success="appendCompanyTreeNode">
        </AddSectionDialog>
        <!--新增门店-->
        <AddDepartmentDialog
            v-if="department.dialogShow"
            :form="department"
            @success="appendCompanyTreeNode">
        </AddDepartmentDialog>
        <!--移动树-->
        <MoveTreeDialog
            v-if="moveTreeDialog"
            :visible.sync="moveTreeDialog"
            v-model="companyTreeData"
            :currentNode="currentNode"
            :load="loadTreeService"
            :nodeTopName="userInfo.company"
            @success="moveCompanyTreeNode">
        </MoveTreeDialog>
        <!-- 选择上级部门 -->
        <ChooseSectionDialog
            :depTreeList="depTreeList"
            :department="department">
        </ChooseSectionDialog>

        <LocalImportDialog
            ref="importUser"
            :title="localImportTitle"
            :uploadUrl="uploadUrl"
            :templateUrl="templateUrl"
            :onClose="importUserClose"
            :showOption=true>
            <article slot="footer">
                <hr style="margin-bottom: 15px;">
                <h5>注意事项：</h5>
                <h5>1.模板中字段轻对照填写，不能为空</h5>
                <h5>2.如果有某些内容为空，导入时将跳过</h5>
                <h5>3.更新员工信息：以手机号匹配员工，并更新员工信息</h5>
            </article>
        </LocalImportDialog>

        <LocalImportDialog
                ref="importDepartment"
                :title="localImportTitle"
                :uploadUrl="uploadUrl"
                :templateUrl="templateUrl"
                :onClose="importDepartmentClose"
                :showOption=false>
            <article slot="footer">
                <hr style="margin-bottom: 15px;">
                <h5>注意事项：</h5>
                <h5>1.模板中字段轻对照填写，不能为空</h5>
                <h5>2.如果有某些内容为空，导入时将跳过</h5>
            </article>
        </LocalImportDialog>
        <AddDepartmentOr :toAdddepartment="toaddDepartment" v-if="toaddDepartment.dialogShow" ></AddDepartmentOr>
    </article>
</template>

<script>
    import organizationService from 'services/company/organizationService'
    import departmentService from 'services/company/departmentService'
    import userService from 'services/company/userService'
    import Department from './component/Department.vue'
    import User from './component/User.vue'
    import UserGroup from './component/UserGroup.vue'
    import AddSectionDialog from './component/AddSectionDialog.vue'
    import AddDepartmentDialog from './component/AddDepartmentDialog.vue'
    import MoveTreeDialog from './component/MoveTreeDialog.vue'
    import ChooseSectionDialog from './component/ChooseSectionDialog.vue'
    import CompanyTree from 'components/tree/CompanyTree.vue'
    import Region from 'components/select/Region.vue'
    import LocalImportDialog from './component/LocalImportDialog.vue'
    import AddDepartmentOr from 'components/dialog/AddDepartmentOr.vue'
    import signingService from 'services/company/signingService'
    export default {
        components: {
            Region,
            Department,
            User,
            UserGroup,
            AddSectionDialog,
            AddDepartmentDialog,
            MoveTreeDialog,
            ChooseSectionDialog,
            CompanyTree, // 企业管理树结构
            LocalImportDialog,
            AddDepartmentOr, // 门店是否达到上限不能添加
        },
        data () {
            return {
                depTreeList: {}, // 门店上级部门树
                moveTreeNode: null,
                moveTreeDialog: false, // 移动节点弹窗是否显示
                section: {
                    dialogTitle: '添加子部门',
                    dialogShow: false, // 是否显示部门
                    form: clearSectionFn(),
                    rules: {
                        name: {required: true, message: '必须填写名称'}
                    }
                },
                fetchOrganizationParam: {
                    organization_id: 0,
                    page: 1,
                    page_size: 15
                },
                activeType: 'organize', // 当前选择的类型
                department: {
                    type: '',
                    operateTreeDialog: false,
                    search: '',
                    dialogShow: false, // 是否显示编辑弹窗
                    dialogTitle: '新增门店', // 弹窗标题
                    form: clearDepartmentFn(),
                    rules: {
                        name: {required: true, message: '必须填写门店名称'}
                    }
                },
                companyTreeData: [],
                currentNode: {},
                currentTreeNode: {},
                isSearching: false,
                uploadUrl: userService.getUserUploadUrl(),
                templateUrl: userService.getUserTemplateUrl(),
                localImportTitle: '导入员工',
                updateTree: false,
                toaddDepartment: {
                    dialogShow: false,
                    department_count:200
                },
                isExpire: true , // 收否到期
                isActivity: this.$route.params.person || ''
            }
        },
        created () {
            // 默认为根目录
            this.changeEditOption(1)
            this.inital = true
            xmview.setContentLoading(false)
        },
        methods: {
            loadTreeService (param) {
                return organizationService.getOrganizationTree(param).then(ret => {
                    // debugger
                    // if (this.inital) {
                    //     this.initSelectTree(this.initDefaultTopNode()[0])
                    //     this.inital = false
                    // }
                    return ret
                })
            },
            updateCompanyTree (id = 0) {
                this.updateTree = true
                this.$nextTick(() => {
                    this.isSearching
                    ? this.$refs.companyTree.search()
                    : this.$refs.companyTree.loadNode({id}, this.treeResolve)
                })
            },
            appendCompanyTreeNode (ret) {
                if (!this.isSearching && !ret.edit) {
                    delete ret.edit
                    this.$refs.companyTree.append(this.currentTreeNode, ret.data)
                } else if (!this.isSearching && ret.edit) {
                    delete ret.edit
                    this.$refs.companyTree.edit(this.currentTreeNode, ret.data)
                } else {
                    this.updateCompanyTree()
                }
            },
            removeCompanyTreeNode () {
                if (!this.isSearching) {
                    this.$refs.companyTree.remove(this.currentTreeNode, this.currentNode)
                } else {
                    this.updateCompanyTree()
                }
            },
            moveCompanyTreeNode (pid, ret) {
                this.removeCompanyTreeNode()
                this.$refs.companyTree.move(pid, this.currentTreeNode, ret)
            },
            fetchCurrentNode (data, node, store) {
                this.currentNode = data
                this.currentTreeNode = node
            },
            initSelectTree (data) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        // debugger
                        this.$refs.companyTree.$el.children[1].children[0].classList.add('is-current')
                        this.$refs.companyTree.treeClick(data)
                    }, 100)
                })
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
            getTreeResolve (resolve) {
                this.treeResolve = resolve
            },
            // 添加部门
            addSection (name) {
                this.section.form = clearSectionFn()
                this.section.dialogTitle = name
                this.section.type = ''
                this.section.form.pid = this.currentNode.id
                this.section.dialogShow = true
            },
            // 新增门店
            addDepartment (name) {
                signingService.departmentAddCheck().then(ret => {
                    if(ret.add) {
                        this.department.form = clearDepartmentFn()
                        this.department.dialogTitle = name
                        this.department.type = ''
                        this.department.form.pid = this.currentNode.id
                        this.department.dialogShow = true
                    }else{
                        this.toaddDepartment.dialogShow = true
                        this.toaddDepartment.department_count = ret.department_count
                    }
                })
            },
            // 门店详情
            getDepartment () {
                this.department.dialogTitle = '门店详情'
                this.getDepartmentInfo()
            },
            // 门店详情数据获取
            getDepartmentInfo () {
                return departmentService.getDepartmentInfo({department_id: this.currentNode.id}).then((ret) => {
                    this.department.form = ret.data
                    this.department.dialogShow = true
                })
            },
            getSectionInfo () {
                return organizationService.getSectionInfo({id: this.currentNode.id}).then((ret) => {
                    this.section.form = ret.data
                    this.section.dialogShow = true
                })
            },
            // 修改门店信息
            editDepartment (name) {
                this.department.dialogTitle = name
                this.department.type = ''
                this.getDepartmentInfo()
            },
            detailDepartment (name) {
                this.department.dialogTitle = name
                this.department.type = 'detail'
                this.getDepartmentInfo()
            },
            detailSection (name) {
                this.section.dialogTitle = name
                this.section.type = 'detail'
                this.getSectionInfo()
            },
            // 删除门店
            deleteDepartment () {
                if (this.$refs.user.total > 0) {
                    return this.$message({
                        message: '该门店下有员工，不可删除门店',
                        type: 'warning'
                    })
                }
                xmview.showDialog(`确定要删除门店 ${this.currentNode.name}`, () => {
                    departmentService.deleteDepartment({department_id: this.currentNode.id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.removeCompanyTreeNode()
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '失败')
                    })
                })
            },
            // 修改部门信息
            editSection (name) {
                this.section.form = clearSectionFn()
                this.section.type = ''
                this.section.dialogTitle = name
                // 获取部门信息
                this.getSectionInfo()
            },
            // 删除部门
            deleteSection () {
                xmview.showDialog(`确定要删除部门 ${this.currentNode.name}`, () => {
                    organizationService.deleteSection({id: this.currentNode.id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.removeCompanyTreeNode()
                    }).catch(ret => {
                        xmview.showTip('error', ret.message || '删除失败')
                    })
                })
            },
            // 移动部门
            moveSection () {
                this.moveTreeDialog = true
            },

            // 移动门店
            moveDepartment (obj) {
                obj.selectData.forEach((item) => {
                    this.$refs.companyTree.removeChildNode(item)
                    this.$refs.companyTree.addChildNode(item, obj.parent)
                })
            },
            addUser () {
                this.$refs.user.addUser()
            },
            handleAction (action, name) {
                this[action] && this[action](name)
            },
            organizationUserImport () {
                userService.organizationUserImport().then(() => {
                    xmview.showTip('success', '导入成功')
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '导入失败')
                })
            },
            fileImport (type) {
                if (type === 0) {
                    this.uploadUrl = departmentService.getDepartmentUploadUrl()
                    this.templateUrl = departmentService.getDepartmentTemplateUrl()
                    this.localImportTitle = '导入门店'
                    this.$refs['importDepartment'].open()
                } else {
                    this.uploadUrl = userService.getUserUploadUrl()
                    this.templateUrl = userService.getUserTemplateUrl()
                    this.localImportTitle = '导入员工'
                    this.$refs['importUser'].open()
                }
            },
            importUserClose () {
                this.$refs['user'].fetchData()
            },
            importDepartmentClose () {
                this.updateCompanyTree()
            },
            changeEditOption (type) { // 根据不同的类型显示不同的操作
                let editOption
                if (type === 1) {
                    // 根目录
                    editOption = [
                        {
                            id: 1,
                            action: 'addSection',
                            name: '增加子部门'
                        },
                        {
                            id: 2,
                            action: 'addDepartment',
                            name: '增加门店'
                        }
                    ]
                } else if (type === 2) { // 门店
                    editOption = [
                        {
                            id: 1,
                            action: 'moveSection',
                            name: '移动位置'
                        },
                        {
                            id: 3,
                            action: 'editDepartment',
                            name: '修改门店'
                        },
                        {
                            id: 4,
                            action: 'detailDepartment',
                            name: '门店详情',
                        },
                        {
                            id: 5,
                            action: 'deleteDepartment',
                            name: '删除门店'
                        }
                    ]
                } else {
                    // 连锁
                    editOption = [
                        {
                            id: 1,
                            action: 'moveSection',
                            name: '移动位置'
                        },
                        {
                            id: 2,
                            action: 'deleteSection',
                            name: '删除部门'
                        },
                        {
                            id: 4,
                            action: 'addSection',
                            name: '增加子部门'
                        },
                        {
                            id: 5,
                            action: 'addDepartment',
                            name: '增加门店'
                        },
                        {
                            id: 6,
                            action: 'detailSection',
                            name: '部门详情'
                        },
                        // {
                        //     id: 0,
                        //     name: '新增子集',
                        //     editOption: [
                        //         {
                        //             id: 4,
                        //             action: 'addSection',
                        //             name: '新增部门'
                        //         },
                        //         {
                        //             id: 5,
                        //             action: 'addDepartment',
                        //             name: '新增门店'
                        //         },
                        //     ]
                        // },
                        {
                            id: 3,
                            action: 'editSection',
                            name: '修改信息'
                        }
                    ]
                }
                return editOption
            },
        }
    }
    function clearDepartmentFn () {
        return {
            pid: '',
            name: '',
            tel: '',
            fax: '',
            contact: '',
            mobile: '',
            address: '',
            zip: '',
            description: '',
            private_id: ''
        }
    }
    function clearSectionFn () {
        return {
            name: '',
            organization_name: '',
            pid: '',
            sort: '',
            description: '',
            type: '',
            province: '',
            city: '',
            area: '',
            private_id: ''
        }
    }
</script>
