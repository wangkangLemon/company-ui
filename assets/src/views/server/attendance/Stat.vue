<!--考勤统计-->
<style lang='scss' rel='stylesheet/scss' >
@import "~utils/mixins/showDetail";
@import "~utils/mixins/topSearch";
@import "~utils/mixins/common";
#server-stat-container {
    @extend %content-container;
    .top-btn {
        @extend %right-top-btnContainer;
    }
    .search {
        @extend %top-search-container;
    }
    .block {
        margin-top: 10px;
        text-align: right;
    }
    .img-content{
        display:flex;
        align-items: center;
        padding: 5px 0;
    }
}
</style>
<template>
    <article id="server-stat-container">
        <div class="main-container">
            <section class="search">
                <section>
                    <i>员工姓名</i>
                    <el-input @keyup.enter.native="fetchData"  v-model="fetchParam.name"/>
                </section>
                <section>
                    <i>工号</i>
                    <el-input @keyup.enter.native="fetchData" v-model="fetchParam.staff_id" auto-complete="off"></el-input>
                </section>
<!--                 <section>
                    <i>门店</i>
                    <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
                </section>  -->
                <section>
                    <i>部门/门店</i>
                    <Pusher 
                        searchForm
                        :ruleForm="{ type: 'organization' }" 
                        @input="(val) => { 
                            this.fetchParam.department_id = val.map(item => item.id).join(',');
                            this.fetchData() 
                        }">
                    </Pusher>
                </section>
                <section>
                    <i>考勤类型</i>
                    <el-select clearable v-model="fetchParam.type" @change="fetchData">
                        <el-option label="正常考勤" value="office"></el-option>
                        <el-option label="外出考勤" value="outwork"></el-option>
                    </el-select>
                </section>
                <DateRange 
                    title="日期" 
                    :start="fetchParam.date_start" 
                    :end="fetchParam.date_end"
                    v-on:changeStart="val=> {fetchParam.date_start=val}"
                    v-on:changeEnd="val=> {fetchParam.date_end=val}"
                    :change="fetchData">
                </DateRange>
                <el-button class="top-btn" icon="el-icon-document" type='warning' @click="fileExport">导出Excel</el-button>
            </section>
            <el-table border :data="dataList" v-loading="loading">
                <el-table-column prop="date" label="日期" width="115">
                </el-table-column>
                <el-table-column prop='name' label="员工姓名" width="120">
                </el-table-column>
                <el-table-column
                    prop="staff_id"
                    label="工号"
                    width="93">
                </el-table-column>
                <el-table-column prop='department_name' label="所属门店" min-width="100">
                </el-table-column>
                <el-table-column prop='type_name' label="考勤类型" width="95">
                </el-table-column>
                <el-table-column prop='first_time' label='最早打卡' width="170"></el-table-column> 
                <el-table-column prop='last_time' label='最晚打卡' width="170"></el-table-column> 
                <el-table-column prop='number' label='打卡次数' width="95"></el-table-column> 
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDetails(scope.row)">
                            更多打卡记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination> 
        </div>
        <el-dialog :visible.sync="detailDialog.showDialog" title="查看" width="80%">
            <el-table border :data="dialogList" v-loading="loading">
                <el-table-column
                   label="序号"
                   min-width="70">
                   <span slot-scope="{$index}">{{$index+1}}</span>
                </el-table-column>
                <el-table-column
                    prop ='time'
                    label="打卡时间"
                    min-width="120">
                </el-table-column>
                <el-table-column
                    prop ='name'
                    label="打卡地址"
                    min-width="250">
                </el-table-column>
                <el-table-column
                    v-if="row.type === 'outwork'"
                    prop ='target'
                    label="拜访对象"
                    min-width="210">
                </el-table-column>
                <el-table-column
                    v-if="row.type === 'outwork'"
                    prop ='note'
                    label="打卡备注"
                    min-width="120">
                </el-table-column>
                <el-table-column
                    v-if="row.type === 'outwork'"
                    label="打卡照片"
                    min-width="120">
                    <template slot-scope="scope">
                        <div class="img-content">
                            <img :src="scope.row.image | fillImgPath" width="80" @click="preview(scope.row.image)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {detailDialog.page_size=val; getDetials()}"
                @current-change="val=> {detailDialog.page=val; getDetials()}"
                :current-page="detailDialog.page"
                :page-size="detailDialog.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="detailDialog.total">
            </el-pagination> 
        </el-dialog>
        <ImagePreview v-model="showImagePreview" :url="face_url | fillImgPath" :needFillPath="false"></ImagePreview>
    </article>
</template>
<script>
import attendanceService from 'services/server/attendanceService'
import DepSelect from '../../component/select/Department.vue'
import DateRange from 'components/form/DateRangePicker.vue'
import ImagePreview from 'components/dialog/ImagePreview.vue'
import Pusher from 'components/select/pusher/Main.vue'

function clearFn () {
    return {
        department_id: '',
        name: '',
        staff_id: '',
        page: 1,
        type: '', // 考勤类型 office为正常考勤，outwork为外出考勤
        page_size: 15,
        date_end: '',
        date_start: '',
    }
}
export default {
    components: {
        DepSelect,
        DateRange,
        ImagePreview,
        Pusher
    },
    data () {
        return {
            dialogList: [],
            dialogList2: [],
            dataList: [],
            loading: false,
            total: 0,
            showDialog: false,
            showDialog2: false,
            fetchParam: clearFn(),
            showImagePreview: false,
            face_url: '',
            type: '',
            detailDialog: {
                showDialog: false,
                total: 0,
                page: 1,
                page_size:15
            },
            row: {}
        }
    },
    activated () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        fetchData () {
            this.loading = true
            return attendanceService.getAttendanceList(this.fetchParam).then((ret) => {
                this.dataList = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        showDetails (row) {
            this.detailDialog.showDialog = true
            this.detailDialog.page = 1
            this.row = row
            this.getDetials()
        },
        getDetials() {
            let params = {
                type: this.row.type,
                id: this.row.id,
                page:this.detailDialog.page,
                page_size: this.detailDialog.page_size
            }
            return attendanceService.getDetails(params).then((ret) => {
                this.dialogList = ret.data
                this.detailDialog.total = ret.total
            })
        },
        preview (image) {
            this.face_url = image
            this.showImagePreview = true
        },
        fileExport () {
            attendanceService.fileExport(this.fetchParam).then(ret => {
                xmview.showExportTip((id) => {
                    id.onclick = () => {
                        this.$router.push({name:'analytics-export'})
                    }
                })
            })
        }
        // add() { },
        // del() { },
        // edit() { },
        // submit() { }

    }

}
</script>
