<style lang="scss">
    
</style>

<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="栏目名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="栏目logo" prop="image">
            <UploadImg 
                :defaultImg="ruleForm.image | fillImgPath" 
                :url="uploadImgUrl"
                :on-success="handleOnUploaded">
            </UploadImg>
        </el-form-item>
        <el-form-item label="栏目排序" prop="sort">
            <el-input v-model="ruleForm.sort" placeholder="最大的排在前面"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')">{{comfirmTxt}}</el-button>
            <el-button v-if="cancelBtn" @click="onCancel()">{{cancelBtn}}</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import UploadImg from 'components/upload/UploadImg.vue'
    import categoryService from 'services/course/categoryService'
    export default {
        components: {
            UploadImg,
        },
        props: {
            formData: Object,
            cancelBtn: [Boolean, String],
            comfirmTxt: String
        },
        data () {
            return {
                ruleForm: this.formData,
                rules: {
                    name: [
                        { require: true, message: '请输入栏目名称', trigger: 'blur' }
                    ],
                    image: [
                        { require: true, message: '请上传栏目logo', trigger: 'change' }
                    ]
                },
                uploadImgUrl: categoryService.uploadCategoryImg()
            }
        },
        // watch: {
        //     formData (val) {
        //         this.ruleForm = val
        //     }
        // },
        methods: {
            // 处理图片上传完毕
            handleOnUploaded (ret) {
                this.ruleForm.image = ret.data.url
            },
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', this.ruleForm)
                    } else {
                        return false
                    }
                })
            },
            onCancel () {
                this.$emit('cancel')
            }
        },
    }
</script>
