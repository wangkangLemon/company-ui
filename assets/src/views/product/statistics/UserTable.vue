<template>
    <main>
        <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
        <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
        <!-- 固定列通过配置fixed="right || left"-->
        <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
            <el-table-column 
                label="姓名" 
                prop="user_name">
            </el-table-column>
            <el-table-column 
                label="所属门店" 
                prop="department_name">
            </el-table-column>
        </el-table>
        <el-pagination 
            class="block"
            @size-change="val=> {fetchParam.page_size=val; fetchData()}"
            @current-change="val=> {fetchParam.page=val; fetchData()}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes, total, prev, pager, next" 
            :total="total">
        </el-pagination>
    </main>
</template>

<script>
    import productService from 'services/product/productService'

    export default {
        props: {
            productId: Number,
            statMonth: String,
        },
        created () {
            this.fetchData(this.fetchParam)
        },
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    stat_month: this.statMonth,
                    product_id: this.productId,
                    page: 1,
                    page_size: 15
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return productService.searchUser(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            }
        }
    }
</script>
