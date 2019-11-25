<!--修改密码-->
<style lang="scss">
@import "../../../utils/mixins/_mixins.scss";

.user-password {
    background: #fff;
    padding: 20px 200px;
    .subButton {
        text-align: center;
    }
}
</style>
<template>
    <article class="user-password">
        <section class="submit-form">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    {{form.mobile}}
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    {{form.email}}
                </el-form-item>
                <el-form-item v-show="isPasswd" prop="origin_password" label="原密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.origin_password" placeholder="原密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="new_password" label="新密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.new_password" placeholder="新密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="re_password" label="确认密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.re_password" placeholder="确认密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item class="subButton">
                    <el-button type="primary" @click="submit('form')">提交修改</el-button>
                </el-form-item>
            </el-form>
        </section>
    </article>
</template>
<script>
import authUtils from '../../../utils/authUtils'
import mineService from '../../../services/base/mineService'
export default {
    data () {
        let validateRepass = (rule, value, callback) => {
            if (value !== this.form.new_password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            imgUrl: '',
            form: {
                origin_password: '',
                new_password: '',
                re_password: ''
            },
            formLabelWidth: '120px', // 表单label的宽度
            rules: {
                new_password: { required: true, message: '必须填写', trigger: 'blur' },
                re_password: [
                    { required: true, message: '必须填写', trigger: 'blur' },
                    { validator: validateRepass, trigger: 'blur' }
                ],
            },
            isPasswd: true,
        }
    },
    created () {
        // 检查密码设置
        // this.isPasswd = authUtils.getIsPasswd()
        mineService.getPassword().then((ret) => {
            this.form = ret
        }).then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        submit (form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    mineService.modifyPassword(this.form).then(() => {
                        if (!this.isPasswd) {
                            authUtils.setIsPasswd(true)
                        }
                        xmview.showTip('success', '修改成功')
                        this.$router.go(-1)
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>
