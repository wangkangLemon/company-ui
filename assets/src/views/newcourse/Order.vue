<!--课程订单管理-->
<style lang="scss" rel="stylesheet/scss">
@import "~utils/mixins/topSearch";
@import "~utils/mixins/common";
@import "~utils/mixins/showDetail";
#course-order {
    @extend %content-container;
    .show-detail {
        .info {
            padding-bottom: 40px;
            p.select {
                span.value {
                    >div {
                        width: 100%;
                    }
                }
            }
        }
    }
    .top-btn {
        @extend %right-top-btnContainer;
    }
    .search {
        @extend %top-search-container;
    }
    .block {
        text-align: right;
        margin-top: 20px;
    }
}
</style>
<template>
    <article id="course-order">
        <el-button class="top-btn" type="primary">导出</el-button>
        <section class="search">
            <section>
                <i>课程</i>
                <el-input v-model="fetchParam.course_id" @keyup.enter.native="getData"></el-input>
            </section>
            <section>
                <i>下单人</i>
                <el-input v-model="fetchParam.user_id" @keyup.enter.native="getData"></el-input>
            </section>
            <section>
                <i>手机号</i>
                <el-input v-model="fetchParam.user_mobile" @keyup.enter.native="getData"></el-input>
            </section>
            <section>
                <i>支付方式</i>
                <el-select clearable @change="getData" v-model="fetchParam.pay_method" placeholder="全部">
                    <el-option label="微信" value="wechat"></el-option>
                    <el-option label="支付宝" value="alipay"></el-option>
                    <el-option label="余额" value="money"></el-option>
                </el-select>
            </section>
            <section>
                <i>有无归属</i>
                <el-select clearable v-model="fetchParam.in_company" @change="getData" placeholder="全部">
                    <el-option label="有归属" :value="1"></el-option>
                    <el-option label="无归属" :value="0"></el-option>
                    <el-option label="不限制" :value="-1"></el-option>
                </el-select>
            </section>
            <DateRange title="下单时间" :start="fetchParam.time_start" :end="fetchParam.time_end" @changeStart="val=> fetchParam.time_start=val " @changeEnd="val=> fetchParam.time_end=val" :change="getData"></DateRange>
            <section>
                <i>订单状态</i>
                <el-select clearable @change="getData" v-model="fetchParam.status" placeholder="全部">
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="未支付" :value="0"></el-option>
                    <el-option label="已支付" :value="1"></el-option>
                    <el-option label="已关闭" :value="2"></el-option>
                    <el-option label="已删除" :value="4"></el-option>
                </el-select>
            </section>
        </section>
        <el-table v-loading="loading" :data="dataList" :fit="true" border>
            <el-table-column prop="trade_no" min-width="180" label="订单编号"></el-table-column>
            <el-table-column prop="course_name" label="课程名称" width="180"></el-table-column>
            <el-table-column prop="price" label="价格" width="100"></el-table-column>
            <el-table-column prop="user_name" label="下单人" width="100"></el-table-column>
            <el-table-column prop="user_mobile" label="手机号" width="180"></el-table-column>
            <el-table-column prop="pay_method" label="支付方式" width="120">
                <template slot-scope="scope">
                    {{payMethods[scope.row.pay_method]}}
                </template>
            </el-table-column>
            <el-table-column prop="pay_time" label="支付时间" width="180"></el-table-column>
            <el-table-column prop="status" label="订单状态" width="100">
                <template slot-scope="scope">
                    {{payStatus[scope.row.status]}}
                </template>
            </el-table-column>
            <el-table-column prop="create_time_name" label="下单时间" width="180"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text" @click="()=>{showDetail=true;detail=scope.row}">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="block" @size-change="val=> {fetchParam.page_size=val; getData()}" @current-change="val=> {fetchParam.page=val; getData()}" :current-page="fetchParam.page" :page-size="fetchParam.page_size" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="total">
        </el-pagination>
        <!--详情-->
        <el-dialog title="订单详情" class="show-detail" :visible.sync="showDetail">
            <div class="info" v-if="detail != null">
                <p>
                    <i class="title">订单号：</i>
                    <span class="value">{{detail.trade_no}}</span>
                </p>
                <p>
                    <i class="title">课程名称：</i>
                    <span class="value">{{detail.course_name}}</span>
                </p>
                <p>
                    <i class="title">价格：</i>
                    <span class="value">{{detail.price}}</span>
                </p>
                <p>
                    <i class="title">下单人：</i>
                    <span class="value">{{detail.user_name}}</span>
                </p>
                <!--<p><i class="title">手机号：</i> <span class="value">{{detail.user_mobile}}</span></p>-->
                <p>
                    <i class="title">所属连锁：</i>
                    <span class="value">{{detail.company_name}}</span>
                </p>
                <p>
                    <i class="title">所属门店：</i>
                    <span class="value">{{detail.department_name}}</span>
                </p>
                <p>
                    <i class="title">下单时间：</i>
                    <span class="value">{{detail.create_time_name}}</span>
                </p>
                <p>
                    <i class="title">支付时间：</i>
                    <span class="value">{{detail.pay_time}}</span>
                </p>
                <p>
                    <i class="title">支付方式：</i>
                    <span class="value">{{payMethods[detail.pay_method]}}</span>
                </p>
                <p>
                    <i class="title">支付状态：</i>
                    <span class="value">{{payStatus[detail.status]}}</span>
                </p>
                <p class="select remark">
                    <i class="title">备注：</i>
                    <span class="value">
                        <el-input type="textarea" :rows="3" v-model="detail.note"></el-input>
                    </span>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateFn">确定</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
import DateRange from 'components/form/DateRangePicker.vue'
import orderService from 'services/newcourse/orderService'
export default {
    components: {
        DateRange
    },
    data () {
        return {
            payMethods: { 'wechat': '微信', 'alipay': '支付宝', 'money': '余额' },
            payStatus: ['未支付', '已支付', '已关闭', '已删除'],
            showDetail: false,
            detail: null,
            loading: false,
            fetchParam: {
                page: 1,
                page_size: 15,
                course_id: '',
                user_id: '',
                user_mobile: '',
                pay_method: '',
                time_start: '',
                time_end: '',
                status: -1,
                in_company: -1
            },
            dataList: [],
            total: 0
        }
    },
    created () {
        xmview.setContentLoading(false)
        this.getData()
    },
    methods: {
        getData () {
            this.loading = true
            return orderService.search(this.fetchParam).then((ret) => {
                this.dataList = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        updateFn () {
            if (this.detail.id) {
                orderService.updateNote({ id: this.detail.id, note: this.detail.note }).then((ret) => {
                    xmview.showTip('success', '修改成功')
                    this.showDetail = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            }
        }
    }
}
</script>
