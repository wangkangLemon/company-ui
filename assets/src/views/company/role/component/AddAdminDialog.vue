<template>
    <el-dialog 
        class="show-detail" 
        :title="admin.addAdminTitle" 
        :visible.sync="showDialog">
        <el-tabs v-model="tabValue" type="card">
            <el-tab-pane label="员工信息" name="first">
                <el-form :model="admin.form" :rules="admin.rules" ref="adminForm" label-width="100px" class="add-admin-form">
                    <el-form-item label="角色分配" prop="roles">
                        <el-select style="width: 50%" 
                            v-model="admin.form.roles"
                            multiple
                            filterable>
                            <el-option 
                                v-for="(item,index) in admin.allRole"
                                :label="item.role_name"
                                :key="index"
                                :value="item.id"
                                :id="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" prop="user_id" class="name-conainer">
                        <el-input style="width: 50%" v-model="admin.form.name"></el-input>
                        <el-button type="text" @click="showUserDialog=true">选择店员</el-button>
                    </el-form-item>
                    <el-form-item label="所属门店" prop="department_name">
                        <el-input style="width: 50%" @focus="()=>{chooseDepDialog = true}" v-model="admin.form.department_name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input style="width: 50%" v-model="admin.form.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="passwd">
                        <el-input style="width: 50%" type="password" auto-complete="new-password" v-model="admin.form.passwd" placeholder="若不设置密码，可为空"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="管理范围" name="second" :disabled="!!~admin.form.roles.indexOf(201)">
                <CompanyTree 
                    ref="adminRange"
                    v-model="rangeList"
                    :isSearch="true"
                    :isSearching.sync="isSearching"
                    :defaultChecks="admin.defaultCheckeds"
                    :expandOnClickNode="true"
                    :defaultTopNode="defaultTopNode"
                    :defaultExpandedKeys="admin.defaultExpandedKeys"
                    :isSelect="true"
                    :isUserCount="false"
                    :truncatedNum="0"
                    :load="load">
                </CompanyTree>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click="admin.showAddAdmin=false">取消</el-button>
            <el-button type="primary" @click="submitAdmin">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import CompanyTree from 'components/tree/CompanyTree.vue'

    export default {
        components: {
            CompanyTree,
        },
        props: {
            visible: Boolean,
            value: Boolean,
            showChooseUser: Boolean,
            admin: Object,
            load: Function,
            rangeList: Array,
            defaultTopNode: Function
        },
        watch: {
            value (val) {
                this.chooseDepDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            },
            chooseDepDialog (val) {
                this.$emit('input', val)
            },
            showUserDialog (val) {
                this.$emit('update:showChooseUser', val)
            },
            showChooseUser (val) {
                this.showUserDialog = val
            }
        },
        computed: {
        },
        created () {
        },
        data () {
            return {
                showDialog: this.visible,
                chooseDepDialog: this.value,
                tabValue: 'first', // tab当前选中的值
                showUserDialog: this.showChooseUser,
                isSearching: false,
            }
        },
        methods: {
            submitAdmin () {
                this.$refs.adminForm.validate((valid) => {
                    if (!valid) {
                        this.tabValue = 'first'
                        return
                    }
                    this.$refs.adminRange.setCheckedKeys()
                    let checkNodes = this.$refs.adminRange.$refs.tree.getCheckedNodes()
                    this.$emit('submit', checkNodes)
                })
            },
        }
    }
</script>
