<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/topSearch";
</style>

<template>
    <SelectScroll 
        v-model="currVal" 
        :changeCb="handleChange" 
        :requestCb="fetchData" 
        :requestTtach="getTeacher"
        :placeholder="placeholder" 
        :inputPlaceholder="inputPlaceholder"
        :list="list" >
    </SelectScroll>
</template>

<script>
    import {userNameList} from 'services/userService'
    import teachingService from 'services/learning/teaching'
    import SelectScroll from 'components/form/SelectScroll.vue'
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
            }
        },
        data () {
            return {
                currVal: this.value,
                pageSize: 15,
                inputPlaceholder: '姓名'
            }
        },
        watch: {
            'value' (val, oldValue) {
                this.currVal !== val && (this.currVal = val)
            }
        },
        methods: {
            handleChange (val) {
                this.currVal = val
                this.$emit('input', val)
                this.$emit('change', val) 
                this.change && this.change()
            },
            fetchData (val, length) {
                return teachingService.getTeachingUserList({
                    keyword: val,
                    page_size: this.pageSize,
                    page: parseInt(length / this.pageSize) + 1
                }).then((ret) => {
                    this.$emit('changeList', ret.data)
                    return ret
                })
            },
             getTeacher(){
                return teachingService.getTeachingUserList(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
        }
    }
</script>
