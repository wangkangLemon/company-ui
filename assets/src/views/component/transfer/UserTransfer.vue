<!-- 
    用户transfer
 -->
<style lang="scss">
    #components-transfer-user {
        .search {
            margin-bottom: 5px;
        }
    }
</style>

<template>
    <main id="components-transfer-user">
        <section class="search">
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </section>
        </section>
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
    import { userNameList } from 'services/userService'
    import DepSelect from 'components/select/Department.vue'
    import Transfer from 'components/dialog/Transfer2.vue'

    export default {
        components: {
            Transfer,
            DepSelect
        },
        props: {
            value: Array,
            showSelectedData: {
                type: Boolean,
                default: true
            }
        },
        watch: {

        },
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
                userNameList(this.fetchParam).then(ret => {
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
                    department_id: '',
                    keyword: '',
                    page: 1,
                    page_size: 15
                }
            }
        },
    }
</script>
