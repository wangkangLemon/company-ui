<!--文档管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-doc-container {
        @extend %content-container;

        .manage-container {
            position: absolute;
            right: 0;
            top: -50px;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            display: inline-block;
            margin-top: 15px;
        }

        // 替换文档
        .el-form-item {
            margin-bottom: 0;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <main id="course-manage-doc-container">
        <section class="search">
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="$refs['localImportDialog'].open()">
                添加文档
            </el-button>

            <section>
                <i>文档名称</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
            
            <section>
                <i>状态</i>
                <el-select :clearable="true" v-model="fetchParam.status" placeholder="请选择" @change="fetchData">
                    <el-option label="待审核" :value="0"></el-option>
                    <el-option label="转码中" :value="1"></el-option>
                    <el-option label="转码失败" :value="2"></el-option>
                    <el-option label="审核成功" :value="3"></el-option>
                    <el-option label="审核失败" :value="4"></el-option>
                </el-select>
            </section>

            <section>
                <i>类型</i>
                <el-select :clearable="true" v-model="fetchParam.file_type" placeholder="请选择" @change="fetchData">
                    <el-option label="Pdf 文件" value="pdf"></el-option>
                    <el-option label="Word 文档" value="doc"></el-option>
                    <el-option label="PowePoint 幻灯片" value="ppt"></el-option>
                </el-select>
            </section>

            <DateRange 
                title="创建时间" 
                :start="fetchParam.time_start" 
                :end="fetchParam.time_end"
                @changeStart="val=> {fetchParam.time_start=val}"
                @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
            </DateRange> 
        </section>

        <el-table 
            class="data-table" 
            v-loading="loadingData"
            :data="data"
            border>
            <el-table-column
                min-width="230"
                prop="file_name"
                label="文档名称">
                <span slot-scope="{row}">
                    {{row.file_name}}
                    <el-tooltip 
                        v-if="row.product_name"
                        class="item" 
                        effect="dark" 
                        :content="'已关联产品' + row.product_name"
                        placement="top-start">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </span>
            </el-table-column>
<!--             <el-table-column
                    min-width="200"
                    prop="company_name"
                    label="所属企业">
            </el-table-column> -->
            <el-table-column
                width="80"
                prop="file_type"
                label="类型">
            </el-table-column>
            </el-table-column>
            <el-table-column
                width="80"
                prop="pages"
                label="页数">
            </el-table-column>
            <el-table-column
                width="115"
                label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0">待审核</el-tag>
                    <template v-else-if="scope.row.status == 1">
                        <el-tag type="warning">转码中</el-tag>
                    </template>
                    <template v-else-if="scope.row.status == 2">
                        <el-tag class="text-danger" :title="scope.row.job_message" type="info">转码失败</el-tag>
                        <el-button @click="retry(scope.$index, scope.row)" type="text" size="small"><i class="el-icon-refresh" title="点击重试"></i></el-button>
                    </template>
                    <el-tag v-else-if="scope.row.status == 3" type="success">审核成功</el-tag>
                    <el-tag v-else-if="scope.row.status == 4" type="danger">审核失败
                        <el-tooltip class="item" effect="dark" :content="scope.row.remark ? scope.row.remark: '暂无备注'" placement="bottom">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                width="170"
                prop="create_time_name"
                label="创建时间">
            </el-table-column>
            <el-table-column
                width="180"
                label="操作">
                <template slot-scope="scope">
                    <el-button 
                        v-if="scope.row.status == 0"
                        @click="show(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        预览
                    </el-button>     
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination 
            class="pagin"
            @size-change="val => {fetchParam.page_size = val}"
            @current-change="val => {fetchParam.page = val}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes,total, prev, pager, next"
            :total="total">
        </el-pagination>

        <LocalImportDialog
            :onSuccess="onSuccess"
            ref="localImportDialog"
            title="导入文档"
            :data="{ product_id: productId }"
            :beforeUploadProp="beforeUpload.bind(this)"
            :uploadUrl="uploadUrl">
            <article slot="form">
                <el-form ref="ruleForm" label-width="33%">
                    <el-form-item label="课程类型" prop="">
                        <el-radio-group v-model="courseType" @change="() => {productId = ''}">
                            <el-radio :label="1">内训课</el-radio>
                            <el-radio :label="2">产品课</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关联产品" prop="" v-if="courseType === 2">
                        <ProductSelect v-model="productId"></ProductSelect>
                    </el-form-item>
                </el-form>
            </article>
            <article slot="footer">
                <hr style="margin-bottom: 15px;">
                <h5>注意事项：</h5>
                <h5>1.支持 word文档, ppt文档, pdf文档</h5>
                <h5>2.单个文档最大不能超过 50M</h5>
                <h5>3.文档转码完成并审核通过后才可用于课程</h5>
            </article>
        </LocalImportDialog>
    </main>
</template>

<script>
    import DateRange from 'components/form/DateRangePicker.vue'
    import LocalImportDialog from '@/views/exam/component/LocalImportDialog.vue'
    import ProductSelect from 'components/select/Product.vue'
    import courseService from 'services/course/docService'
    import config from 'utils/config'
    import * as _ from 'utils/common'

    function getFetchParam () {
        return {
            file_type: void 0, // 文档类型
            company_id: void 0,
            keyword: void 0,
            page: 1,
            page_size: 15,
            status: '',
            time_start: void 0,
            time_end: void 0,
        }
    }

    export default{
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                selectedIds: [], // 选中的id
                fetchParam: getFetchParam(),
                dialogReplace: {
                    isShow: false,
                    title: '替换文档',
                    open: null,
                },
                docModel: {},
                replaceDocUploadUrl: '',
                accept: '.doc,.docx,.ppt,pptx,.pdf',
                uploadUrl: courseService.getDocUploadUrl(),
                courseType: 1,
                productId: '',
            }
        },
        watch: {
            'fetchParam.page_size' () {
                this.fetchData()
            },
            'fetchParam.page' () {
                this.fetchData()
            }
        },
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.fetchParam = getFetchParam()
            },
            fetchData () {
                this.loadingData = true
                let fetchParam = _.clone(this.fetchParam)
                fetchParam.status = !fetchParam.status && fetchParam.status !== 0 ? -1 : fetchParam.status
                return courseService.getDocList(fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            del (index, row) {
                xmview.showDialog(`你将要删除文档 <span style="color:red">${row.file_name}</span> 操作不可恢复确认吗?`, () => {
                    courseService.deleteDoc({doc_id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                        this.loadingData = false
                    })
                })
            },
            // 查看
            show (index, row) {
                window.open(`${window.location.origin}/view/showdoc?url=${config.apiHost}/com/${row.company_id}/course/doc/${row.id}`)
            },
            onSuccess (data, file, fileList) {
                this.fetchData()
                return new Promise((resolve, reject) => {
                    resolve({success: 1})
                })
            },
            beforeUpload () {
                if (this.courseType === 2 && !this.productId) {
                    xmview.showTip('warning', '请选择关联产品')
                    return false
                }
                return true
            }
        },
        components: {
            DateRange,
            LocalImportDialog,
            ProductSelect
        }

    }
</script>
