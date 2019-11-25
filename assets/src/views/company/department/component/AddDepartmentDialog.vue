<style lang="scss">

</style>

<template>
    <el-dialog :visible.sync="department.dialogShow" :title="department.dialogTitle">
        <el-form :model="department.form" :rules="department.rules" ref="departmentForm" label-width="100px">
            <el-form-item label="门店名称" prop="name">
                <span v-if="form.type==='detail'">{{department.form.name}}</span>
                <el-input v-else v-model="department.form.name"></el-input>
            </el-form-item>
<!--             <el-form-item label="上级部门" prop="organization_id">
                <el-input @focus="getFocus" v-model="department.form.organization_name"></el-input>
            </el-form-item> -->
            <el-form-item label="电话号码" prop="tel">
                <span v-if="form.type==='detail'">{{department.form.tel}}</span>
                <el-input v-else v-model="department.form.tel"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="fax">
                <span v-if="form.type==='detail'">{{department.form.fax}}</span>
                <el-input v-else v-model="department.form.fax"></el-input>
            </el-form-item>
            <el-form-item label="地区" prop="area">
                <Region title=""
                    :province="department.form.province || undefined"
                    :city="department.form.city || undefined"
                    :area="department.form.area || undefined"
                    :disabled="form.type==='detail'"
                    v-on:provinceChange="val => department.form.province = val"
                    v-on:cityChange="val => department.form.city = val"
                    v-on:areaChange="val => department.form.area = val">
                </Region>
            </el-form-item>
            <el-form-item label="店长姓名" prop="contact">
                <span v-if="form.type==='detail'">{{department.form.contact}}</span>
                <el-input v-else v-model="department.form.contact"></el-input>
            </el-form-item>
            <el-form-item label="店长手机号" prop="mobile">
                <span v-if="form.type==='detail'">{{department.form.mobile}}</span>
                <el-input v-else v-model="department.form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="门店地址" prop="address">
                <span v-if="form.type==='detail'">{{department.form.address}}</span>
                <el-input v-else v-model="department.form.address"></el-input>
            </el-form-item>
            <el-form-item label="门店邮编" prop="zip">
                <span v-if="form.type==='detail'">{{department.form.zip}}</span>
                <el-input v-else v-model="department.form.zip"></el-input>
            </el-form-item>
<!--             <el-form-item label="排序" prop="sort">
                <el-input type="number" v-model.number="department.form.sort" placeholder="同一级门店中的展示顺序，序号大的会排在组织架构最上面"></el-input>
            </el-form-item> -->
            <el-form-item label="编号" prop="private_id">
                <span v-if="form.type==='detail'">{{department.form.private_id}}</span>
                <el-input v-else v-model="department.form.private_id"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="description">
                <span v-if="form.type==='detail'">{{department.form.description}}</span>
                <el-input v-else type="textarea" :rows="2" placeholder="备注" v-model="department.form.description"></el-input>
            </el-form-item>
        </el-form>
        <div v-if="form.type==='detail'" slot="footer">
            <el-button @click="department.dialogShow=false" type="primary">确定</el-button>
        </div>
        <div v-else slot="footer" class="dialog-footer">
            <el-button @click="department.dialogShow=false">取消</el-button>
            <el-button type="primary" @click="submitDepartment">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import Region from 'components/select/Region.vue'
    import departmentService from 'services/company/departmentService'

    export default {
        components: {
            Region
        },
        props: {
            form: Object
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                department: this.form,
            }
        },
        methods: {
            // 提交门店
            submitDepartment () {
                this.department.form.isdep = 1
                this.$refs.departmentForm.validate((valid) => {
                    if (!valid) return
                    let msg = ''
                    let reqFn
                    let edit = this.department.form.id ? true : false
                    if (edit) {
                        msg = '修改成功'
                        reqFn = departmentService.updateDepartment
                    } else {
                        msg = '添加成功'
                        reqFn = departmentService.addDepartment
                    }
                    reqFn(this.department.form).then(ret => {
                        ret.edit = edit
                        xmview.showTip('success', msg)
                        this.$emit('success', ret)
                        this.department.dialogShow = false
                    }).catch((ret) => {
                        xmview.showTip('success', ret.message || '添加失败')
                    })
                })
            },
        },
    }
</script>
