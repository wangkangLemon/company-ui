<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-profile-info-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-profile-info-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>最近消费门店</i>               
                <Department 
                    v-model="fetchParam.last_cost_department_id"
                    :change="fetchData">
                </Department>
            </section>
            <section>
                <i>会员姓名</i>
                <el-input
                    v-model="fetchParam.name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <DateRange 
                    title="到店时间" 
                    :start="fetchParam.arrive_start_time" 
                    :end="fetchParam.arrive_end_time"
                    v-on:changeStart="val => { fetchParam.arrive_start_time=val }"
                    v-on:changeEnd="val => { fetchParam.arrive_end_time=val }"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <DateRange 
                    title="注册时间" 
                    :start="fetchParam.regist_start_time" 
                    :end="fetchParam.regist_end_time"
                    v-on:changeStart="val => { fetchParam.regist_start_time=val }"
                    v-on:changeEnd="val => { fetchParam.regist_end_time=val }"
                    :change="fetchData">
                </DateRange>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="顾客姓名" 
                    prop="name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="性别" 
                    prop="sex" 
                    min-width="140">
                    <span slot-scope="{ row }">{{row.sex === 1 ? '女' : '男'}}</span>
                </el-table-column>
                <el-table-column 
                    label="年龄" 
                    prop="age" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="会员卡号" 
                    prop="vip_num" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="标签" 
                    prop="tags" 
                    min-width="170">
                    <template slot-scope="{ row }">
                        <el-tag v-for="tag in row.tags" :key="tag.id">{{tag.name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="最近消费门店" 
                    prop="last_cost_department_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="注册时间" 
                    prop="regist_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="最近进店时间" 
                    prop="last_arrive_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="进店次数" 
                    prop="arrive_num" 
                    min-width="140">
                    <el-button 
                        slot-scope="{ row }"  
                        type='text' 
                        :disabled="row.arrive_num===0"
                        @click="viewArriving(row)">
                        {{row.arrive_num}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    fixed="right"
                    label="累计消费金额"
                    prop="cost"
                    min-width="140">
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

        <FlowingCount 
            :visible.sync="flowingCount.showDialog"
            :id="flowingCount.id">
        </FlowingCount>
    </main>
</template>

<script>
    import customerService from 'services/member/customerService'
    import Department from 'components/select/Department.vue'
    import DateRange from 'components/form/DateRangePicker.vue'
    import FlowingCount from '../component/FlowingCount.vue'

    export default {
        components: {
            Department,
            DateRange,
            FlowingCount,
        },
        props: {},
        activated () {},
        created () {
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
                flowingCount: {
                    showDialog: false,
                    id: 0
                },
                fetchParam: {
                    last_cost_department_id: '',
                    name: '',
                    arrive_start_time: '',
                    arrive_end_time: '',
                    regist_start_time: '',
                    regist_end_time: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return customerService.searchCustomer(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            viewArriving (row) {
                this.flowingCount.showDialog = true
                this.flowingCount.id = row.id
            }
        },
        filters: {},
        directives: {},
    }
</script>
