<style lang="scss">
    
</style>

<template>
    <main id="course-manage-category-container">
        <section>
            <el-button type="primary" icon="el-icon-plus" @click="addCategory" style="margin-bottom: 10px;"><i>添加栏目</i>
            </el-button>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-tree 
                        :data="data"
                        :props="defaultProps"
                        lazy
                        :load="loadNode"
                        highlight-current
                        :render-content="renderContent"
                        @node-click="handleNodeClick">
                    </el-tree>
                </el-col>
                <el-col :span="16">
                    <el-tabs type="border-card" @tab-click="handleClick" v-model="curTab">
                        <el-tab-pane label="修改栏目" name="modifyCategory">
                            <CategoryForm 
                                :formData="formData1"
                                :cancelBtn="false"
                                comfirmTxt="修改"
                                @submit="modifyCategory">
                            </CategoryForm>
                        </el-tab-pane>
                        <el-tab-pane label="添加子栏目" name="addSubCategory">
                            <CategoryForm 
                                :formData="formData2" 
                                :cancelBtn="false"
                                comfirmTxt="添加"
                                @submit="addSubCategory">
                            </CategoryForm>
                        </el-tab-pane>
                        <el-tab-pane label="移动栏目" name="moveCategory"></el-tab-pane>
                        <el-tab-pane label="移动栏目下内容" name="moveContent"></el-tab-pane>
                        <el-tab-pane label="删除栏目" name="delCategory"></el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>   
        </section>
        <!-- 添加栏目弹窗 -->
        <el-dialog title="添加栏目" :visible.sync="showAddDialog">
            <CategoryForm 
                :formData="formData3" 
                cancelBtn="取消"
                comfirmTxt="添加"
                @cancel="onCancel"
                @submit="addDialogFn">
            </CategoryForm>
        </el-dialog>
        <!-- 移动栏目和移动内容弹窗 -->
        <el-dialog :title="moveDialogTitle" :visible.sync="showMoveDialog" v-if="showMoveDialog">
            <el-tree 
                :data="data" 
                :props="defaultProps"
                lazy
                :load="loadNode2"
                highlight-current
                @node-click="handleNodeClick2">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="moveDialogFn">确定</el-button>
                <el-button @click="showMoveDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    import categoryService from 'services/course/categoryService'
    import CategoryForm from './component/CategoryForm.vue'
    // import treeUtils from 'utils/treeUtils'

    // import * as _ from 'utils/common'
    
    function getDefault (type) {
        let map = {
            formData: {
                name: '',
                image: '',
                sort: ''
            }
        }
        return map[type]
    }

    export default {
        components: {
            CategoryForm
        },
        created () {
            // this.fetchData().then(() => {
            //     xmview.setContentLoading(false)
            // })
            xmview.setContentLoading(false)
        },
        data () {
            return {
                loading: false,
                data: [],
                cacheData: null,
                defaultProps: {
                    label: 'name',
                },
                showAddDialog: false,
                addDialogFn: '',
                showMoveDialog: false,
                moveDialogTitle: '',
                moveDialogFn: '',
                formData1: getDefault('formData'),  // 修改栏目
                formData2: getDefault('formData'),  // 添加子栏目
                formData3: getDefault('formData'),  // 添加栏目
                node: '',  // 进入界面选中的树节点
                node2: '', // 移动弹窗选中的树节点
                curTab: 'modifyCategory',
                c_curTab: 'modifyCategory',
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return categoryService.getCategory().then(ret => {
                    this.data = ret.data
                }).then(() => {
                    this.loading = false
                })
            },
            loadNode (node, resolve) {
                categoryService.getCategory(node.data.id).then(ret => {
                    resolve(ret.data)
                })
            },
            loadNode2 (node, resolve) {
                categoryService.getCategory(node.data.id).then(ret => {
                    resolve(ret.data.filter(item => item.id !== this.node.id))
                })
            },
            handleNodeClick (node) {
                this.formData1.name = node.name
                this.formData1.image = node.image
                this.formData1.sort = node.sort
                this.node = node
            },
            handleNodeClick2 (node) {
                this.node2 = node
            },
            handleClick (tab, event) {
                switch (tab.name) {
                case 'moveCategory':
                    this.moveCategory(1)
                    setTimeout(() => {
                        this.curTab = this.c_curTab
                    }, 0)
                    break
                case 'moveContent':
                    this.moveCategory(2)
                    setTimeout(() => {
                        this.curTab = this.c_curTab
                    }, 0)
                    break
                case 'delCategory':
                    this.delCategory()
                    setTimeout(() => {
                        this.curTab = this.c_curTab
                    }, 0)
                    break
                default:
                    this.c_curTab = this.curTab
                }
            },
            // 添加栏目
            addCategory () {
                this.showAddDialog = true
                this.addDialogFn = (ruleForm) => {
                    categoryService.addCategory(this.formData3).then(() => {
                        xmview.showTip('success', '添加成功')
                        this.showAddDialog = false
                        this.fetchData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message || '添加失败')
                    })
                }
            },
            // 修改栏目
            modifyCategory () {
                if (this.isClickNode()) {
                    categoryService.modifyCategory({
                        id: this.node.id,
                        name: this.formData1.name,
                        image: this.formData1.image,
                        sort: this.formData1.sort
                    }).then(() => {
                        xmview.showTip('success', '修改成功')
                        this.fetchData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message || '修改失败')
                    })
                }
            },
            // 添加子栏目
            addSubCategory () {
                if (this.isClickNode()) {
                    categoryService.addCategory({
                        id: this.node.id,
                        name: this.formData2.name,
                        image: this.formData2.image,
                        sort: this.formData2.sort,
                    }).then(() => {
                        xmview.showTip('success', '添加成功')
                        this.fetchData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message || '添加失败')
                    })
                }
            },
            // 移动栏目
            moveCategory (type) {
                if (this.isClickNode()) {
                    let service
                    if (type === 1) {
                        service = categoryService.moveCategory
                        this.moveDialogTitle = `移动栏目【${this.node.name}】到`
                    } else {
                        service = categoryService.moveCategoryContent
                        this.moveDialogTitle = `移动栏目【${this.node.name}】的内容到`
                    }
                    this.showMoveDialog = true
                    this.moveDialogFn = () => {
                        service(this.node.id, this.node2.id).then(() => {
                            xmview.showTip('success', '移动成功')
                            this.node = ''
                            this.showMoveDialog = false
                            this.fetchData()
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message || '移动失败')
                        })
                    }
                }
            },
            // 删除栏目
            delCategory () {
                if (this.isClickNode()) {
                    xmview.showDialog(`你确定要删除栏目吗？`, () => {
                        categoryService.deleteCategory(this.node.id).then(() => {
                            xmview.showTip('success', '删除成功')
                            this.node = ''
                            this.fetchData()
                            Object.keys(this.formData1).forEach(form => { this.formData1[form] = '' })
                        }).catch(ret => {
                            xmview.showTip('error', ret.message || '删除失败')
                        })
                    })
                }
            },
            onCancel () {
                this.showAddDialog = false
                this.formData3 = getDefault('formData')
            },
            isClickNode () {
                if (!this.node) {
                    xmview.showTip('warning', '请选择栏目')
                    return false
                }
                return true
            },
            renderContent (h, {node, data, store}) {
                node.isLeaf = data.has_children ? Boolean(false) : Boolean(true)
                return (
                    <span>
                        <span>
                          <span>{node.label}</span>
                        </span>
                    </span>
                )
            },
        }
    }
</script>
