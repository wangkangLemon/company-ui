<style lang="scss" rel="stylesheet/scss">
    @import "../../utils/mixins/showDetail";
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/common";
    #sale-finance {
        @extend %content-container;
        .box-card {
            width: 280px;
            background-color: #FF9966;
            color: #ffffff;
            margin-bottom: 15px;
        }
        .icon {
            background: rgba(0, 0, 0, 0.1);
            width: 42px;
            height: 42px;
            border-radius: 50%;
            text-align: center;
            text-align-last: center;
            line-height: 42px;
            font-size: 28px;
        }
    }
</style>

<template>
    <main id="sale-finance">
        <section>
            <el-card class="box-card">
                <el-row>
                    <el-col :span="6">
                        <p class="icon el-icon-goods"></p>
                    </el-col>
                    <el-col :span="18">
                        <h4>账户余额</h4>
                        <h2>{{ amount }}</h2>
                    </el-col>
                </el-row>
            </el-card>
        </section>

        <el-table border :data="list" v-loading="loading">
            <el-table-column
                    prop ='sale_order_name'
                    label="商品">
            </el-table-column>
            <el-table-column
                    prop ='user_name'
                    label="员工">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="金额">
            </el-table-column>
            <el-table-column
                    prop="create_day"
                    label="时间">
            </el-table-column>
        </el-table>

        <section class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-size="pageSize"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next, jumper"
                    :total="pageTotal">
            </el-pagination>
        </section>
    </main>
</template>

<script>
    import saleFinanceService from '@/services/saleFinanceService'

    export default {
        name: 'sale-finance',
        data(){
            return {
                list: [],
                page: 1,
                pageSize: 15,
                pageTotal: 0,
                loading: true,
                amount:0,
            }
        },
        activated(){
            this.fetchData()
            this.fetchAmount()
        },
        methods: {
            fetchData() {
                this.loading = true
                xmview.setContentLoading(true)
                let params = {
                    page: this.page,
                    page_size: this.pageSize,
                }
                saleFinanceService.search(params).then((data) => {
                    this.list = data.list
                    this.pageTotal = data.total
                    this.loading = false
                    xmview.setContentLoading(false)
                })
            },
            fetchAmount() {
                saleFinanceService.amount().then((data) => {
                    this.amount = data.amount
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.fetchData()
            },
            handleCurrentChange(val) {
                this.page = val
                this.fetchData()
            },
        }
    }
</script>