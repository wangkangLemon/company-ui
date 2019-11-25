<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    #approval-leave-container {
        // @extend %content-container;
    .search {
            @extend %top-search-container;
        }
    .block {
        margin-top: 10px;
        text-align: right;
    }
    }
</style>
<template>
<article id="approval-leave-container">

    <section class="search">
        <section>
            <i>申请人</i>
            <el-input @keyup.enter.native="fetchData"  v-model="fetchParam.user_name"/>
        </section>
        <section>
            <i>工号</i>
            <el-input @keyup.enter.native="fetchData" v-model="fetchParam.staff_id" auto-complete="off"></el-input>
        </section>
<!--         <section>
            <i>门店</i>
            <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
        </section> -->
        <section>
            <i>部门/门店</i>
            <Pusher 
                ref="pusher"
                searchForm
                :ruleForm="{ type: 'organization' }" 
                @input="(val) => { 
                    this.fetchParam.department_id = val.map(item => item.id).join(',');
                    this.fetchData() 
                }">
            </Pusher>
        </section>
        <section>
            <i>请假类型</i>
            <el-select v-model="fetchParam.leavetype" placeholder="未选择" @change="fetchData" :clearable="true">
                <el-option label="事假" value="事假"></el-option>
                <el-option label="病假" value="病假"></el-option>
                <el-option label="调休" value="调休"></el-option>
                <el-option label="年假" value="年假"></el-option>
                <el-option label="产假" value="产假"></el-option>
                <el-option label="婚假" value="婚假"></el-option>
                <el-option label="陪产假" value="陪产假"></el-option>
                <el-option label="路途假" value="路途假"></el-option>
                <el-option label="其他" value="其他"></el-option>
            </el-select>
        </section> 
        <section>
            <i>审批状态</i>
            <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                <el-option label="审核中" value="1"></el-option>
                <el-option label="已同意" value="2"></el-option>
                <el-option label="已拒绝" value="3"></el-option>
            </el-select>
        </section> 
        <DateRange title="提交时间" :start="fetchParam.start_time" :end="fetchParam.end_time" @changeStart="val=> {fetchParam.time_start=val}" @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
        </DateRange>
    </section>
    <el-table class="data-table" v-loading="loadingData" :data="dataList" :fit="true" border>
            <el-table-column prop="member_name" label="申请人" min-width="120">
            </el-table-column>
            <el-table-column
                prop="user_staff_id"
                label="工号"
                width="93">
            </el-table-column>
            <el-table-column prop="department_name"label="门店" min-width="230" >
            </el-table-column>
            <el-table-column  prop="fields.leaveType" label="请假类型" width="95">
            </el-table-column>
            <el-table-column  prop="fields.leaveDays" label="请假天数" width="95">
            </el-table-column>
            <el-table-column  prop="create_time_name" label="提交时间" width="150">
            </el-table-column>
            <el-table-column  prop="fields.beginTime" label="开始时间" width="111">
            </el-table-column>
            <el-table-column width="111" prop="fields.overTime" label="结束时间">
            </el-table-column>
            <el-table-column min-width="200" prop="fields.leaveBecause" label="请假事由">
            </el-table-column> 
            <el-table-column width="100" prop="score" label="审批状态" fixed="right">
                 <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 1" type="warning">审核中</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="success">已同意</el-tag>
                    <el-tag v-else type="danger">已拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="80" prop="score" label="操作" fixed="right">
                 <template slot-scope="scope">
                 <el-button type="text" size="small" @click=" row = scope.row,showdialog=true">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
         <section class="block">
              <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
        </el-pagination>
         </section>

          <el-dialog title="审批详情" :visible.sync="showdialog" >
            <el-form  label-width="100px" v-if="row">
                 <el-form-item label="审批编号："  >
                     {{row.uuid}}
                </el-form-item>
                <el-form-item label="申请人：" >
                    {{row.member_name}}
                </el-form-item>
                <el-form-item label="工号：">
                    {{row.user_staff_id}}
                </el-form-item>
                <el-form-item label="所属门店：" >
                    {{row.department_name}}
                </el-form-item>
                <el-form-item label="请假类型：">
                    {{row.fields.leaveType}}
                </el-form-item>
                <el-form-item label="开始时间：">
                    {{row.fields.beginTime}}
                </el-form-item>
                <el-form-item label="结束时间：" >
                    {{row.fields.overTime}}
                </el-form-item>
                
                <el-form-item  label="请假天数：">
                    {{row.fields.leaveDays}}
                </el-form-item>
                 
                <el-form-item  label="请假理由：">
                    {{row.fields.leaveBecause}}
                </el-form-item>
                <el-form-item  label="提交时间：">
                    {{row.create_time_name}}
                </el-form-item>
                <el-form-item  label="审批状态：">
                    {{row.status_name}}
                </el-form-item> 
                <el-form-item>
                    <step :stepList="row.history"></step>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showdialog = false">确定</el-button>
            </div>
        </el-dialog>
</article>
  
</template>
<script>
import approvalService from 'services/server/approvalService'
import DepSelect from '../../component/select/Department.vue'
import DateRange from '../../component/form/DateRangePicker.vue'
import Step from 'components/step/Main.vue'
import Pusher from 'components/select/pusher/Main.vue'

export default {
    data () {
        return {
            showdialog: false,
            loadingData: false,
            dataList: [],
            total: 0,
            row: '',
            fetchParam: {
                formid: 1,
                start_time: '',
                end_time: '',
                leavetype: '',
                status: '',
                department_id: '',
                user_name: '',
                staff_id: '',
                is_holiday: -1,
                page: 1,
                page_size: 15,
                filter: {},
            }
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        fetchData () {
            this.loadingData = true
            if (this.fetchParam.leavetype) {
                this.fetchParam.filter = JSON.stringify([{name: 'leaveType', value: this.fetchParam.leavetype}])
            } else {
                this.fetchParam.filter = []
            }
            approvalService.getApprovalList(this.fetchParam).then((ret) => {
                this.dataList = ret.data
                this.total = ret.total
                this.loadingData = false
            })
        },
        fileExport () {
            approvalService.fileExport(this.fetchParam).then((ret) => {
                xmview.showExportTip((id) => {
                    id.onclick = () => {
                        this.$router.push({name:'analytics-export'})
                    }
                })
            })
        }
    },
    components: {
        DepSelect,
        DateRange,
        Step,
        Pusher
    }
}
</script>
