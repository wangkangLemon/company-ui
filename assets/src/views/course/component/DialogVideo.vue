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
    <el-dialog title="选取视频" :visible.sync="isShowDialog">
        <article id="course-manage-component--dialogvideo">
            <article class="search">
                <section>
                    <i>状态</i>
                    <el-select v-model="fetchParam.status" placeholder="未选择"
                               @change="fetchData" :clearable="true">
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="转码中" value="1"></el-option>
                        <el-option label="转码失败" value="2"></el-option>
                    </el-select>
                </section>

                <section>
                    <i>名称</i>
                    <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
                </section>
            </article>

            <el-table class="data-table" v-loading="loadingData"
                      :data="data"
                      :fit="true"
                      border>
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        width="100"
                        label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
                        <el-tag v-else-if="scope.row.status == 1">转码中</el-tag>
                        <el-tag v-else  type="info">转码失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="duration_name"
                        width="80"
                        label="时长">
                </el-table-column>
                <el-table-column
                        width="80"
                        prop="score"
                        label="课程">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.course_id != 0" type="success">已关联</el-tag>
                        <el-tag v-else>未关联</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="create_time_name"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="70"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="selectVideo(scope.$index, scope.row)" type="text" size="small">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="pagin"
                           @size-change="val => fetchParam.page_size=val"
                           @current-change="val => fetchParam.page = val"
                           :current-page="fetchParam.page"
                           :page-size="fetchParam.page_size"
                           :page-sizes="[15, 30, 60, 100]"
                           layout="sizes,total, prev, pager, next"
                           :total="total">
            </el-pagination>

        </article>
    </el-dialog>
</template>

<script>
    import courseService from '../../../services/courseService'

    export default{
        props: {
            onSelect: Function,
            value: Boolean, // 是否显示dialog
        },
        data () {
            return {
                isShowDialog: this.value,
                data: [],
                loadingData: false,
                total: 0,
                fetchParam: {
                    keyword: void 0,
                    status: void 0,
                    page: 1,
                    page_size: 15,
                }
            }
        },
        watch: {
            'fetchParam.page' () {
                this.fetchData()
            },
            'fetchParam.page_size' () {
                this.fetchData()
            },
            'value' (val) {
                this.setShowDialog(val)
            },
            'isShowDialog' (val) {
                this.$emit('input', val)
                this.setShowDialog(val)
                if (this.data.length < 1) this.fetchData()
            }
        },
        methods: {
            fetchData () {
                this.loadingData = true
                courseService.getVideo4Dialog(this.fetchParam).then((ret) => {
                    this.data = ret.data.data
                    this.total = ret.data.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
            selectVideo (index, row) {
                this.setShowDialog(false)
                this.onSelect && this.onSelect(row)
            },
            setShowDialog (val) {
                if (val === this.isShowDialog) return
                this.isShowDialog = val
            }
        },
        components: {}
    }
</script>
