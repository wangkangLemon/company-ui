<style lang="scss">
    
</style>

<template>
    <el-dialog 
        :title="title" 
        :visible.sync="showDialog">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px">
            <el-form-item label="产品名称" prop="name">
                <el-input
                    :disabled="view || ruleForm.related_doc_count > 0"
                    v-model="ruleForm.name">
                </el-input>
            </el-form-item>
            <el-form-item label="产品预览" prop="image">
                <UploadImg 
                    :disabled="view"
                    :defaultImg="ruleForm.image | fillImgPath" 
                    :url="imageUploadUrl" 
                    :onSuccess="handleOnUploaded" 
                    @remove="handleOnRemove">
                </UploadImg>
            </el-form-item>
            <el-form-item label="产品简介" prop="description">
                <el-input
                    :disabled="view"
                    type="textarea"
                    v-model="ruleForm.description">
                </el-input>
            </el-form-item>
            <el-form-item label="关联工业" prop="industry_name">
                <el-input
                    :disabled="view"
                    v-model="ruleForm.industry_name">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" v-if="!view">
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="showDialog = false">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import UploadImg from 'components/upload/UploadImg.vue'
    import productService from 'services/product/productService'

    export default {
        components: {
            UploadImg,
        },
        props: {
            visible: Boolean,
            title: String,
            id: Number
        },
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            },
        },
        created () {
            if (this.id) {
                this.getProduct()   
            } else {
                this.ruleForm = initRuleForm()
            }
        },
        data () {
            return {
                view: this.title.indexOf('查看') > -1,
                showDialog: this.visible,
                imageUploadUrl: productService.getImageUrl(),
                ruleForm: initRuleForm(),
                rules: {
                    name: {required: true, message: '请输入名称', trigger: 'blur'},
                    description: {required: true, message: '请输入简介', trigger: 'blur'},
                    industry_name: {required: true, message: '请输入关联工业', trigger: 'blur'},
                }
            }
        },
        methods: {
            getProduct () {
                return productService.getProduct(this.id).then(ret => {
                    this.ruleForm = ret.data
                })
            },
            handleOnUploaded(ret) {
                this.ruleForm.image = ret.data.url
            },
            handleOnRemove () {
                this.ruleForm.image = ''
            },
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // this.$emit('submit', this.ruleForm)
                        let service = this.id ? 'editProduct' : 'createProduct'
                        productService[service]({
                            product_id: this.id,
                            ...this.ruleForm
                        }).then(() => {
                            this.showDialog = false
                            this.$emit('submit')
                        })
                    }
                })
            }
        }
    }
    function initRuleForm () {
        return {
            name: '',
            image: '',
            description: '',
            industry_name: ''
        }
    }
</script>
