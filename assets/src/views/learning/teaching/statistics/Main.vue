<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #teaching-statistics-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="teaching-statistics-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>员工姓名</i>
                <User v-model="fetchParam.user_id" :change="fetchData"></User>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-document" 
                type='warning' 
                @click="exportFile">
                导出
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="员工姓名">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { user_id: row.id, user_name: row.name } })">
                        {{row.name}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="被带教次数">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { user_id: row.id, user_name: row.name }})">
                        {{row.be_teaching_number}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="过关次数">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { user_id: row.id, user_name: row.name, be_teaching_status: 3 } })">
                        {{row.be_teaching_pass_number}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="未过关次数">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { user_id: row.id, user_name: row.name, be_teaching_status: 4 } })">
                        {{row.be_teaching_fail_number}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="被带教过关率" 
                    prop="be_teaching_pass_rate">
                </el-table-column>
                <el-table-column 
                    label="带教次数">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { coacher_id: row.id, coacher_name: row.name }  })">
                        {{row.teaching_number}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="过关次数">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { coacher_id: row.id, coacher_name: row.name, teaching_status: 3 }  })">
                        {{row.teaching_pass_number}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="未过关次数">
                    <el-button 
                        slot-scope="{row}"
                        type='text' 
                        @click="$router.push({ name: 'teaching-learn', query: { coacher_id: row.id, coacher_name: row.name, teaching_status: 4 }  })">
                        {{row.teaching_fail_number}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="带教过关率" 
                    prop="teaching_pass_rate">
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
    import User from 'components/select/User'
    import teachingService from 'services/learning/teaching'

    export default {
        components: {
            User
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
                    user_id: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return teachingService.searchTeachingUser(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            exportFile () {
               teachingService.exportUser(this.fetchParam).then(() => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
               })
            }
        },
        filters: {},
        directives: {},
    }
</script>
