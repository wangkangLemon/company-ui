<!-- 
    事件：
    currentNode:当前树节点信息

    action:在operate为true的情况下，TreeRenderContent抛出的事件，用于在父组件分发调用函数
 -->
<style lang="scss" rel="stylesheet/scss">
    @import '~utils/mixins/mixins';
    #tree-container {
        .tree {
            overflow: auto;
            height: 591px;
            width: 100%;
        }
        .el-input {
            margin-bottom: 10px;
        }
        .user-group-category {
            margin-right: 5px;
        }
        .el-tree-node__content {
            // @include clearFloatByAfter();
            position: relative;
        }
        .operate {
            @include clearFloatByAfter();
        }
        .el-icon-search {
            color: #7a7a7d;
            font-size: 17px;
            font-weight: bold;
        }
    }
</style>
<template>
    <article id="tree-container">
        <el-input
            v-show="isSearch"
            placeholder="搜索部门/门店"
            @keyup.enter.native="search"
            v-model="filterText">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <el-tree 
            v-show="!_$isSearching"
            class="tree"
            lazy
            v-loading="loading"
            :load="loadNode"
            :data="value"
            :show-checkbox="isSelect"
            @node-click="treeClick"
            @node-collapse="treeCollapse"
            :props="defaultProps"
            ref="tree"
            highlight-current
            :default-checked-keys="defaultChecks"
            :default-expanded-keys="defaultExpandedKeys"
            :node-key="nodeKey"
            :render-content="renderContent"
            :default-expand-all="defaultExpandAll"
            :expand-on-click-node="expandOnClickNode">
        </el-tree>
        <!-- 搜索树 -->
        <section 
            v-show="_$isSearching"
            v-loading="loading2">
            <el-tree 
                class="tree"
                :data="treeData"
                :show-checkbox="isSelect"
                @node-click="treeClick"
                @node-collapse="treeCollapse"
                :props="defaultProps"
                ref="tree2"
                highlight-current
                :node-key="nodeKey"
                :render-content="renderContent"
                :default-checked-keys="searchChecks"
                default-expand-all
                :expand-on-click-node="expandOnClickNode">
            </el-tree>
        </section>
    </article>
</template>
<script>
    /* eslint-disable */
    import TreeRenderContent from './TreeRenderContent.vue'
    import * as _ from 'utils/common'
    /* eslint-enable */
    export default {
        components: {},
        props: {
            value: { // 树数据
                type: Array,
                required: true,
            },
            isSearch: { // 是否显示搜索框
                default: false,
                type: Boolean
            },
            isSearching: {
                type: Boolean,
                required: false,
                default: false,
            },
            isSelect: {  // 是否显示选择框
                default: false,
                type: Boolean
            },
            truncatedNum: {
                type: Number,
                default: 10,
            },
            operate: { // 点击节点是否显示编辑操作
                default: false,
                type: Boolean
            },
            isUserCount: { // 是否显示人数
                default: true,
                type: Boolean
            },
            defaultProps: {
                type: Object,
                default () {
                    return {
                        label: 'name'
                    }
                }
            },
            defaultChecks: {
                type: Array,
                default () {
                    return []
                }
            },
            defaultExpandAll: {
                type: Boolean,
                default: false,
            },
            defaultExpandedKeys: {
                type: Array,
                default () {
                    return []
                }
            },
            nodeKey: {
                type: String,
                default: 'id',
                required: false,
            }, // relative to the defaultChecks, it depends on kind of field of value passed into the tree
            expandOnClickNode: {
                type: Boolean,
                default: false,
            },
            load: {
                type: Function,
                required: true
            },
            changeEditOption: {
                type: Function,
                required: false
            },
            hideLeaf: {  // 隐藏叶子节点
                type: Boolean,
                default: false
            },
            defaultTopNode: {
                type: Function,
                required: false
            },
            updateTree: {
                type: Boolean,
                required: false,
                default: false,
            },
            needUpdate: {
                type: Boolean,
                required: false,
                default: false,
            },
            moveNodeId: Number,
        },
        data () {
            return {
                inital: true,
                inital2: true,
                treeData: [],
                filterText: '',
                loading: true,
                loading2: false,
                currentNode: {},
                currentTreeNode: {},
                iconMap: {
                    2: 'iconfont icon-iconfontshop',
                    3: 'iconfont icon-department'
                },
                searching: false,
                searchChecks: []
            }
        },
        computed: {
            _$isSearching () {
                let res = this.filterText.trim() && this.searching
                this.$emit('update:isSearching', res)
                return res
            },
        },
        watch: {
            filterText (val) {
                if (val.trim() === '') {
                    this.searching = false
                    this.setCheckedKeys()
                }
            },
        },
        created () {
            if (this.value) {
                this.loading = false
            }
        },
        methods: {
            filterNode (value, data) {
                if (!value) return true
                return data.name.indexOf(value) !== -1
            },
            search () {
                this.searching = true
                this.loading2 = true
                this.load({keyword: this.filterText}).then(ret => {
                    if (!this.isSelect) {
                        this.treeData = getTopNode.call(this, ret.data || defaultNode())
                    } else {
                        this.treeData = ret.data ? getTopNode.call(this, ret.data || []) : []
                    }
                    this.initTreeData(this.treeData)
                    this.searchChecks = this.$refs.tree.getCheckedKeys()
                    console.log(this.treeData, this.searchChecks)
                    this.loading2 = false
                }).then(() => {
                    this.initSelectTree(2, this.defaultTopNode()[0])
                    this.$emit('update:updateTree', false)
                })
                function getTopNode (data) {
                    let topNode = this.defaultTopNode()[0]
                    topNode.children = data
                    return [topNode]
                }
                function defaultNode () {
                    return [{
                        'godPid': 0,
                        'pid': 0,
                        'unShowEditOption': true,
                        'name': '无数据',
                        'isdep': 1,
                        'has_children': false,
                        'children': null
                    }]
                }
            },
            initTreeData (data, parent) {
                if (!data) {
                    return
                } else {
                    data.unshift({id: -1})
                }
                let i = data.length - 1
                while (i >= 0) {
                    this.initTreeData(data[i].children)
                    i--
                }
            },
            loadNode (node, resolve) {
                // debugger
                // console.log(this.defaultChecks)
                if (this.needUpdate) {
                    this.$emit('update', resolve)
                }
                let organization_id = this.updateTree ? node.id : node.data.id
                this.load({organization_id}).then(ret => {
                    if (this.updateTree) {
                        // debugger
                        // this.$refs.tree.store.root.childNodes[0]
                        this.$refs.tree.store.root.childNodes[0].childNodes = []
                        this.$refs.tree.store.root.childNodes[0].doCreateChildren(ret.data)
                        this.reset()
                        this.$emit('update:updateTree', false)
                    } else {
                        if (this.defaultTopNode) {
                            if (node && node.level === 0) {
                                resolve(this.defaultTopNode())
                            } else {
                                // when show-checkbox is true,
                                // user selects the first node of tree, it will select all node
                                if (this.isSelect) {
                                    ret.data && ret.data.unshift({id: -1})
                                }
                                !this.moveNodeId ? resolve(ret.data) : resolve(ret.data.filter(item => item.id !== this.moveNodeId))
                            }
                        } else {
                            !this.moveNodeId ? resolve(ret.data) : resolve(ret.data.filter(item => item.id !== this.moveNodeId))
                        }
                    }
                }).then(() => {
                    if (this.inital) {
                        this.initSelectTree(1, this.defaultTopNode()[0])
                        this.inital = false
                    }
                }).catch(e => {
                    console.log(e)
                })
                // if (this.updateTree || node.data.has_children === undefined || node.data.has_children === true) {
                // }
            },
            treeClick (data, node, store) {
                this.currentNode = data
                this.currentTreeNode = node
                this.$emit('currentNode', data, node, store)
            },
            treeCollapse () {
                if (this.isSelect) {

                }
            },
            initSelectTree (index, data) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$el.children[index].children[0].classList.add('is-current')
                        this.treeClick(data, this.$refs.tree.store.root.childNodes[0])
                        this.$el.children[index].children[0].click()
                    }, 300)
                })
            },
            setCheckedKeys () {
                this.$refs.tree.setCheckedKeys([...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree2.getCheckedKeys()])
            },
            handleAction (action, name) {
                this.$emit('action', action, name)
            },
            append (node, newNodes) {
                // debugger
                node.childNodes = []
                node.doCreateChildren(newNodes)
                // node.childNodes.push(newChild)
            },
            edit (node, newNodes) {
                let parent = node.parent
                this.append(parent, newNodes)
                this.reset()
            },
            remove (node, data) {
                const parent = node.parent
                const children = parent.childNodes
                const index = children.findIndex(d => d.data.id === data.id)
                children.splice(index, 1)
            },
            move (pid, node, nodeNodes) {
                let parent = node.parent
                while (parent.key !== pid) {
                    if (!parent.parent) {
                        parent = null
                        break
                    } else {
                        parent = parent.parent
                    }
                }
                // debugger
                if (parent) {
                    parent.childNodes = []
                    parent.doCreateChildren(nodeNodes)
                }
                this.reset()
            },
            reset () {
                this.currentNode = {}
            },
            renderContent (h, {node, data, store}) {
                node.isLeaf = !data.has_children
                let type = data.godPid === 0 ? 1 : (data.isdep === 1 ? 2 : 3)
                let showEditOption = data.unShowEditOption
                node.visible = !this.hideLeaf ? 
                            (data.id === -1 ? Boolean(false) : Boolean(true)) : 
                            (type !== 2 ? Boolean(true) : Boolean(false))
                if (data.id === -1) {
                    node.checked = false
                }
                node.loading = !data.has_children ? false : node.loading
                let icon = this.iconMap[type]
                let editOption
                if (this.operate) {
                    editOption = this.changeEditOption(type)
                }
                // <i>（{data.user_count}）人</i>
                if (this.operate && this.isUserCount) {
                    return (
                        <span>
                            <span title={node.label}>
                                <i class={icon}></i>&nbsp;
                                {data.godPid !== 0 ? this.truncateStr(node.label, this.truncatedNum) : this.truncateStr(node.label, 0)}
                            </span>
                            <TreeRenderContent node={data} node-click={this.currentNode} onAction={this.handleAction} editOption={editOption} showEditOption={!showEditOption}></TreeRenderContent>
                        </span>
                    )
                } else if (this.operate && !this.isUserCount) {
                    return (
                        <span>
                            <span>
                                <i class="fa fa-tag fa-lg user-group-category" aria-hidden="true"></i>
                                <span title={node.label}>
                                    <i class={icon}></i>&nbsp;
                                    {data.godPid !== 0 ? this.truncateStr(node.label, this.truncatedNum) : this.truncateStr(node.label, 0)}
                                </span>
                            </span>
                            <TreeRenderContent node={data} node-click={this.currentNode} onAction={this.handleAction} editOption={editOption} showEditOption={!showEditOption}></TreeRenderContent>
                        </span>
                    )
                } else if (!this.operate && !this.isUserCount) {
                    return (
                        <span title={node.label}>
                            <i class={icon}></i>&nbsp;
                            {data.godPid !== 0 ? this.truncateStr(node.label, this.truncatedNum) : this.truncateStr(node.label, 0)}
                        </span>
                    )
                } else if (!this.operate && this.isUserCount) {
                    return (
                        <span>
                            <span>
                                <span title={node.label}>
                                    <i class={icon}></i>&nbsp;
                                    {data.godPid !== 0 ? this.truncateStr(node.label, this.truncatedNum) : this.truncateStr(node.label, 0)}
                                </span>
                            </span>
                        </span>
                    )
                }
            }
        }
    }
</script>
