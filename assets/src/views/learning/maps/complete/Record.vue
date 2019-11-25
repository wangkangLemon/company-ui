<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-record-container {
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

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="learning-map-record-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>学习地图阶段</i>
                <el-select v-model="fetchParam.phase" filterable clearable placeholder="请选择" @change="fetchData">
                    <el-option 
                        v-for="item in phaseList" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </section>
            <section>
<!--                 <el-date-picker
                    v-model="fetchParam.time_start"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker> -->
                <DateRange 
                    title="阶段完成时间" 
                    :start="fetchParam.time_start" 
                    :end="fetchParam.time_end"
                    v-on:changeStart="val=>{fetchParam.time_start=val}"
                    v-on:changeEnd="val=>{fetchParam.time_end=val}"
                    :change="fetchData">
                </DateRange>
                
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="学习地图阶段" 
                    prop="phase" 
                    min-width="140">
                    <span slot-scope="{ row }">
                        {{row.phase | phase}}
                        <i class="el-icon-star-on" v-if="row.phase_finish_time" style="color: #ffc356;" title="已完成"></i>
                    </span>
                </el-table-column>
                <el-table-column 
                    label="当前必修任务数" 
                    prop="required" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="已完成必修任务数" 
                    prop="required_finish" 
                    width="135">
                </el-table-column>
                <el-table-column 
                    label="当前选修任务数" 
                    prop="unrequired" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="已完成选修任务数" 
                    prop="unrequired_finish" 
                    width="135">
                </el-table-column>
                <el-table-column 
                    label="阶段考试最高分数" 
                    prop="score" 
                    width="135">
                    <span slot-scope="{ row }">{{row.has_phase_exam ? row.score : '无'}}</span>
                </el-table-column>
                <el-table-column 
                    label="当前阶段更新时间" 
                    prop="phase_update_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="阶段完成时间" 
                    prop="phase_finish_time" 
                    width="170">
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
    import * as _ from 'utils/common'
    import DateRange from 'components/form/DateRangePicker.vue'
    import { cn } from 'nzh'
    export default {
        components: {
            DateRange
        },
        name: 'learning-maps-record',
        props: {},
        activated () {
        },
        created () {
            xmview.setContentTitle(this.$route.meta.title + '-' + this.$route.query.title)
            this.fetchParam.learning_maps_id = this.$route.query.learning_maps_id
            this.fetchParam.user_id = this.$route.query.user_id
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {
        },
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    learning_maps_id: '',
                    user_id: '',
                    phase: '',
                    time_start: '',
                    time_end: '',
                    is_export: 2,
                    page: 1,
                    page_size: 15,
                },
                phaseList: [],
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 2
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.phase = !fetchParam.phase ? -1 : fetchParam.phase
                return learningService.searchMapByUser(fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    if (fetchParam.phase === -1) this.getPhaseList(this.total)
                    this.loading = false
                })
            },
            export () {
                this.fetchParam.is_export = 1
                return learningService.searchMapByUser(this.fetchParam).then(() => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            },
            getPhaseList (num) {
                this.phaseList = []
                for (let i = 0; i < num; i++) {
                    this.phaseList.push({
                        label: `第${cn.encodeS(i + 1)}阶段`,
                        value: i + 1
                    })
                }
            }
        },
        filters: {
            phase (val) {
                return `第${cn.encodeS(val)}阶段`
            }
        },
        directives: {},
    }
</script>
