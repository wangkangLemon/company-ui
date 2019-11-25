<!--添加课程-->
<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
@import "../../../utils/mixins/common";

#course-manage-addcourse-container {
    @extend %content-container;

    h2 {
        margin-bottom: 10px;
    }

    .tab {
        max-width: 700px;
    }
    .el-tab-pane {
        max-width: 700px;
    }
    .el-upload-list__item {
        position: relative;
        .el-icon-close {
            position: absolute;
            right: 5px;
            top: 5px;
        }
    } // 考试题目设置
    .testing-set {
        .el-form {
            padding-top: 17px;
            &:first-of-type {
                padding-top: 0;
            }

            hr {
                position: absolute;
                width: 100%;
                border-top: none;
                border-color: #bbb;
            }
            h5 {
                font-size: 14px;
                color: #666;
            }
            .el-input {
                display: inline-block;
                width: 60%;
                vertical-align: middle;
            }

            .multy-choose-item {
                margin: 5px 0;
                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }

        .bottom-btns {
            .submit {
                float: right;
            }
        }
    }
    .u-course-tag {
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>

<template>
    <article id="course-manage-addcourse-container">
        <el-tabs v-model="activeTab" class="tab">
            <el-tab-pane label="课程信息" name="first">
                <el-form label-width="120px" ref="formFirst" :rules="rulesFirst" :model="fetchParam">
                    <el-form-item label="所属栏目" prop="category_id">
                        <CourseCategorySelect :placeholder="fetchParam.cat_name" :autoClear="true" :showNotCat="false" v-model="fetchParam.category_id"></CourseCategorySelect>
                    </el-form-item>
                    <el-form-item label="课程名称" prop="name">
                        <el-input v-model="fetchParam.name"></el-input>
                    </el-form-item>
                    <el-form-item label="课程封面图" prop="image">
                        <img :src="fetchParam.image | fillImgPath" width="200" height="112" v-show="fetchParam.image">
                        <CropperImg ref="imgcropper"  :confirmFn="cropperImgSucc" :aspectRatio="16/9"></CropperImg>
                    </el-form-item>
                    <el-form-item label="课程类型">
                        <el-select v-model="fetchParam.material_type" @change="typeChange" placeholder="请选择" :clearable="true">
                            <el-option label="视频" value="video"></el-option>
                            <el-option label="WORD" value="doc"></el-option>
                            <el-option label="PPT" value="ppt"></el-option>
                            <el-option label="PDF" value="pdf"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程文件" prop="material_id">
                        <UploadFile :onSuccess="handleUploadDoc" :url="uploadDocUrl" :accept="accept" :disabled="fetchParam.material_type == null" v-show="fetchParam.material_type !== 'video'"></UploadFile>
                        <el-button v-show="fetchParam.material_type === 'video'" @click="isShowVideoDialog=true">
                            <i>{{fetchParam.material_name}}</i>
                        </el-button>
                    </el-form-item>
                    <el-form-item label="课程介绍" prop="description">
                        <el-input v-model="fetchParam.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="企业学分" prop="study_score">
                        <el-input v-model.number="fetchParam.study_score"  type="number" placeholder="请输入企业学分">
                        </el-input>
                    </el-form-item>

                    <h2>课后考试设置</h2>
                    <el-form-item label="课后考试" prop="need_testing">
                        <el-radio class="radio" v-model="fetchParam.need_testing" :label="1">需要</el-radio>
                        <el-radio class="radio" v-model="fetchParam.need_testing" :label="0">不需要</el-radio>
                    </el-form-item>
                    <el-form-item label="考试时间" prop="limit_time">
                        <el-input-number :min="0" size="small" :disabled="fetchParam.need_testing == 0" placeholder="以分钟为单位" v-model="fetchParam.limit_time"></el-input-number>
                    </el-form-item>
                    <el-form-item label="考试次数限制">
                        <el-input :disabled="fetchParam.need_testing == 0" placeholder="留空或0位不限制" v-model="fetchParam.limit_repeat"></el-input>
                    </el-form-item>
                    <el-form-item label="及格分数" prop="score_pass">
                        <el-input :disabled="fetchParam.need_testing == 0" v-model="fetchParam.score_pass"></el-input>
                    </el-form-item>
                    <el-form-item label="发布对象" prop="push_type">
                        <el-select v-model="fetchParam.push_type" placeholder="请选择" @change="choosePushType">
                           <el-option
                             v-for="item in pushType"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                    </el-form-item>
                    <el-form-item 
                        :label="pushTypeDialog.title" 
                        v-if="fetchParam.push_type && fetchParam.push_type===pushTypeDialog.type">
                        <div class="el-input__inner" @click="openPushTypeDialog">
                            <el-tag 
                                class="u-course-tag"
                                v-for="item in pushTypeDialog.selectedData[this.pushTypeDialog.type]" 
                                :key="item.id">
                                {{item.name}}
                            </el-tag>
                        </div>
                    </el-form-item>
                    <el-form-item label="发布时间" prop="subject_type">
                        <el-radio class="radio" v-model="fetchParam.subject_type" label="now">保存后立即发布</el-radio>
                        <el-radio class="radio" v-model="fetchParam.subject_type" label="time">定时发布</el-radio>
                        <el-form-item v-if="fetchParam.subject_type==='time'" prop="subject_time">
                            设置为
                            <el-date-picker
                                v-model="fetchParam.subject_time"
                                type="datetime"
                                placeholder="点击选择时间">
                            </el-date-picker>
                            发布上线
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="" v-if="!readonly">
                        <el-button style="float: right" type="primary" @click="btnNextClick">
                            <i>{{ fetchParam.need_testing == 0 ? '保存' : '保存并下一步' }}</i>
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :disabled="!fetchParam.id" label="考试题目设置" name="second" class="testing-set">
                <el-form>
                    <el-form label-width="120px" v-for="(item,index) in fetchTesting" :key="index">
                        <el-form-item label="" v-if="!readonly">
                            <el-button icon="el-icon-plus" @click='addTesting(0, index)'>判断题</el-button>
                            <el-button icon="el-icon-plus" @click='addTesting(1, index)'>单选题</el-button>
                            <el-button icon="el-icon-plus" @click='addTesting(2, index)'>多选题</el-button>
                            <el-button icon="el-icon-delete" type="danger" @click='deleteTesting(index, item)'>删除</el-button>
                        </el-form-item>
                        <el-form-item :label="'第' + (index+1) + '题'">
                            <span v-if="item.category == 0">判断题</span>
                            <span v-else-if="item.category == 1">单选题</span>
                            <span v-else>多选题</span>
                        </el-form-item>
                        <el-form-item label="题目">
                            <el-input v-model="item.description" :disabled="!item.editable" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="分数">
                            <el-input placeholder="为该题设置分数" :disabled="!item.editable" v-model="item.score"></el-input>
                        </el-form-item>
                        <el-form-item label="配图" >
                                <img :src="item.image | fillImgPath" width="200" height="112" v-show="item.image">
                              <el-button  type="primary" @click="() => {$refs.imgupload.chooseImg();nowItem = item;
                                  }">上传</el-button>
                             
                             <!-- <UploadImg :defaultImg="item.image" :url="uploadImgUrl" :disabled="!item.editable" :onSuccess="res => item.image = res.data.url"></UploadImg>  -->
                        </el-form-item>
                        <!--判断题的正确错误选项-->
                        <el-form-item label="选项" v-if="item.category == 0">
                            <el-radio class="radio" :disabled="!item.editable" v-model="item.correct" :label="1">
                                <i>正确</i>
                            </el-radio>
                            <el-radio class="radio" :disabled="!item.editable" v-model="item.correct" :label="0">
                                <i>错误</i>
                            </el-radio>
                        </el-form-item>

                        <!--单选|多选的答案部分-->
                        <el-form-item label="选项" v-else>
                            <h5>请在正确答案前面打勾</h5>
                            <div class="multy-choose-item" v-for="(option,indexOption) in item.options" :key="indexOption">
                                <el-checkbox v-model="option.correct" :true-label="1" :disabled="!item.editable" v-if="item.category == 2"></el-checkbox>
                                <el-radio class="radio" v-model="item.correct" :label="indexOption" :disabled="!item.editable" v-else>
                                    <i></i>
                                </el-radio>
                                <el-input placeholder="填写描述" v-model="option.description" :disabled="!item.editable"></el-input>
                                <el-button :disabled="!item.editable" type="text" @click="item.options.splice(indexOption, 1)">
                                    <i>删除</i>
                                </el-button>
                            </div>
                            <div class="multy-choose-item">
                                <el-button type="text" @click="addMoreTestingOption(item.options)">添加更多选项</el-button>
                            </div>
                        </el-form-item>

                        <el-form-item label="答案详解">
                            <el-input v-model="item.explain" :disabled="!item.editable" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
                            </el-input>
                        </el-form-item>
                        <hr>
                    </el-form>
                </el-form>

                <el-form label-width="120px" v-if="!readonly">
                    <el-form-item label="">
                        <el-button icon="el-icon-plus" @click='addTesting(0, fetchTesting.length)'>判断题</el-button>
                        <el-button icon="el-icon-plus" @click='addTesting(1, fetchTesting.length)'>单选题</el-button>
                        <el-button icon="el-icon-plus" @click='addTesting(2, fetchTesting.length)'>多选题</el-button>
                    </el-form-item>
                </el-form>

                <div class="bottom-btns" v-if="!readonly">
                    <el-button @click="btnPreClick">上一步</el-button>
                    <el-button class="submit" type="primary" @click="handleSubmitTesting">发布</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <CropperImg 
            :confirmFn="imgupload"  
            :aspectRatio="16/9"  
            :isShowBtn="false" ref="imgupload">
        </CropperImg>   
        <DialogVideo 
            :onSelect="handleVideoSelected" 
            v-model="isShowVideoDialog">
        </DialogVideo>
        <!-- 发布对象transfer弹窗 -->
        <el-dialog 
            :title="pushTypeDialog.title" 
            :visible.sync="pushTypeDialog.showDialog" 
            v-if="pushTypeDialog.showDialog">
            <template v-if="pushTypeDialog.isSearch">
                <section class="search">
                    <section>
                        <i>门店</i>
                        <DepSelect v-model="pushTypeDialog.fetchParam.department_id" :change="fetchPushTypeData"></DepSelect>
                    </section>
                </section>
            </template>
            <Transfer placeholder="搜索"
                      @searchFn="(val)=>{pushTypeDialog.page=1;pushTypeDialog.data=[];pushTypeDialog.fetchParam.keyword=val;fetchPushTypeData();}"
                      @moreFn="()=>{pushTypeDialog.page++;fetchPushTypeData();}" :total="pushTypeDialog.total"
                      :data="pushTypeDialog.data"
                      v-model="pushTypeDialog.selectedData[pushTypeDialog.type]"></Transfer>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pushTypeDialog.showDialog = false">取 消</el-button>
                <el-button type="primary" @click="transferConfirmFn">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
import courseService from 'services/courseService'
import depService from 'services/departmentService'
import {userList} from 'services/userService'
import userService from 'services/company/userService'
import UploadImg from 'components/upload/UploadImg.vue'
import CropperImg from 'components/upload/ImagEcropperInput.vue'
import DialogVideo from '../component/DialogVideo.vue'
import UploadFile from 'components/upload/UploadFiles.vue'
import CourseCategorySelect from 'components/select/CourseCategory.vue'
import DepSelect from 'components/select/Department.vue'
import Transfer from 'components/dialog/Transfer'
import testingFactory from '../utils/testingFactory'
import formUtils from 'utils/formUtils'

const pushType = [
    {
        label: '全体员工',
        value: 'all'
    },
    {
        label: '指定门店',
        value: 'department'
    },
    {
        label: '指定用户组',
        value: 'user_group'
    },
    {
        label: '指定员工',
        value: 'user'
    },
]
function getOrignData () {
    let orignData = { // 课程信息部分
        id: void 0,
        category_id: void 0,
        cat_name: void 0,
        name: void 0,
        image: void 0,
        material_type: void 0,
        material_id: void 0,
        material_name: '选择视频',
        albumid: void 0,
        album_name: void 0,
        description: void 0,
        study_score: void 0,
        need_testing: void 0,
        limit_time: void 0,
        limit_repeat: void 0,
        score_pass: void 0,
        price_enabled: void 0,
        price: void 0,
        price_floa: void 0,
        push_type: '',
        push_type_id: '',
        subject_type: 'now',
        subject_time: ''
    }
    return orignData
}

export default {
    name: 'course-manage-addcourse',
    components: {
        CropperImg,
        UploadFile,
        CourseCategorySelect,
        DialogVideo,
        UploadImg,
        DepSelect,
        Transfer
    },
    data () {
        return {
            activeTab: 'first',
            uploadDocUrl: '', // 上传文档的url
            isShowVideoDialog: false, // 是否显示视频列表弹出框
            nowItem: '', // 当前点击数据
            fetchParam: getOrignData(),
            rulesFirst: { // 课程信息的校验规则
                name: { required: true, message: '请输入课程名称', trigger: 'change' },
                category_id: { required: true, type: 'number', message: '请选择课程栏目', trigger: 'change' },
                description: { required: true, message: '请输入课程介绍', trigger: 'change' },
                material_id: { required: true, type: 'number', message: '请上传课程文件', trigger: 'change' },
                need_testing: { required: true, type: 'number', message: '请选择是否需要课后考试', trigger: 'change' },
                subject_time: { required: true, message: '请选择时间' },
                push_type: { required: true, message: '请选择发布对象', trigger: 'change' }
            },
            accept: '*.doc,*.docx', // 上传的文件格式
            // 考试设置部分
            fetchTesting: [],
            pushType: pushType,
            pushTypeDialog: {
                fetchParam: {
                    department_id: '',
                    keyword: ''
                },
                title: '',
                isSearch: '',
                type: '',
                showDialog: false,
                selectedData: {
                    user: [],
                    user_group: [],
                    department: []
                },
                data: [],
                page: 1,
                page_size: 15,
                total: 0,
            },
            readonly: false, // 只读模式
        }
    },
    created () {
        this.uploadDocUrl = courseService.getCourseDocUploadUrl()
        this.uploadImgUrl = courseService.getManageImgUploadUrl()
        if (this.$route.params.courseInfo) {
            this.fetchParam = this.$route.params.courseInfo
            xmview.setContentTitle('编辑课程-培训')
        }
        if (this.$route.query.id) {
            courseService.getCourseInfo({ course_id: this.$route.query.id }).then((ret) => {
                this.fetchParam = ret.data
                this.fetchParam.subject_time = this.fetchParam.subject_time_name
                this.choosePushType()
                this.pushTypeDialog.selectedData[this.pushTypeDialog.type] = this.generatorList(ret.push_type_list || [])
                xmview.setContentTitle('编辑课程-培训')
            }).catch((ret) => {
                xmview.showTip('error', ret.message)
                xmview.setContentLoading(false)
            })
        }
        this.$route.params.tab && (this.activeTab = this.$route.params.tab)
        this.readonly = this.$route.params.readonly
        xmview.setContentLoading(false)
    },
    watch: {
        'fetchParam.need_testing' (val) {
            if (val == 1) { // 需要考试
                this.rulesFirst.limit_time = { required: true, message: '请输入考试时间', trigger: 'change' }
                this.rulesFirst.score_pass = { required: true, message: '请输入及格分数', trigger: 'change' }
            } else { // 不需要考试
                this.$delete(this.rulesFirst, 'limit_time')
                this.$delete(this.rulesFirst, 'score_pass')
            }
        },
        'activeTab' (val) {
            if (val === 'second' && this.fetchTesting.length < 1 && this.fetchParam.id) {
                xmview.setContentLoading(true)
                courseService.getTestingInfo({ course_id: this.fetchParam.id }).then((data) => {
                    this.fetchTesting = data
                    this.fetchTesting.forEach((item) => {
                        if (item.category == 1) {
                            item.options.forEach((optionItem, index) => {
                                if (optionItem.correct == 1) item.correct = index
                            })
                        }
                    })
                    xmview.setContentLoading(false)
                })
            }
        },
        'fetchParam.albumid' (val) {
            // 如果专辑id被清空  则干掉专辑名字
            if (!val && val !== 0) {
                this.fetchPaam.album_name = void 0
                this.fetchParam.albumid = void 0
            }
        },
        'fetchParam.subject_time' (val) {
            if (val === '0001-01-01T00:00:00Z') {
                this.fetchParam.subject_time = ''
            }
        },
        'fetchParam.subject_type' (val) {
            if (val === 'now') {
                this.fetchParam.subject_time = ''
            }
        }
    },
    methods: {
        // 下一步按钮点击
        btnNextClick () {
            this.fetchParam.limit_time && (this.fetchParam.limit_time += '')
            this.fetchParam.score_pass && (this.fetchParam.score_pass += '')
            this.fetchParam.push_type_id = this.pushTypeDialog.type && this.pushTypeDialog.selectedData[this.pushTypeDialog.type].map(item => {
                return item.id
            }).join(',')
            this.fetchParam.subject_time = this.timeFormatter(this.fetchParam.subject_time, true)
            this.$refs.formFirst.validate((isValidate) => {
                if (!isValidate) return
                let p
                // 如果是编辑
                if (this.fetchParam.id) {
                    p = courseService.editCourse(this.fetchParam).then((ret) => {
                        this.activeTab = 'second'
                    })
                } else {
                    p = courseService.addCourse(this.fetchParam).then((ret) => {
                        this.fetchParam.id = ret.data.id
                        this.activeTab = 'second'
                    })
                }

                p.then(() => {
                    // 如果只是保存不需要考试  跳回去
                    if (this.fetchParam.need_testing === 0) {
                        xmview.showTip('success', '保存成功')
                        this.$router.back()
                    }
                })
            })
        },
        btnPreClick () {
            this.activeTab = 'first'
        },
        // 处理上传文档
        handleUploadMedia (response) {
            this.fetchParam.material_id = response.data.id
        },
        // 图片裁切成功回调
        cropperImgSucc (imgData) {
            courseService.uploadCover4addCourse({ image: imgData }).then((ret) => {
                this.fetchParam.image = ret.url
            })
        },
        // 配图剪裁成功回调
        imgupload (imgData) {
            courseService.uploadCover4addCourse({ image: imgData }).then((ret) => {
                this.nowItem.image = ret.url
            })
        },
        // 处理视频选取
        handleVideoSelected (row) {
            this.fetchParam.material_name = row.name
            this.fetchParam.material_id = row.id
        },
        addTesting (type, index) {
            this.fetchTesting.splice(index, 0, testingFactory.getTestingSet(type))
        },
        // 删除考试
        deleteTesting (index, item) {
            xmview.showDialog(`是否确定删除题目【 <i style="color:red">${item.description || ''}</i> 】?`, () => {
                this.fetchTesting.splice(index, 1)
            })
        },
        // 添加多选 单选的选项
        addMoreTestingOption (options) {
            options.push({
                description: '',
                correct: ''
            })
        },
        // 考试题目信息提交
        handleSubmitTesting: function () {
            // 处理当前的数据
            let item = null

            if (!this.fetchTesting || this.fetchTesting.length < 1) {
                this.$router.back()
                return
            }

            let requestParam = JSON.parse(JSON.stringify(this.fetchTesting))
            for (let i = 0; item = requestParam[i], i < requestParam.length; i++) {
                // 处理单选题的正确答案选中
                if (item.category == 1 && typeof item.correct == 'number') {
                    item.options.map((itemOptions) => {
                        delete itemOptions.correct
                    })
                    item.options[item.correct].correct = 1
                    delete item.correct
                }

                // 修复sort属性
                item.sort = i + 1
                if (item.options) {
                    item.options.map((itemOptions, index) => {
                        itemOptions.sort = index + 1
                    })
                }
            }

            xmview.setContentLoading(true)
            courseService.addOrEditTesting({
                course_id: this.fetchParam.id,
                subjects: formUtils.serializeArray(requestParam)
            }).then((ret) => {
                xmview.showTip('success', '操作成功')
                this.$router.back()
            }, () => {
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        handleUploadDoc (rep) { // 文档上传完毕
            this.fetchParam.material_id = rep.data.id
        },
        // 课程类型改变
        typeChange (val) {
            if (val === 'doc') {
                this.accept = '.doc,.docx'
            } else if (val === 'ppt') {
                this.accept = '.ppt,pptx'
            } else if (val === 'pdf') {
                this.accept = '.pdf'
            }
        },
        choosePushType () {
            if (this.fetchParam.push_type === 'all') return
            let map = {
                department: {
                    type: 'department',
                    label: '选择门店',
                    isSearch: false,
                },
                user: {
                    type: 'user',
                    label: '选择人员',
                    isSearch: true,
                },
                user_group: {
                    type: 'user_group',
                    label: '选择用户组',
                    isSearch: false,
                }
            }
            let param = map[this.fetchParam.push_type]
            this.pushTypeDialog.title = param.label
            this.pushTypeDialog.isSearch = param.isSearch
            this.pushTypeDialog.type = param.type
        },
        openPushTypeDialog () {
            this.pushTypeDialog.showDialog = true
            this.fetchPushTypeData()
        },
        transferConfirmFn () {
            this.pushTypeDialog.showDialog = false
        },
        fetchPushTypeData () {
            let map = {
                department: depService.getDepartment,
                user: userList,
                user_group: userService.userGroupSearch
            }
            let param = {
                keyword: this.pushTypeDialog.fetchParam.keyword,
                page: this.pushTypeDialog.page,
                page_size: this.pushTypeDialog.page_size
            }
            if (this.pushTypeDialog.isSearch) {
                param.department_id = this.pushTypeDialog.fetchParam.department_id
            }
            map[this.pushTypeDialog.type](param).then(ret => {
                this.pushTypeDialog.data = ret.data
            })
        },
        generatorList (arr) {
            return arr.map(item => {
                return {
                    id: item['department_id'] || item['user_id'] || item['user_group_id'],
                    name: item['department_name'] || item['user_name'] || item['user_group_name']
                }
            })
        }
    },
}
</script>
