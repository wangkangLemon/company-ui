<!--企业信息-->
<style lang="scss">
    @import "~utils/mixins/_mixins.scss";
    .user-company {
        background: #fff;
        padding: 20px 200px;
        .dialog-footer {
            text-align: center;
        }
    }
</style>
<template>
    <article class="user-company">
        <el-form class="addForm" :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
            <el-form-item prop="name" label="企业名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="contact" label="联系人" :label-width="formLabelWidth">
                <el-input v-model="form.contact" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="联系人手机" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" type="number" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="联系人邮箱" :label-width="formLabelWidth">
                <el-input v-model="form.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="tel" label="电话" :label-width="formLabelWidth">
                <el-input v-model="form.tel" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="fax" label="传真" :label-width="formLabelWidth">
                <el-input v-model="form.fax" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="地区" :label-width="formLabelWidth">
                <Region title=""
                        :province="form.province"
                        :city="form.city"
                        :area="form.area"
                        v-on:provinceChange="val => form.province = val"
                        v-on:cityChange="val => form.city = val"
                        v-on:areaChange="val => form.area = val"></Region>
            </el-form-item>
            <el-form-item prop="address" label="地址" :label-width="formLabelWidth">
                <el-input v-model="form.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="zip" label="邮编" :label-width="formLabelWidth">
                <el-input v-model="form.zip" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="url" label="企业网址" :label-width="formLabelWidth">
                <el-input v-model="form.url" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="企业介绍" :label-width="formLabelWidth">
                <el-input type="textarea" :rows="3" v-model="form.description" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit('form')">提交</el-button>
        </div>
    </article>
</template>
<script>
    import Region from 'components/select/Region.vue'
    import mineService from 'services/profile/index'
    export default {
        components: {
            Region
        },
        data () {
            let validateEmail = (rule, value, callback) => {
                if (!(value || '').match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                    callback(new Error('请输入一个有效的电子邮箱地址'))
                }
                callback()
            }
            let validateMobile = (rule, value, callback) => {
                if (!(value || '').match(/^1[345789]\d{9}$/)) {
                    callback(new Error('请输入正确的手机号'))
                }
                callback()
            }
            return {
                formLabelWidth: '100px',
                form: {
                    name: '', // 名称
                    contact: '', // 联系人
                    mobile: '', // 联系人手机
                    tel: '', // 电话
                    email: '', // 联系人邮箱
                    fax: '', // 传真
                    province: '', // 省
                    city: '', // 市
                    area: '', // 区
                    address: '', // 地址
                    zip: '', // 邮编
                    url: '', // 企业网址
                    description: '', // 企业介绍
                },
                rules: {
                    name: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: validateEmail, trigger: 'blur'}
                    ]
                },
            }
        },
        created () {
            mineService.getCompanyInfo().then((ret) => {
                this.form = ret
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        mineService.modifyCompany(this.form).then(() => {
                            xmview.showTip('success', '修改成功')
                            this.$router.go(-1)
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
