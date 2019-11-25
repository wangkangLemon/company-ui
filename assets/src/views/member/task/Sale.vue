<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-task-sale-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-task-sale-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>任务名称</i>
                <el-input
                    v-model="fetchParam.name"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>任务门店</i>
                <Department 
                    v-model="fetchParam.target_department_id"
                    :change="fetchData">
                </Department>
            </section>
            <section>
                <DateRange 
                    title="任务周期" 
                    :start="fetchParam.start_date" 
                    :end="fetchParam.end_date"
                    v-on:changeStart="val=>{fetchParam.start_date=val}"
                    v-on:changeEnd="val=>{fetchParam.end_date=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.create_start_time" 
                    :end="fetchParam.create_end_time"
                    v-on:changeStart="val=>{fetchParam.create_start_time=val}"
                    v-on:changeEnd="val=>{fetchParam.create_end_time=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <i>完成状态</i>
                <el-select v-model="fetchParam.finished" filterable clearable placeholder="请选择" @change="fetchData">
                    <el-option label="已完成" :value="1"></el-option>
                    <el-option label="未完成" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <i>任务状态</i>
                <el-select v-model="fetchParam.status" filterable clearable placeholder="请选择" @change="fetchData">
                    <el-option label="待上线" :value="1"></el-option>
                    <el-option label="上线" :value="2"></el-option>
                    <el-option label="下线" :value="3"></el-option>
                </el-select>
            </section>
            <el-button class="top-btn" icon="el-icon-plus" type='primary' @click="$router.push({name: 'member-task-sale-create'})">添加任务</el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="任务名称" 
                    prop="name" 
                    min-width="100">
                    <el-button 
                        slot-scope="{ row }" 
                        type='text' 
                        @click="$router.push({name: 'member-task-sale-performance', query: { sale_task_id: row.id}})">
                        {{row.name}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="任务门店" 
                    prop="target_department_name" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="目标总额" 
                    prop="target_money" 
                    width="90">
                    <span slot-scope="{ row }">¥{{row.target_money}}</span>
                </el-table-column>
                <el-table-column 
                    label="完成额" 
                    prop="current_money" 
                    width="80">
                    <span slot-scope="{ row }">¥{{row.current_money}}</span>
                </el-table-column>
                <el-table-column 
                    label="任务状态" 
                    prop="status_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="任务周期" 
                    width="190">
                    <span slot-scope="{ row }">{{row.start_date}} ~ {{row.end_date}}</span>
                </el-table-column>
                <el-table-column 
                    label="任务创建时间" 
                    prop="create_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="完成状态" 
                    prop="finished_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="完成进度" 
                    prop="percent" 
                    width="80">
                    <span slot-scope="{ row }">{{row.percent}}%</span>
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    width="100">
                    <template slot-scope="{ row }">
                        <el-button 
                            type='text' 
                            :disabled="row.status === 2 || row.finished === 1 || Date.now() > Date.parse(row.end_date)"
                            @click="$router.push({name: 'member-task-sale-edit', query: {sale_task_id: row.id, offline: row.status === 3 && (Date.parse(row.start_date) < Date.now() && Date.now() < Date.parse(row.end_date)) ? 1 : 0 }})">
                            修改
                        </el-button>
                        <el-button type='text' @click="disableTask(row)">{{row.status === 2 ? '下线' : '上线'}}</el-button>
                    </template>
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
    import DateRange from 'components/form/DateRangePicker.vue'
    import Department from 'components/select/Department.vue'

    export default {
        components: {
            DateRange,
            Department
        },
        props: {},
        activated () {
        },
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
                fetchParam: {
                    name: '',
                    target_department_id: '',
                    start_date: '',
                    end_date: '',
                    create_start_time: '',
                    create_end_time: '',
                    finished: '',
                    status: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return saleTaskService.searchSaleTask(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            disableTask (row) {
                return saleTaskService.disableTask({
                    saletask_id: row.id,
                    status: row.status === 2 ? 3 : 2
                }).then(() => {
                    this.fetchData()
                })
            },
        },
        filters: {},
        directives: {},
    }
</script>
