<!--企业学分-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";
     @import "../../utils/mixins/common";
    .server-score-container {
       @extend %content-container;
       .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }

            // 管理栏目
            .catmange {
                background: rgb(153, 102, 204);
            }
        }
        .add {
            @extend %right-top-btnContainer;
        }
        .show-detail {
            .info {
                h2 {
                    text-align: center;
                    margin-bottom: 10px;
                }
                > div {
                    text-indent: 2em;
                    line-height: 28px;
                }
            }
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
    <div class="server-score-container">
        <!-- <section class="search"> -->
            <section class="manage-container">
                <el-button icon="el-icon-document" type='warning' @click="exportFn()"><i>导出</i>
                </el-button>
            </section>
            <!-- <section>
              <i>员工姓名</i>
                <UserSelect v-model="fetchParam.user_id" :change="fetchData"></UserSelect>
            </section>            
            <section>
                <i>工号</i>
                <el-input v-model="fetchParam.staff_id" @keyup.enter.native="fetchData"/>
            </section>
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </section>
            <DateRange 
                title="" 
                :start="fetchParam.time_start" 
                :end="fetchParam.time_end"
                v-on:changeStart="val=>{fetchParam.time_start=val}"
                v-on:changeEnd="val=>{fetchParam.time_end=val}"
                :change="fetchData">
            </DateRange>
        </section> -->
        <el-form :inline="true" :model="fetchParam" class="search" @submit.native.prevent>
            <el-form-item label="员工姓名">
               <UserSelect v-model="fetchParam.user_id" :change="fetchData"></UserSelect>
            </el-form-item>
            <el-form-item label="工号">
                <el-input v-model="fetchParam.staff_id" @keyup.enter.native="fetchData"/>
            </el-form-item>
            <el-form-item label="门店">
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </el-form-item>
            <DateRange 
                title="获得时间" 
                :start="fetchParam.time_start" 
                :end="fetchParam.time_end"
                v-on:changeStart="val=>{fetchParam.time_start=val}"
                v-on:changeEnd="val=>{fetchParam.time_end=val}"
                :change="fetchData">
            </DateRange>
            <el-button icon="el-icon-search" @click="fetchData">查询</el-button>
        </el-form>
        <el-table
            v-loading="loading"
            border
            :data="data"
            stripe
            style="width: 100%">
            <el-table-column
                prop="user_name"
                label="员工姓名">
            </el-table-column>
            <el-table-column
                prop="user_staff_id"
                label="工号"
                width="93">
            </el-table-column>
            <el-table-column
                prop="mobile"
                min-width='100'
                label="手机号">
            </el-table-column>
            <el-table-column 
                label="职位"
                prop="job"
                width="">
            </el-table-column>
            <el-table-column 
                prop="department_name" 
                width="330"
                label="门店">
            </el-table-column>
             <el-table-column
                prop="score"
                width="180"
                label="企业总学分">
            </el-table-column>
            <el-table-column
                prop="operate"
                width="200"
                label="操作">
                <el-button 
                    slot-scope="scope"
                    type="text" 
                    size="small" 
                    @click="show(scope.row)">
                    获得记录
                </el-button>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
        <el-dialog title="企业学分获得记录" :visible.sync="showDetail">
            <el-table
                v-loading="loading"
                border
                :data="historyData"
                stripe
                style="width: 100%">
                <el-table-column
                        prop="description"
                        label="行为">
                </el-table-column>
                 <el-table-column
                        prop="score"
                        label="企业学分">
                    <template slot-scope="scope">
                        {{scope.row.score}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="获得时间">
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {viewParam.page_size=val; getView()}"
                @current-change="val=> {viewParam.page=val; getView()}"
                :current-page="viewParam.page"
                :page-size="viewParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="viewTotal">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
import DepSelect from '../component/select/Department.vue'
import UserSelect from '../component/select/User'
import DateRange from '../component/form/DateRangePicker.vue'
import scoreService from 'services/server/scoreService'
import * as _ from 'utils/common'

function clearSearch () {
    return {
        user_id: '',
        staff_id: '',
        department_id: '',
        time_start: '',
        time_end: '',
        page: 1,
        page_size: 15
    }
}

export default {
    components: {
        DepSelect,
        DateRange,
        UserSelect
    },
    data () {
        return {
            data: [],
            historyData: [],
            dialogTitle: '',
            showDetail: false,
            loading: false,
            total: 0,
            fetchParam: clearSearch(),
            viewParam: {
                page: 1,
                page_size: 15
            },
            viewTotal: 0,
            row: ''
        }
    },
    activated () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        initFetchParam () {
            this.fetchParam = clearSearch()
        },
        fetchData () {
            this.loading = true
            return scoreService.getList(this.fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
            }).then(() => {
                this.loading = false
            })
        },
        exportFn () {
            let fetchParam = _.clone(this.fetchParam)
            return scoreService.export(fetchParam).then(() => {
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
            this.fetchParam.page = val
            this.fetchData()
        },
        show (row) {
            this.showDetail = true
            this.row = row
            this.getView()
        },
        getView () {
            return scoreService.getView({
                user_id: this.row.id,
                time_start: this.fetchParam.time_start,
                time_end: this.fetchParam.time_end,
                page: this.viewParam.page,
                page_size: this.viewParam.page_size
            }).then(ret => {
                this.historyData = ret.data
                this.viewTotal = ret.total
            })
        }
    },

}
</script>
