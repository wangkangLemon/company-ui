<style lang='scss' rel='stylesheet/scss'>
    @import "../utils/mixins/mixins";

    .index-container {
        background: #d9e0e7;

        @media (max-width: 767px) {
            .header-wap {
                display: block;
            }
            .header-pc {
                display: none;
            }
            .wap-header {
                border-bottom: 1px solid #ededed;
            }
        }

        @media (min-width: 768px) {
            .header-wap {
                display: none;
            }
            .header-pc {
                display: block;
            }
        }

        .header {
            height: 55px;
            line-height: 55px;
            text-align: center;
            z-index: 11;
            background: #fff;

            .logo {
                text-align: left;
                padding-left: 28px;
                > * {
                    display: inline-block;
                    vertical-align: middle;
                }
                img {
                    width: 30px;
                    height: 30px;
                }

                h1 {
                    font-size: 16px;
                    font-weight: normal;
                }
                .add-department-txt {
                    color: red;
                    font-size: 12px;
                    margin-left: 5px;
                    .toxfei{
                        color:#20a0ff;
                        font-size:15px;
                        cursor: pointer;
                    }
                }
            }
            
            // 右边部分
            @at-root {
                .header-right {
                    text-align: right;

                    > * {
                        text-align: center;
                        display: inline-block;

                        > em {
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }

                    // 问题反馈
                    .feedback {
                        cursor: pointer;
                        margin: 0 5px 0 15px;
                    }
                    .notice {
                        @media (max-width: 1185px) {
                            display: none;
                        }
                    }
                    @at-root {
                        .feedback-dropdown {
                            top: 35px !important;
                            width: 120px;
                        }
                    }

                    .nickname {
                        cursor: pointer;
                        margin-right: 30px;
                        img {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            vertical-align: middle;
                            margin-right: 2px;
                        }
                    }

                    @at-root {
                        .nickname-dropdown {
                            top: 35px !important;
                            width: 160px;
                        }
                    }
                }
            }
        }

        .content {
            @media (max-width: 767px) {
                margin-top: 55px;
            }

            .left-menu-container {
                position: fixed;
                width: 220px;
                z-index: 10;
                top: 56px;
                bottom: 0;
                overflow-y: auto;
                /*height: 100%;*/
                /*overflow-y: auto;*/
                transition: all 300ms ease;
                transform: translateX(0);

                // 左边菜单的样式
                .el-menu-item, .el-submenu__title {
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                }
                @media (max-width: 767px) {
                    transform: translateX(-100%);
                    top: -55px;
                    z-index: 12;
                }

                > div.nav-title {
                    font-size: 14px;
                    color: #999;
                    margin: 12px 20px 0;
                }

                &.isShowMenue {
                    transform: translateX(0);
                }
            }

            .index-right-content {
                position: absolute;
                padding: 75px 20px 20px 240px;
                width: 100%;
                background: #d9e0e7;
                min-height: 100%;
                top: 0;
                height: 100%;
                overflow: auto;
                @media (max-width: 767px) {
                    padding: 75px 20px 20px;
                    position: absolute;
                    /*top: 110px;*/
                }

                .back-btn {
                    cursor: pointer;
                    color: #58B7FF;
                    &:hover {
                        text-decoration: underline;
                    }
                }

                .right-title {
                    font-size: 24px;
                    margin-bottom: 15px;
                    > small {
                        font-weight: 300;
                        font-size: 70%;
                        display: inline-block;
                    }
                }
            }
        }
    }
    a.link {
        text-decoration: none;
        color: #333; 
        margin-right:10px;
        em {
            padding: 2px 5px;
            display: inline;
            color: #409EFF;
            border: 1px solid #409EFF;
            border-radius: 5px;
        }
    }
</style>

<template>
    <article class="index-container">
        <!--头部部分 pc端-->
        <el-row class="header header-pc" type="flex">
            <el-col :span="9" class="logo">
                <img src="../assets/images/logo.png">
                <h1>药视通连锁管理平台</h1>
                <span v-if="isShowExpire">
                    <span class="add-department-txt" v-if="isExpire">
                        {{expire_duration}} 天后到期,后台和app将停止使用.请点击 
                        <span class="toxfei" @click="toContinueDepartmentpay">
                            续费
                        </span>
                    </span>
                    <span class="add-department-txt" v-if="!isExpire">
                        {{expire_duration}} 到期,后台和app将停止使用
                    </span>
                </span>
            </el-col>
            <el-col :span="7">
                <h2>
                    {{ userInfo.company }}
                    <input type="hidden" :value=userInfo.id data-id="creator_id">
                </h2>
            </el-col>
            <el-col :span="8" class="header-right">
<!--                 <a class="link">
                    <router-link to="/store/list"><em>课程商城</em></router-link>
                </a> -->
                <div><i class="iconfont icon-bell"></i> <em>通知</em></div>
                <el-dropdown trigger="click" @command="handleFeedback">
                    <span class="el-dropdown-link feedback">
                        <i class="iconfont icon-service"></i> 
                        <em>问题反馈</em> 
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="feedback-dropdown">
                        <el-dropdown-item command="index">我的反馈</el-dropdown-item>
                        <el-dropdown-item command="add">提交问题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" @command="handleNickname">
                      <span class="el-dropdown-link nickname">
                        <img 
                            v-if="userInfo.avatar"
                            :src="{url:userInfo.avatar, sex: userInfo.sex} | defaultAvatar"> 
                            {{userInfo.name}} 
                        <i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown" class="nickname-dropdown">
                        <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                        <el-dropdown-item command="company">企业信息</el-dropdown-item>
                        <el-dropdown-item command="password">修改密码</el-dropdown-item>
                        <el-dropdown-item :divided="true"></el-dropdown-item>
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <!--头部部分 wap端-->
        <section class="header-wap">
            <el-row class="header wap-header" type="flex">
                <el-col :span="20" class="logo">
                    <img src="../assets/images/logo.png">
                    <h1>药视通连锁管理平台</h1>
                </el-col>
                <el-col :span="4">
                    <i class="iconfont icon-list" @click="handleIsShowMenue(!isShowMenue)"></i>
                </el-col>
            </el-row>
            <el-row class="header" type="flex">
                <el-col :span="8" :offset="2">
                    <h2>{{ userInfo.company }}</h2>
                </el-col>
                <el-col :span="24" class="header-right">
                    <div><i class="iconfont icon-xiaoxizhongxin"></i> <em></em></div>
                    <div class="feedback"><i class="iconfont icon-wenti"></i> <em></em></div>
                    <el-dropdown trigger="click" @command="handleNickname">
                      <span class="el-dropdown-link nickname">
                        <img src="../assets/images/user-default-male.jpg"><i
                              class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown" class="nickname-dropdown">
                            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                            <el-dropdown-item command="company">企业信息</el-dropdown-item>
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item :divided="true"></el-dropdown-item>
                            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </section>

        <article class="content">
            <!--左边菜单栏-->
            <el-menu 
                :default-active="navMenueActive" 
                class="left-menu-container" 
                :class="{ 'isShowMenue':isShowMenue }"
                :unique-opened="true"
                @select="handleMenuClick"
                :router="true">
                <div class="nav-title">导航</div>
                <MenuTree v-for="item in navMenus" :data="item" :key="item.item.id"></MenuTree>
            </el-menu>
            <!--右边内容-->
            <section class="index-right-content" @click="handleIsShowMenue(false)">
                <h2 class="right-title">
                    <i class="back-btn" v-show="isShowBack" @click="$router.back()">返回</i> <i v-show="isShowBack">|</i>
                    {{mainTitle}}
                    <!--asd-->
                    <small>{{subTitle}}</small>
                </h2>

                <div class="route-content" v-loading="contentLoading">
                    <router-view></router-view>
                </div>
            </section>
        </article>

        <ExpireDepartment :toExpiredepartment="toExpiredepartment" v-if="toExpiredepartment.dialogShow"></ExpireDepartment>
    </article>
</template>

<script>
    import authService from '../services/base/authService'
    import MenuTree from './component/tree/MenuTree.vue'
    import authUtils from '../utils/authUtils'
    import config from '../utils/config'
    import ExpireDepartment from 'components/dialog/ExpireDepartmentDialog.vue'
    import signingService from 'services/company/signingService'

    export default {
        data () {
            return {
                isShowMenue: false,
                contentLoading: false,
                mainTitle: this.$store.state.index.webpathMain,
                subTitle: this.$store.state.index.webpathSub,
                isShowBack: false,
                oldCompanyDomain: config.oldCompanyDomain,
                isExpire: true , // 收否到期
                expire_duration:7,
                toExpiredepartment: {
                    dialogShow: false
                },
                isShowExpire:false, //是否显示到期提示
            }
        },
        computed: {
            // 当前用户可见de所有的菜单
            navMenus () {
                return this.$store.state.index.navMenu
            },
            // 激活的菜单选项
            navMenueActive () {
                return this.$store.state.index.navMenueActive
            }
        },
        watch: {
            '$store.state.index.webpathMain': function () {
                this.mainTitle = this.$store.state.index.webpathMain
            },
            '$store.state.index.webpathSub': function () {
                this.subTitle = this.$store.state.index.webpathSub
            }
        },
        created () {
            // if (authUtils.getTwiceToken()) {
            authUtils.authRefreshtoken() // 开启自动更新token
            // }
            xmview.setContentLoading = this.setContentLoading.bind(this)
            xmview.setContentBack = this.showContentBack.bind(this)
            // this.$store.dispatch('setIndexMenuActive', this.$route.path) // 设置选中的菜单
            this.$store.dispatch('setIndexNavMenu', {menu: authUtils.getNavMenu()}) // 设置菜单存储
            this.$store.dispatch('setAuthOperation', authUtils.getAuthOperation())  // 设置权限存储

            // 查看到期时间
            this.getSignExpireDate()
        },
        mounted () {
            window.onresize = () => {
                this.handleIsShowMenue(document.documentElement.clientWidth > 767)
            }
        },
        beforeDestroy () {
            window.onresize = null
        },
        methods: {
            getSignExpireDate() {
                signingService.getsigningExpireDate().then( ret => {
                    // ret = '2018-6-28'
                    let expireDate = new Date(ret.expire_date);
                    let nowDate = new Date();
                    let expire = Math.ceil((expireDate - nowDate) / (1000 * 60 * 60 * 24))
                    if(ret.is_online) {
                        this.isShowExpire = true
                        if( expire <= 7) {
                            this.isExpire = true
                            this.expire_duration = expire
                        }else {
                            this.isExpire = false
                            this.expire_duration = ret.expire_date
                        }
                    }else {
                        this.isShowExpire = false
                    }
                    
                })
            },
            handleIsShowMenue (val) {
                this.isShowMenue = val
            },
            handleFeedback (type) {
                /* eslint-disable indent  */
                switch (type) {
                    case 'index':
                        this.$router.push({name: 'feedback-index'})
                        break
                    case 'add':
                        this.$router.push({name: 'feedback-add'})
                        break
                    default:
                        console.error('handleFeedback not support type')
                        break
                }
            },
            // 注销登录
            handleNickname (type) {
                /* eslint-disable indent  */
                switch (type) {
                    case 'loginout': {
                        authService.loginout()
                        this.$router.push({name: 'login'})
                        break
                    }
                    case 'safeset': {
                        this.$router.push({name: 'mine-safeset'})
                        break
                    }
                    case 'profile': {
                        this.$router.push({name: 'mine-profile'})
                        break
                    }
                    case 'company': {
                        this.$router.push({name: 'mine-company'})
                        break
                    }
                    case 'password': {
                        this.$router.push({name: 'mine-password'})
                        break
                    }
                    default: {
                        throw new Error('index.vue, handleNickname not support type')
                    }
                }
            },
            // 菜单点击
            handleMenuClick (item) {
                if (!this.$store.state.sidebar.isActive) {
                    this.$store.dispatch('clearFetchParam', true)
                    if (item === this.$route.path) {
                        this.$router.replace({name: this.$route.name, query: {refreshId: Date.now()}})
                        xmview.setContentLoading(false)
                    } else {
                        this.$router.push({path: item})
                    }
                }
            },
            setContentLoading (loading) {
                if (!loading) {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.contentLoading = loading
                        }, 300)
                    })
                } else {
                    this.contentLoading = loading
                }
            },
            // 是否显示
            showContentBack (isShow) {
                this.isShowBack = isShow
            },
            toContinueDepartmentpay() {
                this.toExpiredepartment.dialogShow = true
            }
        },
        components: {
            MenuTree,
            ExpireDepartment
        }
    }
</script>
