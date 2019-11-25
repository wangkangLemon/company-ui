<template>
    <el-form label-width="120px" ref="form" :rules="rules" :model="lesson">
        <div v-for="lesson_field in lesson_fields">
            <el-form-item label="课时类型" prop="material_type" v-if="lesson_field === 'material_type'">
                <el-select
                        v-model.string="lesson.material_type"
                        @change="typeChange"
                        :clearable="false"
                        @visible-change="onVisibleChange">
                    <el-option
                            v-for="item in material_types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="课件" prop="material_id" v-if="lesson_field === 'material_id'">
                <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog" :companyID="company_id"></DialogVideo>
                <DialogDocument :onSelect="handleDocumentSelected" v-model="isShowDocumentDialog" :companyID="company_id" :fileType="fileType" ref="dialogDocument"></DialogDocument>
                <!--点击上传视频-->
                <div v-if="lesson.material_type === 'video'">
                    <el-button type="primary" plain @click="isShowVideoDialog=true" :disabled="!lesson.material_type">
                        <i v-if="lesson.material_name">{{ lesson.material_name }}</i>
                        <i v-else>选择视频</i>
                    </el-button>
                </div>
                <div v-if="lesson.material_type !== 'video'">
                    <el-button type="primary" plain @click="isShowDocumentDialog=true" :disabled="!lesson.material_type">
                        <i v-if="lesson.material_name">{{ lesson.material_name }}</i>
                        <i v-else>选择文档</i>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="快进" v-if="lesson.material_type === 'video' && lesson_field === 'forward_enable'">
                <el-checkbox v-model.number="lesson.forward_enable" :trueLabel="0" :falseLabel="1">不允许快进</el-checkbox>
            </el-form-item>
            <el-form-item label="课时名称" prop="name" v-if="lesson_field === 'name'">
                <el-input v-model="lesson.name"></el-input>
            </el-form-item>
            <el-form-item label="免费试看" prop="try_enable" v-if="lesson_field === 'try_enable'">
                <el-checkbox v-model.number="lesson.try_enable" :trueLabel="1" :falseLabel="0">本课时免费试看</el-checkbox>
            </el-form-item>
            <slot></slot>
        </div>
    </el-form>
    <!--选择视频的弹窗-->
</template>
<script>
    import config from '../../utils/config'
    import DialogVideo from './component/DialogVideo.vue'
    import UploadFile from '../component/upload/UploadFiles.vue'
    import DialogDocument from './component/DialogDocument.vue'

    export default {
        props: {
            lesson: {type: Object, required: true},
            company_id: Number,
            material_types: {
                type: Array,
                default: function () {
                    return [
                        {value: 'video', label: '视频'},
                        {value: 'doc', label: 'WORD'},
                        {value: 'ppt', label: 'PPT'},
                        {value: 'pdf', label: 'PDF'},
                    ]
                },
            },
            lesson_fields: {
                type: Array,
                default: function () {
                    return [
                        'material_type',
                        'material_id',
                        'forward_enable',
                        'name',
                    ]
                },
            }
        },
        components: {DialogVideo, UploadFile, DialogDocument},
        data () {
            return {
                fileType: '',
                accept: '',
                isShowVideoDialog: false,
                isShowDocumentDialog: false,
                uploadDocUrl: `${config.apiHost}/com/course/doc/upload`,
                rules: {
                    name: { required: true, message: '请输入课程名称', trigger: 'blur' },
                    material_type: { required: true, message: '请选择课时类型', trigger: 'blur' },
                    material_id: { required: true, type: 'number', min: 1, message: '请选择课程文件', trigger: 'blur' },
                },
                selectOpen: false,
            }
        },
        watch: {
            'lesson.material_type': function (newValue, oldValue) {
                this.fileType = newValue
            }
        },
        methods: {
            // 课程类型改变
            typeChange (val) {
                this.fileType = val
                if (this.fileType === 'doc') {
                    this.accept = '.doc,.docx'
                } else if (this.fileType === 'ppt') {
                    this.accept = '.ppt,pptx'
                } else if (this.fileType === 'pdf') {
                    this.accept = '.pdf'
                }
                if (this.selectOpen) {
                    this.lesson.material_name = ''
                    this.lesson.material_id = 0
                }
                this.$refs['dialogDocument'].refreshFetchParam()
            },
            // 处理视频选取
            handleVideoSelected (row) {
                this.lesson.material_name = row.name
                this.lesson.material_id = row.id
            },
            handleDocumentSelected (row) {
                this.lesson.material_name = row.file_name
                this.lesson.material_id = row.id
            },
            resetFields () {
                return this.$refs['form'].resetFields()
            },
            validate (func) {
                return this.$refs['form'].validate(func)
            },
            onVisibleChange (val) {
                this.selectOpen = val
            }
        }
    }
</script>
