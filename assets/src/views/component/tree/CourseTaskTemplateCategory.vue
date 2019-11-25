<!--课程栏目-->

<template>
    <el-tree v-loading="loading" :data="data" @node-click="handleNodeClick"
             @node-expand="handleNodeExpand"
             ref="container">
    </el-tree>
</template>

<script>
    import companyService from '../../../services/companyService'
    import treeUtils from '../../../utils/treeUtils'

    export default{
        props: {
            onNodeClick: Function,
            value: Array,
        },
        data () {
            return {
                data: this.value,
                allNodes: [],
                loading: false
            }
        },
        watch: {
            'value' (val) {
                if (val.length != this.data.length) this.setCurrVal(val)
            }
        },
        created () {
            if (!this.value || this.value.length < 1)
                this.initData()
        },
        deactivated () {
            this.allNodes = null
        },
        methods: {
            // 设置所有的tree节点
            setAllNodes () {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.allNodes = [...this.$refs.container.$el.querySelectorAll('.el-tree-node__content')]
                    }, 0)
                })
            },
            handleNodeExpand (data, node, nodeDom) {
                // 如果是有children 并且只有一个[加载中...]的一项 则去服务器加载数据
                if (data.children && data.children[0].value)
                    return

                companyService.getCategoryTree({id: data.value}).then(ret => {
                    ret.map((item) => {
                        item.label = item.name
                        item.value = item.id
                        item.item = item
                        item.children = item.has_children ? [{label: '加载中...'}] : null
                    })
                    data.children = ret
                }).then(() => {
                    this.setAllNodes()
                })
            },
            handleNodeClick (data, node, store) {
                this.onNodeClick && this.onNodeClick(data, node, store)
                // 根节点无法被选中
                if (data.value == 0) return
                this.allNodes.map((item) => {
                    item.style.background = '#ffffff'
                })
                store.$el.querySelector('.el-tree-node__content').style.background = 'rgb(228, 233, 241)'
            },
            removeItem (item, parent) {
                // 父节点没有children 说明当前是根节点
                if (!parent.data.children) {
                    this.data = this.data.filter((curr) => {
                        return curr.value != item.value
                    })
                } else {
                    parent.data.children = parent.data.children.filter((curr) => {
                        return curr.value != item.value
                    })

                    if (parent.data.children.length < 1) parent.data.children = null
                }

                this.setAllNodes()
                // 重新给父容器赋值  不然数据不同步
                this.$emit('input', this.data)
            },
            setCurrVal (val) {
                if (val === this.data) return
                this.data = val
                this.$emit('input', val)
                this.setAllNodes()
            },
            initData () {
                this.loading = true
                return companyService.getCategoryTree({}).then(ret => {
                    this.setCurrVal(treeUtils.arr2Cascader(ret, 0, void 0, void 0, 'name', 'id'))
                    xmview.setContentLoading(false)
                }).then(() => {
                    this.loading = false
                    this.$forceUpdate()
                })
            },
            // 清空选中项
            clearSelected () {
                this.allNodes.map((item) => {
                    item.style.background = '#ffffff'
                })
            }
        },
        components: {}
    }
</script>
