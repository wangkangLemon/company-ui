<style lang="scss">
    @import "~utils/mixins/common";
    #store-nav-container {
    }
</style>

<template>
    <main id="store-nav-container">
        <el-menu 
            mode="horizontal"
            menu-trigger="click"
            :default-active="navMenueActive" 
            :unique-opened="true"
            @open="loadChildren"
            @select="handleMenuClick">
            <!-- <div class="nav-title">导航</div> -->
            <NavTree 
                v-for="item in navMenus" 
                :data="item" 
                v-model="data"
                :key="item.item.id">
            </NavTree>
        </el-menu>
    </main>
</template>

<script>
    import NavTree from 'components/tree/NavTree.vue'
    import storeService from 'services/store/storeService'
    import treeUtils from 'utils/treeUtils'
    import {isArray} from 'utils/typeUtils'

    export default {
        components: {
            NavTree,
        },
        props: {
            value: Object,
            navMenueActive: {
                type: String,
                default: '0'
            }
        },
        activated () {},
        created () {
            this.fetchData({id: 0}).then(ret => {
                this.navMenus = treeUtils.arr2Tree(ret, 0, 'parent_id', 'id', (item) => {
                    return {
                        item: item,
                        children: item.has_children ? [{name: '加载中...', item: { id: -3, parent_id: 0 }}]: null,
                        id: item.id
                    }
                }) || []
                // 添加全部
                this.navMenus.unshift({
                    item: { id: 0, name: '全部',  parent_id: 0 },
                    children: null,
                })
                // 添加优惠
                this.navMenus.push({
                    item: { id: -2, name: '限时优惠', parent_id: 0 },
                    children: null,
                    id: 0,
                })
                console.log(this.navMenus)
            })
        },
        mounted () {},
        computed: {},
        watch: {
        },
        data () {
            return {
                loading: false,
                data: this.value,
                navMenus: []
            }
        },
        methods: {
            fetchData (params) {
                return storeService.getCategoryTree(params)
            },
            handleMenuClick (key, path) {
                this.$emit('change', +key)
            },
            loadChildren (index) {
                // debugger
                this.fetchData({id: index}).then(ret => {
                    ret.map((item) => {
                        item.id = item.id
                        item.item = item
                        item.children = item.has_children ? 
                                        [{label: '加载中...', item: {id: -3, parent_id: 0}}] : 
                                        null
                    })
                    delete ret.tipCom
                    treeUtils.findItem(this.navMenus, [+index]).children = ret
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
