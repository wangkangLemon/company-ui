<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #feedback-index {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <main id="feedback-index">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name:'feedback-add'})"><i>提交问题</i></el-button>
        </section>

        <main class="search">
            <section>
                <i>反馈状态</i>
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="未分配" value="0"></el-option>
                    <el-option label="处理中" value="1"></el-option>
                    <el-option label="待补充" value="2"></el-option>
                    <el-option label="待处理" value="3"></el-option>
                    <el-option label="待确认" value="4"></el-option>
                    <el-option label="已关闭" value="9"></el-option>
                </el-select>
            </section>

            <DateRange title="提交时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=> fetchParam.time_start=val"
                       v-on:changeEnd="val=> fetchParam.time_end=val"
                       :change="fetchData">
            </DateRange>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" border>
            <el-table-column width="100" prop="id" label="反馈编号"></el-table-column>
            <el-table-column width="120" prop="category_name" label="问题分类"></el-table-column>
            <el-table-column prop="content" label="问题描述"></el-table-column>
            <el-table-column width="180" prop="create_time_name" label="提交时间"></el-table-column>
            <el-table-column width="100" prop="status_name" label="状态">
                <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.status == 2 || scope.row.status == 4">
                        {{ scope.row.status_name }}
                    </el-tag>
                    <el-tag type="info" v-else>{{ scope.row.status_name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="100" prop="operate" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewFn(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="deleteFn(scope, scope.row.id)"
                               v-if="[0, 9].indexOf(scope.row.status) > -1">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>

    </main>
</template>

<script>
    import feedbackService from '../../../services/base/feedbackService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                dialogVisible: false,
                fetchParam: {
                    status: void 0,
                    category_id: void 0,
                    page: 1,
                    page_size: 15,
                    time_start: void 0,
                    time_end: void 0
                }
            }
        },
        activated () {
            if (this.$route.params['reload']) {
                this.fetchData()
            }
            xmview.setContentLoading(false)
        },
        created () {
            this.fetchData()
        },
        methods: {
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData (val) {
                this.loadingData = true
                return feedbackService.search(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
            viewFn (id) {
                this.$router.push({name: 'feedback-view', query: {feedback_id: id}})
            },
            deleteFn (index, id) {
                xmview.showDialog('你将要执行删除操作且不可恢复确认吗？', () => {
                    feedbackService.remove(id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.data.splice(index, 1)
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            }
        }
    }
</script>
