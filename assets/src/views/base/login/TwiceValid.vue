<!--二次验证-->
<style lang='scss' rel='stylesheet/scss'>
    #login-twice {
        position: absolute;
        min-height: 100%;
        width: 100%;
        background: #d9e0e7;

        > * {
            width: 500px;
            margin: 0 auto;
        }

        .tip {
            color: #666;
            margin-bottom: 15px;
            display: block;
        }
        h5 {
            margin-top: 35px;
            text-align: right;
        }

        .el-card__header {
            padding: 10px;
            background: #f8f8f8;
        }

        .el-input {
            width: 50%;
            display: inline-block;
            vertical-align: top;
        }

        .center-slit {
            margin: 9px 0;
        }

        #login-twice-wechatlogin {
            text-align: center;
        }
    }
</style>

<template>
    <article id="login-twice" v-loading="loadingdata">
        <h5>
            <i>{{user.name}}，</i>
            <el-button type="text" @click="$router.replace({name:'login'})">切换账号</el-button>
        </h5>

        <el-card class="box-card">
            <div slot="header" class="head">
                <i>二次验证</i>
            </div>
            <div class="container">
                <i class="tip"> <i class="el-icon-warning"></i> 为进一步确保您的账号信息和其他内容的安全，请选择任一种方式进行账号校验</i>
                <el-tabs type="card" :value="tabSelected">
                    <el-tab-pane label="微信扫码登录" name="wechat" v-if="wechat">
                        <div>您设置的验证微信账号是：{{wechat.data}}, 请扫码登录</div>
                        <div id="login-twice-wechatlogin"></div>
                    </el-tab-pane>
                    <el-tab-pane label="手机号码验证" name="sms" v-if="sms">
                        <i>您设置的手机号码是 ({{sms.data}})</i>
                        <div class="center-slit">
                            <el-input v-model="smsCode" placeholder="填写手机验证码" @keyup.enter.native="login(0)"></el-input>
                            <el-button :disabled="codeWaitSecond !== 0" @click="sendValidCode(0)">
                                <i v-if="codeWaitSecond <= 0">发送验证码</i>
                                <i v-else>{{codeWaitSecond}} 秒后重发</i>
                            </el-button>
                        </div>
                        <el-button type="primary" @click="login(0)">登录</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱验证" name="email" v-if="email">
                        <i>您设置的邮箱码是 ({{email.data}})</i>
                        <div class="center-slit">
                            <el-input v-model="emailCode" placeholder="填写邮箱验证码"
                                      @keyup.enter.native="login(1)"></el-input>
                            <el-button :disabled="codeWaitSecond !== 0" @click="sendValidCode(1)">
                                <i v-if="codeWaitSecond <= 0">发送验证码</i>
                                <i v-else>{{codeWaitSecond}} 秒后重发</i>
                            </el-button>
                        </div>
                        <el-button type="primary" @click="login(1)" :disabled="logining">
                            <i v-if="!logining">登录</i>
                            <i v-else>登录中...</i>
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </article>
</template>

<script>
    import wechatSdk from '../../../vendor/wechatSdk'
    import twiceService from '../../../services/base/twoStepService'
    import authUtils from '../../../utils/authUtils'

    export default {
        components: {},
        data () {
            return {
                loadingdata: false,
                wechat: void 0,
                email: void 0,
                sms: void 0,
                wechatConfig: void 0,
                user: {},
                codeWaitSecond: 0, // 验证码发送后的等待时间 -1表示不可用 比如正在请求发送验证码接口
                smsCode: void 0,
                emailCode: void 0,
                tabSelected: 'first', // 选中的tab
                logining: false, // 正在登录请求的状态
            }
        },
        created () {
            let ret = this.$route.query.callback ? JSON.parse(this.$route.query.callback) : void 0

            if (ret && ret.code == 0) {
                authUtils.setTwiceToken(ret.data.userTwoStepAuthToken)
                this.$router.replace({name: 'main'})
            } else if (ret) {
                xmview.showTip('error', ret.message)
                this.$router.replace({name: 'login-twice'})
            }
            this.user = authUtils.getUserInfo()
            this.loadingdata = true
        },
        mounted () {
            // 获取已绑定的信息
            twiceService.getSafeSetInfo().then((ret) => {
                // 如果都没绑定  跳到绑定页面
                if (!ret || (!ret.sms && !ret.email && !ret.wechat)) {
                    this.$router.replace({name: 'mine-safeset'})
                } else {
                    this.sms = ret.sms
                    this.email = ret.email
                    this.wechat = ret.wechat
                    this.wechatConfig = ret.wechatConfig
                }

                this.loadingdata = false

                // 设置当前选中的tab
                if (this.wechat) this.tabSelected = 'wechat'
                else if (this.sms) this.tabSelected = 'sms'
                else this.tabSelected = 'email'
            }).then(() => {
                // 如果绑定了微信 初始化微信登录二维码
                if (!this.wechatConfig) return

                this.wechatConfig.redirect_uri = `${this.wechatConfig.redirect_uri}&redirect_url=${window.location.href}`
                // 初始化微信扫码二维码
                this.wechatConfig.id = 'login-twice-wechatlogin'

                this.$nextTick(() => {
                    wechatSdk.initLogin(this.wechatConfig)
                })
            }).catch((err) => {
                this.loadingdata = false
                console.info('出错', err)
            })
        },
        beforeDestroy () {
            xmview.closeAllTip()
        },
        methods: {
            // type 0- 手机 1-邮箱
            sendValidCode (type) {
                this.codeWaitSecond = -1
                let p
                if (type == 0) {
                    p = twiceService.sendSmsValidcode()
                } else if (type == 1) {
                    p = twiceService.sendEmailValidcode()
                }
                p.then(() => {
                    xmview.showTip('success', '验证码发送成功,请注意查收')
                    this.codeWaitSecond = 60
                    let intervalId = setInterval(() => {
                        this.codeWaitSecond--
                        if (this.codeWaitSecond <= 0) clearInterval(intervalId)
                    }, 1000)
                }).catch(() => {
                    this.codeWaitSecond = 0
                })
            },
            // type 0- 手机 1-邮箱
            login (type) {
                this.logining = true
                let code = type == 0 ? this.smsCode : this.emailCode
                let p = type == 0 ? twiceService.twiceSmsValid({code}) : twiceService.twiceEmailValid({code})
                p.then((ret) => {
                    authUtils.setTwiceToken(ret)
                    let item = authUtils.getNavMenu()[0]
                    while (item.children && item.children.length > 0)
                        item = item.children[0]
                    this.$router.push({path: item.item.menu_url})

                    xmview.showTip('success', '验证成功, 跳转中...', 1e9)
                }).catch(() => {
                    setTimeout(() => {
                        this.logining = false
                    }, 300)
                })
            }
        }
    }
</script>
