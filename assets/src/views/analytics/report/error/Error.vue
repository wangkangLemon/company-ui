<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-error-error-container {
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
    <div id="analytics-report-error-error-container">
        <section class="export-btn">
            <el-button icon="el-icon-document" type='warning' @click="exportFn()"><i>导出Excel</i>
            </el-button>
        </section>

        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="错题名称">
                <el-input v-model="fetchParam.keyword" placeholder="题目名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="错题类型">
                <el-select v-model="fetchParam.type" @change="fetchData" :clearable="true">
                    <el-option label="判断题" :value="0"></el-option>
                    <el-option label="单选题" :value="1"></el-option>
                    <el-option label="多选题" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属题库">
                <SelectScroll :requestCb="fetchLibrary" v-model="fetchParam.subject_group_id" :changeCb="changeLibrary" ref="selectScroll"></SelectScroll>
            </el-form-item>
            <!-- <el-button icon="search" @click="fetchData">查询</el-button> -->
        </el-form>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column prop="subject_name" label="错题名称"></el-table-column>
            <el-table-column label="错题类型" width="120">
                <template slot-scope="scope">
                    <p v-if="scope.row.subject_type == 0">判断题</p>
                    <p v-if="scope.row.subject_type == 1">单选题</p>
                    <p v-if="scope.row.subject_type == 2">多选题</p>
                </template>
            </el-table-column>
            <el-table-column prop="subject_group_name" label="所属题库"></el-table-column>
            <el-table-column prop="answer_count" label="答题次数" width="100"></el-table-column>
            <el-table-column prop="wrong_count" label="错误次数" width="100"></el-table-column>
            <el-table-column prop="wrong_rate" label="错误率" width="110"></el-table-column>
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
    import testLibraryService from 'services/exam/testLibraryService'
    import SelectScroll from 'components/form/SelectScroll.vue'

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
                testPracticeStatService.searchSubject(this.fetchParam).then((ret) => {
                    this.data = ret.list
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            exportFn () {
                return testPracticeStatService.exportSubject(this.fetchParam).then(() => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            fetchLibrary (keyword, length) {
                let page = parseInt(length / 10) + 1
                return testLibraryService.search({keyword, page}).then((ret) => {
                    let result = {
                        data: [],
                        total: ret.total
                    }
                    if (ret.list == null) {
                        ret.list = []
                    }
                    ret.list.forEach((value) => {
                        result.data.push({
                            id: value.id,
                            name: value.name,
                        })
                    })

                    return result
                })
            },
            changeLibrary (val) {
                this.fetchParam.subject_group_id = val
                this.fetchData()
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
                    type: void -1,
                    subject_group_id: void 0,
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {SelectScroll}
    }
</script>
