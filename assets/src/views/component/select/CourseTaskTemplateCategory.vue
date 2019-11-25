<style lang="scss" type="stylesheet/scss">
    .el-cascader-menu {
        height: auto !important;
    }
</style>
<!--课程任务模板分类-->
<template>
    <el-cascader
            :options='options' :show-all-levels="false"
            :clearable="true"
            :props="props"
            @change="setCurrVal"
            :placeholder="placeholder"
    ></el-cascader>
</template>

<script>
    import coursetaskService from 'services/server/coursetaskService'
    export default{
        props: {
            value: [String, Number],
            onchange: Function,
            placeholder: {
                type: String,
                default: '请选择'
            },
        },
        data () {
            return {
                options: [],
                currVal: this.value,
                props: {
                    value: 'id',
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created () {
            coursetaskService.courseTaskTree().then((ret) => {
                this.options = ret.data || []
            })
        },
        methods: {
            setCurrVal (val) {
                if (this.currVal == val || !val) return
                this.currVal = val
                this.$emit('input', val[val.length - 1])
                this.onchange && this.onchange(val)
            },
        }
    }
</script>
