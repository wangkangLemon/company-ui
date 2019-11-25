<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #creategroupdialog-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
    }
</style>

<template>
    <el-dialog 
        :title="title" 
        :visible.sync="showDialog">
        <template v-if="type!=='detail'">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-form-item label="用户组名称" prop="name">
                    <el-input
                        v-model="ruleForm.name"
                        placeholder="请输入用户组名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="用户组简介" prop="description">
                    <el-input
                        type="textarea"
                        v-model="ruleForm.description"
                        placeholder="请输入用户组简介">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="type!='detail'">
                <el-button type="primary" @click="save('ruleForm')">{{type==='add' ? '保存' : '修改'}}用户组</el-button>
            </span>
        </template>
        <template v-else>
            <el-form>
                <el-form-item label="用户组名称：">
                    <span>{{ruleForm.name}}</span>
                </el-form-item>
                <el-form-item label="用户组简介：">
                    <span>{{ruleForm.description}}</span>
                </el-form-item>
            </el-form>
        </template>
    </el-dialog>
</template>

<script>
    import userService from 'services/company/userService'
    export default {
        components: {},
        props: {
            title: String,
            visible: Boolean,
            type: String,
            id: Number
        },
        activated () {},
        created () {
            if (this.type !== 'add') {
                this.fetchData()
            }
        },
        mounted () {},
        computed: {
            service () {
                let map = {
                    'add': userService.addUserGroup,
                    'edit': userService.updateUserGroupInfo,
                }
                return map[this.type]
            },
            reqParam () {
                let map = {
                    'add': {
                        name: this.ruleForm.name,
                        description: this.ruleForm.description
                    },
                    'edit': {
                        id: this.id,
                        name: this.ruleForm.name,
                        description: this.ruleForm.description,

                    }
                }
                return map[this.type]
            }
        },
        watch: {
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                loading: false,
                showDialog: this.visible,
                ruleForm: {
                    name: '',
                    description: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户组名称', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入用户组简介', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return userService.viewUserGroup({id: this.id}).then(ret => {
                    this.ruleForm = ret.data
                }).then(() => {
                    this.loading = false
                })
            },

            save (form) {
                if (this.ruleForm.name.trim() === '未分组用户') return xmview.showTip('error', '该分组已存在')
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.service(this.reqParam).then(ret => {
                            xmview.showTip('success', '成功')
                            this.$emit('success')
                            this.showDialog = false
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message || '失败')
                        })
                    }
                })
            }
        },
        filters: {}
    }
</script>
