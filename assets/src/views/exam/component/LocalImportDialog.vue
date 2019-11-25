<!--
Attribute:
 - templateUrl: String 模板地址
 - onSuccess: Function (response, file, fileList) :{success, error, reason} 成功回调
 - title: String 标题
 - uploadUrl: String 上传地址

Slot:
 - footer: 底部备注
-->
<style lang='scss' rel='stylesheet/scss'>
    #dialog-local-import {
        .upload-file, .download-template, .upload-file-result {
            margin: 0 auto;
            width: 360px;
            text-align: center;
            margin-bottom: 15px;
        }
        .upload-file-result{
            height: 185px;
            .el-progress{
                line-height: 180px;
                width: 300px;
                margin: 0 auto;
            }
            .yst-show-response{
                height: 38px;
                margin-top:75px;
                text-align: center;
            }
            .el-upload-dragger:hover{
                border: 1px dashed #d9d9d9;
            }
        }
        .error-reason {
            color: #FF4949;
            margin-bottom: 15px;
        }
        .color-success {
            color: #13CE66;
        }
        .color-error {
            color: #FF4949;
        }
        .download-template{
            a{
                color: #20a0ff;
                text-decoration: none;
            }
            a:hover {
                color: #1D8CE0;
            }
        }
    }
</style>
<template>
    <el-dialog 
        append-to-body 
        id="dialog-local-import" 
        :title="title" 
        :visible.sync="isOpen" 
        @click.native.stop 
        @close="onClose">
        <slot name="form"></slot>
        <el-upload
            class="upload-file"
            drag
            :action="uploadUrl"
            :multiple="false"
            :headers="headers"
            :show-file-list="false"
            v-show="showUploading"
            :on-progress="progress"
            :on-error="error"
            :before-upload="beforeUpload"
            :data="data"
            :on-success="success">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="upload-file-result" v-show="!showUploading">
            <div class="el-upload el-upload--text">
                <div class="el-upload-dragger">
                    <el-progress v-show="uploadStatus == 0" :text-inside="true" :stroke-width="18" :percentage="percent"></el-progress>
                    <div class="yst-show-response" v-show="uploadStatus == 1">
                        <p v-show="response.success > 0"><i class="el-icon-circle-check color-success"></i>&nbsp;成功: {{ response.success }} 条</p>
                        <p v-show="response.error > 0"><i class="el-icon-circle-cross color-error"></i>&nbsp;失败: {{ response.error }}  条</p>
                    </div>
                    <div class="yst-show-response" v-show="uploadStatus == 2">
                        <p style="line-height: 38px"><i class="el-icon-circle-cross color-error"></i>上传失败</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="download-template" v-if="templateUrl">
            <a v-bind:href="templateUrl" target="_blank">下载参考模板</a>
        </div>
        <article class="error-reason" v-show="response.reasons.length > 0">
            <h5>错误原因：</h5>
            <h5 v-for="reason in response.reasons">{{ reason.message }}</h5>
        </article>
        <slot name="footer"></slot>
    </el-dialog>
</template>
<script>
    import authUtils from 'utils/authUtils'
    // import NestedDialog from 'components/dialog/NestedDialog.vue'

    export default {
        components: {},
        props: {
            templateUrl: {
                type: String,
                required: false
            },
            onSuccess: {
                type: Function,
                required: false
            },
            onClose: {
                type: Function,
                required: false,
                default: () => {}
            },
            title: {
                type: String,
                required: true
            },
            uploadUrl: {
                type: String,
                required: true
            },
            data: Object,   // additions options of request
            beforeUploadProp: Function, // custom before-upload 
        },
        data () {
            return {
                isOpen: false,
                headers: {
                    'Authorization': 'Bearer ' + authUtils.getAuthToken(),
                    'TwoStep': `Bearer ` + authUtils.getTwiceToken() // 二次验证的token
                },
                showUploading: true,
                isSuccess: true,
                percent: 0,
                uploadStatus: 0,
                response: {
                    success: 0,
                    error: 0,
                    reasons: [],
                }
            }
        },
        methods: {
            open () {
                this.uploadStatus = 0
                this.showUploading = true
                this.isOpen = true
                this.response.success = 0
                this.response.error = 0
                this.response.reasons = []
            },
            close () {
                this.isOpen = false
            },
            success (response, file, fileList) {
                console.log(file)
                this.$emit('success')
                this.isSuccess = true
                this.uploadStatus = 1

                if (response.code !== 0) {
                    this.response.success = 0
                    this.response.error = 1
                    this.response.reasons = [{message: response.message}]
                    return
                }

                this.response.success = response.data.success
                if (response.data.errs) {
                    this.response.error = response.data.failure || 1
                    response.data.errs.forEach((message) => {
                        this.response.reasons.push({
                            message: message
                        })
                    })
                }

                if (this.onSuccess) {
                    this.onSuccess(response.data, file, fileList).then(({success, error, reasons}) => {
                        this.response.success = success || 0
                        this.response.error = error || 0
                        this.response.reasons = reasons || []
                    }, ({error, reasons}) => {
                        this.response.success = 0
                        this.response.error = error
                        this.response.reasons = reasons || this.response.reasons

                        this.uploadStatus = 0
                        this.showUploading = true
                    })
                }
            },
            progress (event) {
                this.percent = parseInt(event.percent)
            },
            error (err) {
                if(err.status === 403){
                    xmview.showTip('error', '您没有权限执行该操作')
                }

                this.uploadStatus = 2
                this.isSuccess = false
            },
            beforeUpload (file) {
                console.log(file)
                if (this.beforeUploadProp) {
                    if (!this.beforeUploadProp()) {
                        return false
                    }
                }
                this.uploadStatus = 0
                this.showUploading = false
            },
        }
    }
</script>
