<!-- 
    课程transfer
 -->
<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-course-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <main id="learning-map-course-container">
        <section class="search">
            <section>
                <i>课程类型</i>
                <el-select 
                    v-model="fetchParam.type" 
                    filterable 
                    placeholder="请选择课程类型"
                    @change="fetchData">
                    <el-option label="公开课" value="public"></el-option>
                    <el-option label="内训课" value="private"></el-option>
                    <el-option v-if="coursetask" label="工业课" value="industry"></el-option>
                    <!-- <el-option v-if="coursetask" label="产品课" value="product"></el-option> -->
                </el-select>
            </section>
            <section v-if="fetchParam.type!=='industry' && coursetask">
                <i>栏目</i>
                <CourseCategorySelect 
                    v-model="fetchParam.category_id" 
                    :type="fetchParam.type"
                    :onchange="fetchData">
                </CourseCategorySelect>
            </section>
            <section v-if="coursetask">
                <i>添加过任务</i>
                <el-select v-model="fetchParam.is_task" placeholder="全部" :clearable="true" @change="fetchData">
                    <el-option label="未加入过任务" :value="0"></el-option>
                    <el-option label="已加入任务" :value="1"></el-option>
                </el-select>
            </section>
            <section>
                <i>课程名称</i>
                <el-input
                    v-model="fetchParam.keyword"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <!-- <section>
                <i>课程载体</i>
                <el-select 
                    v-model="fetchParam.type" 
                    filterable 
                    clearable
                    placeholder="请选择课程载体"
                    @change="fetchData">
                    <el-option 
                        v-for="item in TYPE" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                    </el-option>
                </el-select>
            </section> -->
        </section>
        <Transfer 
            ref="transfer"
            placeholder="搜索"
            :loading="loading"
            :showHeader="true"
            :isSearch="false"
            :type="cacheType"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :total="total"
            :data="data"
            v-model="selected"
            :showSelectedData="false"
            @curRow="getCurRow"
            @select-all="getSelectAll"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            @searchFn="handleTransferSearch">
<!--             <template slot="source-column" slot-scope="scope">
                <el-tag></el-tag>
            </template> -->
        </Transfer>
    </main>
</template>

<script>
    import courseService from 'services/courseService'
    import Transfer from 'components/dialog/Transfer2.vue'
    import CourseCategorySelect from 'components/select/CourseCategory'
    import * as _ from 'utils/common'

    // const TYPE = [
    //     {
    //         label: '视频',
    //         value: 'video',
    //     },
    //     {
    //         label: 'Word文档',
    //         value: 'word',
    //     },
    //     {
    //         label: 'PPT文档',
    //         value: 'ppt',
    //     },
    //     {
    //         label: 'PDF文档',
    //         value: 'pdf',
    //     },
    // ]
    export default {
        components: {
            Transfer,
            CourseCategorySelect
        },
        props: {
            taskType: Number,
            childType: Array,
            type: {
                type: [Number, String],
                required: false,
            },
            coursetask: Boolean,
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            showSelectedData: {
                type: Boolean,
                default: false
            }
        },
        activated () {},
        created () {
            this.fetchParam = this.initFetchParam()
            this.fetchData()
        },
        mounted () {},
        computed: {
            cacheType () {
                return this.fetchParam.type
            }
        },
        watch: {
            value (val) {
                this.selected = val
            }
        },
        data () {
            return {
                loading: false,
                // TYPE: TYPE,
                selected: this.value,
                fetchParam: this.initFetchParam(),
                data: [],
                total: 0,
                selectedArr: []
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                let fetchParam = _.clone(this.fetchParam)
                if (this.coursetask) {
                    fetchParam.is_task = !fetchParam.is_task && fetchParam.is_task !== 0 ? -1 : fetchParam.is_task
                }
                if(fetchParam.type=='private' || fetchParam.type=='industry'){
                    fetchParam.publish_status=''
                    fetchParam.status=''
                }
                return courseService.getPublicCourselistByName(fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            handlePageChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleTransferSearch (val) {
                this.fetchParam.page = 1
                this.data = []
                this.fetchParam.keyword = val
                this.fetchData()
            },
            getCurRow (row, all) {
                if (this.type) {
                    row.type = this.coursetask ? this.type : this.cacheType
                    row.taskType = this.taskType
                    this.$emit('curRow', row, all)
                }
            },
            getSelectAll (selection) {
                if(selection.length) {
                    this.selectedArr = []
                    this.selectedArr = [...selection]
                    selection.forEach(sel => {
                        this.getCurRow(sel, true)
                    })
                }else {
                    this.selectedArr.forEach(sel => {
                        this.getCurRow(sel, false)
                    })
                }
            },
            initFetchParam () {
                return {
                    type: 'public',
                    status: 0,
                    publish_status:'',
                    is_task: this.coursetask ? '' : -1,
                    need_testing: -1,
                    keyword: '',
                    category_id: '',
                    page: 1,
                    page_size: 15
                }
            }
        },
        filters: {},
        directives: {},
    }
</script>
