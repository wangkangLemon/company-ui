<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #product-statistics-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <main id="product-statistics-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>产品名称</i>
                <el-input
                    v-model="fetchParam.product_name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>关联工业</i>
                <el-input
                    v-model="fetchParam.industry_name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>统计月份</i>
                <StatMonth 
                    @change="val => {fetchParam.stat_month = val;fetchData()}">
                </StatMonth>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-document" 
                type='warning' 
                @click="exportFile">
                导出
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="产品名称" 
                    prop="product_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="关联工业" 
                    prop="industry_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="课件数" 
                    width="80">
                    <el-button 
                        type="text" 
                        slot-scope="{row}"
                        :disabled="!row.courseware_count"
                        @click="openTable(row, 'CoursewareTable')">
                        {{row.courseware_count}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="课程数" 
                    width="80">
                    <el-button 
                        type="text" 
                        slot-scope="{row}"
                        :disabled="!row.course_count"
                        @click="openTable(row, 'CourseTable')">
                        {{row.course_count}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="任务数" 
                    width="80">
                    <el-button 
                        type="text" 
                        slot-scope="{row}"
                        :disabled="!row.task_count"
                        @click="openTable(row, 'TaskTable')">
                        {{row.task_count}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="覆盖人数" 
                    width="80">
                    <el-button 
                        type="text" 
                        slot-scope="{row}"
                        :disabled="!row.user_total"
                        @click="openTable(row, 'UserTable')">
                        {{row.user_total}}
                    </el-button>
                </el-table-column>
<!--                 <el-table-column 
                    label="学习人次" 
                    width="80">
                    <el-button 
                        type="text" 
                        slot-scope="{row}"
                        @click="openTable(row, 'UserTimesTable')">
                        {{row.learn_user_times}}
                    </el-button>
                </el-table-column> -->
                <el-table-column 
                    label="学习人数" 
                    width="80">
                    <el-button 
                        type="text" 
                        slot-scope="{row}"
                        :disabled="!row.learn_user_count"
                        @click="openTable(row, 'UserTotalTable')">
                        {{row.learn_user_count}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="统计月份" 
                    prop="stat_month"
                    width="180">
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
        <el-dialog 
            v-if="tableModel.showDialog"
            :title="tableModel.title | title" 
            :visible.sync="tableModel.showDialog">
            <component 
                :is="tableModel.component" 
                :stat-month="tableModel.statMonth"
                :product-id="tableModel.productId"
                :task-id="tableModel.taskId">
            </component>
        </el-dialog>
    </main>
</template>

<script>
    import productService from 'services/product/productService'
    import StatMonth from '../component/StatMonth'
    import CoursewareTable from './CoursewareTable.vue' // 课件流水
    import CourseTable from './CourseTable.vue'  // 课程流水
    import TaskTable from './TaskTable.vue'      // 任务流水
    import TaskLearnTable from './TaskLearnTable.vue' // 任务流水学习人次
    import UserTable from './UserTable.vue'      // 人员流水
    import UserTimesTable from './UserTimesTable.vue'   // 学习人次流水
    import UserTotalTable from './UserTotalTable.vue'   // 学习人次流水

    export default {
        components: {
            StatMonth,
            CoursewareTable,
            CourseTable,
            TaskTable,
            TaskLearnTable,
            UserTable,
            UserTimesTable,
            UserTotalTable,
        },
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                stat_month: [],
                fetchParam: {
                    product_name: '',
                    industry_name: '',
                    stat_month: '',
                    page: 1,
                    page_size: 15,
                },
                tableModel: {
                    showDialog: false,
                    title: '',
                    productId: '',
                    taskId: '',
                    statMonth: '',
                    component: '',
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return productService.searchStat(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            openTable (row, type) {
                this.tableModel.title = this.tableModel.component = type
                this.tableModel.productId = row.product_id
                this.tableModel.taskId = row.course_task_id
                this.tableModel.statMonth = row.stat_month
                this.tableModel.showDialog = true
            },
            exportFile () {
                return productService.export(this.fetchParam).then(() => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            }
        },
        filters: {
            title (val) {
                let map = {
                    'CoursewareTable': '课件流水',
                    'CourseTable': '课程流水',
                    'TaskTable': '任务流水',
                    'TaskLearnTable': '学习人数流水',
                    'UserTable': '人员流水',
                    'UserTimesTable': '学习次数流水',
                    'UserTotalTable': '学习人数流水',
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
