<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .login-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #666 url("./images/bg.jpg") no-repeat;
        background-size: cover;
        .login-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            .content {
                margin-top: px2rem(100);
                .login-header {
                    position: relative;
                    width: 90%;
                    margin-bottom: 80px;
                    img {
                        width: 28px;
                        height: 28px;
                        margin-right: 5%;
                    }
                    * {
                        color: #fff;
                        font-weight: 300;
                    }
                    h1 {
                        font-size: 22px;
                        * {
                            display: inline-block;
                            vertical-align: top;
                        }
                    }
                    p {
                        margin-top: 5px;
                        font-size: 14px;
                    }
                    .icon {
                        position: absolute;
                        right: 0;
                        top: 0;
                        opacity: .4;
                        filter: alpha(opacity=40);
                    }
                    .icon > i {
                        font-size: 50px;
                        line-height: 52px;
                        color: #ccc;
                    }
                }
                .form {
                    border-radius: 5px;
                    padding: 30px 0;
                    background: rgba(0, 0, 0, 0.4);
                    width: 100%;
                    display: block;
                    margin: 0 auto !important;
                    text-align: center;
                    > * {
                        display: block;
                        margin: 0 auto;
                        width: 80%;
                        margin-top: px2rem(15);
                        &:first-of-type {
                            margin-top: 0;
                        }
                    }
                    input {
                        background: rgba(0, 0, 0, 0.4);
                        color: #fff;
                        border: none;
                    }
                    input:focus {
                        box-shadow: none;
                    }
                    ::-webkit-input-placeholder {
                        color: #999;
                    }
                    .submit {
                        width: 100%;
                    }
                }
                .daoqi {
                    background: rgba(255, 255, 255, 0.6);
                    padding: 60px 30px 15px;
                    text-align: center;
                    color: #f00;
                    .btn-xufei {
                        cursor: pointer;
                        color: #1d90e6;
                    }
                    .tip {
                        margin-top: 50px;
                        font-size: 12px;
                        color: #303133;
                        text-align:left;
                    }
                }
            }
            @media (max-width: 767px) {
                .content {
                    margin-top: 20px;
                    .login-header {
                        > div {
                            width: 50%;
                        }
                    }
                    .form {
                        padding: px2rem(80) 0;
                        > * {
                            margin-top: px2rem(60);
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <article class="login-container">
        <section class="login-mask">
            <el-row :gutter="10" type="flex" justify="center">
                <el-col :xs="23" :sm="13" :md="10" :lg="6" class="content">
                    <div class="login-header">
                        <el-col :offset="1" :span="20" class="title">
                            <h1><img src="../../../assets/images/logo.png"/>药视通 </h1>
                            <p>登录到连锁管理平台</p>
                        </el-col>
                        <div class="icon">
                            <i class="iconfont icon-signin"></i>
                        </div>
                    </div>
                    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm form" v-if="!isExpire">
                        <el-form-item prop="account">
                            <el-input size="large" placeholder="手机号或邮箱" type="text" v-model="ruleForm2.account"
                                      :autofocus="true"
                                      auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="checkPass">
                            <div class="el-form-item">
                                <div class="el-form-item__content">
                                    <div class="el-input el-input--large">
                                        <input type="password" v-model="ruleForm2.checkPass" placeholder="管理密码"
                                               @keyup.enter="submitForm('ruleForm2')" autocomplete="off"
                                               class="el-input__inner">
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="submit" type="primary" @click="submitForm('ruleForm2')"
                                       :disabled="logining">
                                <i v-if="logining">登录中...</i>
                                <i v-else>登录</i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <div class="daoqi" v-if="isExpire">
                        <p>{{isExpire_time}} 
                            <span class="btn-xufei" @click="toExpiredepartment.dialogShow = true">立即续费</span></p>
                        <p class="tip">注:当连锁过期后,店员在前端使用app需要付费购买会员</p> 
                    </div>
                </el-col>
            </el-row>
        </section>
        <ExpireDepartment :toExpiredepartment="toExpiredepartment" v-if="toExpiredepartment.dialogShow"></ExpireDepartment>
    </article>
</template>

<script>
    import authService from 'services/base/authService'
    import authUtils from 'utils/authUtils'
    import treeUtls from 'utils/treeUtils'
    import ExpireDepartment from 'components/dialog/ExpireDepartmentDialog.vue'

    export default {
        components: {
            ExpireDepartment
        },
        data () {
            var validateAccount = (rule, value, callback) => {
                let newValue = value || ''
                if (newValue === '') {
                    callback(new Error('请输入手机号或邮箱'))
                }
                if (newValue.indexOf('@') != -1) {
                    if (!newValue.match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                        callback(new Error('请输入正确的邮箱'))
                    }
                } else {
                    if (!newValue.match(/^1[345789]\d{9}$/)) {
                        callback(new Error('请输入正确的手机号'))
                    }
                }
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass')
                }
                callback()
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入管理员密码'))
                }
                callback()
            }
            return {
                rememberUserKey: 'remember_login_name',
                ruleForm2: {
                    account: '',
                    checkPass: ''
                },
                rules2: {
                    account: [
                        {validator: validateAccount, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                logining: false, // 是否正在登录,
                isExpire: false , // 收否到期
                isExpire_time: '2018-6-20',
                toExpiredepartment: {
                    dialogShow: false
                },
            }
        },
        created () {
            authUtils.clearAuthRefreshToken()
            authUtils.clearAuthInfo()
            xmview.setLoading(false)  
            this.ruleForm2.account = this.$cookies.get(this.rememberUserKey)

        },
        beforeDestroy () {
            xmview.closeAllTip()
        },
        methods: {
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.logining = true
                        // 请求接口
                        authService.login({
                            username: this.ruleForm2.account,
                            password: this.ruleForm2.checkPass
                        }).then((ret) => {
                            if(!ret.need_renew_signing){ // 是否到期
                                
                                authUtils.setNavMenu(treeUtls.arr2Tree(ret.auth_menu)) // 保存菜单
                                authUtils.setAuthToken(ret.auth_token) // 保存token
                                authUtils.setUserInfo(ret.auth_user)   // 保存用户信息
                                authUtils.setAuthOperation(ret.auth_operation) // 保存用户权限信息
                                xmview.showTip('success', '登录成功, 正在跳转...', 1e9)
                                this.$cookies.set(this.rememberUserKey, this.ruleForm2.account) // 记住登录人
                                setTimeout(() => {
                                    // 如果需要二次登录
                                    if (ret.need_two_step) {
                                        this.$router.replace({name: 'login-twice'})
                                    } else if (this.$route.query.returnUrl) {  // 判断是否需要回到上个页面
                                        window.location.href = this.$route.query.returnUrl
                                    } else {
    //                                    this.$router.replace({name: 'main'})
                                        // 拿到左边的叶子节点
                                        if (ret.auth_menu.length < 1) {
                                            xmview.showTip('error', '跳转失败，请设置菜单栏数据', 1e9)
                                            return
                                        }
                                        let item = treeUtls.arr2Tree(ret.auth_menu)[0]
                                        while (item.children && item.children.length > 0)
                                            item = item.children[0]
    //                                    window.location = item.item.menu_url
                                        this.$router.push({path: item.item.menu_url})
                                    }
                                }, 400)
                            }else {
                                authUtils.setAuthToken(ret.auth_token) // 保存token
                                this.isExpire_time = ret.message
                                this.isExpire = true
                            }
                        }).catch((ret) => {
                            this.logining = false
                        }).then(() => {
                            xmview.setLoading(false)
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
