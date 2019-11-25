<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #product-manage-index-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <main id="product-manage-index-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>产品名称</i>
                <el-input
                    v-model="fetchParam.product_name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>工业名称</i>
                <el-input
                    v-model="fetchParam.industry_name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.time_start" 
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="add">
                添加产品
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="产品名称" 
                    prop="name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="关联工业" 
                    prop="industry_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="产品简介" 
                    prop="description" 
                    min-width="180">
                </el-table-column>
                <el-table-column 
                    label="创建时间"
                    prop="created_at" 
                    width="180">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="145" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="view(row)">
                            查看
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="edit(row)">
                            编辑
                        </el-button>
<!--                         <el-button 
                            type='text' 
                            size="small"
                            @click="del(row)">
                            删除
                        </el-button> -->
                    </template>
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
        </section>
        <AddProduct
            v-if="productModel.showDialog"
            :visible.sync="productModel.showDialog"
            :title="productModel.title"
            :id="productModel.id"
            @submit="fetchData">
        </AddProduct>
    </main>
</template>

<script>
    import UploadImg from 'components/upload/UploadImg'
    import DateRange from 'components/form/DateRangePicker.vue'
    import AddProduct from '../component/AddProduct.vue'
    import productService from 'services/product/productService'

    export default {
        components: {
            DateRange,
            UploadImg,
            AddProduct
        },
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    product_name: '',
                    industry_name: '',
                    time_start: '',
                    time_end: '',
                    page: 1,
                    page_size: 15,
                },
                productModel: {
                    showDialog: false,
                    title: '',
                    id: void 0,
                },
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return productService.searchProduct(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            add () {
                this.productModel.title = '添加产品'
                this.productModel.id = void 0
                this.productModel.showDialog = true
            },
            view (row) {
                this.productModel.title = '查看产品'
                this.productModel.id = row.id
                this.productModel.showDialog = true
            },
            edit (row) {
                this.productModel.title = '编辑产品'
                this.productModel.id = row.id
                this.productModel.showDialog = true
            },
            del (row) {
                this.$confirm(`是否删除【${row.name}】`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    productService.deleteProduct(row.id).then(() => {
                        this.fetchData()
                    })
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
