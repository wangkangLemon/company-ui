<!--报表中心-->
<style lang='scss' rel="stylesheet/scss">
@import "../../utils/mixins/common";
@import "../../utils/mixins/topSearch";
#analytics-report-export-container {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
    .block {
        float: right;
        margin-top: 15px;
    }
}
</style>
<template>
    <article id="analytics-report-export-container">
        <section class="search">
            <section>
                <i>状态</i>
                <el-select clearable v-model="fetchParam.status" @change="fetchData">
                    <el-option label="已完成" :value="0"></el-option>
                    <el-option label="待处理" :value="1"></el-option>
                    <el-option label="进行中" :value="2"></el-option>
                    <el-option label="失败" :value="3"></el-option>
                    <el-option label="已取消" :value="4"></el-option>
                </el-select>
            </section>
        </section>
        <el-table
            v-loading="loading"
            border
            stripe
            :data="dataList">
            <el-table-column
                prop="name"
                min-width="250"
                label="报表名称">
            </el-table-column>
            <el-table-column
                width="100"
                label="状态">
                <el-tag slot-scope="scope" :type="scope.row.status | tagMap">{{scope.row.status | statusMap}}</el-tag>
            </el-table-column>
            <el-table-column
                prop="create_time_name"
                width="180"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="user_name"
                width="100"
                label="操作人">
            </el-table-column>
            <el-table-column
                prop="operate"
                width="70"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                        size="small"
                        @click="downloadFn(scope.row)"
                        v-if="scope.row.status === 0">下载</el-button>
                    <el-button type="text"
                        size="small"
                        @click="retryFn(scope.row)"
                        v-if="scope.row.status === 3">重试</el-button>
                    <el-button type="text"
                        size="small"
                        @click="cancelFn(scope.row)"
                        v-if="scope.row.status === 1">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                @size-change="(val)=>{fetchParam.page_size = val;fetchData();}"
                @current-change="(val)=>{fetchParam.page = val;fetchData();}"
                :current-page="fetchParam.page"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="fetchParam.page_size"
                layout="total, sizes, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
    </article>
</template>

<script>
    import exportService from 'services/analytics/exportService'
    export default {
        data () {
            return {
                loading: false,
                dataList: [],
                fetchParam: {
                    status: '',
                    time_start: '',
                    time_end: '',
                    page_size: 15,
                    page: 1
                },
                total: 0,
            }
        },
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loading = true
                return exportService.exportSearch({
                    status: (!this.fetchParam.status && this.fetchParam.status !== 0) ? -1 : this.fetchParam.status,
                    page: this.fetchParam.page,
                    page_size: this.fetchParam.page_size
                }).then((ret) => {
                    this.total = ret.total
                    this.dataList = ret.data
                }).then(() => {
                    this.loading = false
                })
            },
            downloadFn (row) {
                console.log(row)
                this.loading = true
                let extension = row.last_run.file_path.slice(row.last_run.file_path.lastIndexOf('.')) || '.xls'
                let name = row.name + extension
                console.log(name)
                exportService.exportDownload({id: row.id, name}).then(() => {
                    // xmview.showExportTip((id) => {
                    //     id.onclick = () => {
                    //         this.$router.push({name:'analytics-export'})
                    //     }
                    // })
                    this.loading = false
                    xmview.showTip('success', '下载成功，请查看。')
                })
            },
            cancelFn (row) {
                exportService.exportCancel({id: row.id}).then(() => {
                    xmview.showTip('success', '成功删除')
                    this.fetchData()
                })
            },
            retryFn (row) {
                exportService.exportRetry({id: row.id}).then(() => {
                    xmview.showTip('success', '成功重试')
                })
            }
        },
        filters: {
            statusMap (value) {
                const map = {
                    0: '已完成',
                    1: '待处理',
                    2: '进行中',
                    3: '失败',
                    4: '已取消',
                }
                return map[value]
            },
            tagMap (value) {
                const map = {
                    0: 'success',
                    1: 'primary',
                    2: 'primary',
                    3: 'danger',
                    4: 'info'
                }
                return map[value]
            }
        }
    }
</script>
