<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #task-statistics-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article id="task-statistics-container">
        <div class="top-btn">
            <el-button icon="el-icon-document" type='warning' :loading="exportLoading" @click.native="exportTask">导出 excel</el-button>
        </div>
        <article class="search">
            <section>
                <i>完成状态</i>
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="已完成" :value="1"></el-option>
                    <el-option label="未完成" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <i>门店</i>
                <Department v-model="fetchParam.department_id" :change="()=>{page=1;fetchData();}"></Department>
            </section>
            <section>
                <i>角色</i>
                <el-select v-model="fetchParam.role_type" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="店长" :value="1"></el-option>
                    <el-option label="店员" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <i>员工姓名</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
        </article>
        <el-table class="data-table" v-loading="loading" :data="dataList" :fit="true" border>
            <el-table-column prop="name" width="130" label="员工姓名"></el-table-column>
            <el-table-column prop="staff_id" width="93" label="工号"></el-table-column>
            <el-table-column prop="job" width="140" label="职位"></el-table-column>
            <el-table-column prop="department_name" min-width="120" label="所属门店"></el-table-column>
            <el-table-column prop="status" label="完成状态" width="180"></el-table-column>
            <el-table-column prop="" label="完成进度" width="100">
                <template slot-scope="scope">
                    <el-button type='text' @click="openCourseDetail(scope.row)">{{scope.row.course_done}}/{{scope.row.course_count}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="last_time" label="最后学习时间" width="180"></el-table-column>
        </el-table>
        <el-pagination class="block"
            @size-change="val=> {fetchParam.page_size=val; fetchData()}"
            @current-change="val=> {fetchParam.page=val; fetchData()}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes,total, prev, pager, next" :total="total">
        </el-pagination>

        <el-dialog 
            title="完成进度" 
            :visible.sync="courseDetail.showDialog">
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="courseDetail.data" :fit="true" border>
                <el-table-column 
                    label="内容名称" 
                    prop="object_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column prop="object_type" label="类型" width="100">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.object_type === 'industry'">工业课</el-tag>
                        <el-tag type="success" v-if="scope.row.object_type === 'public'">公开课</el-tag>
                        <el-tag type="success" v-if="scope.row.object_type === 'private'">内训课</el-tag>
                        <el-tag type="danger" v-if="scope.row.object_type === 'exam'">试卷</el-tag>
                        <el-tag type="warning" v-if="scope.row.object_type === 'speaking'">药我说</el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="进度" 
                    prop="completed" 
                    width="80">
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {courseDetail.fetchParam.page_size=val; fetchCourseData()}"
                @current-change="val=> {courseDetail.fetchParam.page=val; fetchCourseData()}"
                :current-page="courseDetail.fetchParam.page"
                :page-size="courseDetail.fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="courseDetail.total">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
            </span>
        </el-dialog>
    </article>
</template>

<script>
    import coursetaskService from 'services/server/coursetaskService'
    import Department from 'components/select/Department.vue'
    export default {
        name: 'server-coursetask-user',
        components: {
            Department
        },
        data () {
            return {
                type: {company: '企业任务', department: '门店任务', user: '指定人员', user_group: '指定用户组'},
                dataList: [],
                tableHeader: [],
                total: 0,
                loading: false,
                fetchParam: {
                    status: '',
                    department_id: '',
                    role_type: '',
                    keyword: '',
                    page: 1,
                    page_size: 15
                },
                exportLoading: false,
                courseDetail: {
                    showDialog: false,
                    data: [],
                    object: [],
                    total: 0,
                    fetchParam: {
                        page: 1,
                        page_size: 15
                    }
                },
            }
        },
        computed: {
            statid () {
                return this.$route.params.id
            },
            // title () {
            //     debugger
            //     return this.$route.query.title
            // }
        },
        created () {
            xmview.setContentTitle && xmview.setContentTitle(`详细统计-${this.$route.query.title}`)
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                return coursetaskService.courseTaskUserStateSearch({...this.fetchParam, id: this.statid}).then((ret) => {
                    this.dataList = ret.data
                    this.total = ret.total
                })
            },
            openCourseDetail (row) {
                this.courseDetail.showDialog = true
                this.courseDetail.object = row.object
                this.courseDetail.total = row.object.length
                this.fetchCourseData()
            },
            fetchCourseData () {
                let offset = this.courseDetail.fetchParam.page_size
                let start = (this.courseDetail.fetchParam.page - 1) * offset
                let end = start + offset
                this.courseDetail.data = this.courseDetail.object.slice(start, end)
            },
            exportTask () {
                this.exportLoading = true
                return coursetaskService.exportUserTask({
                    id: this.statid,
                    ...this.fetchParam
                }).then((ret) => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                }).catch((ret) => {
                    xmview.showTip('error', ret.message || '导出失败')
                }).then(() => {
                    this.exportLoading = false
                })
            }
        }
    }
</script>
