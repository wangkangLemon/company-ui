<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #feedback-view {
        @extend %content-container;

        background-color: #d9e0e7;
        border-color: #d9e0e7;
        padding: 0;

        .manage-container {
            @extend %right-top-btnContainer;
        }
        .el-row {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-white {
            background: #fff;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .box-card {
            margin-bottom: 15px;
            color: #333;
            box-shadow: none;
            .clearfix {
                text-align: left;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                font-size: 14px;
            }
            #lineChart {
                width: 100%;
                height: 300px;
            }
        }
        .feedback-charts .el-card__body {
            padding: 0;
        }

        .pull-right {
            float: right;
        }
        .feedback-form {
            border-top: 1px solid #d1dbe5;
            padding: 20px 15px 0 15px;
        }

        dl {
            margin-top: 0;
            margin-bottom: 0;
            font-size: 12px;
        }
        dt,
        dd {
            line-height: 1.8;
            display: block;
        }
        dt:before,
        dd:before,
        dt:after,
        dd:after {
            display: table;
            content: " ";
        }
        dt:after,
        dd:after {
            clear: both;
        }
        dt {
            font-weight: bold;
        }
        dd {
            margin-left: 0;
        }
        .dl-horizontal dt {
            float: left;
            width: 60px;
            overflow: hidden;
            clear: left;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dl-horizontal dd {
            margin-left: 80px;
        }
        ul.process-status {
            padding-left: 20px;
        }
        .text {
            font-size: 12px;
        }
        .text.light {
            color: lightgray;
        }
        .text.current {
            color: #13CE66;
        }

        /* 9.5 Chat List Setting */

        .panel-body .chats {
            padding: 0;
        }
        .slimScrollDiv .chats {
            padding-right: 15px;
        }
        .chats {
            list-style-type: none;
            margin: 0;
            padding: 12px 15px 15px;
        }
        .chats > li + li {
            margin-top: 15px;
        }
        .chats > li:before,
        .chats > li:after {
            content: '';
            display: table;
            clear: both;
        }
        .chats .name {
            color: #333;
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            text-decoration: none;
        }
        .chats .name .label {
            font-size: 8px;
            padding: 1px 4px 2px;
            margin-left: 3px;
            position: relative;
            top: -1px;
        }
        .chats .date-time {
            font-size: 10px;
            display: block;
            float: right;
            color: #999;
            margin-top: 3px;
        }
        .chats .image {
            float: left;
            width: 60px;
            height: 60px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            overflow: hidden;
        }
        .chats .image img {
            max-width: 100%;
        }
        .chats .image + .message {
            margin-left: 75px;
        }
        .chats .message {
            border: 1px solid #d1dbe5;
            padding: 7px 12px;
            font-size: 12px;
            position: relative;
            background: #fff;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
        .chats .message:before,
        .chats .message:after {
            content: '';
            position: absolute;
            top: 10px;
            left: -14px;
            border: 7px solid transparent;
            border-right-color: #d1dbe5;
        }
        .chats .message:after {
            left: -13px;
            border-right-color: #fff;
        }
        .chats .message p {
            line-height: 1.5;
        }
        .chats .right .name {
            text-align: right;
        }
        .chats .right .date-time {
            float: left;
        }
        .chats .right .image {
            float: right;
        }
        .chats .right .image + .message {
            margin-right: 75px;
            margin-left: 0;
        }
        .chats .right .message:before,
        .chats .right .message:after {
            left: auto;
            right: -14px;
            border-right-color: transparent;
            border-left-color: #d1dbe5;
        }

        .chats .right .message:after {
            right: -13px;
            border-left-color: #fff;
        }

        .chats .right .message {
            background-color: #d1dbe5;
            color: #333;
        }

        .chats .right .message:after {
            border-left-color: #d1dbe5;
        }
    }
</style>

<template>
    <article id="feedback-view">
        <div class="manage-container">
            <el-button type="info" @click="$router.push({name: 'feedback-index'})">返回列表</el-button>
        </div>

        <el-row :gutter="20">
            <el-col :span="18">
                <div class="grid-content">
                    <el-card class="box-card feedback-charts">
                        <div slot="header" class="clearfix">
                            沟通记录
                            <el-button type="primary" size="mini" class="pull-right"
                                       v-if="data.status == 4"
                                       @click="confirmFn">
                                确认已解决
                            </el-button>
                        </div>
                        <ul class="chats">
                            <li class="left">
                                <span class="date-time">{{ data.create_time_name }}</span>
                                <a href="#" class="name">{{ data.user_name }}</a>
                                <a href="javascript:;" class="image"><img alt=""
                                                                          :src="{ url: data.user_avatar, sex: data.user_sex } | defaultAvatar "></a>
                                <div class="message">
                                    <p v-html="data.content"></p>
                                    <label class="text-inline" v-for="img in data.upload_group"><a href="javascript:;"
                                                                                                   @click="handlePreview(img)"><img
                                            width="100" :src="img | fillImgPath" alt=""></a></label>
                                </div>
                            </li>

                            <li :class="{left: item.user_id == data.user_id, right: item.user_id != data.user_id }"
                                v-for="item in replies" :key="item.id">
                                <span class="date-time">{{ item.create_time_name }}</span>
                                <a href="#" class="name">{{ item.user_name }}</a>
                                <a href="javascript:;" class="image"><img alt=""
                                                                          :src="{ url: item.user_avatar, sex: item.user_sex } | defaultAvatar "></a>
                                <div class="message">
                                    <p v-html="item.content"></p>
                                    <label class="text-inline" v-for="img in item.upload_group"><a href="javascript:;"
                                                                                                   @click="handlePreview(img)"><img
                                            width="100" :src="img | fillImgPath" alt=""></a></label>
                                </div>
                            </li>
                        </ul>
                        <el-form ref="form" :model="form" :rules="rules" class="feedback-form"
                                 :label-width="formLabelWidth"
                                 v-if="data.status < 9">
                            <el-form-item prop="content" label="问题描述">
                                <el-input type="textarea" v-model="form.content" :rows="5"
                                          placeholder="问题补充"></el-input>
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
                            <el-form-item v-if="data.status == 4">
                                <el-checkbox v-model="form.confirm">确认已解决并关闭工单</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form')">回复</el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="grid-content">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">工单信息</div>
                        <dl class="dl-horizontal">
                            <dt>提交人</dt>
                            <dd>{{ data.user_name }}</dd>
                            <dt>联系方式</dt>
                            <dd>{{ data.contact }}</dd>
                            <dt>问题类型</dt>
                            <dd>{{ data.category_name }}</dd>
                        </dl>
                    </el-card>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            处理进度
                        </div>
                        <ul class="process-status">
                            <li class="text current" v-if="data.status == 0">待分配</li>
                            <li class="text" v-else>已分配</li>
                            <template v-if="data.status < 4">
                                <li :class="{text: true, light: data.status == 0 ? true : false, current: data.status == 1 ? true : false}">
                                    处理中
                                </li>
                                <li class="text current" v-if="data.status == 2">待补充</li>
                                <template v-if="data.status == 3">
                                    <li class="text">已补充</li>
                                    <li class="text current">待处理</li>
                                </template>
                            </template>
                            <template v-else>
                                <li class="text">已处理</li>
                            </template>
                            <template v-if="data.status < 5">
                                <li :class="{text: true, light: data.status == 4 ? false : true, current: data.status == 4 ? true : false}">
                                    待确认
                                </li>
                            </template>
                            <template v-else>
                                <li class="text">已确认</li>
                            </template>
                            <li :class="{text: true, light: data.status == 9 ? false : true, current: data.status == 9 ? true : false}">
                                已关闭
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            工单评价
                        </div>
                        <el-rate v-model="score" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
                    </el-card>
                </div>
            </el-col>
        </el-row>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

    </article>
</template>

<script>
    import feedbackService from '../../../services/base/feedbackService'
    import {fillImgPath, defaultAvatar} from '../../../utils/filterUtils'
    import UploadImages from '../../component/upload/UploadImages.vue'
    export default {
        name: 'feedback-view',
        filters: {
            fillImgPath,
            defaultAvatar
        },
        components: {
            UploadImages
        },
        data () {
            return {
                score: 3,
                id: 0,
                data: {
                    id: 0,
                    user_id: 0,
                    user_name: '',
                    user_sex: 0,
                    user_avatar: '',
                    contact: '',
                    category_name: '',
                    content: '',
                    upload_group: [],
                    status: 0,
                    create_time: 0,
                    create_time_name: '',
                },
                replies: [],
                form: {
                    id: 0,
                    status: 0,
                    content: '',
                    images: [],
                    confirm: false,
                },
                rules: {
                    content: {type: 'string', required: true, message: '请补充信息', trigger: 'change'}
                },
                formLabelWidth: '120px', // 表单label的宽度
                uploadImgUrl: '',
                uploadName: 'file',
                fileNum: 3,
                dialogImageUrl: '',
                dialogVisible: false,
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        created () {
            this.id = this.$route.query['feedback_id']
            this.uploadImgUrl = feedbackService.uploadImageUrl()
            this.loadData()
            xmview.setContentLoading(false)
        },
        methods: {
            handlePreview (url) {
                this.dialogImageUrl = fillImgPath(url)
                this.dialogVisible = true
            },
            handleImgUploaded (ret, file, fileList) {
                if (this.form.images.indexOf(ret.data.url) == -1) {
                    this.form.images.push(ret.data.url)
                }
            },
            handleImgRemoved (file, fileList) {
                let index = this.form.images.indexOf(file.response.data.url)
                if (index > -1) {
                    this.form.images.splice(index, 1)
                }
            },
            loadData () {
                feedbackService.view(this.id).then((ret) => {
                    this.data = ret.data
                    this.replies = ret.replies
                    this.form.id = ret.data.id
                    this.form.status = ret.data.status
                    if (ret.data.status == 4) {
                        this.form.confirm = true
                    }
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        feedbackService.reply(this.form).then(() => {
                            xmview.showTip('success', '提交成功')
                            this.loadData()
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
            },
            confirmFn () {
                console.log(this.id)
            }
        }
    }
</script>
