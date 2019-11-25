<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-selling-staff-detail-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-selling-staff-detail-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>品类类型</i>
                <MedicineCategory 
                    v-model="fetchParam.medicine_category_id"
                    :change="fetchData">
                </MedicineCategory>
            </section>
            <section>
                <i>药品名称</i>
                <Medicine 
                    v-model="fetchParam.medicine_id"
                    :change="fetchData">
                </Medicine>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border @sort-change="sort">
                <el-table-column 
                    label="药品名称" 
                    prop="medicine_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="规格" 
                    prop="dosage" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="生产厂家" 
                    prop="factory" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="品类类型" 
                    prop="medicine_category_name" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="销售数量" 
                    prop="selling_count" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="单位" 
                    prop="unit" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="销售额" 
                    prop="selling_money" 
                    sortable="custom"
                    width="100">
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
    import DateRange from 'components/form/DateRangePicker.vue'
    import Department from 'components/select/Department.vue'
    import MedicineCategory from 'components/select/MedicineCategory'
    import Medicine from 'components/select/Medicine'

    export default {
        components: {
            DateRange,
            Department,
            MedicineCategory,
            Medicine
        },
        props: {},
        activated () {
        },
        created () {
            this.fetchParam.user_id = this.$route.query.user_id
            if (this.$route.query.time) {
                xmview.setContentTitle(`${this.$route.query.name}销售详情 - ${this.$route.query.time}`)
            } else {
                xmview.setContentTitle(`${this.$route.query.name}销售详情`)
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
                    user_id: '',
                    medicine_category_id: '',
                    medicine_id: '',
                    start_date: '',
                    end_date: '',
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
                return sellingService.searchDetailedStaff(this.fetchParam).then(ret => {
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
