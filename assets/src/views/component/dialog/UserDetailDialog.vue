<!-- 员工信息 -->
<!-- 所有需要用到员工信息弹窗的地方，组织架构，成绩... -->
<style lang="scss" rel='stylesheet/scss'>
    @import "~utils/mixins/showDetail";
</style>

<template>
    <el-dialog 
        :class="customClass"
        class="show-detail"
        :title="title" 
        :visible.sync="showDialog">
        <div class="avatar">
            <img :src="{url:clerkDetail.avatar, sex: clerkDetail.sex} | defaultAvatar" />
        </div>
        <div class="info">
            <p><i class="title">姓名：</i><span class="value">{{clerkDetail.name}}</span></p>
            <p><i class="title">工号：</i><span class="value">{{clerkDetail.staff_id}}</span></p>
            <p><i class="title">所属门店：</i><span class="value">{{clerkDetail.dep_name}}</span></p>
            <p><i class="title">职位：</i><span class="value">{{clerkDetail.job}}</span></p>
            <p><i class="title">手机号：</i> <span class="value">{{clerkDetail.mobile}}</span></p>
            <p>
                <i class="title">状态：</i>
                <span class="value">
                    <el-tag type="success" v-if="!clerkDetail.disabled">正常</el-tag>
                    <el-tag type="danger" v-else>异常</el-tag>
                </span>
            </p>
            <p><i class="title">性别：</i> <span class="value">{{clerkDetail.sex ? '男' : '女'}}</span></p>
            <p><i class="title">生日：</i> <span class="value">{{clerkDetail.birthday}}</span></p>
            <p><i class="title">入职时间：</i> <span class="value">{{clerkDetail.join_time}}</span></p>
            <p><i class="title">地区：</i> <span class="value">{{clerkDetail.province_name}} / {{clerkDetail.city_name}} / {{clerkDetail.area_name}}</span></p>
            <p><i class="title">地址：</i> <span class="value">{{clerkDetail.address}}</span></p>
            <p><i class="title">注册时间：</i><span class="value">{{clerkDetail.create_time_name}}</span></p>
            <p><i class="title">最后使用时间：</i> <span class="value">{{clerkDetail.last_active_time_name}}</span></p>
            <p><i class="title">最后登录时间：</i> <span class="value">{{clerkDetail.last_login_time_name}}</span></p>
        </div>
    </el-dialog>
</template>

<script>
    import userService from 'services/company/userService'
    export default {
        props: {
            customClass: {
                type: String
            },
            visible: {
                type: Boolean,
            },
            title: {
                type: String,
                default: '员工信息'
            }
        },
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                showDialog: this.visible,
                clerkDetail: {}
            }
        },
        methods: {
            fetchData (id) {
                return userService.getUserInfo({id}).then((ret) => {
                    this.clerkDetail = ret.data
                })
            }
        }
    }
</script>
