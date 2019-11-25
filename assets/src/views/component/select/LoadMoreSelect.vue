<template>
    <SelectScroll :changeCb="handleChange" :requestCb="fetchData" :placeholder="placeholder"
                  v-model="currVal" :disabled="disabled" :type="type">
    </SelectScroll>
</template>

<script>
    import courseService from 'services/newcourse/courseService'
    import courseTaskService from 'services/server/coursetaskService'
    import articleService from 'services/server/articleService'
    import SelectScroll from 'components/form/SelectScroll.vue'
    export default{
        props: {
            value: [String, Number],
            change: Function,
            type: String,         // request的类型，article,course,task
            placeholder: String,
            list: Array,
            disabled: {
                type: Boolean,
                default: false
            },
            industry: {
                type: String,
                require: false
            }
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
            'value' (val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            },
        },
        methods: {
            handleChange (val) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val)
                this.change && this.change()
            },
            fetchData (val, length) {
                let keyword = val
                let page = parseInt(length / this.pageSize) + 1
                switch (this.type) {
                case 'course':
                    return this.getService()(keyword, page, this.pageSize, this.industry ? this.industry : '')
                case 'article':
                    return this.getService()({title: keyword, page, page_size: this.pageSize})
                case 'coursetask':
                    return this.getService()({keyword, page, page_size: this.pageSize})
                }
            },
            getService () {
                let map = {
                    'course': courseService.courseList,
                    'article': articleService.getArticleList,
                    'coursetask': courseTaskService.getTaskSearch,
                }
                return map[this.type]
            }
        }
    }
</script>
