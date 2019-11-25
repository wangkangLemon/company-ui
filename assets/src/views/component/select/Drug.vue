<template>
    <SelectScroll 
        ref="selectScroll"
        :changeCb="handleChange" 
        :requestCb="fetchData" 
        :placeholder="placeholder"
        v-model="currVal" 
        multiple
        :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import drugService from 'services/course/drugService'
    import SelectScroll from 'components/form/SelectScroll.vue'
    export default{
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
        components: {
            SelectScroll
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 10
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            },
        },
        methods: {
            handleChange(val, name) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val, name)
                this.change && this.change()
            },
            fetchData (val, length) {
                let common_name = val
                let page = parseInt(length / this.pageSize) + 1
                let page_size = this.pageSize
                return drugService.searchDrug({common_name, page, page_size})
            },
            // 手动清除选中状态
            clear () {
                // 'el-select'
                // 'el-select__tags'
                // 'el-tag__close el-icon-close'
                let arr = this.$el.querySelectorAll('i.el-icon-close')

                for (let i = 0, len = arr.length; i < len; i++) {
                    setTimeout(() => {
                        arr[i].click()
                    }, i * 100)
                }
            }
        }
    }
</script>
