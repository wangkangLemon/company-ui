<!-- 
    name: 级联穿梭框
    type: ui组件
-->
<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #cascader-transfer-container {
        @extend %content-container;
        .transfer2-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            .dialog-add-item {
                flex-grow: 1;
                width: 0;
            }
            .dialog-add-item + .dialog-add-item {
                margin-left: 1em;
            }
        }
        .cascader-container {
            flex: 1 1 0;
            align-self: flex-start;
            height: 481px;
            // margin-right: 1em;
            .cascader {
                margin-top: 0;
                // width: 100%;
                height: 100%;
                position: initial;
                ul {
                    width: 100%;
                    height: 425px;
                }
            }
        }
    }
</style>

<template>
    <main id="cascader-transfer-container">
        <Transfer 
            :title="transferTitle"
            placeholder="搜索"
            :loading="loading"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :total="total"
            :data="data"
            v-model="selected"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            @searchFn="handleTransferSearch">
            <div class="cascader-container">
                <section id="cascader"></section>
            </div>
        </Transfer>
    </main>
</template>

<script>
    import Vue from 'vue'
    import Cascader from 'components/form/CascaderMenu.vue'
    import Transfer from 'components/dialog/Transfer2.vue'

    export default {
        components: {
            Transfer
        },
        props: {
            value: Array,
            options: {
                type: Array,
                required: true
            },
            expandTrigger: {
                type: String,
                default: 'click'
            },
            cascaderProps: {
                type: Object,
                default () {
                    return {
                        value: 'id',
                        label: 'name',
                        children: 'children',
                        disabled: 'disabled'
                    }
                }
            },
            hoverThreshold: {
                type: Number,
                default: 500
            },
            transferTitle: {
                type: String,
                default: '药品名'
            },
            transferProps: {
                type: Object,
                default () {
                    return {
                        value: 'id',
                        label: 'name'
                    }
                }
            },
            transferLoader: Function,
            // cascaderLoader: Function,  // 品类懒加载
        },
        activated () {},
        created () {
        },
        mounted () {
            // this.flatOptions = this.flattenOptions(this.options)
            this.initMenu()
        },
        computed: {
            labelKey () {
                return this.cascaderProps.label || 'label'
            },
            valueKey () {
                return this.cascaderProps.value || 'value'
            },
            childrenKey () {
                return this.cascaderProps.children || 'children'
            },
        },
        watch: {
            options: {
                deep: true,
                handler (value) {
                    if (!this.menu) {
                        this.initMenu()
                    }
                    // this.flatOptions = this.flattenOptions(this.options)
                    this.menu.options = value
                }
            },
            selected (val) {
                this.$emit('input', val)
            }
        },
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                selected: this.value,
                fetchParam: this.initFetchParam(),
                menu: null,
                flatOptions: null,
            }
        },
        methods: {
            initMenu () {
                this.menu = new Vue(Cascader).$mount('#cascader')
                this.menu.options = this.options
                this.menu.props = this.cascaderProps
                this.menu.expandTrigger = this.expandTrigger
                this.menu.hoverThreshold = this.hoverThreshold
                this.popperElm = this.menu.$el
                this.menu.$refs.menus[0].setAttribute('id', `cascader-menu-${this.id}`)
                this.menu.popperClass = 'cascader'
                this.menu.visible = true
                this.menu.$on('pick', this.handlePick)
                this.menu.$on('activeItemChange', this.handleActiveItemChange)
                // this.menu.$on('menuLeave', this.doDestroy)
                // this.menu.$on('closeInside', this.handleClickoutside)
            },
            handlePick (value) {
                this.fetchParam.medicine_category_id = value[value.length - 1]
                this.fetchData()
            },
            // 添加children
            handleActiveItemChange (value) {
                this.fetchParam.medicine_category_id = value[value.length - 1]
                this.fetchData()
                // this.$emit('active-item-change', value)
            },
            flattenOptions (options, ancestor = []) {
                let flatOptions = []
                options.forEach((option) => {
                    const optionsStack = ancestor.concat(option)
                    if (!option[this.childrenKey]) {
                        flatOptions.push(optionsStack)
                    } else {
                        if (this.changeOnSelect) {
                            flatOptions.push(optionsStack)
                        }
                        flatOptions = flatOptions.concat(this.flattenOptions(option[this.childrenKey], optionsStack))
                    }
                })
                return flatOptions
            },
            fetchData () {
                this.loading = true
                this.transferLoader && this.transferLoader(this.fetchParam, (ret) => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            initFetchParam () {
                return {
                    medicine_category_id: '',
                    page: 1,
                    page_size: 15
                }
            },
            handlePageChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleTransferSearch (val) {
                this.fetchParam.page = 1
                this.data = []
                this.fetchParam.keyword = val
                this.fetchData()
            },
            submit () {
                this.$emit('submit')
            }
        },
        filters: {},
        directives: {},
    }
</script>
