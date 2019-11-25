<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-orderdetail-container {
        @extend %content-container;
        .order {        
            .el-collapse-item__header {
                background: #dadada;    
                padding-left: 1.5em;        
                font-size: 14px;
            }
            .box-header {
                .card-header + .card-header {
                    margin-left: 2em;
                }
            }
        }
        .order + .order {
            margin-top: 1em;
        }
    }
</style>

<template>
    <main id="member-orderdetail-container">
        <el-collapse v-model="activeNames">
            <el-collapse-item class="order" v-for="order in data" :key="order.id" name="1">
                <template slot="title">
                    <section class="box-header">
                        <span class="card-header"><b>订单时间：</b>{{order.create_time || order.created_at}}</span>
                        <span class="card-header"><b>订单编号：</b>{{order.num}}</span>
                        <span class="card-header"><b>总价：</b>¥{{order.real_money}}</span>
                    </section>
                </template>
                <el-card class="box-card" v-for="item in order.medicines" :key="item.id">
                    <el-form>
                        <el-form-item label="药品：">{{item.name}}</el-form-item>
                        <el-form-item label="数量：">{{item.count}}</el-form-item>
                        <el-form-item label="单位：">{{item.unit}}</el-form-item>
                        <el-form-item label="规格：">{{item.dosage}}</el-form-item>
                        <el-form-item label="生产厂家：">{{item.factory}}</el-form-item>
                        <el-form-item label="价格：">¥{{item.real_money}}</el-form-item>
                    </el-form>
                </el-card>
            </el-collapse-item>
        </el-collapse>
    </main>
</template>

<script>
    export default {
        components: {},
        props: {
            data: Array
        },
        activated () {},
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                activeNames: ['1']
            }
        },
        methods: {
        },
        filters: {},
        directives: {},
    }
</script>
