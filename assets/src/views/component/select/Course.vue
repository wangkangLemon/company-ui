<template>
    <SelectScroll 
        ref=selectScroll
        :changeCb="handleChange"
        :requestCb="fetchData"
        :placeholder="placeholder"
        v-model="currVal"
        :disabled="disabled">
    </SelectScroll>
</template>

<script>
    import courseService from 'services/courseService'
    import newCourseService from 'services/newcourse/courseService'
    import SelectScroll from 'components/form/SelectScroll.vue'
    export default{
        props: {
            status: {
                type: Number,
                default: -1
            },
            type: String, // 课程类型
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
                pageSize: 10,
                fetchParam:getFetchParam()
            }
        },
        watch: {
            'value' (val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            },
            type (val) {
                console.log(val)
                this.$refs.selectScroll.filter()
                this.clear()
            }
        },
        methods: {
            handleChange (val, name) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val, name)
                this.change && this.change()
            },
            fetchData (val, length) {
                if(this.type=='teaching'){
                this.fetchParam.keyword = val
                this.fetchParam.page = parseInt(length / this.pageSize) + 1
                return newCourseService.teachSearch(this.fetchParam)
                }else if(this.type=='company_teach'){
                 this.fetchParam.keyword = val
                 this.fetchParam.page = parseInt(length / this.pageSize) + 1
                return newCourseService.search(this.fetchParam)
                }
               
            },
            // 手动清除选中状态
            clear () {
                this.$refs.selectScroll.clear()
            }
        }
    }
    function getFetchParam () {
    return {
        keyword:'',
        publish_status: void 0, // 2 视屏转码中，1 下线，0 正常，-1 全部
        category_id: void 0, // 栏目id
        time_start: void 0,
        time_end: void 0,
        page: 1,
        page_size: 15,
        course_type: 'teaching',
    }
}
</script>
