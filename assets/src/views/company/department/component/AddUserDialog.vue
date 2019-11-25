<template>
    <el-dialog :visible.sync="dialogShow" :title="dialogTitle">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="所属门店">
                <DepSelect v-if="form.id" v-model="form.department_id" :placeholder="form.dep_name"></DepSelect>
                <span v-else>{{form.dep_name}}</span>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="staff_id">
                <el-input v-model="form.staff_id"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="职位" prop="job">
                <el-input v-model="form.job"></el-input>
            </el-form-item>
            <el-form-item label="入职时间" prop="join_time">
                <el-date-picker v-model="form.join_time" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="form.birthday" type="date" placeholder="选择生日"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="passwd">
                <el-input v-if="form.id" v-model="form.passwd" type="password" placeholder="用于登录药视通客户端"></el-input>
                <el-tooltip v-else class="item" effect="dark" content="初始密码为123123" placement="left">
                    <el-input v-model="form.passwd" type="password" placeholder="用于登录药视通客户端"></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="地区">
                <Region title=""
                        :province="form.province"
                        :city="form.city"
                        :area="form.area"
                        v-on:provinceChange="val => form.province = val"
                        v-on:cityChange="val => form.city = val"
                        v-on:areaChange="val => form.area = val"></Region>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" placeholder="办公地址"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShow=false">取消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import Region from 'components/select/Region.vue'
    import DepSelect from 'components/select/Department.vue'

    export default {
        components: {
            Region,
            DepSelect,
        },
        props: {
            visible: Boolean,
            title: String,
            form: Object,
        },
        watch: {
            'dialogShow' (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            let validateMobile = (rule, value, callback) => {
                if (!(value || '').match(/^1[3456789]\d{9}$/)) {
                    callback(new Error('请输入正确的手机号'))
                }
                callback()
            }
            return {
                dialogShow: this.visible,
                dialogTitle: this.title,
                rules: {
                    department_id: {required: true, message: '必须选择所属部门'},
                    name: {required: true, message: '必须填写姓名'},
                    mobile: [
                        {required: true, message: '必须填写', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                },
                showTooltip: true,
            }
        },
        methods: {
            submit () {
                this.$refs.form.validate((valid) => {
                    if (!valid) return
                    this.$emit('submit')
                })
            }
        },
    }
</script>
