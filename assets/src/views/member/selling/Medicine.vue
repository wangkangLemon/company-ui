<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-selling-medicine-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-selling-medicine-container">
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
            <section>
                <i>销售门店</i>
                <Department 
                    v-model="fetchParam.department_id"
                    :change="fetchData">
                </Department>
            </section>
            <section>
                <DateRange 
                    title="查找时间" 
                    :start="fetchParam.start_date" 
                    :end="fetchParam.end_date"
                    v-on:changeStart="val => { fetchParam.start_date=val }"
                    v-on:changeEnd="val => { fetchParam.end_date=val }"
                    :change="fetchData">
                </DateRange>
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
                    <el-button 
                        slot-scope="{ row }" 
                        type='text' 
                        @click="$router.push({name: 'member-selling-medicine-detail', query: { medicine_id: row.medicine_id, name: row.medicine_name, time }})">
                        {{row.medicine_name}}
                    </el-button>
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
                    width="80">
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
                    width="120">
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
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {
            time () {
                if (this.fetchParam.start_date && this.fetchParam.end_date) {
                    return `${this.fetchParam.start_date} - ${this.fetchParam.end_date}`
                }
            }
        },
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    medicine_category_id: '',
                    department_id: '',
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
                return sellingService.searchMedicine(this.fetchParam).then(ret => {
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
