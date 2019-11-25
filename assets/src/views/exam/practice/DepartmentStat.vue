<style lang='scss' rel='stylesheet/scss'>

</style>
<template>
    <div id="paper-content-container">
        <section class="manage-container">
            <el-button icon="el-icon-document" type='warning' @click="exportFn()"><i>导出Excel</i>
            </el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="门店">
                <DepSelect v-model="fetchParam.department_id"  :change="fetchData"></DepSelect>
            </el-form-item>
            <!-- <el-button icon="el-icon-search" @click="fetchData">查询</el-button> -->
        </el-form>

        <el-table class="data-table" v-loading="loadingData"
                :data="data"
                :fit="true"
                border>
            <el-table-column prop="name" label="门店">
                <template slot-scope="scope">
                    <el-button @click="$router.push({ path: `/exam/practice/${practice_id}/stat/${scope.row.department_id}/user`, query: {p: practiceName, d: scope.row.department_name}})" type="text">{{scope.row.department_name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="testing_count" label="考试次数" width="150"></el-table-column>
            <!-- <el-table-column prop="user_count" label="考试人数" width="150"></el-table-column> -->
            <el-table-column prop="pass_count" label="及格次数" width="150"></el-table-column>
            <el-table-column prop="unpass_count" label="不及格次数" width="150"></el-table-column>
        </el-table>
        <el-pagination
                style="text-align: right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="sizes,total, prev, pager, next"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                :total="fetchParam.page_total">
        </el-pagination>
    </div>
</template>

<script>
    import testPracticeStatService from 'services/exam/testPracticeStatService'
    import DepSelect from '../../component/select/Department.vue'
    import * as _ from 'utils/common'

    export default {
        data () {
            return {
                loadingData: false,
                data: [],
                practiceName: void '',
                fetchParam: this.newFetchParam()
            }
        },
        activated () {
            xmview.setContentTitle && xmview.setContentTitle(`模拟考试统计-${this.$route.query.p}`)
            this.practiceName = this.$route.query.p ? this.$route.query.p : ''
            this.practice_id = this.fetchParam.practice_id = +this.$route.params.practice_id
            this.fetchData()
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let fetchParam = _.clone(this.fetchParam)
                testPracticeStatService.searchDepartment(fetchParam).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            exportFn () {
                let fetchParam = _.clone(this.fetchParam)
                return testPracticeStatService.exportDepartment(fetchParam).then(() => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            newFetchParam () {
                return {
                    practice_id: +this.$route.params.practice_id,
                    department_id: void 0,
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {DepSelect}
    }
</script>
