<style lang='scss' rel='stylesheet/scss'>
    #store-product-add {
        width: 630px;
        hr{
            margin-bottom: 15px;
        }
        .multy-choose-item{
            padding: 5px 0;
        }
        .el-button + .el-button{
            margin-left: 0;
        }
        .u-course-tag {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>
<template>
     <article class="store-product-add">
        <el-form ref="form" :rules="rules" :model="product" label-width="100px">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="product.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            
            <el-form-item label="商品预览图" prop="image" style="white-space: nowrap">
                <img :src="product.image | fillImgPath"  width="300" height="200" v-show="product.image" alt="">
                <ImagEcropperInput :isRound="false" :confirmFn="cropperFn" :aspectRatio="aspectRatio"></ImagEcropperInput>
            </el-form-item>
             <el-form-item label="当前售价" prop="score">
                <el-input v-model.number="product.score" placeholder="请输入当前售价">
                    <template slot="append">学分</template>
                </el-input>
            </el-form-item>
            <el-form-item label="库存数量" prop="stock">
                <el-input v-model.number="product.stock" placeholder="请输入库存数量">
                </el-input>
            </el-form-item>
            <el-form-item label="商品分类"  prop="category_id">
                <SelectScroll :requestCb="fetchCategory" v-model="product.category_id" :changeCb="changeCategory" ref="selectScroll" :placeholder="product.category_name"></SelectScroll>
            </el-form-item>
            <el-form-item label="商品简介" id="editor">
                <vue-editor v-model="product.description" @ready="ueReady"></vue-editor>
            </el-form-item>
            <slot name="formFooter"></slot>
        </el-form>
        
    </article>
</template>

<script>
    import VueEditor from '../../../component/form/UEditor.vue'
    import SelectScroll from '../../../component/form/SelectScroll.vue'
    import testProductService from 'services/server/store/testProductService'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import testCategoryService from 'services/server/store/testCategoryService'

    export default{
        props: {
            product: {},
            aspectRatio: {
                type: Number,
                default: 3 / 2
            }
        },
        activated () {
            // this.fetchCategory()
        },
        data () {
            return {
                editor: null,
                categroyArr: {},
                rules: {
                    name: [
                        { required: true, message: '必须填写商品名称', trigger: 'blur' }
                    ],
                    image: [
                        { required: true, message: '请上传图片', trigger: 'change' }
                    ],
                    score: [
                        { type: 'number', required: true, message: '请填写售价', trigger: 'blur' },
                        { type: 'number', min: 0, message: '请输入正整数', trigger: 'blur' },
                    ],
                    category_id: [
                        { type: 'number', required: true, message: '请选择商品分类', trigger: 'change' }
                    ],
                    stock: [
                        { type: 'number', required: true, message: '请输入库存数量', trigger: 'blur' }
                    ]
                },
                submitLoading: false
            }
        },
        methods: {
            // 验证表单
            validateForm (func) {
                return this.$refs['form'].validate(func)
            },
            // 获取分类
            fetchCategory (keyword, length) {
                debugger
                if (!length) {
                    length = 1
                }
                let page = parseInt(length / 10) + 1
                return testCategoryService.search({keyword, page}).then((ret) => {
                    let result = {
                        data: [],
                        total: ret.total
                    }
                    if (ret.data == null) {
                        ret.data = []
                    }
                    ret.data.forEach((value) => {
                        result.data.push({
                            id: value.id,
                            name: value.name,
                        })
                    })

                    return result
                })
            },
            changeCategory (val) {
                this.product.category_id = val
            },
            cropperFn (data, ext) {
                testProductService.getUploadUrl({
                    image: data,
                    alias: Date.now() + ext
                }).then((ret) => {
                    this.product.image = ret.url
                })
            },
            ueReady (ue) {
                this.editor = ue
            }
        },
        components: {
            VueEditor,
            SelectScroll,
            ImagEcropperInput},
    }
</script>
