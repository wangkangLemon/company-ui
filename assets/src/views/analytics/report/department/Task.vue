<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-department-task-container {
    @extend %content-container;
    .block {
        float: right;
        margin-top: 15px;
    }
    .export-btn {
        float: right;
        margin-top: -65px;
    }
    .button--wrap {
        white-space: normal;
        text-align: left;
    }
}
</style>
<template>
    <main id="analytics-report-department-task-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>部门/门店</i>
                <Pusher 
                    searchForm
                    confirmText="选 择"
                    :ruleForm="{ type: 'organization' }" 
                    @input="(val) => {
                        this.fetchParam.department_id = val.map(item => item.id).join(',')
                        this.fetchParam.department_name = val.map(item => item.name).join(' ')
                        this.reloadData()
                    }">
                </Pusher>
            </section>
            <section>
                <DateRange 
                    title="任务创建时间" 
                    :start="fetchParam.time_start" 
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="reloadData">
                </DateRange>
            </section>
            <el-button class="top-btn" icon="el-icon-document" type='warning' @click="fileExport">导出Excel</el-button>
        </section>

        <el-table :data="data" border v-loading="loading" :fit="true">
            <el-table-column fixed prop="department_name" label="部门" min-width="180"></el-table-column>
            <el-table-column prop="parents_name" label="上级部门" min-width="230"></el-table-column>
            <el-table-column prop="is_dep" label="是否门店" width="80">
                <template slot-scope="scope">
                    <template v-if="scope.row.is_dep">是</template>
                    <template v-else>否</template>
                </template>
            </el-table-column>
            <el-table-column prop="user_num" label="部门人数" width="80"></el-table-column>
            <el-table-column prop="dm_num" label="店长人数" width="80"></el-table-column>
            <el-table-column prop="task_num" label="任务数" width="75"></el-table-column>
            <el-table-column prop="task_finished_total" label="完成任务总数" width="110"></el-table-column>
            <el-table-column prop="user_finished" label="完成任务人数" width="110"></el-table-column>
            <el-table-column prop="user_finished_not" label="未完成任务人数" width="120"></el-table-column>
            <el-table-column prop="user_finished_rate" label="完成率" width="95"></el-table-column>
            <el-table-column prop="dm_finished" label="店长完成任务人数" width="135"></el-table-column>
            <el-table-column prop="dm_finished_not" label="店长未完成任务人数" width="150"></el-table-column>
            <el-table-column prop="dm_finished_rate" label="店长完成率" width="95"></el-table-column>
            <el-table-column prop="avg_score" label="平均获得学分" width="110"></el-table-column>
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
import {getNowDate, getMonthFirstDayTime} from 'utils/timeUtils'
import Pusher from 'components/select/pusher/Main.vue'
import DateRange from 'components/form/DateRangePicker.vue'
import courseTaskService from 'services/server/coursetaskService'
export default {
    components: {
        Pusher,
        DateRange
    },
    data() {
        return {
            loading: false,
            data: [],
            total: 0,
            fetchParam: {
                is_export: 0,
                department_id: '',
                department_name: '',
                time_start: getMonthFirstDayTime(3),
                time_end: getNowDate(),
                page: 1,
                page_size: 15,
            }
        }
    },
    created () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods:{
        reloadData() {
            this.fetchParam.page = 1
            this.fetchData()
        },
        fetchData () {
            this.loading = true
            this.fetchParam.is_export = 0
            return courseTaskService.reportDepartmentTask(this.fetchParam).then(ret => {
                this.data = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        fileExport () {
            this.fetchParam.is_export = 1
            return courseTaskService.reportDepartmentTask(this.fetchParam).then(ret => {
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
