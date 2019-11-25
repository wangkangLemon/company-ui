<template>
    <el-dialog 
        class="show-detail" 
        size="small" 
        title="管理员信息" 
        :visible.sync="showDialog">
        <div class="avatar">
            <img :src="{url:admin.clerkDetail.avatar, sex: admin.clerkDetail.sex} | defaultAvatar" />
        </div>
        <div class="info">
            <p><i class="title">姓名：</i><span class="value">{{admin.clerkDetail.name}}</span></p>
            <p><i class="title">工号：</i><span class="value">{{admin.clerkDetail.staff_id}}</span></p>
            <p><i class="title">所属门店：</i><span class="value">{{admin.clerkDetail.dep_name}}</span></p>
            <p><i class="title">职位：</i><span class="value">{{admin.clerkDetail.job}}</span></p>
            <p><i class="title">手机号：</i> <span class="value">{{admin.clerkDetail.mobile}}</span></p>
            <template v-for="(item, index) in admin.clerkDetail.role_id_name">
                <p><i class="title">{{index===0 ? "管理员角色：" : ""}}</i> <span class="value" >{{item.name}}</span></p>
            </template>
            <p>
                <i class="title">管理范围：</i>
                <span class="value">
                    <el-button type='text' @click="view">查看</el-button>
                </span>
            </p>
            <!-- <p>
                <i class="title">状态：</i>
                <span class="value">
                    <el-tag type="success" v-if="admin.clerkDetail.disabled === 0">启用</el-tag>
                    <el-tag type="info" v-else>禁用</el-tag>
                </span>
            </p> -->
            <p><i class="title">上次登录时间：</i> <span class="value">{{admin.clerkDetail.last_login_time_name}}</span></p>
        </div>

        <!-- 查看管理员范围 -->
        <el-dialog 
            append-to-body
            title="管理员范围"
            :visible.sync="showDepartmentDialog">
            <CompanyTree 
                v-model="rangeList"
                ref="adminRange"
                :defaultChecks="admin.defaultCheckeds"
                :expandOnClickNode="true"
                :defaultTopNode="initDefaultTopNode"
                :defaultExpandedKeys="[0]"
                :isUserCount="false"
                :truncatedNum="0"
                :load="loadTreeService">
            </CompanyTree>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import organizationService from 'services/company/organizationService'
    import CompanyTree from 'components/tree/CompanyTree.vue'

    export default {
        props: {
            visible: Boolean,
            admin: Object,
        },
        components: {
            CompanyTree
        },
        watch: {
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        created () {

        },
        data () {
            return {
                showDialog: this.visible,
                showDepartmentDialog: false,
                rangeList: [],
            }
        },
        methods: {
            view () {
                this.showDepartmentDialog = true
            },
            loadTreeService (param) {
                param.user_id = this.admin.clerkDetail.id
                return organizationService.getOrganizationTree(param).then(ret => {
                    return ret
                })
            },
            initDefaultTopNode () {
                return [
                    {
                        has_children: true,
                        id: 0,
                        isdep: 0,
                        name: this.userInfo.company,
                        pid: 0,
                        godPid: 0,
                    }
                ]
            },
        }
    }
</script>
