<!--录音记录-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
     @import "../../../utils/mixins/common";
    #speaking-hitsory-container {
       @extend %content-container;
        .top-btn {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article id="speaking-hitsory-container">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @keyup.enter.native="fetchData" v-model="fetchParam.keyword" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>姓名</i>
                    <el-input @keyup.enter.native="fetchData" v-model="fetchParam.name" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>工号</i>
                    <el-input @keyup.enter.native="fetchData" v-model="fetchParam.staff_id" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>分数</i>
                    <el-select clearable v-model="fetchParam.score" @change="fetchData">
                        <el-option label="满分" value="0"></el-option>
                        <el-option label="未满分" value="1"></el-option>
                    </el-select>
                </section>
                <section>
                        <i>门店</i>
                        <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
                </section> 
                <DateRange title="练习时间" :start="fetchParam.time_start" :end="fetchParam.time_end" @changeStart="val=> {fetchParam.time_start=val}" @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
                </DateRange>
                <el-button class="top-btn" icon="el-icon-document" type='warning' @click="fileExport">导出Excel</el-button>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="data"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="speaking_title"
                        min-width="160"
                        label="标题">
                </el-table-column>
                <el-table-column
                        prop="department_name"
                        min-width="160"
                        label="门店">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        width="100"
                        label="员工姓名">
                </el-table-column>
                <el-table-column
                    prop="user_staff_id"
                    label="工号"
                    width="93">
                </el-table-column>
                <el-table-column
                        prop="speaking_content"
                        min-width='200'
                        label="内容">
                </el-table-column>
                <el-table-column
                        prop="score"
                        width="70"
                        label="分数">
                </el-table-column>
                <el-table-column
                    prop="recording"
                    width="180"
                    label="员工录音">
                    <template slot-scope="scope">
                        <AmrPlayer :url="scope.row.recording | fillImgPath"></AmrPlayer>
                        <i>{{scope.row.recording_text}}</i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="duration_name"
                    width="80"
                    label="时长">
                </el-table-column>
                <el-table-column
                    prop="create_time_name"
                    width="180"
                    label="练习时间">
                </el-table-column>
              
            </el-table>
            <div class="block">
                <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            </div>
    </article>
</template>
<script>
import DateRange from '../../component/form/DateRangePicker.vue'
import DepSelect from '../../component/select/Department.vue'
import AmrPlayer from 'components/media/AmrPlayer.vue'
import speakingService from 'services/server/speakingService'
import * as _ from 'utils/common.js'
export default {
    data () {
        return {
            loading: false,
            data: [],
            total: 0,
            fetchParam: {
                keyword: '',
                name: '',
                staff_id: '',
                score: '',
                department_id: '',
                time_start: '',
                time_end: '',
                page: 1,
                page_size: 15,
                is_export: 2,
            }
        }
    },
    activated () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        getParam (param) {
            let fetchParam = _.clone(param)
            fetchParam.score = !fetchParam.score && fetchParam.score !== 0 ? -1 : fetchParam.score
            return fetchParam
        },
        fetchData () {
            this.loading = true
            let fetchParam = this.getParam(this.fetchParam)
            fetchParam.is_export = 2
            return speakingService.getSpeakingHistory(fetchParam).then(ret => {
                this.data = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        handleSizeChange (val) {
            this.page_size = val
            this.fetchData()
        },
        handleCurrentChange (val) {
            this.page = val
            this.fetchData()
        },
        fileExport () {
            let fetchParam = this.getParam(this.fetchParam)
            fetchParam.is_export = 1
            speakingService.getSpeakingHistory(fetchParam).then((ret) => {
                if (ret === null) {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                }
            })
        }
    },
    components: {
        DateRange,
        DepSelect,
        AmrPlayer
    }
}
</script>
