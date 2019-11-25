<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #memeber-profile-tags-detail-container {
        @extend %content-container;
        .tag + .tag {
            margin-left: 1em;
        }
    }
</style>

<template>
    <main id="memeber-profile-tags-detail-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>会员姓名</i>
                <el-input
                    v-model="fetchParam.name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>手机号</i>
                <el-input
                    v-model="fetchParam.mobile"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>会员卡号</i>
                <el-input
                    v-model="fetchParam.vip_num"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="会员姓名" 
                    prop="name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="性别" 
                    prop="sex" 
                    width="80">
                    <span slot-scope="{ row }">{{row.sex === 1 ? '女' : '男'}}</span>
                </el-table-column>
                <el-table-column 
                    label="生日" 
                    prop="birthday" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="手机号" 
                    prop="mobile" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="会员卡号" 
                    prop="vip_num" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="标签" 
                    prop="tags" 
                    min-width="170">
                    <template slot-scope="{ row }">
                        <el-tag class="tag" v-for="tag in row.tags" :key="tag.id">{{tag.name}}</el-tag>
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
    </main>
</template>

<script>
    import customerService from 'services/member/customerService'
    
    export default {
        components: {},
        props: {},
        activated () {},
        created () {
            this.fetchParam.customer_tag_id = this.$route.query.customer_tag_id
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
                    mobile: '',
                    vip_num: '',
                    customer_tag_id: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return customerService.searchCustomer(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
