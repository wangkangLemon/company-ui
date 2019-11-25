<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-exam-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <el-dialog 
        :title="title" 
        :visible.sync="showDialog">
        <main id="learning-map-exam-container">
            <section class="search">
                <!-- 搜索条件 -->
                <section>
                    <i>试卷名称</i>
                    <el-input
                        v-model="fetchParam.keyword"
                        @keyup.enter.native="fetchData">
                    </el-input>
                </section>
            </section>
            <section>
                <!-- 内容主体 -->
                <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
                <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
                <!-- 固定列通过配置fixed="right || left"-->
                <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                    <el-table-column 
                        label="试卷名称" 
                        prop="name" 
                        min-width="140">
                    </el-table-column>
                    <el-table-column 
                        label="题目数量" 
                        prop="subject_total" 
                        width="80">
                    </el-table-column>
                    <el-table-column 
                        label="试卷总分" 
                        prop="score_total" 
                        width="80">
                    </el-table-column>
                    <el-table-column 
                        label="及格分数" 
                        prop="score_pass" 
                        width="80">
                    </el-table-column>
                    <el-table-column 
                        label="可考试次数" 
                        prop="limit_repeat" 
                        width="80">
                        <span slot-scope="{row}">{{row.limit_repeat === 0 ? '不限制' : row.limit_repeat}}</span>
                    </el-table-column>
                    <el-table-column>
                        <el-button slot-scope="scope" type='text' @click="pick(scope.row)">选取</el-button>
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
    </el-dialog>
</template>

<script>
    import examService from 'services/exam/testPagerService'

    export default {
        components: {},
        props: {
            visible: Boolean,
            title: String,
            selected: {
                type: Array,
                default: () => []
            },
            taskType: Number,
        },
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {
            visible (val) {
                if (val) this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                showDialog: this.visible,
                selectedExam: this.selected,
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    keyword: '',
                    status: 0,
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return examService.search(this.fetchParam).then(ret => {
                    this.data = ret.list || ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            pick (row) {
                row.taskType = this.taskType
                // get the result by props——selected or emit——pick
                this.selectedExam.length = 0
                this.selectedExam.push(row)
                this.$emit('pick', row)
                this.showDialog = false
            }
        },
        filters: {},
        directives: {},
    }
</script>
