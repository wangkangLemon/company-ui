<template>
    <div>
        <AddForm ref="form" :product="product">
            <el-form-item slot="formFooter">
                <el-button type="primary" @click="submitForm">保存并上线</el-button>
                
                <el-button type="primary" @click="$router.go(-1)">取消</el-button>
            </el-form-item>
        </AddForm>
    </div>
</template>
<script>
    import AddForm from './Form.vue'
    import testProductService from 'services/server/store/testProductService'

    export default {
        name: 'store-product-add',
        components: {AddForm},
        data () {
            return {
                product: {
                    id: '',
                    stock:'',
                    name: '',
                    image: '',
                    score: void 0,
                    category_id: '',
                    category_name: '',
                    description: '',
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
            this.product.stock=''
            this.product.score=''
            this.product.name=''
            this.product.image=''
            this.product.category_id=''
        },
        methods: {
            submitForm () {
                this.$refs['form'].validateForm((pass) => {
                    if (!pass) {
                        xmview.showTip('error', '您填写的数据不对，请检查红色项')
                        return
                    }
                    this.$refs.form.product.score = parseInt(this.$refs.form.product.score)
                    testProductService.create(this.$refs.form.product).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.$router.push({name: 'test-store-index'})
                    })
                })
            },
        }
    }
</script>
