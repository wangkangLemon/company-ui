<!-- 
    药我说transfer
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
                <i>标题名称</i>
                <el-input
                    v-model="fetchParam.keyword"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>药我说类型</i>
                <el-select v-model="fetchParam.send_type" filterable placeholder="请选择" @change="fetchData">
                    <el-option label="全部" value="system,company"></el-option>
                    <el-option label="系统药我说" value="system"></el-option>
                    <el-option label="企业药我说" value="company"></el-option>
                </el-select>
            </section>
        </section>
        <Transfer 
            ref="transfer"
            placeholder="搜索"
            :loading="loading"
            firstColumnProp="title"
            :showHeader="true"
            :type="type"
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
    import speakingService from 'services/server/speakingService'
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
            this.initFetchParam()
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
                extraColumn: [{
                    value: 'content',
                    label: '内容'
                }],
                selectedArr: []
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return speakingService.getSpeakingList(this.fetchParam).then(ret => {
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
                    row.taskType = this.taskType
                    row.type = this.type
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
                    send_type: 'system,company',
                    price_enabled: 0,
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
