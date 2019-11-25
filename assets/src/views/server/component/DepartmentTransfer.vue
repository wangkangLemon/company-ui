<template>
 <Transfer placeholder="搜索"
    @searchFn="(val)=>{page=1;departments=[]; depkeyword=val; getAlldepartment()}"
    @moreFn="()=>{page++;getAlldepartment();}" 
    :total="total" 
    :data="departments" 
    v-model="selectData">
</Transfer> 
</template>

<script>
import departmentService from 'services/company/departmentService'
import Transfer from 'components/dialog/Transfer'
export default {
    props: {
        value: {
            type: Array
        },
        isdata: {
            type: Boolean
        },
    },
    watch: {
        'value' (val) {
            this.selectData = val
        },
        'selectData' (val) {
            this.selectData = val
            this.$emit('input', this.selectData)
        },
        'isdata' (val) {
            if (val) {
                this.keyword = ''
                this.departments = []
                this.getAlldepartment()
            }
        }
    },
    data () {
        return {
            selectData: this.value,
            total: 10,
            page: 1,
            page_size: 15,
            departments: [],
            depkeyword: '',
        }
    },
    created () {
        this.getAlldepartment()
    },
    methods: {
        getAlldepartment () {  // 获取企业
            return departmentService.departmentSearchByName({
                keyword: this.depkeyword,
                page_size: this.page_size,
                page: this.page
            }).then((ret) => {
                if (this.departments.length > 0 && this.departments.length < ret.total) {
                    this.departments.splice(-1, 1)
                }
                this.departments.push(...ret.data, {id: -1})
                this.total = ret.total
            })
        },
    },
    components: {
        Transfer
    }
}
</script>
