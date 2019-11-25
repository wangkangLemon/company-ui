<!--课程栏目-->
<style lang="scss">
    .course-select-container {
        .el-icon-caret-bottom {
            text-align: center;
            text-align-last: center;
        }
    }
</style>
<template>
    <el-cascader class="course-select-container" ref="container" 
        v-loading="loading"
        :options='options' 
        :props="props"
        :show-all-levels="false"
        :placeholder="placeholder"
        @change="setCurrVal"
        @active-item-change="handleItemChange"
        @click.native="clickFn"
        clearable
    ></el-cascader>
</template>

<script>
    import treeUtils from 'utils/treeUtils'
    import courseService from 'services/courseService'
    export default{
        props: {
            type: String, // 课程类型
            value: [String, Number, Array],
            autoClear: {
                type: Boolean,
                default: false
            },
            onchange: Function,
            placeholder: {
                type: String,
                default: '请选择'
            },
            showNotCat: { // 是否显示未分类的选项
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                loading: false,
                options: [],
                currVal: this.value,
                companyid: void 0, // 企业id
                lastData: void 0,
                props: {
                    // value: 'name'
                }
            }
        },
        watch: {
            'value' (val) {
                this.setCurrVal(val)
            },
            'currVal' (val, old) {
                this.$emit('input', val)
                this.onchange && this.onchange(val)
            }
        },
        mounted () {
        },
        deactivated () {
            if (this.autoClear && this.options.length > 0) {
                this.lastData = this.options
                this.options = []
            }
        },
        activated () {
        },
        methods: {
            setCurrVal (val) {
                if (!val) this.$refs.container.clearValue(new window.Event('click'))
                if (this.currVal == val || !val) return
                // this.currVal = val
                this.currVal = val.length > 0 ? parseInt(val[val.length - 1]) : val
            },
            handleItemChange (val) {
                if (val.length < 1) return
                // 递归找到该项
                let currItem = treeUtils.findItem(this.options, val, 'value')

                if (!currItem.children || (currItem.children.length > 0 && currItem.children[0].value)) return
                courseService.getCategoryTree({id: val[val.length - 1], course_type: this.type})
                    .then(ret => {
                        // 重新组合数据
                        ret.data.map((item) => {
                            item.label = item.name
                            item.value = item.id
                            item.children = item.has_children ? [{label: '加载中...'}] : null
                        })
                        currItem.children = ret.data
                    })
            },
            clickFn () {
                if (this.loading || this.options.length > 0) return
                if (this.lastData) {
                    this.options = this.lastData
                } else {
                    this.getData()
                }
            },
            getData () {
                this.loading = true
                courseService.getCategoryTree({course_type: this.type}).then(ret => {
                    // 不显示未分类那一项
                    if (!this.showNotCat) {
                        var res = ret.data.filter((item) => {
                            return item.id != 0
                        })
                    }
                    this.options = treeUtils.arr2Cascader(res || ret.data, 0, void 0, void 0, 'name', 'id')
                    this.loading = false
                })
            },
            clearData () {
                this.lastData = this.options
                this.options = []
            }
        },
        components: {}
    }
</script>
