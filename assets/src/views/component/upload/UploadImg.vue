<!--使用ex.-->
<!--<el-form-item label="课程封面图" prop="image">-->
<!--<UploadImg :defaultImg="fetchParam.image" :url="uploadImgUrl"-->
<!--:on-success="res=> fetchParam.image = res.data.url"></UploadImg>-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .component-upload-uploadimg {
        width: 100px;
        height: 100px;
        display: inline-block;

        // 当禁用的样式
        &.uploaddisabled {
            * {
                color: #ededed;
                border-color: #ededed !important;
                cursor: auto;
            }
            .el-upload-list__item-delete {
                display: none !important;
            }
        }

        %commSize {
            width: 100% !important;
            height: 100% !important;
        }

        > * {
            height: 100%;
        }

        .defaultImg {
            position: relative;
            border-radius: 5px;

            &:hover {
                span {
                    opacity: 1;
                }
            }
            img {
                width: 100%;
                height: 100%
            }

            span {
                border-radius: 5px;
                opacity: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.4);
                text-align: center;
                transition: all 300ms ease;

                i {
                    font-size: 30px;
                    color: #fff;
                    display: block;
                    transform: translateY(-50%);
                    top: 50%;
                    position: absolute;
                    width: 100%;
                    cursor: pointer;
                }
            }
        }

        .el-upload--picture-card {
            @extend %commSize;
            position: relative;
            i {
                position: absolute;
                @extend %absoluteCenter;
            }
        }

        .el-upload-list__item-actions {
            @extend %commSize
        }

        .el-upload-list__item {
            @extend %commSize
        }

        .el-progress, .el-progress--circle {
            @extend %commSize;
            .el-progress-circle {
                @extend %commSize;
            }
            > * {
                @extend %commSize
            }
        }
    }
</style>
<template>
    <div class="component-upload-uploadimg" ref="container" :class="{'uploaddisabled':disabled }">
        <el-upload :headers="headers" :disabled="disabled"
                   :action="url"
                   list-type="picture-card"
                   :multiple="false"
                   :before-upload="beforeUpload"
                   :on-success="handleSuccess"
                   :on-error="handleRemove"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   accept="image/jpg,image/jpeg,image/png,image/gif"
                   :file-list="currImg">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny" @click.native.stop append-to-body>
            <img width="100%" :src="currImg.length > 0 && currImg[0].url" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import authUtils from '../../../utils/authUtils'
    import config from '../../../utils/config'
    export default{
        components: {},
        props: {
            // 要上传的url地址
            url: {
                type: String,
                default: ''
            },
            // 上传成功后的回调
            onSuccess: Function,
            onRemove: Function,
            defaultImg: String,
            disabled: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {
                uploadBtn: null, // 上传按钮
                dialogVisible: false,
                headers: void 0,
                forceShowUpload: false, // 强行显示上传图片
                host: config.apiHost,
                currImg: [],
            }
        },
        watch: {
            'currImg' (val) {
                if (val.length > 0 && val[0].url) {
                    this.uploadBtn && (this.uploadBtn.style.display = 'none')
                } else {
                    this.uploadBtn.style.display = 'block'
                }
            },
            'defaultImg' (val) {
                this.currImg = val ? [{name: val, url: val}] : []
            },
            'disabled' (val) {
                this.isShowDelAndPreview(!val)
                this.setDisabled(val)
            }
        },
        created () {
            this.currImg = this.defaultImg ? [{name: this.defaultImg, url: this.defaultImg}] : []
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken(),
                'TwoStep': `Bearer ` + authUtils.getTwiceToken() // 二次验证的token
            }
        },
        activated () {
            this.uploadBtn && (this.uploadBtn = this.$refs.container.querySelector('.el-upload--picture-card'))
            this.isShowDelAndPreview(!this.disabled)
            this.setDisabled(this.disabled)
        },
        mounted () {
            this.setDisabled(this.disabled)
            this.uploadBtn = this.$refs.container.querySelector('.el-upload--picture-card')
        },
        methods: {
            beforeUpload () {
                this.uploadBtn.style.display = 'none'
            },
            handleRemove () {
                setTimeout(() => {
                    this.clearFiles()
                    this.onRemove && this.onRemove()
                }, 500)
            },
            handlePictureCardPreview (file) {
                this.dialogVisible = true
            },
            handleSuccess (response, file, fileList) {
                if (response.code == 0)
                    this.onSuccess && this.onSuccess(response)
                else {
                    xmview.showTip('error', response.message)
                    this.handleRemove()
                }
                this.$refs.container.querySelector('.el-upload__input').value = null
            },
            clearFiles () {
                this.uploadBtn.style.display = 'block'
                this.isShowDefault = true
                this.currImg = []
                this.$emit('remove')
            },
            isShowDelAndPreview (isShow) {
                let uploadList = this.$refs.container.querySelector('.el-upload-list__item-actions')
                if (uploadList) {
                    uploadList.style.display = isShow ? 'block' : 'none'
                }
//                this.$refs.container.querySelector('.el-upload-list__item-actions').style.display = isShow ? 'block' : 'none'
            },
            // 设置是否启动
            setDisabled (b) {
                if (b)
                    this.$refs.container.querySelector('input').setAttribute('disabled', 'disabled')
                else
                    this.$refs.container.querySelector('input').removeAttribute('disabled')
            }
        },
    }
</script>
