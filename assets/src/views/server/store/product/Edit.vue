<template>
    <div>
        <EditForm ref="form" :product="product">
            <el-form-item slot="formFooter">
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button type="primary" @click="$router.go(-1)">取消</el-button>
            </el-form-item>
        </EditForm>
    </div>
</template>
<script>
    import EditForm from './Form.vue'
    import testProductService from 'services/server/store/testProductService'

    export default {
        name: 'score-product-edit',
        components: {EditForm},
        data () {
            return {
                product: {
                    id: '',
                    name: '',
                    image: '',
                    stock:'',
                    score: void 0,
                    category_id: '',
                    category_name: '',
                    description: '',
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        mounted () {
            this.getProductById()
        },
        methods: {
            getProductById () {
                let id = this.$route.params.id
                testProductService.getProductById(id).then((ret) => {
                    this.product = ret.data
                    xmview.setContentLoading(false)
                })
            },
            submitForm () {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        xmview.showTip('error', '您填写的数据不对，请检查红色项')
                        return
                    }
                    this.$refs.form.product.score = parseInt(this.$refs.form.product.score)
                    this.$refs.form.product.product_id = parseInt(this.$refs.form.product.id)
                    console.log(this.$refs.form.product)
                    testProductService.update(this.$refs.form.product.product_id, this.$refs.form.product).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-store-index'})
                    })
                })
            },
        }
    }
</script>
