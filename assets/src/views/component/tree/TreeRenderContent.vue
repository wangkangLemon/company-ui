<style lang="scss" rel="stylesheet/scss">
    .set-color {
        color: red;
    }
    .operate__content {
        position: absolute;
        right: 5px;
        top: -2px;
        // float: right;
    }
</style>
<template>
    <span class="operate__content">
        <el-popover
            ref="popover5"
            placement="right"
            trigger="hover">
            <el-button type="text" slot="reference" v-show="nodeClick.id===node.id && showEditOption">操作</el-button>
            <template v-for="(item, index) in editOption">
                <div style="margin: 0; text-align: center;">
                    <el-button
                        :key="item.id"
                        type="text"
                        @click="handleAction(item.action, item.name)">
                        {{item.name}}
                        <!-- <tree-render-content v-if="item.id===0" :editOption="item.editOption"/> -->
                    </el-button>
                </div>
            </template>
        </el-popover>
    </span>
</template>
<script>
    export default {
        name: 'TreeRenderContent',
        props: ['editOption', 'node', 'nodeClick', 'showEditOption'],
        data () {
            return {}
        },
        methods: {
            handleAction (action, name) {
                this.$emit('action', action, name)
            }
        }
    }
</script>
