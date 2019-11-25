<!-- 
    事件：success，移动成功，在页面入口处理其他逻辑
 -->
<template>
    <el-dialog :visible.sync="section.dialogShow" :title="section.dialogTitle">
        <el-form :model="section.form" :rules="section.rules" ref="sectionForm" label-width="110px">
            <el-form-item label="部门名称" prop="name">
                <span v-if="form.type==='detail'">{{section.form.name}}</span>
                <el-input v-else v-model="section.form.name"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="tel">
                <span v-if="form.type==='detail'">{{section.form.tel}}</span>
                <el-input v-else v-model="section.form.tel"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="fax">
                <span v-if="form.type==='detail'">{{section.form.fax}}</span>
                <el-input v-else v-model="section.form.fax"></el-input>
            </el-form-item>
            <el-form-item label="地区" prop="area">
                <Region title=""
                    :province="section.form.province || undefined"
                    :city="section.form.city || undefined"
                    :area="section.form.area || undefined"
                    :disabled="form.type==='detail'"
                    v-on:provinceChange="val => section.form.province = val"
                    v-on:cityChange="val => section.form.city = val"
                    v-on:areaChange="val => section.form.area = val">
                </Region>
            </el-form-item>
            <el-form-item label="部门负责人" prop="contact">
                <span v-if="form.type==='detail'">{{section.form.contact}}</span>
                <el-input v-else v-model="section.form.contact"></el-input>
            </el-form-item>
            <el-form-item label="负责人手机号" prop="mobile">
                <span v-if="form.type==='detail'">{{section.form.mobile}}</span>
                <el-input v-else v-model="section.form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="部门地址" prop="address">
                <span v-if="form.type==='detail'">{{section.form.address}}</span>
                <el-input v-else v-model="section.form.address"></el-input>
            </el-form-item>
            <el-form-item label="部门邮编" prop="zip">
                <span v-if="form.type==='detail'">{{section.form.zip}}</span>
                <el-input v-else v-model="section.form.zip"></el-input>
            </el-form-item>
<!--             <el-form-item label="排序" prop="sort">
                <el-input type="number" v-model.number="section.form.sort" placeholder="同一级门店中的展示顺序，序号大的会排在组织架构最上面"></el-input>
            </el-form-item> -->
            <el-form-item label="编号" prop="private_id">
                <span v-if="form.type==='detail'">{{section.form.private_id}}</span>
                <el-input v-else v-model="section.form.private_id"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="description">
                <span v-if="form.type==='detail'">{{section.form.description}}</span>
                <el-input v-else type="textarea" :rows="2" placeholder="备注" v-model="section.form.description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="section.dialogShow=false">取消</el-button>
            <el-button type="primary" @click="submitSection">保存</el-button>
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
            form: Object,
            getFocus: Function,
        },
        data () {
            return {
                section: this.form,
            }
        },
        watch: {
        },
        methods: {
            submitSection () {
                this.section.form.isdep = 0
                this.$refs.sectionForm.validate((valid) => {
                    if (!valid) return
                    let msg = ''
                    let reqFn
                    let edit = this.section.form.id ? true : false
                    if (edit) {
                        msg = '修改成功'
                        reqFn = departmentService.updateDepartment
                    } else {
                        msg = '添加成功'
                        reqFn = departmentService.addDepartment
                    }
                    reqFn(this.section.form).then(ret => {
                        ret.edit = edit
                        xmview.showTip('success', msg)
                        this.$emit('success', ret)
                        for (let item in this.section.form) {
                            this.section.form[item] = ''
                        }
                        this.section.dialogShow = false
                    })
                })
            },
        }
    }
</script>
