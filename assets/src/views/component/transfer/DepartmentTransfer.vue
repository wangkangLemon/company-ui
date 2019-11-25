<!-- 
    门店transfer
 -->
<style>
    
</style>

<template>
    <main id="components-transfer-department">
        <Transfer 
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
        </Transfer>
    </main>
</template>

<script>
    import departmentService from 'services/departmentService'
    import Transfer from 'components/dialog/Transfer2.vue'

    export default {
        components: {
            Transfer,
        },
        props: {
            value: Array,
            showSelectedData: {
                type: Boolean,
                default: true
            }
        },
        watch: {},
        created () {
            this.fetchParam = this.initFetchParam()
            this.fetchData()
        },
        data () {
            return {
                selected: this.value,
                loading: false,
                fetchParam: this.initFetchParam(),
                data: [],
                total: 0,
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                departmentService.getDepartment(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
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
            initFetchParam () {
                return {
                    keyword: '',
                    page: 1,
                    page_size: 15
                }
            }
        },
    }
</script>
