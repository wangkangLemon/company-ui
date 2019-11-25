<style lang="scss" rel="stylesheet/scss">
    @import "~utils/mixins/topSearch";
    .el-cascader-menu {
        height: 204px !important;
    }
    .create-course-task {
        background: #fff;
        padding: 20px;
        .tip {
            color: red;
        }
        .el-form {
            width: 60%;
            img {
                width: 35%;
                // height: 50% 
            }
        }
        .search {
            @extend %top-search-container;
        }
        .collection {
            align-items: center;
            min-height: 36px;
            border-radius: 4px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
        }
        .u-course-tag {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
        .el-tabs__content {
            position: relative;
            .dialog-select-item {
                h5 {
                    line-height: 40px;
                    font-size: 14px;
                    padding-left: 20px;
                    background: #fbfdff;
                    border: 1px solid #d1dbe5;
                    border-bottom: none;
                }
                position: absolute;
                top: 54px;
                right: 120px;
                height: 500px;
                width: 42%;
                display: inline-block;
                vertical-align: top;
            }
        }
        .row-class {
            border: 1px solid #d1dbe5;
        }
    }
</style>
<template>
    <article class="create-course-task">
        <el-form ref="form" :rules="rules" :model="fetchParam" label-width="100px">
            <el-form-item label="任务标题" prop="title">
                <el-input v-model="fetchParam.title"></el-input>
            </el-form-item>
            <el-form-item label="任务介绍" prop="description">
                <el-input type="textarea" :rows="3" v-model="fetchParam.description"></el-input>
            </el-form-item>
            <el-form-item label="客户端展示图" prop="image" style="white-space: nowrap">
                <img v-if="fetchParam.image" :src="fetchParam.image | fillImgPath"  alt="">
                <ImagEcropperInput :isRound="false" :confirmFn="cropperFn"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="添加任务" prop="object">
                <div>
                    <el-button @click="chooseCourse" :disabled="isLearn">选择任务</el-button>
                    <span v-if="isLearn" class="tip">该任务已有人参与，不支持本项操作</span>
                </div>
                <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
                <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
                <!-- 固定列通过配置fixed="right || left"-->
                <template v-if="transferRight.length">
                    <el-table class="data-table" :data="transferRight" :fit="true" border style="margin-top: 5px;">
                        <el-table-column 
                            label="类型" 
                            prop="type"
                            width="100">
                            <el-tag slot-scope="scope" :type="scope.row.type | taskType('tag')">
                                {{scope.row.type | taskType('label')}}
                            </el-tag>
                        </el-table-column>
                        <el-table-column 
                            label="名称" 
                            prop="name">
                        </el-table-column>
                    </el-table>
                    <el-tag>总计：{{transferRight.length}}个任务</el-tag>
                </template>
            </el-form-item>
            <el-form-item label="任务截止日期" prop="end_time" style="white-space: nowrap;">
                <el-date-picker
                        v-model="fetchParam.end_time"
                        type="datetime"
                        placeholder="截止日期"
                        :picker-options="pickerOptions0">
                </el-date-picker>
                <p>过期的任务员工仍可以继续查看和学习，但不会再记入统计</p>
            </el-form-item>
            <!-- 发布对象 -->
            <Pusher
                ref="pusher"
                :ruleForm="fetchParam"
                type="type"
                parentRef="form"
                labelWidth="100px"
                v-model="fetchParam.push_type_list">
            </Pusher>
            <el-form-item label="企业学分">
                <el-input style="width: auto;" v-model.number="fetchParam.study_score" type="number"  placeholder="请输入企业学分" :disabled="isLearn"></el-input>
                <span v-if="isLearn" class="tip">该任务已有人参与，不支持本项操作</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit(0)" :loading="submitLoading">提交</el-button>
                <!-- <el-button type="warning" @click="submit(1)">存草稿</el-button> -->
            </el-form-item>
        </el-form>
        <!-- 选择任务弹窗 -->
        <Task
            v-if="course.showDialog"
            ref="task"
            title="选择任务"
            :visible.sync="course.showDialog"
            :selected="transferRight"
            :initTabs="transferLeft"
            :coursetask="true"
            @submit="getTaskData">
        </Task>
    </article>
</template>
<script>
    import Task from 'components/dialog/task/Main.vue'
    import TaskModel from 'components/dialog/task/model'

    import Transfer from 'components/dialog/Transfer'
    import CourseCategorySelect from 'components/select/CourseCategory'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import DepSelect from 'components/select/Department.vue'
    import Pusher from 'components/select/pusher/Main.vue'
    import courseService from 'services/courseService'
    import courseTaskService from 'services/server/coursetaskService'
    import depService from 'services/departmentService'
    import {userNameList} from 'services/userService'
    import userService from 'services/company/userService'
    import testPaperService from 'services/exam/testPagerService'
    import * as _ from 'utils/common'

    export default {
        components: {
            ImagEcropperInput,
            CourseCategorySelect,
            Transfer,
            DepSelect,
            Task,
            Pusher
        },
        name: 'server-manage-create',
        computed: {
            id () {
                return this.$route.query.id
            },
            isCopy () {
                return this.$route.query.isCopy
            }
        },
        watch: {},
        created () {
            if (this.$route.query.item) {
                let item = this.$route.query.item
                this.fetchParam.title = item.title
                this.fetchParam.description = item.description
                this.fetchParam.image = item.image
                item.course = item.course || []
                item.course.forEach(item => {
                    item.type = 'course'
                    item.id = +item.id
                })
                this.transferLeft = this.getTaskSelected(item.course).resLeft
                this.transferRight = _.clone(item.course)
                xmview.setContentLoading(false)
            } else if (this.id === undefined) {
                xmview.setContentLoading(false)
            } else {
                courseTaskService.courseTaskDetail({id: this.id}).then((ret) => {
                    this.fetchParam = Object.assign(this.fetchParam, ret.data)
                    this.fetchParam.end_time = this.fetchParam.end_day
                    // debugger
                    this.isLearn = ret.is_learn && !this.isCopy ? true : false
                    this.transferLeft = this.getTaskSelected(ret.object).resLeft
                    this.transferRight = this.getTaskSelected(ret.object).resRight
                    // ret.object.forEach(o => {
                    //     if (o.type === 'course') {
                    //         this.course.selectCourse.push(o)
                    //     } else if (o.type === 'exam') {
                    //         this.exam.selectExam.push(o)
                    //     }
                    // })
                    this.fetchParam.push_type_list = this.generatorList(ret.push_type_list || [])
                    xmview.setContentLoading(false)
                })
            }
        },
        data () {
            return {
                tabs: 'course',
                pickerOptions0: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                transferLeft: [],
                transferRight: [],
                fetchParam: {
                    title: '',
                    description: '',
                    image: '',
                    end_time: '',
                    push_type_id: '',
                    push_type_list: [],
                    type: '',
                    study_score: '',
                    course: [],
                    status: '',
                    object: null,
                },
                isLearn: false,
                rules: {
                    title: {required: true, message: '必须填写标题', trigger: 'blur'},
                    description: {required: true, message: '必须填写任务介绍', trigger: 'blur'},
                    end_time: { required: true, message: '请选择截止日期', trigger: 'change' },
                },
                course: {
                    total: 0,
                    dataList: [],
                    showDialog: false,
                    selectCourse: [],
                    courseCurRow: [],
                    firstLoading: true,
                    fetchParam: {
                        category_id: '',
                        type: 'public',
                        is_task: '',
                        page: 1,
                        page_size: 10,
                        keyword: '',
                    }
                },
                exam: {
                    total: 0,
                    dataList: [],
                    selectExam: [],
                    examCurRow: [],
                    fetchParam: {
                        status: 0,
                        keyword: '',
                        page: 1,
                        page_size: 15
                    }
                },
                submitLoading: false,
            }
        },
        methods: {
            getTaskSelected (list) {
                let resLeft = new TaskModel().getTabs()
                let resRight = []
                list.forEach(item => {
                    // 适配器，适配task组件中的数据
                    resRight.push(item)
                    resLeft.forEach(tab => {
                        // if (tab.childType && tab.childType.includes(item.type)) {
                        //     tab.selected.push(item)
                        // } else if (tab.type === item.type) {
                        //     tab.selected.push(item)
                        // }
                        if (tab.type === item.type) {
                            tab.selected.push(item)
                        }
                    })
                })
                return {
                    resLeft,
                    resRight
                }
            },
            getTaskData () {
                this.course.showDialog = false
            },
            submit (type) {
                if (!this.transferRight.length) {
                    return xmview.showTip('warning', '请选择任务')
                }
                this.submitLoading = true
                if (this.validateAllForm('form')) {
                    this.fetchParam.status = type
                    this.fetchParam.end_time = this.timeFormatter(this.fetchParam.end_time, true)
                    this.fetchParam.object = this.transferRight.map(item => {
                        return {
                            object_id: item.id,
                            object_type: item.type
                        }
                    })
                    if (this.fetchParam.type !== 'company') {
                        this.fetchParam.push_type_id = this.fetchParam.push_type_list.map(item => {
                            return item.id
                        }).join(',')
                    }
                    if (this.id && !this.isCopy) {
                        courseTaskService['editTask'](this.fetchParam, this.id).then(() => {
                            xmview.showTip('success', type === 1 ? '保存成功' : '提交成功')
                            !type && this.$router.push({name: 'server-manage'})
                        }).catch(ret => {
                            xmview.showTip('error', ret.message || '失败')
                        }).then(() => {
                            this.submitLoading = false
                        })
                    } else {
                        courseTaskService['submitTask'](this.fetchParam).then(() => {
                            xmview.showTip('success', type === 1 ? '保存成功' : '提交成功')
                            !type && this.$router.push({name: 'server-manage'})
                        }).catch(ret => {
                            xmview.showTip('error', ret.message || '失败')
                        }).then(() => {
                            this.submitLoading = false
                        })
                    }
                } else {
                    this.submitLoading = false
                }
            },
            validateAllForm (formName) {
                return ![this, this.$refs.pusher]
                        .some((item, index) => !item.validate(formName, index + 1))
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            cropperFn (data, ext) {
                courseTaskService.uploadCover({
                    image: data,
                    alias: `${Date.now()}.${ext}`
                }).then((ret) => {
                    this.fetchParam.image = ret.url
                })
            },
            getExam (type) {
                type !== 'no-clear' && (this.exam.dataList = [])
                testPaperService.search(this.exam.fetchParam).then(ret => {
                    this.exam.total = ret.total
                    if (this.exam.dataList.length > 0 && this.exam.dataList.length < ret.total) {
                        this.exam.dataList.splice(-1, 1)
                    }
                    this.exam.dataList.push(...ret.list, {id: -1})
                    this.exam.dataList.forEach(item => { item.type = 'exam' })
                })
            },
            getCourseFn () {
                this.course.fetchParam.page = 1
                this.getCourse()
            },
            getCourse (type) {
                type !== 'no-clear' && (this.course.dataList = [])
                let fetchParam = _.clone(this.course.fetchParam)
                fetchParam.is_task = !fetchParam.is_task && fetchParam.is_task !== 0 ? -1 : fetchParam.is_task
                courseService.getPublicCourselistByName(fetchParam).then((ret) => {
                    this.course.total = ret.total
                    if (this.course.dataList.length > 0 && this.course.dataList.length < ret.total) {
                        this.course.dataList.splice(-1, 1)
                    }
                    this.course.dataList.push(...ret.data, {id: -1})
                    this.course.dataList.forEach(item => { item.type = 'course' })
                })
            },
            handleTabClick () {},
            chooseCourse () {
                this.course.showDialog = true
                if (this.course.firstLoading) {
                    this.clearFn()
                    this.getCourse()
                    this.getExam()
                    this.course.firstLoading = false
                }
            },
            clearFn () {
                this.course.fetchParam.category_id = ''
                this.course.fetchParam.is_task = ''
                this.course.fetchParam.page = 1
                this.course.fetchParam.keyword = ''
            },
            generatorList (arr) {
                return arr.map(item => {
                    return {
                        id: item['department_id'] || item['user_id'] || item['group_id'],
                        name: item['department_name'] || item['user_name'] || item['group_name']
                    }
                })
            }
        },
        filters: {
            type (val) {
                let map = {
                    'course': '课程',
                    'exam': '考试',
                }
                return map[val]
            }
        }
    }
</script>
