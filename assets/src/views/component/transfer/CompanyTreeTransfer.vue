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
        .collection {
            margin-bottom: 5px;
            .u-course-tag {
                margin-right: 10px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
</style>
<template>
    <main id="tree-container">
        <div>
            <div class="collection" v-if="isOrg === 0">
                <el-tag
                    class="u-course-tag"
                    :key="tag.id"
                    v-for="tag in selected"
                    :disable-transitions="false">
                    {{tag.name}}
                </el-tag>
            </div>
            <el-input
                v-show="isSearch"
                :placeholder="placeholder"
                @keyup.enter.native="search"
                v-model="filterText"
                @change="expand">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
            </el-input>
        </div>
        <el-tree 
            v-show="!_$isSearching"
            class="tree"
            ref="tree"
            lazy
            :data="value"
            v-loading="loading"
            :load="loadNode"
            :show-checkbox="isSelect"
            @node-click="treeClick"
            @node-collapse="treeCollapse"
            :props="defaultProps"
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
                @check="check"
                @check-change="checkChange"
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
    </main>
</template>
<script>
    /* eslint-disable */
    import * as _ from 'utils/common'
    import organizationService from 'services/company/organizationService'

    /* eslint-enable */
    export default {
        components: {},
        props: {
            isOrg: { // 是否只展示部门
                type: Number,
                default: 1,
            },
            isSearch: { // 是否显示搜索框
                default: false,
                type: Boolean
            },
            isSelect: {  // 是否显示选择框
                default: true,
                type: Boolean
            },
            truncatedNum: {
                type: Number,
                default: 10,
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
            hideLeaf: {  // 隐藏叶子节点
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
            }
        },
        data () {
            return {
                inital: true,
                value: [],
                treeData: [],
                cache_tree2Keys: [],
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
                searchChecks: [],
                selected: [],
            }
        },
        computed: {
            _$isSearching () {
                return this.filterText.trim() && this.searching
            },
        },
        watch: {
            filterText (val) {
                if (val.trim() === '') {
                    this.searching = false
                    // 当切换到正常树的时候选中状态回添
                    this.expand()

                }
            },
        },
        created () {
            console.log('companyTreeTransfer created')

            if (this.value) {
                this.loading = false
            }
        },
        activated () {
            console.log('companyTreeTransfer activated')
        },
        methods: {
            check (node, a, b, c) {
            },
            // 在此处处理搜索树节点取消的情况
            checkChange (node, a, b, c) {
                // this.$refs.
            },
            defaultTopNode () {
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
                    if (this.treeData.length) {
                        this.initTreeData(this.treeData[0].children)
                        this.searchChecks = this.$refs.tree.getCheckedKeys()
                        this.clear2(this.searchChecks)
                        this.$nextTick(() => {
                            this.cache_tree2Keys = this.$refs.tree2.getCheckedKeys().filter(item => item !== 0)
                        })
                    }
                    console.log('search：', this.treeData, this.searchChecks)
                    this.loading2 = false
                }).then(() => {
                    this.initSelectTree(2, this.defaultTopNode()[0])
                }).catch(e => {
                    console.log(e)
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
            initTreeData (data) {
                // debugger
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
            load (param) {
                return organizationService.getOrganizationTree({...param, is_org: this.isOrg}).then(ret => {
                    return ret
                })
            },
            loadNode (node, resolve) {
                // console.log(this.defaultChecks)
                let organization_id = node.data.id
                this.load({organization_id}).then(ret => {
                    if (this.defaultTopNode) {
                        if (node && node.level === 0) {
                            resolve(this.defaultTopNode())
                        } else {
                            // when show-checkbox is true,
                            // user selects the first node of tree, it will select all node
                            if (this.isSelect) {
                                ret.data && ret.data.unshift({id: -1})
                            }
                            resolve(ret.data)
                        }
                    } else {
                        resolve(ret.data)
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
            clear (ids) {
                this.$refs.tree.setCheckedKeys(ids)
            },
            clear2 (ids) {
                this.$refs.tree2.setCheckedKeys(ids)
            },
            setCheckedKeys () {
                let treeKeys = new Set(this.$refs.tree.getCheckedKeys().filter(item => item !== 0))
                let tree2Keys = new Set(this.$refs.tree2.getCheckedKeys().filter(item => item !== 0))
                let cache_tree2Keys = new Set(this.cache_tree2Keys)
                let distance1
                let distance2
                let ansKeys = []
                // debugger
                let intersection = new Set([...cache_tree2Keys].filter(x => tree2Keys.has(x)))
                // 如果是某一个集合为空集合，那么intersection为空集合，但是intersection为空，不一定某一个集合为空，
                // 所以某一集合为空是intersection为空的充分不必要条件.
                // 综上：
                // 如果cache_tree2Keys为空，那么只有增加的部分，没有减少的部分
                // 如果tree2Keys为空，那么只有减少的部分，没有增加的部分
                // 如果cache_tree2Keys和tree2Keys都不为空，说明没有交集，则应该减去cache_tree2Keys，增加tree2Keys
                // intersection为空的情况
                if (!intersection.size) {
                    if (!cache_tree2Keys.size) {
                        ansKeys = [...treeKeys, ...tree2Keys]
                    } else if (!tree2Keys.size) {
                        ansKeys = [...treeKeys].filter(x => !cache_tree2Keys.has(x))
                    } else {
                        ansKeys = [...[...treeKeys].filter(x => !cache_tree2Keys.has(x)), ...tree2Keys]
                    }
                } else { // intersection不为空
                    distance1 = new Set([...cache_tree2Keys].filter(x => !intersection.has(x))) // 减少的集合
                    distance2 = new Set([...tree2Keys].filter(x => !intersection.has(x))) // 增加的集合
                    ansKeys = [...[...treeKeys].filter(x => !distance1.has(x)), ...distance2]
                }
                console.log('tree:', treeKeys, 'tree2', tree2Keys, 'ansKeys', ansKeys)
                this.clear(ansKeys)
                this.clear2([])
                this.cache_tree2Keys = []
            },
            async getCheckedNodes () {
                if (this.searching) {
                    let ret = await this.expand()
                    if (!ret) {
                        return this.$refs.tree.getCheckedNodes().filter(item => item.id !== -1 && item.id !== 0)
                    } else {
                        return ret
                    }
                } else {
                    return this.$refs.tree.getCheckedNodes().filter(item => item.id !== -1 && item.id !== 0)
                }
            },
            async expand () {
                let _nodes = this.$refs.tree.getCheckedNodes()
                let nodes = this.$refs.tree2.getCheckedNodes().filter(item => {
                    if (_nodes.length) {
                        return item.id !== -1 && item.id !== 0 && !_nodes.some(node => node.id == item.id)
                    } else {
                        return item.id !== -1 && item.id !== 0
                    }
                })
                // tree中没有tree2选中的节点
                if (nodes.length) {
                    let allNodes = this.$refs.tree.store._getAllNodes()
                    for (let node of allNodes) {
                        if (!node.expanded) {
                            let res = this.getPid()
                            if (nodes.some(item => item.pid !==0 && res.includes(node.data.id))) {
                                await handleNode.call(this, res)
                            }
                        }
                    }
                    this.setCheckedKeys()
                    // 处理搜索时还未被加载的节点
                    async function handleNode (res) {
                        await this.expandTreeNode(res)
                    }
                    return this.$refs.tree.getCheckedNodes().filter(item => item.id !== -1 && item.id !== 0)
                } else {
                    this.setCheckedKeys()
                }
                return nodes.length
            },
            // 找到当前节点的父节点,父节点的父节点...
            getPid () {
                return this.$refs.tree2.getHalfCheckedKeys().filter(item => item !== -1 && item !== 0)
            },
            async expandTreeNode (res) {
                // debugger
                for (let i = 0; i < res.length; i++) {
                    let allNodes = this.$refs.tree.store._getAllNodes()
                    await new Promise((resolve, reject) => {
                        allNodes.filter(node => node.data.id === res[i])[0].expand(resolve)
                    })
                }
            },
            renderContent (h, {node, data, store}) {
                node.isLeaf = !data.has_children
                let type = data.godPid === 0 ? 1 : (data.isdep === 1 ? 2 : 3)
                node.visible = !this.hideLeaf ? 
                            (data.id === -1 ? Boolean(false) : Boolean(true)) : 
                            (type !== 2 ? Boolean(true) : Boolean(false))
                if (data.id === -1) {
                    node.checked = false
                    // if (node.parent.data.children_count === 1) {
                    //     node.checked = true
                    // } else {
                    //     node.checked = false
                    // }
                }
                node.loading = !data.has_children ? false : node.loading
                let icon = this.iconMap[type]
                return (
                    <span>
                        <span title={node.label}>
                            <i class={icon}></i>&nbsp;
                            {data.godPid !== 0 ? this.truncateStr(node.label, this.truncatedNum) : this.truncateStr(node.label, 0)}
                        </span>
                    </span>
                )
            }
        }
    }
</script>
