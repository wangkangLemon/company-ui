<style lang="scss">
    #teaching-templatelist-container {
        .info {
            margin-right: 20px;
        }
    }
</style>

<template>
    <main id="teaching-templatelist-container">
        <section v-loading="loading">
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
<!--             <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="周期数" 
                    prop="total_phase">
                </el-table-column>
                <el-table-column 
                    label="周期类型" 
                    prop="phase_unit">
                </el-table-column>
                <el-table-column 
                    label="任务数"
                    prop="total_object">
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination> -->
            <span class="info">周期数: {{data.total_phase}}</span>
            <span class="info">周期类型: {{data.phase_unit}}</span>
            <span>任务数: {{data.total_object}}</span>
        </section>
    </main>
</template>

<script>
    import teachingService from 'services/learning/teaching'

    export default {
        components: {},
        props: {
            templateId: Number,
        },
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        destroyed () {
            this.fetchParam.page = 1
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return teachingService.viewTeachingTemp(this.templateId).then(ret => {
                    this.data = ret.data
                    this.loading = false
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
