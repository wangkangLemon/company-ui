<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    @import "~utils/mixins/theme_leij";
    #store-list-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
            padding-left: 23px;
            .nav {
                margin-bottom: 5px;
            }
        }
        .content {
            padding: 30px;
            .card-wrapper {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                .card-wrapper-inner {
                    margin: 0 10px 10px 0;
                    width: 350px;
                    cursor: pointer;
                }
            }
            .oper-btn {
                margin-bottom: 20px;
                .el-radio-button + .el-radio-button{
                    margin-left: 20px;
                    border-left: 1px solid #dcdfe6;
                    border-radius: 4px;
                }
            }
        }
    }
</style>

<template>
    <main id="store-list-container" v-loading="loading">
        <section class="search" v-if="!teachingId">
            <!-- 搜索条件 -->
            <section>
                <Nav 
                    class="nav"
                    @change="(val) => {
                            // 限时优惠id
                            if (val === -2) {
                                fetchParam.goods_type = 2;
                                fetchParam.category_id = ''; 
                            } else {
                                fetchParam.goods_type = 1;
                                fetchParam.category_id = val; 
                            }
                            fetchData()
                    }">
                </Nav>
                <el-input
                    :class="['search-radius', { 'search-radius__active': inputFocus }]"
                    @focus="() => { inputFocus = true }"
                    @blur="() => { inputFocus = false }"
                    v-model="fetchParam.keyword"
                    placeholder="输入课程名称"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
        </section>
        <section class="content">
            <!-- 内容主体 -->
            <div class="oper-btn" v-if="!teachingId">
                <el-radio-group v-model="radio" @change="choosePay">
                      <el-radio-button :label="1">未购买</el-radio-button>
                      <el-radio-button :label="2">已购买</el-radio-button>
                      <!-- <el-radio-button :label="0">免费</el-radio-button> -->
                </el-radio-group>
            </div>
            <div class="card-wrapper">
                <div 
                    class="card-wrapper-inner"
                    v-for="item in data"
                    @click="$router.push({name: 'store-detail', query: { id: item.id, name: item.name, goods_type: item.goods_type}})"
                    :key="item.id">
                    <Card 
                        :data="item"
                        @buy="buy">
                    </Card>
                </div>
                <div v-if="data.length === 0">
                    暂无商品
                </div>
            </div>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[12, 15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>
        <BuyDialog
            v-if="buyObject.showDialog"
            :visible.sync="buyObject.showDialog"
            :data="buyObject.data">
        </BuyDialog>
    </main>
</template>

<script>
    import Nav from './component/Nav.vue'
    import Card from './component/Card.vue'
    import BuyDialog from './component/BuyDialog.vue'
    import storeService from 'services/store/storeService'

    export default {
        components: {
            Card,
            BuyDialog,
            Nav
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
                buyObject: {
                    showDialog: false,
                    data: {},
                },
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    goods_type: 1,
                    is_purchased: '',
                    category_id: 0,
                    keyword: '',
                    page: 1,
                    page_size: 12,
                },
                radio: '',
                teachingId: this.$route.query.id, // 从带教跳过来
                inputFocus: false,
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                let service = this.teachingId ? 'searchTeachingCourse' : 'searchCourse'
                let param = this.teachingId ? this.teachingId : this.fetchParam
                return storeService[service](param).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            choosePay (val) {
                this.fetchParam.is_purchased = val
                this.fetchData()
            },
            buy (param) {
                this.buyObject.showDialog = true
                this.buyObject.data = param
                console.log(param)
            }
        },
        filters: {},
        directives: {},
    }
</script>
