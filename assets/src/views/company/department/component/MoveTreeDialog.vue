<!-- 
    事件：success，移动成功，在页面入口处理其他逻辑
 -->
<template>
    <el-dialog :visible.sync="moveTreeDialog" title="调整到">
        <CompanyTree 
            v-model="value"
            :expandOnClickNode="true"
            :load="load"
            :hideLeaf="true"
            :isUserCount="false"
            :defaultExpandedKeys="[0]"
            :defaultTopNode="initDefaultTopNode"
            @currentNode="fetchCurrentNode"
            :moveNodeId="currentNode.id">
        </CompanyTree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="moveTreeDialog=false">取消</el-button>
            <el-button type="primary" @click="saveMove">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import CompanyTree from 'components/tree/CompanyTree.vue'
    import organizationService from 'services/company/organizationService'

    export default {
        components: {
            CompanyTree,
        },
        props: {
            value: Array,
            visible: Boolean,
            load: Function,
            currentNode: Object,
            nodeTopName: String,
        },
        watch: {
            moveTreeDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                moveTreeDialog: this.visible,
            }
        },
        methods: {
            // 树点击的回调
            fetchCurrentNode (data) {
                this.moveTreeNode = data
            },
            initDefaultTopNode () {
                return [
                    {
                        has_children: true,
                        id: 0,
                        isdep: 0,
                        name: this.nodeTopName,
                        pid: 0,
                        godPid: 0,
                    }
                ]
            },
            // 保存移动
            saveMove () {
                if (this.moveTreeNode.id == undefined) {
                    xmview.showTip('warning', '请选中节点')
                }
                organizationService.moveSection({id: this.currentNode.id, pid: this.moveTreeNode.id}).then(ret => {
                    xmview.showTip('success', '移动成功')
                    // // 删除要移动的部门
                    // this.$refs.companyTree.removeChildNode(this.currentNode)
                    // // 移动到目标部门
                    // this.$refs.companyTree.addChildNode(this.currentNode, this.moveTreeNode)
                    this.moveTreeDialog = false
                    this.$emit('success', this.moveTreeNode.id, ret.data)
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '移动失败')
                })
            },

        }
    }
</script>
