<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-course-courserank-container {
    @extend %content-container;
    .block {
        float: right;
        margin-top: 15px;
    }
    .export-btn{
        float:right;
        margin-top: -65px;
    }
}
</style>
<template>
    <main id="analytics-report-course-courserank-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item label="排列方式：">
                <el-select v-model="fetchParam.sort_type" placeholder="请选择" clearable @change="fetchData">
                    <el-option v-for="item in types"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="fetchData">查询</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="data" border :fit="true" v-loading="loading">
            <el-table-column
                    prop="course_task_name"
                    label="课程任务名称">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    label="门店">
            </el-table-column>
            <el-table-column
                    prop="total_user"
                    label="门店参与人数">
            </el-table-column>
            <el-table-column
                    prop="finished_user"
                    label="完成学习人数">
            </el-table-column>
            <el-table-column
                    prop="finished_rate"
                    label="完成学习占比">
            </el-table-column>
            <el-table-column
                    prop="part_finished_user"
                    label="部分完成人数">
            </el-table-column>
            <el-table-column
                    prop="part_finished_rate"
                    label="部分完成占比">
            </el-table-column>
            <el-table-column
                    prop="unlearned_user"
                    label="未学习人数">
            </el-table-column>
            <el-table-column
                    prop="unlearned_rate"
                    label="未学习占比">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </main>
</template>

<script>
    import reportService from 'services/analytics/reportService'
    import * as _ from 'utils/common'
    export default {
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_export: 0,
                    sort_type: '',
                    task_id: '',
                    page: 1,
                    page_size: 15,
                },
                types: [{
                    value: 0,
                    label: '完成学习占比'
                }, {
                    value: 1,
                    label: '部分完成占比'
                }, {
                    value: 2,
                    label: '未学习占比'
                }]
            }
        },
        created () {
            xmview.setContentTitle(this.$route.meta.title + '-' + this.$route.query.title)
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                this.fetchParam.task_id = this.$route.query.task_id
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.sort_type = !fetchParam.sort_type && fetchParam.sort_type !== 0
                    ? -1 : fetchParam.sort_type
                return reportService.searchCourse(fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchCourse(this.fetchParam).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            }
        }
    }
</script>
