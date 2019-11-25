<!--个人信息-->
<style lang="scss">
    @import "../../../utils/mixins/_mixins.scss";
    .user-profile {
        background: #fff;
        display: flex;
        .upload-avatar {
            width: 30%;
            text-align: center;
            .img-container {
                margin: 20px auto;
                width: 170px;
                height: 170px;
                border: none;
                > img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #ededed;
                }
            }
        }
        .submit-form {
            width: 40%;
            padding: 20px;
            .subButton {
                text-align: center;
            }
        }
    }
</style>
<template>
    <article class="user-profile">
        <section class="upload-avatar">
            <div class="img-container">
                <img :src="imgUrl"/>
            </div>
            <ImagEcropperInput :isRound="true" :aspectRatio="1" :confirmFn="cropperFn"
                               class="upload-btn"></ImagEcropperInput>
        </section>
        <section class="submit-form">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" :disabled="true" type="number" placeholder="手机号码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" :disabled="true" placeholder="邮箱" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="名字" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="名字" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" placeholder="地址" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="称谓" :label-width="formLabelWidth">
                    <el-radio class="radio" v-model="form.sex" :label="1">先生</el-radio>
                    <el-radio class="radio" v-model="form.sex" :label="0">女士</el-radio>
                </el-form-item>
                <el-form-item class="subButton">
                    <el-button type="primary" @click="submit('form')">提交修改</el-button>
                </el-form-item>
            </el-form>
        </section>
    </article>
</template>
<script>
    import mineService from '../../../services/base/mineService'
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import * as filterUtils from '../../../utils/filterUtils'
    import authUtils from '../../../utils/authUtils'
    import config from '../../../utils/config'
    export default {
        filterUtils,
        components: {
            ImagEcropperInput
        },
        data () {
            return {
                imgUrl: '',
                form: {
                    mobile: '',
                    email: '',
                    name: '',
                    address: '',
                    sex: 0
                },
                rules: {
                    name: {required: true, message: '必须填写', trigger: 'blur'}
                },
                formLabelWidth: '120px', // 表单label的宽度
            }
        },
        created () {
            // 获取个人信息
            mineService.getProfile().then((ret) => {
                this.form = ret
                if (!ret.avatar) {
                    this.imgUrl = filterUtils.defaultAvatar({url: '', sex: ret.sex})
                } else {
                    this.imgUrl = ret.avatar.indexOf(config.apiHost) > -1 ? ret.avatar : config.apiHost + ret.avatar
                }
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 裁切后的回调
            cropperFn (data, ext) {
                mineService.uploadAvatar({
                    avatar: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.imgUrl = data
                    authUtils.setAvatar(ret.data.url)
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        mineService.updateProfile(this.form).then(() => {
                            xmview.showTip('success', '修改成功')
                            authUtils.setUserInfo(this.form)
                            this.$router.go(-1)
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
        }
    }
</script>
