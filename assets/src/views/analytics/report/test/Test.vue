<style lang='scss' rel='stylesheet/scss'>
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-test-test-container {
    @extend %content-container;
    .export-btn{
        float:right;
        margin-top: -65px;
    }
    .block {
        float: right;
        margin-top: 15px;
    }
}
</style>
<template>
    <div id="analytics-report-test-test-container">
        <section class="export-btn">
            <el-button icon="el-icon-document" type='warning' @click="exportFn()"><i>导出Excel</i>
            </el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search" @submit.native.prevent>
            <el-form-item label="模拟考试名称：">
                <el-input v-model="fetchParam.keyword" placeholder="模拟考试名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <!-- <el-button icon="search" @click="fetchData">查询</el-button> -->
        </el-form>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column prop="name" label="模拟考试名称">
                <template slot-scope="scope">
                    <el-button @click="()=>{$router.push({name: 'exam-practice-stat-department', params: {practice_id: scope.row.id}, query: {p: scope.row.name}})}" type="text">{{scope.row.name}}</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="user_count" label="考试人数" width="100"></el-table-column> -->
            <el-table-column prop="testing_count" label="考试次数" width="150"></el-table-column>
            <el-table-column prop="highest_count" label="满分次数" width="150"></el-table-column>
            <el-table-column prop="pass_count" label="及格次数" width="150"></el-table-column>
            <el-table-column prop="unpass_count" label="不及格次数" width="150"></el-table-column>
        </el-table>

        <el-pagination class="block"
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
                testPracticeStatService.search(fetchParam).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            exportFn () {
                let fetchParam = _.clone(this.fetchParam)
                return testPracticeStatService.export(fetchParam).then(() => {
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
                    keyword: '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {}
    }
</script>
