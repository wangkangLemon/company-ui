<style lang='scss' rel='stylesheet/scss'>
    #order-content-container {
        .el-form-item{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
    }
</style>
<template>
    <div id="order-content-container">
        <el-form :inline="true" :model="fetchParam" class="search">
            <el-form-item label="订单编号">
                <el-input v-model="fetchParam.order_no" placeholder="请输入订单编号" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="fetchParam.product_name" placeholder="请输入商品名称" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="fetchParam.user_name" placeholder="请输入姓名" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="工号">
                <el-input v-model="fetchParam.staff_id" placeholder="请输入工号" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="fetchParam.mobile" placeholder="请输入电话" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                    <el-option label="已发货" :value="1"></el-option>
                    <el-option label="未发货" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <DateRange title="兑换时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                           @changeStart="val=> {fetchParam.time_start=val}"
                           @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
                </DateRange>
            </el-form-item>
        </el-form>
        
         <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column
                    width="215"
                    prop="order_no"
                    label="订单编号">
            </el-table-column>
            <el-table-column
                    min-width="120"
                    prop="product_name"
                    label="商品名称">
            </el-table-column>
            <el-table-column
                    width="125"
                    label="员工姓名"
                    prop="user_name">
            </el-table-column>
            <el-table-column
                prop="user_staff_id"
                label="工号"
                width="93">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="mobile"
                    label="电话">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="departemet_name"
                    label="所属门店">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="time"
                    label="兑换时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="当前状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="danger">未发货</el-tag>
                    <el-tag v-else-if="scope.row.status == 1" type="success">已发货</el-tag>
                </template>
            </el-table-column>

             <el-table-column
                    min-width="120"
                    prop="remarks"
                    label="备注">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    width="125"
                    label="操作">
                <template slot-scope="scope">
                    <el-button 
                        @click="addRemarks(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        v-if="scope.row.remarks === ''|| scope.row.remarks === undefined">
                        添加备注
                    </el-button>
                    <el-button 
                        @click="deliverGoods(scope.$index, scope.row)"
                        type="text" 
                        size="small" 
                        v-if="scope.row.status == 0">
                        发货
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="12" :offset="12">
                <el-pagination
                    style="text-align: right"
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="fetchParam.page_total">
                </el-pagination>
            </el-col>
        </el-row>

        <el-dialog :title="editDialog" :visible.sync="dialog.edit">
            <el-form :model="model" label-width="80px" :rules="rules" ref="remarksForm">
                <el-form-item label="添加备注" prop="remarks">
                    <el-input type="textarea" v-model="model.remarks"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">确定</el-button>
                    <el-button @click="dialog.edit = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import DateRange from '../../../component/form/DateRangePicker.vue'
    import testOrderService from 'services/server/store/testOrderService'
    import * as _ from 'utils/common'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                editDialog: '备注',
                dialog: {
                    edit: false
                },
                model: {},
                rules: {
                    remarks: [{required: true, message: '请输入备注', trigger: 'blur'}],
                },
            }
        },
        activated () {
            this.fetchData()
        },
        created () {
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.status = (!fetchParam.status && fetchParam.status !== 0) ? -1 : fetchParam.status
                testOrderService.search(fetchParam).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    this.selectedIds = []
                    xmview.setContentLoading(false)
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
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            newFetchParam () {
                return {
                    id: '',
                    status: '',
                    order_no: void '',
                    product_name: '',
                    user_name: '',
                    staff_id: '',
                    mobile: '',
                    time_start: void '',
                    time_end: void '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            },
            deliverGoods (index, row) {
                return testOrderService.deliverGoods({order_id: row.id}).then((ret) => {
                    row.status = 0
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
            },
            // 添加备注
            addRemarks (index, row) {
                this.dialog.edit = true
                this.model = {
                    order_id: row.id,
                    remarks: ''
                }
            },
            // 提交备注
            submitForm () {
                this.$refs['remarksForm'].validate((pass) => {
                    if (!pass) {
                        return
                    }
                    return testOrderService.remarks(this.model).then(() => {
                        this.dialog.edit = false
                        this.fetchData()
                    })
                })
            },
        },
        components: {
            DateRange
        }
    }
</script>
