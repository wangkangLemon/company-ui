<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-selling-category-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-selling-category-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>销售门店</i>
                <Department 
                    v-model="fetchParam.department_id"
                    :change="fetchData">
                </Department>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border @sort-change="sort">
                <el-table-column 
                    label="门店" 
                    prop="department_name">
                </el-table-column>
                <el-table-column 
                    label="销售额" 
                    sortable="custom"
                    prop="selling_money">
                    <span slot-scope="{ row }">¥{{row.selling_money}}</span>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>
    </main>
</template>

<script>
    import sellingService from 'services/member/sellingService'
    import Department from 'components/select/Department.vue'

    export default {
        components: {
            Department
        },
        props: {},
        activated () {
        },
        created () {
            this.fetchParam.medicine_category_id = this.$route.query.medicine_category_id
            if (this.$route.query.time) {
                xmview.setContentTitle(`${this.$route.query.name}品类销售 - ${this.$route.query.time}`)
            } else {
                xmview.setContentTitle(`${this.$route.query.name}品类销售`)
            }
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    medicine_category_id: '',
                    department_id: '',
                    sort_type: '',
                    sort_field: 'selling_money',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return sellingService.searchDetailedCategory(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            sort ({order}) {
                this.fetchParam.sort_type = order === 'ascending' ? 'asc' : 'desc'
                this.fetchData()
            }
        },
        filters: {},
        directives: {},
    }
</script>
