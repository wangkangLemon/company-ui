<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/common";
    #course-unlearned-container {
        // @extend %content-container; // 导出按钮
         position:relative;
        .export {
            position: absolute;
            right: 5px;
            top: -10px;
            i {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .note {
            margin-bottom: 10px;
            color: #F7BA2A;
        }
        .custom-alert {
            text-align: center;
            margin-bottom: 10px;
        }
        .search {
            @extend %top-search-container
        }
        .pagin {
            float: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article id="course-unlearned-container">
        <el-alert
            class="custom-alert"
            title=""
            type="warning">
            <span>
                企业中尚有{{unlearnedTotal}}人从未学习过任何课程
                <router-link to="/course/study/unlearned">查看人员名单</router-link>
            </span>
        </el-alert>
        <!-- <div class="note">说明：企业选项为内训与工业课程的考试情况</div> -->
        <article class="search">
               <section>
                <i>课程类型</i>
                <!--public表示公开课，private为内训，industry为工业课程-->
                <el-select v-model="fetchParam.type" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="公开课" value="public"></el-option>
                    <el-option label="内训课" value="private"></el-option>
                    <el-option label="工业课程" value="industry"></el-option>
                </el-select>
            </section>
            <section>
                <i>课程</i>
                <CourseSelect :change="fetchData" type="course" @change="val => {fetchParam.course_id=val}" v-model="fetchParam.course_id"></CourseSelect>
            </section>
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </section>
            <section>
                <i>考试名称</i>
                <ExamSelect v-model="fetchParam.exam_id" :change="fetchData"></ExamSelect>
            </section>
            <section>
                <i>角色</i>
                <el-select v-model="fetchParam.role_type" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="店长" value="manager"></el-option>
                    <el-option label="店员" value="user"></el-option>
                </el-select>
            </section>
             <section>
            <i>用户组</i>
                <UserGroupSelect  v-model="fetchParam.group_id" :change="fetchData"></UserGroupSelect>
            </section>
            <section>
                <i>成绩</i>
                <el-select v-model="fetchParam.grade" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="满分" value="1"></el-option>
                    <el-option label="及格" value="2"></el-option>
                    <el-option label="不及格" value="3"></el-option>
                </el-select>
            </section>

            <DateRange 
                title="最高分获得时间" 
                :start="fetchParam.time_start" 
                :end="fetchParam.time_end" 
                @changeStart="val=> {fetchParam.time_start=val} "
                @changeEnd="val=> {fetchParam.time_end=val}" 
                :change="fetchData">
            </DateRange>

            <section>
              <i>员工</i>
                <UserSelect v-model="fetchParam.user_id" :change="fetchData"></UserSelect>
            </section>
            <section>
                <i>学习进度</i>
                <el-select v-model="fetchParam.finished" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="已完成" value="1"></el-option>
                    <el-option label="未完成" value="2"></el-option>
                </el-select>
            </section>
<!--             <section>
                <i>考试情况</i>
                <el-select v-model="fetchParam.testing" placeholder="未选择" @change="fetchData" clearable>
                    <el-option label="已考试" value="1"></el-option>
                    <el-option label="未考试" value="2"></el-option>
                </el-select>
            </section> -->
        </article>
        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
            <el-table-column
                prop="exam_name"
                label="考试名称"
                min-width="200">
            </el-table-column>
            <el-table-column  min-width="350" label="关联课程">
                <template slot-scope="scope">
                    <template v-if="scope.row.course_name">
                        <el-tag type="success" v-if="scope.row.type == 'public'">公开</el-tag>
                        <el-tag v-else-if="scope.row.type == 'private'">内训</el-tag>
                        <el-tag type="warning" v-else>工业</el-tag>
                        <i>{{scope.row.course_name}}</i>
                    </template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column prop="user_name" label="员工姓名" width="150">
                <el-button slot-scope="scope" type='text' @click="openUserDetailDialog(scope.row.user_id)">{{scope.row.user_name}}</el-button>
            </el-table-column>
            <el-table-column
                prop="user_staff_id"
                label="工号"
                width="93">
            </el-table-column>
            <el-table-column prop="department_name" width="330" label="门店">
            </el-table-column>
            <el-table-column width="100" prop="job" label="职位">
            </el-table-column>
            <el-table-column width="100" prop="course_rate" label="学习进度">
                <span slot-scope="scope">{{scope.row.course_rate+"%"}}</span>
            </el-table-column>
            <el-table-column width="190" prop="last_course_time" label="最高分获得时间">
            </el-table-column>
            <el-table-column width="100" prop="testing_number" label="考试次数">
            </el-table-column>
            <el-table-column width="80" prop="score" label="分数" fixed="right">
            </el-table-column>
            <el-table-column width="100" label="成绩" fixed="right">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.grade == 1" type="success">满分</el-tag>
                    <el-tag v-else-if="scope.row.grade == 2">及格</el-tag>
                    <el-tag v-else type="danger">不及格</el-tag>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
         @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="fetchParam.page" 
        :page-size="fetchParam.page_size" 
        :page-sizes="[15, 30, 60, 100]" 
        layout="sizes,total, prev, pager, next" :total="total">
        </el-pagination>

        <UserDetailDialog
            ref="userDetail"
            :visible.sync="showUserDetail">
        </UserDetailDialog>
    </article>
</template>

<script>
    import testingService from 'services/course/testingService'
    import CourseSelect from 'components/select/LoadMoreSelect.vue'
    import DateRange from 'components/form/DateRangePicker.vue'
    import CompanySelect from 'components/select/IndustryCompany.vue'
    import DepSelect from 'components/select/Department.vue'
    import UserSelect from 'components/select/User.vue'
    import ExamSelect from 'components/select/Exam.vue'
    import UserGroupSelect from 'components/select/UserGroup'
    import UserDetailDialog from 'components/dialog/UserDetailDialog.vue'

    export default {
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                unlearnedTotal: 0,
                fetchParam: getFetchParam(),
                showUserDetail: false,
            }
        },
        created () {
            Promise.all([this.fetchData(), this.getUnlearnedTotal()]).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
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
            fetchData () {
                this.loadingData = true
                return testingService.getHistory(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            getUnlearnedTotal () {
                return testingService.getUnlearnedList({ page: 0, page_size: 0 }).then((ret) => {
                    this.unlearnedTotal = ret.total
                })
            },
            exportData () {
                return testingService.exportHighest(this.fetchParam).then(() => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '导出失败')
                })
            },
            openUserDetailDialog (id) {
                this.$refs.userDetail.fetchData(id).then(() => {
                    this.showUserDetail = true
                })
            }
        },
        components: {
            CourseSelect,
            DateRange,
            CompanySelect,
            DepSelect,
            UserSelect,
            UserGroupSelect,
            UserDetailDialog,
            ExamSelect
        }
    }

    function getFetchParam () {
        return {
            page: void 0,
            page_size: 15,
            enterprise_id: void 0,
            course_id: void 0,
            department_id: void 0,
            account: void 0,
            time_start: void 0,
            time_end: void 0,
            grade: void 0, // 不赋值则为未选择，1位满分，2为及格，3为不及格
            user_id: void 0, // 用户昵称
            type: void 0, // 课程类型  public表示公开课，private为内训，industry为工业课程
            exam_id: '', // 考试名称
            role_type: '',  // 角色 role_type：不赋值则为未选择，manager为店长
            finished: '', // 不赋值则为未选择，1为已完成，2为未完成
            testing: '', // testing：不赋值则为未选择，1为已考试，2为未考试
            group_id: '' // 用户组

        }
    }
</script>
