<!--文档管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";

    #course-manage-doc-container {
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
        .block {
            margin-top: 5px;
            float: right;
        }
        .xm-list {
            display: inline-block;
            margin: 0 auto;
            position: relative;
            left: 50%;
            transform: translate(-50%);
            /* margin-left: 10px; */
            list-style: none;
            .xm-list__item {
                margin-bottom: 20px;
            }
        }
    }
</style>

<template>
    <main id="course-manage-doc-container">
        <section class="search">
            <section>
                <i>工业</i>
                <IndustryCompany 
                    :type="1"
                    v-model="fetchParam.industry_id"
                    :change="fetchData">
                </IndustryCompany>
            </section>
            <section>
                <i>课程</i>
                <CourseSelect 
                    v-model="fetchParam.course_id"
                    type="course"
                    industry="industry"
                    :change="fetchData">
                </CourseSelect>
            </section>
        </section>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  border>
            <el-table-column
                    min-width="100"
                    prop="course_name"
                    label="课程名称">
            </el-table-column>
            <el-table-column
                    min-width="100"
                    prop="company_name"
                    label="工业名称">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="create_time_name"
                    label="投放时间">
            </el-table-column>
            <el-table-column
                    width="350"
                    label="操作">
                <template slot-scope="scope">
                    <!-- <el-button v-if="scope.row.status == 0" @click="show(scope.$index, scope.row)" type="text" size="small">预览</el-button> -->
                    <el-button @click="getCourseInfo(scope.$index, scope.row)" type="text" size="small">课程信息</el-button>
                    <el-button @click="deliveryStore(scope.$index, scope.row)" type="text" size="small">投放门店</el-button>
                    <el-button @click="showDenyDialog('屏蔽课程', scope.row, 'course')" type="text" size="small">屏蔽课程</el-button>
                    <el-button @click="showDenyDialog('屏蔽工业', scope.row, 'industry')" type="text" size="small">屏蔽工业</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
            @size-change="val => {fetchParam.page_size = val}"
            @current-change="val => {fetchParam.page = val}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes, total, prev, pager, next"
            :total="total">
        </el-pagination>

        <!-- 课程详情弹窗 -->
        <el-dialog 
            v-if="courseDetail.showDialog"
            title="课程详情" 
            width="30%"
            :visible.sync="courseDetail.showDialog">
            <ul class="xm-list">
                <li class="xm-list__item">
                    <div>
                        <i>课程名称：</i>
                        <span>{{courseDetail.data.name}}</span>
                    </div>
                </li>
                <li class="xm-list__item">
                    <div>
                        <i>课程描述：</i>
                        <span>{{courseDetail.data.description}}</span>
                    </div>
                </li>
                <li class="xm-list__item">
                    <div>
                        <i>奖励类型：</i>
                        <span>{{courseDetail.data.award_type | awardType}}</span>
                    </div>
                </li>                
                <li class="xm-list__item">
                    <div>
                        <i>奖励标准：</i>
                        <span>{{courseDetail.data.award_price}}</span>
                    </div>
                </li>                
                <li class="xm-list__item">
                    <div>
                        <i>课时总数：</i>
                        <span>{{courseDetail.data.lesson_count}}</span>
                    </div>
                </li>                
                <li class="xm-list__item">
                    <div>
                        <i>是否需要考试：</i>
                        <span>{{courseDetail.data.need_testing ? '需要' : '不需要'}}</span>
                    </div>
                </li>
                <li class="xm-list__item">
                    <div>
                        <i>创建时间：</i>
                        <span>{{courseDetail.data.create_time_name}}</span>
                    </div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="courseDetail.showDialog = false">确定</el-button>
            </span>
        </el-dialog>

        <!-- 投放门店弹窗 -->
        <el-dialog 
            v-if="departmentDetail.showDialog"
            title="投放门店" 
            :visible.sync="departmentDetail.showDialog">
            <p>*屏蔽课程：可针对某一门店进行屏蔽操作</p>
            <section class="search">
                <section>
                    <i>门店</i>
                    <DepSelect v-model="departmentDetail.param.department_id" :change="getDepartment"></DepSelect>
                </section>
            </section>
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="departmentDetail.loading" :data="departmentDetail.data" :fit="true" border>
                <el-table-column 
                    label="门店列表" 
                    prop="name">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showDenyDialog('屏蔽课程', scope.row, 'department')">屏蔽课程</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {fetchParam.page_size=val; getDepartment()}"
                @current-change="val=> {fetchParam.page=val; getDepartment()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="departmentDetail.total">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="departmentDetail.showDialog=false">确定</el-button>
            </span>
        </el-dialog>

        <!-- 屏蔽课程弹窗 -->
        <el-dialog 
            v-if="denyCourse.showDialog"
            :title="denyCourse.title" 
            :visible.sync="denyCourse.showDialog">
            <span>你确认要屏蔽{{denyCourse.type | denyType}}<i style="color: red;">{{denyCourse.data}}</i>？{{denyCourse.type === 'course' ? '屏蔽后门店将不会再看到此课程' : ''}}</span>
            <el-input
                type="textarea"
                v-model="denyCourse.reason"
                placeholder="请输入屏蔽原因"
                suffix-icon="el-icon-search">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="denyCourse.denyFn()">确定</el-button>
                <el-button @click="cancelDeny">取消</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    import IndustryCompany from 'components/select/IndustryCompany.vue'
    import CourseSelect from 'components/select/LoadMoreSelect.vue'
    import DepSelect from 'components/select/Department.vue'
    import industryService from 'services/course/industryService'
    import newCourseService from 'services/newcourse/courseService'
    // import config from 'utils/config'

    function getFetchParam () {
        return {
            industry_id: void 0, // 工业id
            course_id: void 0,
            page: 1,
            page_size: 15,
        }
    }

    export default{
        components: {
            IndustryCompany,
            CourseSelect,
            DepSelect
        },
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                fetchParam: getFetchParam(),
                courseDetail: {
                    data: [],
                    showDialog: false
                },
                departmentDetail: {
                    loading: false,
                    showDialog: false,
                    data: [],
                    total: '',
                    course_id: '',
                    industry_id: '',
                    param: {
                        department_id: '',
                        page: 1,
                        page_size: 15,
                    }
                },
                denyCourse: {
                    showDialog: false,
                    reason: '',
                    course_id: '',
                    department_id: '',
                    title: '',
                    type: '',
                }
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
                return industryService.getTakeCourseList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            getCourseInfo (index, row) {
                newCourseService.getCourseInfo({course_id: row.course_id}).then(ret => {
                    this.courseDetail.data = ret.course
                    this.courseDetail.showDialog = true
                })
            },
            getDepartment () {
                this.departmentDetail.loading = true
                industryService.getDepartment({
                    course_id: this.departmentDetail.course_id,
                    department_id: this.departmentDetail.param.department_id,
                    page: this.departmentDetail.param.page,
                    page_size: this.departmentDetail.param.page_size
                }).then(ret => {
                    this.departmentDetail.data = ret.data
                    this.departmentDetail.total = ret.total
                }).then(() => {
                    this.departmentDetail.loading = false
                })
            },
            deliveryStore (index, row) {
                this.departmentDetail.showDialog = true
                this.departmentDetail.course_id = row.course_id
                this.departmentDetail.industry_id = row.company_id
                this.denyCourse.data = row.course_name
                this.getDepartment()
            },
            showDenyDialog (title, row, type) {
                this.denyCourse.title = title
                this.denyCourse.type = type
                if (type === 'department') {
                    this.denyCourse.department_id = row.id
                    this.denyCourse.course_id = this.departmentDetail.course_id
                } else {
                    this.denyCourse.data = type === 'course' ? row.course_name : row.company_name
                    this.denyCourse.course_id = row.course_id
                    this.denyCourse.industry_id = row.company_id
                }
                this.denyCourse.showDialog = true
                this.denyCourse.denyFn = ~title.indexOf('工业') ? this.shieldIndustry : this.shieldCourse
            },
            shieldCourse () {
                let isDepartment = this.denyCourse.type === 'department'
                let industry_id = isDepartment ? this.departmentDetail.industry_id : this.denyCourse.industry_id
                industryService.denyCourse({
                    course_id: this.denyCourse.course_id,
                    department_id: isDepartment ? this.denyCourse.department_id : 0,
                    industry_id,
                    reason: this.denyCourse.reason
                }).then(() => {
                    xmview.showTip('success', '屏蔽课程成功')
                    this.denyCourse.showDialog = false
                    this.denyCourse.reason = ''
                    isDepartment ? this.getDepartment() : this.fetchData()
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '屏蔽课程失败')
                })
            },
            shieldIndustry () {
                industryService.denyIndustry({industry_id: this.denyCourse.industry_id, reason: this.denyCourse.reason}).then(() => {
                    xmview.showTip('success', '屏蔽工业成功')
                    this.denyCourse.showDialog = false
                    this.denyCourse.reason = ''
                    this.fetchData()
                }).catch(ret => {
                    xmview.showTip('error', ret.message || '屏蔽工业失败')
                })
            },
            cancelDeny () {
                this.denyCourse.reason = ''
                this.denyCourse.showDialog = false
            }
        },
        filters: {
            awardType (val) {
                let map = {
                    'none': '没有奖励',
                    'lucky_money': '红包',
                    'credit': '积分',
                    'study_score': '学分'
                }
                return map[val]
            },
            denyType (val) {
                let map = {
                    'course': '课程',
                    'industry': '工业'
                }
                return map[val]
            }
        }
    }
</script>
