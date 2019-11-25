<!--门店下拉框-->

<template>
    <SelectScroll 
        v-model="currVal" 
        :changeCb="handleChange" 
        :requestCb="fetchData" 
        :placeholder="placeholder" 
        :list="list"
        :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import SelectScroll from '../../component/form/SelectScroll.vue'
    import depService from 'services/departmentService'
    export default{
        components: {
            SelectScroll
        },
        props: {
            value: [String, Number],
            change: Function,
            placeholder: String,
            list: Array,
            disabled: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 15
            }
        },
        watch: {
            'value' (val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            }
        },
        methods: {
            fetchData (val, length) {
                return depService.getDepartmentByName({
                    keyword: val,
                    page_size: this.pageSize,
                    page: parseInt(length / this.pageSize) + 1
                }).then((ret) => {
                    this.$emit('changeList', ret.data)
                    return ret
                })
            },
            handleChange (val) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val)
                this.change && this.change()
            },
        },
    }
</script>
