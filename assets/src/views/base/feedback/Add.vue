<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #feedback-add {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }
        .feedback-form {
            width: 90%;
            .input {
                max-width: 300px;
            }
        }

        .el-dialog__wrapper {
            padding-top: 15px;
            background: rgba(0, 0, 0, .5);
            z-index: 1000;
        }
    }
</style>

<template>
    <main id="feedback-add">
        <div class="manage-container">
            <el-button type="info" @click="$router.push({name: 'feedback-index'})">返回列表</el-button>
        </div>

        <main class="feedback-form">
            <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
                <el-form-item prop="category_id" label="问题分类">
                    <el-select v-model="form.category_id" placeholder="未选择">
                        <el-option v-for="cate in categories" :label="cate.name" :value="cate.id"
                                   :key="cate.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="content" label="问题描述">
                    <el-input type="textarea" v-model="form.content" :rows="5"
                              placeholder="请详细描述您所遇到的问题或优化建议"></el-input>
                </el-form-item>
                <el-form-item prop="images" label="上传截图(选填)">
                    <UploadImages ref="uploadImg"
                                  :url="uploadImgUrl"
                                  :name="uploadName"
                                  :fileNum="fileNum"
                                  :onSuccess="handleImgUploaded"
                                  :onRemove="handleImgRemoved"
                                  class="upload-btn">
                    </UploadImages>
                </el-form-item>
                <el-form-item prop="contact" label="联系方式">
                    <el-input class="input" type="input" v-model="form.contact" placeholder="请留下联系方式用于问题跟进"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">提交</el-button>
                </el-form-item>
            </el-form>
        </main>

    </main>
</template>

<script>
    import feedbackService from '../../../services/base/feedbackService'
    import {fillImgPath} from '../../../utils/filterUtils'
    import authUtils from '../../../utils/authUtils'
    import UploadImages from '../../component/upload/UploadImages.vue'
    export default {
        name: 'feedback-add',
        filters: {
            fillImgPath
        },
        components: {
            UploadImages
        },
        data () {
            return {
                form: {
                    category_id: '',    // 分类
                    content: '',        // 标题
                    contact: '',        // 正文内容
                    images: [],         // 图片地址
                },
                rules: {
                    category_id: {type: 'number', required: true, message: '请选择栏目', trigger: 'blur'},
                    content: {type: 'string', required: true, message: '请描述您遇到的问题', trigger: 'change'},
                    contact: {type: 'string', required: true, message: '请填写联系方式', trigger: 'change'}
                },
                formLabelWidth: '120px', // 表单label的宽度
                categories: [],
                uploadImgUrl: '',
                uploadName: 'file',
                fileNum: 3,
            }
        },
        watch: {
            'form.images' (val) {
                console.log('watch images:', val)
            }
        },
        created () {
            this.uploadImgUrl = feedbackService.uploadImageUrl()
            feedbackService.category().then((ret) => {
                this.categories = ret.categories
            }).catch((ret) => {
                xmview.showTip('error', ret.message)
            })
            let userInfo = authUtils.getUserInfo()
            if (userInfo) {
                this.form.contact = userInfo.mobile ? userInfo.mobile : userInfo.email
            }
            xmview.setContentLoading(false)
        },
        methods: {
            handleImgUploaded (ret, file, fileList) {
                console.log('handleImgUploaded', ret)
                if (this.form.images.indexOf(ret.data.url) == -1) {
                    this.form.images.push(ret.data.url)
                }
            },
            handleImgRemoved (file, fileList) {
                console.log('handleRemove', file, fileList)
                let index = this.form.images.indexOf(file.response.data.url)
                if (index > -1) {
                    this.form.images.splice(index, 1)
                }
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        feedbackService.create(this.form).then(() => {
                            xmview.showTip('success', '提交成功')
                            this.$router.push({name: 'feedback-index', params: {reload: true}})
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            resetForm (formName) {
                this.$refs[formName].resetFields()
            }
        }
    }
</script>
