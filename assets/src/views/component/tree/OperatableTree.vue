<!--课程栏目-->

<template>
    <el-tree 
        v-loading="loading" 
        :data="data" 
        :expand-on-click-node="false" 
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand" 
        :highlight-current="selectable">
    </el-tree>
</template>

<script>
    import treeUtils from 'utils/treeUtils'

    export default{
        props: {
            value: Array,
            fetchData: Function, // 获取数据 返回promise
        },
        data () {
            return {
                data: this.value,
                loading: false,
                selectable: true, // 是否可选中
            }
        },
        watch: {
            'value' (val) {
                if (val.length != this.data.length) {
                    this.setCurrVal(val)
                }
            }
        },
        created () {
            if (!this.value || this.value.length < 1)
                this.initData()
        },
        deactivated () {
        },
        methods: {
            handleNodeExpand (data, node, nodeDom) {
                // 如果是有children 并且只有一个[加载中...]的一项 则去服务器加载数据
                if (data.children && data.children[0].value)
                    return

                this.initData(data)
            },
            handleNodeClick (data, node, store) {
                this.$emit('onNodeClick', {data, node, store})
                // 根节点无法被选中
                if (data.value == 0) return
                this.selectable = true
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
                // 重新给父容器赋值  不然数据不同步
                this.$emit('input', this.data)
            },
            setCurrVal (val) {
                if (val === this.data) return
                this.data = val
                this.$emit('input', val)
            },
            initData (parentNode) {
                let params = parentNode ? {id: parentNode.value} : {}
                this.loading = true
                return this.fetchData(params).then(ret => {
                    xmview.setContentLoading(false)
                    if (!parentNode) {
                        this.setCurrVal(treeUtils.arr2Cascader(ret.data, 0, void 0, void 0, 'name', 'id'))
                    } else {
                        ret.data.map((item) => {
                            item.label = item.name
                            item.value = item.id
                            item.item = item
                            item.children = item.has_children ? [{label: '加载中...'}] : null
                        })
                        parentNode.children = ret.data
                    }
                }, () => {
                }).then(() => {
                    this.loading = false
                    this.$forceUpdate()
                })
            },
            // 清空选中项
            clearSelected () {
                this.selectable = false
            }
        },
        components: {}
    }
</script>
