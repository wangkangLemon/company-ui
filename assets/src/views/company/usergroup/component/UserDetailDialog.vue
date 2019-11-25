<style lang="scss">
    @import "~utils/mixins/showDetail";
</style>

<template>
    <el-dialog 
        size="small" 
        v-loading="loading"
        class="show-detail" 
        :title="title" 
        :visible.sync="showDialog">
        <div class="avatar">
            <img :src="{url:ruleForm.avatar, sex: ruleForm.sex} | defaultAvatar" />
        </div>
        <div class="info">
            <p><i class="title">姓名：</i><span class="value">{{ruleForm.name}}</span></p>
            <p><i class="title">工号：</i><span class="value">{{ruleForm.staff_id}}</span></p>
            <p><i class="title">手机号：</i> <span class="value">{{ruleForm.mobile}}</span></p>
            <p><i class="title">所属门店：</i><span class="value">{{ruleForm.dep_name}}</span></p>
            <p><i class="title">职位：</i><span class="value">{{ruleForm.job}}</span></p>
            <p><i class="title">入职时间：</i><span class="value">{{ruleForm.join_time}}</span></p>
            <p><i class="title">办公地址：</i><span class="value">{{ruleForm.address}}</span></p>
        </div>
    </el-dialog>
</template>

<script>
    import userService from 'services/company/userService'
    export default {
        components: {},
        props: {
            title: String,
            visible: Boolean,
            id: Number
        },
        activated () {},
        created () {
            this.fetchData()
        },
        mounted () {},
        computed: {},
        watch: {
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                loading: false,
                showDialog: this.visible,
                ruleForm: {}
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return userService.getUserInfo({id: this.id}).then(ret => {
                    this.ruleForm = ret.data
                }).then(() => {
                    this.loading = false
                })
            },
        },
        filters: {
            sex (val) {
                let map = {
                    0: '女',
                    1: '男'
                }
                return map[val]
            }
        }
    }
</script>
