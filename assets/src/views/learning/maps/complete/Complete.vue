<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-complete-container {
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
    <main id="learning-map-complete-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>店员姓名</i>
                <el-input
                    v-model="fetchParam.user_name"
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
                <i>所属门店</i>
                <Department 
                    v-model="fetchParam.department_id"
                    :change="fetchData"></Department>
            </section>
            <section>
                <i>学习地图</i>
                <LearningMaps 
                    v-model="fetchParam.learning_maps_id"
                    :change="fetchData"></LearningMaps>
            </section>
        </section>
        <el-button class="top-btn" icon="el-icon-document" type='warning' @click="exportExcel">导出Excel</el-button>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="店员姓名" 
                    prop="user_name" 
                    min-width="100">
                </el-table-column>
                <el-table-column 
                    label="手机号" 
                    prop="mobile" 
                    width="130">
                </el-table-column>
                <el-table-column 
                    label="工号" 
                    prop="staff_id" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="所属门店" 
                    prop="department_name" 
                    min-width="150">
                </el-table-column>
                <el-table-column 
                    label="学习地图名称" 
                    prop="learning_maps_name" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="完成阶段数" 
                    width="120">
                    <span slot-scope="{ row }">{{row.finished_phase}}/{{row.total_phase}}</span>
                </el-table-column>
                <el-table-column 
                    label="上一阶段完成时间" 
                    prop="last_phase_finished_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="100" 
                    fixed="right">
                    <template slot-scope="{ row }">
                        <el-button type="text" size="small" @click="$router.push({name: 'learning-maps-record', query: {user_id: row.user_id, learning_maps_id: row.learning_maps_id, title: row.user_name + '-' + row.learning_maps_name}})">
                            学习记录
                        </el-button>
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
    import learningService from 'services/learning'
    import Department from 'components/select/Department.vue'
    import LearningMaps from 'components/select/LearningMaps.vue'

    export default {
        components: {
            Department,
            LearningMaps
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
                    user_name: '',
                    mobile: '',
                    department_id: '',
                    learning_maps_id: '',
                    is_export: void 0,
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 2
                return learningService.searchUserMap(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            exportExcel () {
                this.fetchParam.is_export = 1
                return learningService.searchUserMap(this.fetchParam).then(() => {
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
