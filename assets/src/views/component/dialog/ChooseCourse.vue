<style lang="scss">
    @import "../../../utils/mixins/topSearch";
    .search {
        @extend %top-search-container;
    }
    .choose-course {
        .block {
            text-align: center !important;
            width: 50%;
            margin: 0 auto;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article>
        <el-dialog class="choose-course main-container" title="选取课程" :visible.sync="curValue">
            <section class="search">
                <section>
                    <i>名称</i>
                    <el-input @change="getCourse" v-model="search.keyword"></el-input>
                </section>
                <section>
                    <i>栏目分类</i>
                    <CourseCategorySelect v-model="search.category_id" :onchange="getCourse"></CourseCategorySelect>
                </section>
            </section>
            <el-table v-loading="loading" border :data="data" :highlight-current-row="true">
                <el-table-column prop="name" label="课程"></el-table-column>
                <el-table-column prop="company_name" label="企业" width="200"></el-table-column>
                <!-- <el-table-column prop="material_type" label="类型" width="150">
                    <template slot-scope="scope">
                        {{material_type[scope.row.material_type]}}
                    </template>
                </el-table-column> -->
                <el-table-column prop="operate" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="courseConfirm(scope.row)">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="courseSizeChange"
                        @current-change="coursePageChange"
                        :total="total"
                        :current-page="page"
                        :page-size="page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next">
                </el-pagination>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    // import courseService from '../../../services/courseService'
    import courseService from '../../../services/newcourse/courseService'
    import CourseCategorySelect from '../../component/select/CourseCategory.vue'
    export default {
        props: ['value'],
        components: {
            CourseCategorySelect
        },
        data () {
            return {
                curValue: this.value,
                loading: false,
                search: {
                    keyword: '',
                    category_id: ''
                },
                data: [],
                page: 1,
                page_size: 10,
                total: 0,
                material_type: {
                    video: '视频',
                    doc: 'word文档',
                    ppt: '幻灯片',
                    pdf: 'PDF文件'
                }
            }
        },
        watch: {
            value (val) {
                this.curValue = val
            },
            curValue (val) {
                this.curValue = val
                this.$emit('input', val)
            }
        },
        created () {
            this.getCourse()
        },
        methods: {
            // 课程当前页
            coursePageChange (val) {
                this.page = val
                this.getCourse()
            },
            // 课程分页
            courseSizeChange (val) {
                this.page_size = val
                this.getCourse()
            },
            courseConfirm (item) {
                this.$emit('result', item)
            },
            getCourse () {
                this.loading = true
                // 获取课程数据
                return courseService.getPublicCourselist({
                    keyword: this.search.keyword,
                    category_id: this.search.category_id,
                    page: this.page,
                    page_size: this.page_size,
                    status: 0,
                    course_type: 'public'
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
        }
    }
</script>
