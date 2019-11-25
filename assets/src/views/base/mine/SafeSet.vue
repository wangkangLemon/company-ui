<!--安全设置-->
<style lang='scss' rel='stylesheet/scss'>
    #user-sefeset-container {
        .el-card__header {
            background: #f8f8f8;
            padding: 10px;
        }

        .content-container {
            > section {
                font-size: 13px;
                color: #333;
                margin-bottom: 25px;
                &:last-of-type {
                    margin-bottom: 0;
                }

                > * {
                    display: inline-block;
                    vertical-align: top;
                }

                > i {
                    padding-top: 5px;
                    width: 7em;
                    text-align: right;
                }
                > div {
                    margin-left: 20px;
                    > div {
                        margin-top: 5px;
                        color: #666;
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="user-sefeset-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>二次验证</span>
            </div>
            <article class="content-container">
                <section>
                    <i>
                        <el-tag type="danger">推荐</el-tag>
                        微信:</i>
                    <div>
                        <span v-if="!wechat || !wechat.data">
                            <el-tag type="info">未绑定</el-tag>
                            <el-button type="text" @click="bindWechat">绑定</el-button>
                        </span>
                        <span v-else>
                            <el-tag type="primary">已绑定微信号: {{wechat.data}}</el-tag>
                            <el-button type="text" @click="changeWechat">更换</el-button>
                        </span>
                        <div>绑定后，登录药视通平台可用绑定微信账号扫码进行安全验证。</div>
                    </div>
                </section>
                <section>
                    <i>手机号码:</i>
                    <div>
                        <span v-if="!sms || !sms.data">
                            <el-tag type="info">未绑定</el-tag>
                            <el-button type="text" @click="bindSms">绑定</el-button>
                        </span>
                        <span v-else>
                            <el-tag type="primary">已绑定手机号码: {{sms.data}}</el-tag>
                            <el-button type="text" @click="changeSms">更换</el-button>
                        </span>
                        <div>绑定后，登录药视通平台用该手机号码接收登录验证码。</div>
                    </div>
                </section>
                <section>
                    <i>电子邮件:</i>
                    <div>
                        <span v-if="!email || !email.data">
                            <el-tag type="info">未绑定</el-tag>
                            <el-button type="text" @click="bindEmail">绑定</el-button>
                        </span>
                        <span v-else>
                            <el-tag>已绑定电子邮箱: {{email.data}}</el-tag>
                            <el-button type="text" @click="changeEmail">更换</el-button>
                        </span>
                        <div>绑定后，登录药视通平台可用该邮箱接收登录验证码。</div>
                    </div>
                </section>
            </article>
        </el-card>

        <el-dialog title="绑定" :visible.sync="dialogBind.isShow">
            <el-form label-width="80px">
                <el-form-item :label="fetchParam.type == 'email' ? '电子邮箱' : '手机号码'">
                    <el-input v-model="fetchParam.receiver" auto-complete="off"
                              :placeholder="fetchParam.type == 'email' ? '请输入邮箱地址' : '请输入手机号码'"></el-input>
                </el-form-item>
                <el-form-item label="验证码">
                    <div style="display: inline-block;width: 60%;vertical-align: top">
                        <el-input v-model="fetchParam.code" placeholder="输入验证码"></el-input>
                    </div>
                    <el-button type="primary" @click="sendBindValidCode" :disabled="dialogBind.validWait > 0">
                        <i v-if="dialogBind.validWait <= 0">发送验证码</i>
                        <i v-else>{{dialogBind.validWait}} 秒后重发</i>
                    </el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="bindFn" type="primary">
                        <i>确定</i>
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="更换绑定" :visible.sync="dialogChange.isShow">
            <el-form label-width="80px">
                <el-form-item label="验证方式">
                    <i>{{(fetchParam.type == 'email' ? '电子邮箱' : '手机号码') + ' (' + fetchParam.receiver + ')'}}</i>
                </el-form-item>
                <el-form-item label="验证码">
                    <div style="display: inline-block;width: 60%;vertical-align: top">
                        <el-input v-model="fetchParam.code" placeholder="输入验证码"></el-input>
                    </div>
                    <el-button type="primary" @click="sendBindValidCode" :disabled="dialogBind.validWait > 0">
                        <i v-if="dialogBind.validWait <= 0">发送验证码</i>
                        <i v-else>{{dialogBind.validWait}} 秒后重发</i>
                    </el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="validCode" type="primary">
                        <i>确定</i>
                    </el-button>
                </el-form-item>
            </el-form>
            <span slot="footer">
                如果您已绑定{{fetchParam.type == 'email' ? '电子邮箱' : '手机号码'}}无法接收验证码，请联系我们：400-686-5262
            </span>
        </el-dialog>
    </article>
</template>

<script>
    //    import twoStepService from '../../services/twoStepService'
    import mineService from '../../../services/base/mineService'
    import wechatSdk from '../../../vendor/wechatSdk'
    import authUtils from '../../../utils/authUtils'

    function getFetchParam () {
        return {
            type: 'email',
            code: '',
            receiver: ''
        }
    }
    export default {
        components: {},
        data () {
            return {
                email: {},
                sms: {},
                wechat: {},
                wechatConfig: void 0,
                fetchParam: getFetchParam(),
                // 绑定的dialog
                dialogBind: {
                    isShow: false,
                    validWait: 0, // 验证码等待
                },
                // 更换的dialog
                dialogChange: {
                    isShow: false,
                }
            }
        },
        created () {
            this.initData()
            // 进入页面去掉自动刷新token 避免在初次设置的时候 跳转到登录
            authUtils.clearAuthRefreshToken()
        },
        destroyed () {
            // 离开页面时打
            authUtils.authRefreshtoken()
        },
        methods: {
            // 更换邮箱
            changeEmail () {
                this.fetchParam.type = 'email'
                this.fetchParam.code = ''
                this.fetchParam.receiver = this.email.data
                this.dialogChange.isShow = true
            },
            // 更换手机号
            changeSms () {
                this.fetchParam.type = 'sms'
                this.fetchParam.code = ''
                this.fetchParam.receiver = this.sms.data
                this.dialogChange.isShow = true
            },
            // 绑定邮箱
            bindEmail () {
                this.fetchParam = getFetchParam()
                this.fetchParam.type = 'email'
                this.dialogBind.isShow = true
            },
            // 绑定手机号
            bindSms () {
                this.fetchParam = getFetchParam()
                this.fetchParam.type = 'sms'
                this.dialogBind.isShow = true
            },
            // 绑定微信
            bindWechat () {
                wechatSdk.openWechatLogin(this.wechatConfig, (data) => {
                    data = JSON.parse(data)
                    if (data.code == 0) {
                        // 保存二次验证的token
                        authUtils.setTwiceToken(data.data.userTwoStepAuthToken)
                        this.initData()
                        this.$store.dispatch('setIndexNavMenu', {menu: authUtils.getNavMenu()}) // 获取菜单
                        xmview.showTip('success', '操作成功', 5000)
                    } else {
                        xmview.showTip('error', data.message)
                    }
                })
            },
            // 更换微信绑定
            changeWechat () {
                let wechatConfig = Object.assign({}, this.wechatConfig, {verify: 'xm'})
                wechatSdk.openWechatLogin(wechatConfig, (data) => {
                    data = JSON.parse(data)
                    if (data.code == 0) {
                        // 重新刷新绑定数据 如果message为空 则验证成功
                        mineService.getSafeSetInfo().then((ret) => {
                            if (!ret.message) {
                                this.wechat = {}
                                xmview.showTip('success', '操作成功!请重新绑定新的微信', 5000)
                            } else {
                                xmview.showTip('error', ret.message, 5000)
                            }
                        }).then(() => {
                            mineService.getWechatLoginConfig().then((ret) => {
                                this.wechatConfig = ret
                            })
                        })
                    } else {
                        xmview.showTip('error', data.message, 5000)
                    }
                })
            },
            // 发送绑定的验证码
            sendBindValidCode () {
                let fetchParam = {
                    type: this.fetchParam.type,
                    receiver: this.fetchParam.receiver.indexOf('***') > -1 ? '' : this.fetchParam.receiver
                }
                mineService.sendTwoValidCode(fetchParam).then(() => {
                    xmview.showTip('success', '验证码发送成功,请注意查收')
                    this.dialogBind.validWait = 60
                    let intervalId = setInterval(() => {
                        --this.dialogBind.validWait <= 0 && clearInterval(intervalId)
                    }, 1000)
                })
            },
            // 设置绑定 或者更换绑定
            bindFn () {
                mineService.bindOrChangeTwo(this.fetchParam).then((ret) => {
                    authUtils.setTwiceToken(ret)
                    this[this.fetchParam.type] = {data: this.fetchParam.receiver}
                    this.dialogBind.isShow = false
                    this.dialogChange.isShow = false
                    this.$store.dispatch('setIndexNavMenu', {menu: authUtils.getNavMenu()}) // 获取菜单
                    xmview.showTip('success', '操作成功')
                }).catch((err) => {
                    console.info(err)
                })
            },
            // 确认验证码
            validCode () {
                mineService.validTwoVliadCode(this.fetchParam).then((ret) => {
                    this.dialogBind.validWait = 0
                    // 关掉解绑框  打开绑定框
                    this.dialogChange.isShow = false
                    setTimeout(() => {
                        this.dialogBind.isShow = true
                    }, 500)
                    // 刷新绑定
                    this.fetchParam.code = ''
                    this.fetchParam.receiver = ''

                    authUtils.setTwiceToken(ret)
                })
            },
            initData () {
                mineService.getSafeSetInfo().then((ret) => {
                    // 如果已经绑定
                    if (ret && ret.stepTypes) {
                        ret.stepTypes.forEach((item) => {
                            if (item.type === 'sms') {
                                this.sms = item
                                this.sms && (this.sms.data = processMobile(this.sms.data))
                            } else if (item.type === 'email') {
                                this.email = item
                                this.email && (this.email.data = processEmail(this.email.data))
                            } else {
                                this.wechat = item
                            }
                        })
                    } else { // 如果没有任何绑定
                        // 把菜单置空
                        this.$store.dispatch('setIndexNavMenu', {menu: []})
                        // 干掉返回按钮
                        xmview.setContentBack(false)
                    }
                    xmview.setContentLoading(false)
                }).catch((err) => {
                    console.info(err)
                }).then(() => {
                    // 微信配置
                    mineService.getWechatLoginConfig().then((ret) => {
                        this.wechatConfig = ret
                    })
                })
            }
        }
    }

    function processEmail (str) {
        if (!str) return str
        let first = str.split('@')[0]
        return `${first[0]}***${first[first.length - 1]}@${str.split('@')[1]}`
    }

    function processMobile (mobile) {
        if (!mobile) return

        return `${mobile.slice(0, 3)}****${mobile.slice(-4, mobile.length)}`
    }
</script>
