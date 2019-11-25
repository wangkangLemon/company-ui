<style lang="scss">
    // @import "~utils/mixins/common";
    // @import "~utils/mixins/topSearch";
    #medicinetaken-container {
        padding: 15px;
        height: 600px;
        border: 1px solid #ededed;
        border-radius: 5px;
        background: #fff;
        .form {
            margin-top: 57px;
            width: 53%;
        }
        .el-form-item {
            margin-bottom: 20px;
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
    <main id="medicinetaken-container">
        <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="form" :rules="rules">
            <el-form-item label="拿药练习" prop="name">
                <el-input
                    class="input"
                    v-model="ruleForm.name"
                    placeholder="请输入拿药练习标题">
                </el-input>
            </el-form-item>
            <el-form-item label="药品" prop="course_id">
                <DrugSelect 
                    ref="DrugSelect"
                    @change="(val, name)=>{ ruleForm.course_id = val; ruleForm.course_name = name}">
                </DrugSelect>
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
                +拿药练习
            </el-button>
        </div> -->
    </main>
</template>

<script>
    import DrugSelect from 'components/select/Drug.vue'

    export default {
        components: {
            DrugSelect
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
                    name: '',
                    course_id: [],
                    course_name: '',
                },
                rules: {
                    name: { required: true, message: '请输入拿药练习名称', trigger: 'blur'},
                    // course_id: { required: true,  message: '请选择关联课程', trigger: 'change' }
                }
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
            // }
            add () {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.$emit('medicineTaken', { 
                            taskType: this.taskType,
                            type: this.type,
                            medicine_list: this.ruleForm.course_id.map(item => { return { id: item } }),
                            po_course_name: this.ruleForm.course_name,
                            name: this.ruleForm.name
                        })
                        this.ruleForm.name = ''
                        this.$refs.DrugSelect.clear()
                        this.$refs.ruleForm.clearValidate()
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
