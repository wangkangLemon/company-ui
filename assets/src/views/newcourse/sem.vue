<!--课程列表-->
<style lang='scss' rel='stylesheet/scss'>
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";

#newcourse-course-public-container {
    @extend %content-container;

    .manage-container {
        .el-dropdown {
            margin-right: 10px;
        }
        @extend %right-top-btnContainer;
        >* {
            color: #fff;
            border-radius: 5px;
        } // 添加课程
        .add {
            background: rgb(0, 204, 255);
        } // 管理栏目
        .catmange {
            background: rgb(153, 102, 204);
        }
    }

    .search {
        @extend %top-search-container;
    } // 底部的管理按钮
    .bottom-manage {
        margin-top: 15px;
    }

    .el-dialog__wrapper {
        padding-top: 15px;
        background: rgba(0, 0, 0, .5);
        z-index: 1000;
    }
}
</style>

<template>
    <main id="newcourse-course-public-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'newcourse-course-add',query:{course_type:'teaching'}})" v-operation="auth.com_course_create"><i>添加课程</i>
            </el-button>
            <!-- <el-button v-operation="auth.com_course_category_create" type="warning" icon="el-icon-menu" @click="$router.push({name:'course-manage-category'})">
                <i>栏目管理</i>
            </el-button> -->
        </section>

        <main class="search">
            <section>
                <i>课程名称</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>

            <!-- <section>
                <i>状态</i>
                <el-select v-model="fetchParam.publish_status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="已发布" value="0"></el-option>
                    <el-option label="已撤回" value="1"></el-option>
                </el-select>
            </section> -->

            <!-- <section>
                <i>栏目</i>
                <CourseCategorySelect :onchange="fetchData" v-model="fetchParam.category_id"></CourseCategorySelect>
            </section> -->
            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end" @changeStart="val=> {fetchParam.time_start=val}" @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
            </DateRange>

        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" @select="selectRow" @select-all="selectRow" border>
            <el-table-column type="selection" :selectable="selectable"></el-table-column>
             <el-table-column width="190" prop="id" label="ID">
            </el-table-column>
            <el-table-column 
                min-width="200" 
                prop="name" 
                label="课程">
                <span slot-scope="{row}">
                    {{row.name}}
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
            <!-- <el-table-column min-width="200" prop="category_name" label="所属栏目">
            </el-table-column> -->
            <el-table-column width="80" label="课时数">
                <template slot-scope="scope">
                    {{ scope.row.lesson_count}}课时
                </template>
            </el-table-column>
            <!-- <el-table-column width="100" prop="need_testing" label="是否考试">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.need_testing == 0" type="info">否</el-tag>
                    <el-tag v-if="scope.row.need_testing == 1" type="success">是</el-tag>
                </template>
            </el-table-column> -->
            <!-- <el-table-column width="100" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.publish_status == 0" type="success">已发布</el-tag>
                    <el-tag v-else-if="scope.row.publish_status == 2">转码中</el-tag>
                    <el-tag v-else type="info">已撤回</el-tag>
                </template>
            </el-table-column> -->
            <el-table-column width="190" prop="create_time_name" label="创建时间">
            </el-table-column>
            <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                    <!--<el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>-->
                    <el-button 
                        @click="$router.push({name: 'newcourse-course-edit', params: {course_id: scope.row.id},query:{course_type:'teaching'}})" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.publish_status == 0 || creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <!-- <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id) || !!scope.row.product_name">
                        <i>{{ scope.row.publish_status == 1 ? '发布' : '撤回' }}</i>
                    </el-button> -->
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.publish_status == 0 || creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination 
            class="pagin"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes,total, prev, pager, next"
            :total="total">
        </el-pagination>

        <!--底部的批量删除和移动两个按钮-->
        <div class="bottom-manage">
            <!-- <el-button :disabled='selectedIds.length < 1' @click="dialogTree.isShow = true">移动到</el-button> -->
            <el-button :disabled='selectedIds.length < 1' @click="delMulti" type="danger">批量删除</el-button>
        </div>

        <!--移动子栏目的弹出框-->
        <div class="el-dialog__wrapper" v-show="dialogTree.isShow">
            <main class="el-dialog el-dialog--tiny">
                <section class="el-dialog__header">
                    <i>移动课程到</i>
                </section>
                <section class="el-dialog__body">
                    <CourseCategoryTree node-key="id" :onNodeClick="(data) => dialogTree.selectedId=data.value"></CourseCategoryTree>
                </section>

                <section class="el-dialog__footer">
                    <span class="dialog-footer">
                        <el-button @click="dialogTree.isShow = false">取 消</el-button>
                        <el-button type="primary" @click="moveToCategory">确 定</el-button>
                    </span>
                </section>
            </main>
        </div>
        <ErrorDialog :error="error"></ErrorDialog>
    </main>
</template>

<script>
import courseService from 'services/newcourse/courseService'
import DateRange from 'components/form/DateRangePicker.vue'
import CourseCategorySelect from 'components/select/CourseCategory.vue'
import CourseCategoryTree from 'components/tree/CourseCategory.vue'
import CourseComponent from '../course/manage/Public.vue'
import ErrorDialog from 'components/dialog/ErrorDialog.vue'
import * as _ from 'utils/common'
function getFetchParam () {
    return {
        keyword: void '',
        publish_status: void 0, // 2 视屏转码中，1 下线，0 正常，-1 全部
        category_id: void 0, // 栏目id
        time_start: void 0,
        time_end: void 0,
        page: 1,
        page_size: 15,
        course_type: 'teaching',
    }
}
export default {
    data () {
        return {
            activeTab: 'course',
            loadingData: false,
            data: [], // 表格数据
            total: 0,
            dialogVisible: false,
            selectedIds: [], // 被选中的数据id集合
            fetchParam: getFetchParam(),
            dialogTree: {
                isShow: false,
                selectedId: void 0,
            },
            error: {
                showDialog: false,
                message: '',
                data: []
            }
        }
    },
    created () {
        //            this.fetchData()
    },
    activated () {
        if (this.$route.query.tab === 'newcourse') this.activeTab = 'newcourse'
        this.fetchData()
    },
    methods: {
        handleType (type) {
            if (type === 'course') this.$router.push({name: 'course-manage-addCourse'})
            else this.$router.push({name: 'newcourse-course-add'})
        },
        initFetchParam () {
            this.fetchParam = getFetchParam()
        },
        handleCurrentChange (val) {
            this.fetchParam.page = val
            this.fetchData()
        },
        handleSizeChange (val) {
            this.fetchParam.page_size = val
            this.fetchData()
        },
        fetchData (val) {
            this.loadingData = true
            let fetchParam = _.clone(this.fetchParam)
            fetchParam.publish_status = (!fetchParam.publish_status && fetchParam.publish_status !== 0) ? -1 : fetchParam.publish_status
            return courseService.search(fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
                this.loadingData = false
                this.selectedIds = []
                xmview.setContentLoading(false)
            })
        },
        // 单行被选中
        selectRow (selection) {
            let ret = []
            selection.forEach((item) => {
                ret.push(item.id)
            })
            this.selectedIds = ret
        },
        // 下线 或者上线课程 0为下线，1为上线
        offline (index, row) {
            let txt = row.publish_status == 0 ? '撤回' : '发布'
            let finalStatus = row.publish_status == 0 ? 1 : 0
            let reqFn = row.publish_status == 0 ? courseService.offline : courseService.online
            xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                reqFn(row.id).then((ret) => {
                    row.publish_status = finalStatus
                })
            })
        },
        // 单条删除
        del (index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                courseService.delete(row.id).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                }).catch(ret => {
                    this.error.message = ret.data.message
                    this.error.data = ret.data.list
                    this.error.showDialog = true
                })
            })
        },
        moveToCategory () {
            courseService.moveToCategoryMulty({
                ids: this.selectedIds.join(','),
                category_id: this.dialogTree.selectedId
            }).then(() => {
                xmview.showTip('success', '操作成功')
                this.dialogTree.isShow = false
                setTimeout(() => {
                    // this.selectedIds = []
                    this.fetchData() // 重新刷新数据
                }, 300)
            })
        },
        // 批量删除
        delMulti () {
            xmview.showDialog(`你将要删除选中的课程，操作不可恢复确认吗?`, () => {
                courseService.deleteMulty(this.selectedIds.join(',')).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.dialogTree.isShow = false
                    setTimeout(() => {
                        this.selectedIds = []
                        this.fetchData() // 重新刷新数据
                    }, 300)
                })
            })
        },
        handleTab (val) {
//            if (val.name == 'course') this.$router.push({name: 'newcourse-course-public', query: {tab: 'course'}})
//            else this.$router.push({name: 'newcourse-course-public', query: {tab: 'newcourse'}})
        },
        selectable (row) {
            return row.publish_status !== 0
        },
    },
    components: { DateRange, CourseCategorySelect, CourseCategoryTree, CourseComponent, ErrorDialog }
}
</script>
