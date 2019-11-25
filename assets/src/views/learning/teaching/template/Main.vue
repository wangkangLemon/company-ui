<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #teaching-template-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
        .btn-disabled {
            cursor: not-allowed;
            color: #c0c4cc;
        }
    }
</style>

<template>
    <main id="teaching-template-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>带教名称</i>
                <el-input
                    v-model="fetchParam.title"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select 
                    v-model="fetchParam.status" 
                    filterable 
                    clearable 
                    placeholder="请选择"
                    @change="fetchData">
                    <el-option label="上线" :value="1"></el-option>
                    <el-option label="下线" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.create_start_time" 
                    :end="fetchParam.create_end_time"
                    v-on:changeStart="val=>{fetchParam.create_start_time=val}"
                    v-on:changeEnd="val=>{fetchParam.create_end_time=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="$router.push({ name: 'teaching-template-add' })">
                创建带教
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
                    min-width="150">
                </el-table-column>
                <el-table-column 
                    label="已选模版" 
                    prop="template_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="学员" 
                    prop="user_name" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="教员" 
                    prop="coacher_name" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="学员考核评估参数" 
                    prop="is_default_user_rule" 
                    width="140">
                    <template slot-scope="{row}">
                        <span v-if="row.is_default_user_rule === 1">默认设置</span>
                        <el-button 
                            v-if="row.is_default_user_rule === 0"
                            type='text' 
                            @click="viewTeachingRule(row, 'user')">
                            已设置
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="教员考核评估参数" 
                    prop="is_default_coacher_rule" 
                    width="140">
                    <template slot-scope="{row}">
                        <span v-if="row.is_default_coacher_rule === 1">默认设置</span>
                        <el-button 
                            v-if="row.is_default_coacher_rule === 0"
                            type='text' 
                            @click="viewTeachingRule(row, 'coacher')">
                            已设置
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="创建人" 
                    prop="creator_name" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="创建时间" 
                    prop="create_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="180" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({ name: 'teaching-template-view', query: {id: row.id, view: 1} })">
                            查看
                        </el-button>
                        <el-tooltip v-if="row.status === 0" class="item" content="上线状态禁止编辑" placement="top">
                            <el-button type="text" size="small" class="btn-disabled">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip v-else-if="!row.can_edit" class="item" content="认领过后禁止编辑" placement="top">
                            <el-button type="text" size="small" class="btn-disabled">编辑</el-button>
                        </el-tooltip>
                        <el-button v-else
                            type="text" 
                            size="small" 
                            @click="$router.push({ name: 'teaching-template-edit', query: {id: row.id} })">
                            编辑
                        </el-button>   
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="disableTeaching(row)">
                            {{row.status === 0 ? '下线' : '上线'}}
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            :disabled="row.status === 0 || !!row.online_time"
                            @click="del(row)">
                            删除
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
        <!-- 查看选用模版 -->
        <el-dialog 
            v-if="template.showDialog"
            title="模版详情" 
            width="30%"
            :visible.sync="template.showDialog">
            <TemplateList :template-id="template.templateId"></TemplateList>
        </el-dialog>
        <!-- 学员系统考核标准 -->
        <el-dialog 
            width="30%"
            v-if="teachingRule.showDialog"
            :title="teachingRule.type | ruleType" 
            :visible.sync="teachingRule.showDialog">
            <TeachingRule 
                :id="teachingRule.id" 
                :type="teachingRule.type">
            </TeachingRule>
        </el-dialog>
        <!-- 教员系统考核标准 -->
    </main>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import TemplateList from '../component/TemplateList.vue'
    import TeachingRule from '../component/TeachingRule.vue'
    import teachingService from 'services/learning/teaching'

    export default {
        components: {
            DateRange,
            TemplateList,
            TeachingRule
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
                    title: '',
                    status: '',
                    create_start_time: '',
                    create_end_time: '',
                    page: 1,
                    page_size: 15,
                },
                template: {
                    showDialog: false,
                },
                teachingRule: {
                    id: '',
                    showDialog: false,
                    type: ''
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return teachingService.searchTeaching(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            viewTemplate (row) {
                this.template.showDialog = true
                this.template.templateId = row.template_id
            },
            viewTeachingRule (row, type) {
                this.teachingRule.showDialog = true
                this.teachingRule.id = row.id
                this.teachingRule.type = type
            },
            disableTeaching (row) {
                let status = row.status === 0 ? 2 : 1
                let tip
                if (row.status === 0) {
                    tip = `是否确认下线【${row.title}】`
                } else {
                    if (!row.template_is_free && row.template_id > 0) {
                        tip = `带教【${row.title}】上线后开始扣除名额,是否确认提交`
                    } else {
                        tip = `带教有上线记录后将不能被删除，是否确认上线【${row.title}】？`
                    }
                }
                this.$confirm(tip, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    teachingService.disableTeaching({ id: row.id, status }).then(() => {
                        this.fetchData()
                    })
                })
            },
            del (row) {
                this.$confirm(`是否确认删除【${row.title}】`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    teachingService.deleteTeaching(row.id).then(() => {
                        this.fetchData()
                    })
                })
            }
        },
        filters: {
            ruleType (val) {
                let map = {
                    'user': '学员系统考核标准',
                    'coacher': '教员系统考核标准'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
