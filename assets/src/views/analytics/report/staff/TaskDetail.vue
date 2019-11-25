<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-staff-taskdetail-container {
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
    <main id="analytics-report-staff-taskdetail-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>员工名称</i>
                <el-input
                    v-model="fetchParam.user_name"
                    @keyup.enter.native="reloadData">
                </el-input>
            </section>
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
                <i>任务名称</i>
                <el-input
                    v-model="fetchParam.task_name"
                    @keyup.enter.native="reloadData">
                </el-input>
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
            <el-table-column fixed prop="user_name" label="姓名" min-width="120"></el-table-column>
            <el-table-column prop="departments_name" label="所属部门" min-width="230"></el-table-column>
            <el-table-column prop="job" label="职位" width="110"></el-table-column>
            <el-table-column prop="staff_id" label="工号" width="110"></el-table-column>
            <el-table-column prop="task_name" label="任务名称" min-width="200"></el-table-column>
            <el-table-column prop="task_object_name" label="学习内容" min-width="200"></el-table-column>
            <el-table-column prop="is_finished" label="完成状态" width="90">
                <template slot-scope="scope">
                    <template v-if="scope.row.is_finished">已完成</template>
                    <template v-else>未完成</template>
                </template>
            </el-table-column>
            <el-table-column prop="is_learned" label="参与状态" width="90">
                <template slot-scope="scope">
                    <template v-if="scope.row.is_learned">已学习</template>
                    <template v-else>未学习</template>
                </template>
            </el-table-column>
            <el-table-column prop="learned_time" label="最后参与时间" width="160"></el-table-column>
            <el-table-column prop="task_create_time" label="任务创建时间" width="160"></el-table-column>
            <el-table-column prop="task_end_time" label="任务截止时间" width="160"></el-table-column>
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
                user_name: '',
                task_name: '',
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
            return courseTaskService.reportStaffTaskDetail(this.fetchParam).then(ret => {
                this.data = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        fileExport () {
            this.fetchParam.is_export = 1
            return courseTaskService.reportStaffTaskDetail(this.fetchParam).then(ret => {
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
