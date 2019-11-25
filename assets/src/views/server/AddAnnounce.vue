<!-- 公告编辑 -->
<style lang="scss" rel="stylesheet/scss">
    .addannounce-content-operate {
        background: #fff;
        padding: 20px;

        .addForm {
            max-width: 700px;
            .footer {
                text-align: right;
                padding-right: 20px;
            }
        
        }
        .collection {
            align-items: center;
            min-height: 36px;
            border-radius: 4px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
            .tag {
               margin-right: 10px;
            }
            
        }
        .dialog {
            section {
                margin: 10px; 
            }
            .btn {
                float: right;
                margin-bottom: 20px;
            }
        }
    }
</style>
<template>
    <article class="addannounce-content-operate">
        <!--添加/编辑表单-->
        <section class="addForm">
            <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
                <el-form-item prop="title" label="标题" >
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="正文内容">
                  <el-input
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入内容"
                      v-model="form.content">
                  </el-input>
                </el-form-item>
                <Pusher 
                    ref="pusher"
                    :ruleForm="form" 
                    :labelWidth="formLabelWidth"
                    v-model="push_type_list">
                </Pusher>
                
                <el-form-item label="">
                <div  class="footer">
                    <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
                    <el-button type="warning" v-if="!ID" @click="submit('ruleForm', 1)">存为草稿</el-button>
                </div>
                </el-form-item>
            </el-form>
        </section>
    </article>
</template>

<script>
    import announceService from 'services/server/announceService'
    import Pusher from 'components/select/pusher/Main.vue'
    function clearFn () {
        return {
            title: '',          // 标题
            content: '',         // 正文内容
            type: '', // 类型
            departments: [],
            parent_departments: [],
            push_type_id: '',    // 发布对象id
            id: '',
            status: 0, // 0 发布 1 草稿
            draft: 0
        }
    }
    export default {
        name: 'content-operate',
        data () {
            return {
                dialogShow: false, // 用户弹窗
                dialogDep: false, // 企业弹框
                usersTotal: 10,
                departments: [],
                selectUser: [],  // 选择用户
                selectDep: [],  // 选择企业
                depkeyword: '', // 企业搜索
                keyword: '', // 员工搜索
                department_id: '', //  员工选择框的id
                push_type_list: [],
                form: clearFn(),
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'},
                        { max: 15, message: '20字以内', trigger: 'blur' }
                    ],
                    content: [
                        {required: true, message: '必须填写', trigger: 'blur'},
                        { max: 150, message: '150字以内', trigger: 'blur' }
                    ],
                    type: {required: true, message: '请选择发布对象', trigger: 'change'}
                },
                formLabelWidth: '120px', // 表单label的宽度
            }
        },
        components: {
            Pusher
        },
        computed: {
            ID () {
                return this.$route.query.id
            },
            Status () {
                return this.$route.query.status
            }
        },
        created () {
            xmview.setContentLoading(false)
            if (isNaN(this.ID)) {
                // this.$refs.ruleForm.resetFields()
                this.form = clearFn()
                return
            }

            announceService.getEditDetail(this.ID, this.Status).then((ret) => {
                this.form.id = ret.data.id
                this.form.title = ret.data.title
                this.form.content = ret.data.content  // 正文
                this.form.type = ret.data.type
                this.form.departments = ret.data.departments
                this.form.parent_departments = ret.data.parent_departments
                this.push_type_list = ret.push_type_list || []
            })
        },
        methods: {
            submit (formName, type = 0) {
                if (this.validateAllForm(formName)) {
                    if (this.form.type !== 'company') {
                        this.form.push_type_id = this.push_type_list.map(item => item['id']).join(',')
                    }
                    this.form.status = type
                    let reqFn
                    this.ID ? reqFn = announceService.updateAnnounceService
                    : reqFn = announceService.addAnnounceService
                    reqFn(this.form).then((ret) => {
                        this.selectUser = [] // 清空
                        this.selectDep = []
                        xmview.showTip('success', '保存成功')
                        this.$router.go(-1)
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            validateAllForm (formName) {
                return ![this, this.$refs.pusher]
                        .some((item) => !item.validate(formName))
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
        }
    }
</script>
