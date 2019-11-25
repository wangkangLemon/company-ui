<style lang="scss">
    // @import "~utils/mixins/common";
    // @import "~utils/mixins/topSearch";
    #practicaloperation-container {
        padding: 15px;
        height: 600px;
        border: 1px solid #ededed;
        border-radius: 5px;
        background: #fff;
        .el-form-item {
            margin-bottom: 20px;
        }
        .form {
            margin-top: 57px;
            width: 53%;
        }
        // .el-tag + .el-tag {
        //     margin-left: 10px;
        //     margin-bottom: 10px;
        // }
        // .button-new-tag {
        //     margin-left: 10px;
        //     height: 32px;
        //     line-height: 30px;
        //     padding-top: 0;
        //     padding-bottom: 0;
        // }
        // .input-new-tag {
        //     width: 90px;
        //     margin-left: 10px;
        // }
    }
</style>

<template>
    <main id="practicaloperation-container">
        <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="form" :rules="rules">
            <el-form-item label="实操课" prop="name">
                <el-input
                    class="input"
                    v-model="ruleForm.name"
                    placeholder="请输入实操课名称">
                </el-input>
            </el-form-item>
            <el-form-item label="关联课程说明" prop="course_id">
                <el-form-item style="display: inline-block; margin-bottom: 0;">
                    <el-select 
                        v-model="courseType">
                        <el-option label="系统实操" value="teaching"></el-option>
                        <el-option label="企业实操" value="company_teach"></el-option>
                    </el-select>
                </el-form-item>
                <CourseSelect 
                    :status="0"
                    :type="courseType"
                    ref="courseSelect"
                    @change="(val, name)=>{ ruleForm.course_id = val; ruleForm.course_name = name}">
                </CourseSelect>
            </el-form-item>
            <el-form-item>
                <el-button 
                    type='primary' 
                    @click="add">
                    添加
                </el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="medicine">
            <el-tag
                :key="tag + index"
                v-for="(tag, index) in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
            </el-input>
            <el-button
                v-else 
                class="button-new-tag" 
                size="small" 
                @click="showInput">
                +实操课
            </el-button>
        </div> -->
    </main>
</template>

<script>
    import CourseSelect from 'components/select/Course.vue'

    export default {
        components: {
            CourseSelect
        },
        props: {
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            taskType: Number,
            type: {
                type: [Number, String],
                required: false,
            },
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                ruleForm: {
                    name: '', // 实操课
                    course_id: '',  // 关联课程id
                    course_name: '',  // 关联课程名字
                },
                rules: {
                    name: { required: true, message: '请输入实操课名称', trigger: 'blur'},
                    course_id: { required: true,  message: '请选择关联课程' }
                },
                courseType: 'teaching',
                // dynamicTags: this.value,
                // inputVisible: false,
                // inputValue: ''
            }
        },
        methods: {
            // handleClose(tag, noemit) {
            //     this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
            //     if (!noemit) {
            //         this.$emit('medicineTaken', {
            //             taskType: this.taskType,
            //             type: this.type,
            //             name: tag
            //         }, false)
            //     }
            // },
            // showInput() {
            //     this.inputVisible = true
            //     this.$nextTick(_ => {
            //       this.$refs.saveTagInput.$refs.input.focus()
            //     })
            // },
            // handleInputConfirm() {
            //     let inputValue = this.inputValue
            //     if (inputValue) {
            //         this.dynamicTags.push(inputValue)
            //         this.$emit('medicineTaken', { 
            //             taskType: this.taskType,
            //             type: this.type,
            //             name: inputValue
            //         }, true)
            //     }
            //     this.inputVisible = false
            //     this.inputValue = ''
            // },
            // deleteAll () {
            //     while (this.dynamicTags.length > 0) {
            //         this.dynamicTags.splice(0, 1)
            //     }
            // },
            add () {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.$emit('medicineTaken', { 
                            taskType: this.taskType,
                            type: this.type,
                            po_course_id: this.ruleForm.course_id,
                            po_course_name: this.ruleForm.course_name,
                            name: this.ruleForm.name
                        })
                        this.ruleForm.name = ''
                        this.clearSelect()
                    }
                })
            },
            clearSelect () {
                this.$refs.courseSelect.clear()
                this.ruleForm.course_id = ''
                this.$refs.ruleForm.clearValidate()
            }
        },
        filters: {},
        directives: {},
    }
</script>
