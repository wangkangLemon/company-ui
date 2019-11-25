<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-profile-tags-container {
        @extend %content-container;
    }
</style>

<template>
    <main id="member-profile-tags-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>标签名称</i>
                <el-input
                    v-model="fetchParam.name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <DateRange 
                    title="标签创建时间" 
                    :start="fetchParam.create_start_time" 
                    :end="fetchParam.create_end_time"
                    v-on:changeStart="val=>{fetchParam.create_start_time=val}"
                    v-on:changeEnd="val=>{fetchParam.create_end_time=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button class="top-btn" icon="el-icon-plus" type='primary' @click="addTag">新增标签</el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="标签名称" 
                    prop="name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="标签会员数量" 
                    width="140">
                    <el-button 
                        :disabled="row.customer_num===0" 
                        slot-scope="{ row }" 
                        type='text' 
                        @click="$router.push({name: 'member-customer-tags-detail', query: { customer_tag_id: row.id }})">
                        {{row.customer_num}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="标签创建时间" 
                    prop="create_date"
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    width="80">
                    <el-button slot-scope="{ row }" type='text' @click="deleteTag(row)">删除</el-button>
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
    </main>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import customerService from 'services/member/customerService'

    export default {
        components: {
            DateRange
        },
        props: {},
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
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
                    name: '',
                    create_start_time: '',
                    create_end_time: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return customerService.searchTag(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            deleteTag (row) {
                this.$confirm('确定要删除该标签吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    customerService.deleteTag(row.id).then(() => {
                        this.fetchData()
                    })
                })
            },
            addTag () {
                this.$prompt('标签名称：', '新增标签', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    inputPlaceholder: '15字之内',
                    inputErrorMessage: '超过15个字数范围',
                    // inputPattern: /^[\u4e00-\u9fa5\d\w\s]{1,15}$/,
                    inputValidator: (val) => {
                        return val.length > 15 ? false : true
                    }
                }).then(({value}) => {
                    customerService.createTag(value).then(() => {
                        this.fetchData()
                    })
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
