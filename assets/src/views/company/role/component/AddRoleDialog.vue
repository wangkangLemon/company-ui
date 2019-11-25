<style>
    .tree__permission {
        height: 300px;
        overflow: scroll;
        span .disabled_span {
            color: #ddd;
        }
    }
</style>

<template>
    <el-dialog class="show-detail" :title="role.addRoleTitle" :visible.sync="showDialog">
        <el-form :model="role.form" :rules="role.rules" ref="roleForm" label-width="100px" style="width: 100%">
            <el-form-item label="角色名称" prop="role_name">
                <el-input v-model="role.form.role_name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
                <el-input :rows="2" type="textarea" v-model="role.form.description"></el-input>
            </el-form-item>
            <el-form-item label="权限分配" prop="ids">
                <el-tree
                    class="tree__permission"
                    ref="permissionTree"
                    :data="role.permissionList"
                    :default-checked-keys="role.defaultCheckeds"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :render-content="renderContent"
                    :props="{
                        children: 'children',
                        label: 'label'}">
                </el-tree>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog=false">取消</el-button>
            <el-button type="primary" @click="submitRole">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import roleService from 'services/company/roleService'

    export default {
        props: {
            visible: Boolean,
            title: String,
            role: Object,
        },
        watch: {
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        created () {
            this.fetchRoleData()
        },
        data () {
            return {
                showDialog: this.visible
            }
        },
        methods: {
            fetchRoleData () {
                roleService.getPermissionTree().then((ret) => {
                    this.role.permissionList = ret.data
                })
            },
            submitRole () {
                this.$refs.roleForm.validate((valid) => {
                    if (!valid) return
                    this.$emit('submit')
                })
            },
            renderContent (h, { node, data, store }) {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" style={{color: data.disabled ? '#ddd' : ''}}>
                        <span>
                            <span>{node.label}</span>
                        </span>
                    </span>
                )
            }
        }
    }
</script>
