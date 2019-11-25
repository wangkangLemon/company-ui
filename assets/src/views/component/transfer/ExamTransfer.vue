<!-- 
    考试transfer
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
                <i>试卷名称</i>
                <el-input
                    v-model="fetchParam.keyword"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
        </section>
        <Transfer
            ref="transfer"
            placeholder="搜索"
            :loading="loading"
            :type="type"
            :showHeader="true"
            :isSearch="false"
            :extraColumn="extraColumn"
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
        </Transfer>
    </main>
</template>

<script>
    import examService from 'services/exam/testPagerService'
    import Transfer from 'components/dialog/Transfer2.vue'

    export default {
        components: {
            Transfer
        },
        props: {
            taskType: Number,
            type: {
                type: [Number, String],
                required: false,
            },
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
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                fetchParam: this.initFetchParam(),
                selected: this.value,
                data: [],
                total: 0,
                extraColumn: [
                    {
                        value: 'subject_total',
                        label: '题目数量'
                    },
                    {
                        value: 'score_total',
                        label: '试卷总分'
                    },
                    {
                        value: 'score_pass',
                        label: '及格分数'
                    },
                    {
                        value: 'limit_repeat',
                        label: '可考试次数',
                        slot: true
                    }
                ],
                selectedArr: []
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return examService.search(this.fetchParam).then(ret => {
                    this.data = ret.list
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
                    row.type = this.type
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
                    keyword: '',
                    status: 0,
                    page: 1,
                    page_size: 15
                }
            }
        },
        filters: {},
        directives: {},
    }
</script>
