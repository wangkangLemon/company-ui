<!--使用ex.-->
<!--<el-form-item label="反馈附件" prop="image">-->
<!--<UploadImages :url="uploadImgUrl" :fileNum="fileNum" :name="file"-->
<!--:on-success="res => form.images.push(res.data.url)"-->
<!--:on-remove="file => form.images.splice(form.images.indexOf(file.response.data.url),1)" ></UploadImg>-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .component-upload-uploadimages {
        height: 100px;
        .el-upload-list__item,
        .el-upload--picture-card {
            width: 100px;
            height: 100px;
        }
        .el-upload--picture-card {
            line-height: 100px;
        }
    }
</style>
<template>
    <div class="component-upload-uploadimages" ref="container">
        <el-upload :headers="headers"
                   :action="url"
                   :name="name"
                   list-type="picture-card"
                   :multiple="multiple"
                   :on-success="handleSuccess"
                   :on-error="handleRemove"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :file-list="imgList"
                   accept="image/jpg,image/jpeg,image/png,image/gif">
            <i v-if="showUploadBtn" class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import authUtils from '../../../utils/authUtils'
    import config from '../../../utils/config'
    export default{
        props: {
            // 要上传的url地址
            url: String,
            // 上传的文件字段名
            name: {
                type: String,
                default: 'file',
            },
            // 上传成功后的回调
            onSuccess: Function,
            // 删除后的回调
            onRemove: Function,
            // 允许上传多少个文件，默认只允许上传一个
            fileNum: {
                type: Number,
                default: 1
            },
        },
        data () {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                showUploadBtn: true,
                headers: void 0,
                host: config.apiHost,
                uploadBtn: null, // 上传按钮
                multiple: false,
                imgList: [],
            }
        },
        watch: {
            'imgList' (val) {
                if (val.length >= this.fileNum && val[0].url) {
                    this.uploadBtn.style.display = 'none'
                } else {
                    this.uploadBtn.style.display = 'inline-block'
                }
            }
        },
        created () {
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken(),
                'TwoStep': `Bearer ` + authUtils.getTwiceToken() // 二次验证的token
            }
        },
        activated () {
            this.uploadBtn && (this.uploadBtn = this.$refs.container.querySelector('.el-upload--picture-card'))
        },
        mounted () {
            this.uploadBtn = this.$refs.container.querySelector('.el-upload--picture-card')
        },
        methods: {
            handlePreview (file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            handleRemove (file, fileList) {
                this.onRemove && this.onRemove(file, fileList)
                this.imgList = fileList
                this.$refs.container.querySelector('.el-upload__input').value = null
            },
            handleSuccess (response, file, fileList) {
                if (response.code == 0) {
                    this.onSuccess && this.onSuccess(response, file, fileList)
                    this.imgList = fileList
                } else {
                    xmview.showTip('error', response.message)
                }
            },
            clearFiles () {
                this.imgList = []
            }
        },
    }
</script>
