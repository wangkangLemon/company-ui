<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/mixins";
    .left-menu-container {
        .menu-icon {
            width: 15px;
            height: 15px;
            position: relative;
            top: 2px;
            margin-right: 2px;
        }
    }
</style>

<template>
    <el-submenu 
        :index="'' + data.item.id" 
        v-if="data && data.children != null">
        <template slot="title">
<!--             <i class="fa" :class="data.item.menu_icon" v-if="data.item.menu_icon"></i>
            <i class="fa fa-th-large" v-else></i> -->
            {{data.item.name}}
        </template>

        <NavTree 
            v-for="item in hasChildCItems" 
            :key="item.item.id" 
            :data="item">
        </NavTree>

        <el-menu-item 
            :index="'' + item.item.id" 
            v-for="item in leafChildren" 
            :key="item.item.id" 
            @click="menuItemClick">
            <!-- <i class="fa" :class="item.item.menu_icon" v-if="item.item.menu_icon"></i>
            <i class="fa fa-circle-o" v-else></i> -->
            {{item.item.name}}
        </el-menu-item>
    </el-submenu>

    <el-menu-item 
        :index="'' + data.item.id" 
        v-else-if="data && data.children == null" 
        @click="menuItemClick">
        <!-- <i class="fa" :class="data.item.menu_icon" v-if="data.item.menu_icon"></i>
        <i class="fa fa-th-large" v-else></i> -->
        {{data.item.name}}
    </el-menu-item>
</template>

<script>
    import NavTree from './NavTree.vue'
    import treeUtls from 'utils/treeUtils'

    export default{
        name: 'NavTree',
        components: {
            NavTree
        },
        props: ['data'],
        watch: {
            'data.children' (val) {
                this.initData()
            }
        },
        data () {
            return {
                leafChildren: [], // 叶子节点
                hasChildCItems: [], // 有子节点的item
            }
        },
        created () {
            this.initData()
        },
        methods: {
            initData () {
                let hasChildCItems = []
                let leafChildren = []
                if (this.data.children) {
                    this.data.children.forEach((item) => {
                        if (item.children != null) {
                            hasChildCItems.push(item)
                        } else {
                            leafChildren.push(item)
                        }
                    })
                }

                this.hasChildCItems = hasChildCItems
                this.leafChildren = leafChildren
                console.log(this.hasChildCItems, this.leafChildren)
            },
            menuItemClick (menuItem) {
            }
        }
    }
</script>
