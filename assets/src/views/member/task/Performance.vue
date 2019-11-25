<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-task-sale-create-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-task-sale-create-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>品类类型</i>
                <MedicineCategory 
                    v-model="fetchParam.category_id"
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
                <i>完成状态</i>
                <el-select v-model="fetchParam.status" filterable clearable placeholder="请选择" @change="fetchData">
                    <el-option label="未设置" :value="0"></el-option>
                    <el-option label="已完成" :value="1"></el-option>
                    <el-option label="未完成" :value="2"></el-option>
                </el-select>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="药品名称" 
                    prop="name" 
                    min-width="100">
                </el-table-column>
                <el-table-column 
                    label="规格" 
                    prop="dosage" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="生产厂家" 
                    prop="factory" 
                    min-width="100">
                </el-table-column>
                <el-table-column 
                    label="品类类型" 
                    prop="category_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="目标销售额" 
                    prop="target_money" 
                    width="100">
                    <span slot-scope="{ row }">¥{{row.target_money}}</span>
                </el-table-column>
                <el-table-column 
                    label="实际销售额" 
                    prop="current_money" 
                    width="100">
                    <span slot-scope="{ row }">¥{{row.current_money}}</span>
                </el-table-column>
                <el-table-column 
                    label="完成进度" 
                    prop="percent" 
                    width="80">
                    <span slot-scope="{ row }">{{row.percent}}%</span>
                </el-table-column>
                <el-table-column 
                    label="完成状态" 
                    prop="status_name" 
                    width="80">
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
    import saleTaskService from 'services/member/saleTaskService'
    import MedicineCategory from 'components/select/MedicineCategory'
    import Medicine from 'components/select/Medicine'

    export default {
        components: {
            MedicineCategory,
            Medicine
        },
        props: {},
        activated () {},
        created () {
            this.fetchParam.sale_task_id = this.$route.query.sale_task_id
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
                    sale_task_id: '',
                    category_id: '',
                    medicine_id: '',   // 药品id
                    status: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return saleTaskService.searchPerformance(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
