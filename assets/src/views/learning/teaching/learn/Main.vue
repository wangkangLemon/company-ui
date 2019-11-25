<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #teaching-learn-container {
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
    <main id="teaching-learn-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>带教名称</i>
                <el-input
                    v-model="fetchParam.title"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>教员</i>
                <Teach
                    v-model="fetchParam.coacher_id" 
                    :change="fetchData"
                     type='teaching' 
                    :placeholder="fetchParam.coacher_name">
                </Teach>
            </section>
            <section>
                <i>学员</i>
                <User 
                    v-model="fetchParam.user_id" 
                    :change="fetchData" 
                    :placeholder="fetchParam.user_name">
                </User>
            </section>
            <section>
                <i>学员评定状态</i>
                <el-select 
                    v-model="fetchParam.be_teaching_status" 
                    filterable 
                    clearable 
                    placeholder="请选择" 
                    @change="fetchData">
                    <el-option label="待评定" :value="1"></el-option>
                    <el-option label="已评定" :value="2"></el-option>
                    <el-option label="已通过" :value="3"></el-option>
                    <el-option label="不通过" :value="4"></el-option>
                </el-select>
            </section>
            <section>
                <i>教员评定状态</i>
                <el-select 
                    v-model="fetchParam.teaching_status" 
                    filterable 
                    clearable 
                    placeholder="请选择" 
                    @change="fetchData">
                    <el-option label="待评定" :value="1"></el-option>
                    <el-option label="已评定" :value="2"></el-option>
                    <el-option label="已通过" :value="3"></el-option>
                    <el-option label="不通过" :value="4"></el-option>
                </el-select>
            </section>
            <!-- <section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.create_start_time" 
                    :end="fetchParam.create_end_time"
                    v-on:changeStart="val=>{fetchParam.create_start_time=val}"
                    v-on:changeEnd="val=>{fetchParam.create_end_time=val}"
                    :change="fetchData">
                </DateRange>
            </section> -->
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
                    label="带教名称" 
                    prop="title" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="学员" 
                    prop="user_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="教员" 
                    prop="coacher_name" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="进行时间" 
                    prop="start_time"
                    width="185">
                </el-table-column>
                <el-table-column 
                    label="计划进度" 
                    width="80">
                    <span slot-scope="{row}">{{row.current_phase}}/{{row.total_phase}}</span>
                </el-table-column>
                <el-table-column 
                    label="当前进度" 
                    width="80">
                    <span slot-scope="{row}">{{row.pass_phase}}/{{row.total_phase}}</span>
                </el-table-column>
                <el-table-column 
                    label="结业考试成绩" 
                    prop="finish_exam_status" 
                    width="110">
                </el-table-column>
                <el-table-column 
                    label="通过周期数" 
                    prop="pass_phase" 
                    width="110">
                </el-table-column>
                <el-table-column 
                    label="系统考核(学员)" 
                    prop="system_appraisal_user" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="系统考核(教员)" 
                    prop="system_appraisal_coacher" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="管理员鉴定(学员)" 
                    prop="admin_appraisal_user" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="管理员鉴定(教员)" 
                    prop="admin_appraisal_coacher" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="80" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            :disabled="!row.is_appraisal"
                            @click="$router.push({ name: 'teaching-learn-detail', query: {id: row.id, appraisal_admin_user: row.appraisal_admin_user, appraisal_admin_coacher: row.appraisal_admin_coacher} })">
                            {{!row.is_appraisal ? '--' : (row.admin_appraisal_coacher === '未评定' || row.admin_appraisal_user === '未评定') ? '待评价' : '评价结果'}}
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
    import User from 'components/select/User'
    import Teach from 'components/select/Teach'
    import DateRange from 'components/form/DateRangePicker.vue'
    import Evaluate from '../component/Evaluate.vue'
    import teachingService from 'services/learning/teaching'

    export default {
        name: 'teaching-learn-main',
        components: {
            User,
            DateRange,
            Evaluate,
            Teach
        },
        props: {},
        activated () {
        },
        created () {
            this.fetchParam = Object.assign(this.fetchParam, this.$route.query)
            // xmview.setContentTitle(this.$route.meta.title + '')
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
                    title: '',
                    user_id: void 0,
                    coacher_id: void 0,
                    be_teaching_status: void 0,
                    teaching_status: void 0,
                    coacher_name: '',
                    user_name: '',
                    // create_start_time: '',
                    // create_end_time: '',
                    page: 1,
                    page_size: 15,
                },
                evaluateModel: {
                    showDialog: false,
                    template: {}
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return teachingService.searchTeachingLearn(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            // openEvaluateDialog (row, type) {
            //     xmview.setContentLoading(true)
            //     this.evaluateModel.template.object_id = row.id
            //     this.evaluateModel.template.template_key = row['appraisal_admin_' + type]

            //     teachingService.getAppraisalTemp(this.evaluateModel.template.template_key).then(ret => {
            //         xmview.setContentLoading(false)
            //         // 直接将items添加到template不是响应式的
            //         this.$set(this.evaluateModel.template, 'items', ret.template.items || [])
            //         this.evaluateModel.showDialog = true
            //     })
            // },
            evaluate (items) {
                teachingService.appraisal(this.evaluateModel.template).then(() => {
                    this.evaluateModel.showDialog = false
                })
            },
            exportFile () {
               teachingService.exportLearn(this.fetchParam).then(() => {
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
