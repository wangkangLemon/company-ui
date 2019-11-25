<template>
    <div id="product-detail-container">
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">商品名称：</label>
            <div class="el-form-item__content" style="margin-left: 80px;">
                {{product.name}}
            </div>
        </div>
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">商品预览图：</label>
            <div class="el-form-item__content" style="margin-left: 80px;">
                <img :src="product.image | fillImgPath" width="300" height="200"/>
                <input type="hidden" :value="product.image">
            </div>
        </div>
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">当前售价：</label>
            <div class="el-form-item__content" style="margin-left: 80px;">
                {{product.score}} 学分
            </div>
        </div>
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">库存数量：</label>
            <div class="el-form-item__content" style="margin-left: 80px;">
                {{product.stock}}
            </div>
        </div>
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">商品分类：</label>
            <div class="el-form-item__content" style="margin-left: 80px;">
                {{product.category_name}}
            </div>
        </div>
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">创建时间：</label>
            <div class="el-form-item__content" style="margin-left: 80px;">
                {{product.create_time}}
            </div>
        </div>
        <div class="el-form-item">
            <label for="score" class="el-form-item__label" style="width: 150px;">商品简介：</label>
            <div class="el-form-item__content" style="margin-left: 80px;" v-html="product.description">
            </div>
        </div>

        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="6" :offset="5">
                <el-button @click="$router.push({name: 'test-store-edit', params: {id: product.id}})" type="primary">
                    <i>修改商品</i>
                </el-button>
            </el-col>
        </el-row>
      
    </div>
</template>

<script>

    import testProductService from 'services/server/store/testProductService'

    export default{
        filters: {
        },
        data () {
            return {
                product: {}
            }
        },
        created () {
        },
        activated () {
            this.getProductById()
        },
        methods: {
            getProductById () {
                let id = this.$route.params.id
                testProductService.getProductById(id).then((ret) => {
                    this.product = ret.data
                    xmview.setContentLoading(false)
                })
            }
        },
        components: {}
    }
</script>
