<style lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-container {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
    .top-btn {
        @extend %right-top-btnContainer;
    }

    .block {
        float: right;
        margin-top: 15px;
    }
}
</style>

<template>
    <main id="analytics-report-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column
                    label="序号"
                    width="50">
                    <span slot-scope="scope">{{scope.$index+1}}</span>
                </el-table-column>
                <el-table-column 
                    label="报表名称" 
                    prop="name">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    width="165" 
                    fixed="right">
                    <el-button 
                        slot-scope="scope"
                        type='text' 
                        @click="$router.push({name: `${scope.row.path}`})">
                        查看
                    </el-button>
                </el-table-column>
            </el-table>
<!--             <el-pagination class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination> -->
        </section>    
    </main>
</template>

<script>
    import * as model from './model'
    export default {
        components: {},
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
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                return Promise.resolve(model.reportForm).then((ret) => {
                    this.data = ret
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
