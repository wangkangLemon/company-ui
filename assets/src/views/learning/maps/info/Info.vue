<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-info-container {
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
    <main id="learning-map-info-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>模版名称</i>
                <el-input
                    v-model="fetchParam.learning_maps_name"
                    icon="search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>发布对象</i>
                <el-select 
                    v-model="fetchParam.publish_type" 
                    placeholder="未选择" 
                    @change="fetchData" 
                    :clearable="true">
                    <el-option label="全体员工" value="company"></el-option>
                    <el-option label="指定部门" value="organization"></el-option>
                    <el-option label="指定门店" value="department"></el-option>
                    <el-option label="指定用户组" value="user_group"></el-option>
                    <el-option label="指定员工" value="user"></el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="模版创建时间" 
                    :start="fetchParam.time_start" 
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button class="top-btn" icon="plus" type='primary' @click="$router.push({name: 'learning-maps-create'})">创建模版</el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="模板名称" 
                    prop="title" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="阶段数量" 
                    prop="total_phase" 
                    width="80">
                </el-table-column>
<!--                 <el-table-column 
                    label="创建者" 
                    prop="user_name" 
                    width="80">
                </el-table-column> -->
                <el-table-column 
                    label="模板创建时间" 
                    prop="create_time_name" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="最后修改时间" 
                    prop="update_time_name" 
                    width="170">
                </el-table-column>
                <el-table-column prop="type" label="发布对象" width="120">
                    <template slot-scope="scope">
                        {{type[scope.row.publish_type]}}
                    </template>
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="100" 
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({name: 'learning-maps-create', query: { id: scope.row.id }})"
                            :disabled="creatorDisabled(scope.row.creator_id)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="block"
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
    import learningService from 'services/learning'
    import DateRange from 'components/form/DateRangePicker.vue'

    export default {
        components: {
            DateRange
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
                type: {
                    company: '全体员工', 
                    department: '指定门店', 
                    organization: '指定部门',
                    user: '指定员工', 
                    user_group: '指定用户组'
                },
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    learning_maps_name: '',
                    time_start: '',
                    time_end: '',
                    publish_type: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return learningService.searchStudyMap(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
