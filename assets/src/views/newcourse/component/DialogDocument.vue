<!--视频选取弹出框-->
<style rel="stylesheet/scss" lang="scss">
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/mixins";
@import "../../../utils/mixins/topSearch";

#course-manage-component--dialogvideo {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
}
</style>
<template>
    <el-dialog append-to-body title="选取文档" :visible.sync="isShowDialog">
        <span slot="title"><span class="el-dialog__title">选取文档</span>  <span style="color:#FF4949">只能选取审核通过的文档</span></span>
        <article id="course-manage-component--dialogvideo">
            <article class="search">
                <section>
                    <i>名称</i>
                    <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
                </section>
                <section>
                    <i>课件类型</i>
                    <el-select 
                        v-model="fetchParam.doc_type" 
                        filterable 
                        clearable 
                        placeholder="请选择" 
                        @change="fetchData">
                        <el-option label="产品课件" value="product"></el-option>
                        <el-option label="内训课件" value="private"></el-option>
                    </el-select>
                </section>
            </article>

            <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
                <el-table-column
                    min-width="230"
                    prop="file_name"
                    label="文档名称">
                </el-table-column>
                <el-table-column
                    min-width="200"
                    prop="company_name"
                    label="所属企业">
                </el-table-column>
                <el-table-column
                    width="80"
                    prop="doc_type"
                    label="课件类型">
                    <span slot-scope="{row}">{{row.doc_type | docType}}</span>
                </el-table-column>
                <el-table-column
                    width="80"
                    prop="pages"
                    label="页数">
                </el-table-column>
                <el-table-column
                    width="120"
                    label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 3" type="success">审核成功</el-tag>
                        <el-tag v-else-if="scope.row.status == 4" type="danger">审核失败</el-tag>
                        <template v-else-if="scope.row.status == 1 && scope.row.job_id > 0">
                            <el-tag type="warning">转码中</el-tag>
                        </template>
                        <el-tag v-else-if="scope.row.status == 0" type="primary">待审核</el-tag>
                        <template v-else>
                            <el-tag type="danger" :title="scope.row.job_message">转码失败</el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    width="170"
                    prop="create_time_name"
                    label="创建时间">
                </el-table-column>
                <el-table-column fixed="right" width="70" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="selectItem(scope.$index, scope.row)" type="text" size="small">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagin" @size-change="sizeChange" @current-change="pageChange" :current-page="fetchParam.page" :page-size="fetchParam.page_size" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="total">
            </el-pagination>
        </article>
    </el-dialog >
</template>

<script>
import courseService from 'services/courseService'

export default {
    props: {
        onSelect: Function,
        value: Boolean,     // 是否显示dialog
        companyID: [Number, String],  // 视频所属的企业编号
        fileType: String,
    },
    data () {
        return {
            isShowDialog: this.value,
            data: [],
            loadingData: false,
            total: 0,
            fetchParam: {
                companyid: void 0,
                keyword: void 0,
                doc_type: void 0,
                status: 3,
                page: 1,
                page_size: 15,
                file_type: '',
            }
        }
    },
    watch: {
        'value' (val) {
            this.setShowDialog(val)
        },
        'fetchParam.page' () {
            this.fetchData()
        },
        'fetchParam.page_size' () {
            this.fetchData()
        },
        'isShowDialog' (val) {
            this.$emit('input', val)
            this.setShowDialog(val)
            if (val === true) {
                this.fetchData()
            }
        }
    },
    methods: {
        fetchData () {
            this.loadingData = true
            this.fetchParam.companyid = this.companyID
            this.fetchParam.file_type = this.fileType
            this.fetchParam.status = 3
            return courseService.getDocList(this.fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
                this.loadingData = false
                xmview.setContentLoading(false)
            })
        },
        selectItem (index, row) {
            this.setShowDialog(false)
            this.onSelect(row)
        },
        setShowDialog (val) {
            this.isShowDialog = val
        },
        sizeChange (val) {
            this.fetchParam.page_size = val
        },
        pageChange (val) {
            this.fetchParam.page = val
        },
        refreshFetchParam () {
            this.fetchParam.keyword = ''
            this.fetchParam.page = 1
        }
    },
    components: {},
    filters: {
        docType (val) {
            let map = {
                'product': '产品课件',
                'private': '内训课件'
            }
            return map[val]
        }
    }
}
</script>
