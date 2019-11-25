<style lang='scss' rel='stylesheet/scss'>

</style>
<template>
    <div id="paper-content-container">
        <section class="manage-container">
            <el-button icon="el-icon-document" type='warning' @click="exportFn()"><i>导出Excel</i>
            </el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="店员姓名">
                <el-input v-model="fetchParam.user_name" placeholder="店员姓名" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="店员工号">
                <el-input v-model="fetchParam.user_staff_id" placeholder="店员工号" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <!-- <el-button icon="el-icon-search" @click="fetchData">查询</el-button> -->
        </el-form>

        <el-table class="data-table" v-loading="loadingData"
                :data="data"
                :fit="true"
                border>
            <el-table-column prop="user_name" label="姓名"></el-table-column>
            <el-table-column prop="user_staff_id" label="工号"></el-table-column>
            <el-table-column prop="testing_count" label="考试次数" width="120"></el-table-column>
            <el-table-column prop="pass_count" label="及格次数" width="120"></el-table-column>
            <el-table-column prop="pass_rate" label="及格率" width="120"></el-table-column>            
            <el-table-column prop="unpass_count" label="不及格次数" width="120"></el-table-column>
            <el-table-column prop="unpass_rate" label="不及格率" width="120"></el-table-column>
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
    import * as _ from 'utils/common'

    export default {
        data () {
            return {
                loadingData: false,
                data: [],
                fetchParam: this.newFetchParam()
            }
        },
        activated () {
            this.fetchParam = this.newFetchParam()
            xmview.setContentTitle && xmview.setContentTitle(`${this.$route.query.d}-${this.$route.query.p}`)
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
                testPracticeStatService.searchUser(fetchParam).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            exportFn () {
                let fetchParam = _.clone(this.fetchParam)
                return testPracticeStatService.exportUser(fetchParam).then(() => {
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
                    department_id: +this.$route.params.department_id,
                    user_name: '',
                    user_staff_id: '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {}
    }
</script>
