<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    @import "~utils/mixins/mixins";
    #flowingcount-container {
        @include clearFloatByAfter;
        .img--preview {
            width: 70%;
            cursor: zoom-in;
        }
    }
</style>

<template>
    <el-dialog 
        :title="title" 
        :visible.sync="showDialog">
        <!-- 内容主体 -->
        <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
        <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
        <!-- 固定列通过配置fixed="right || left"-->
        <section id="flowingcount-container">
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="抓取图像" 
                    width="80">
                    <img slot-scope="{ row }" :src="row.face_url" alt="抓取的图像" @click="preview(row)" class="img--preview">
                </el-table-column>
                <el-table-column 
                    label="进店时间" 
                    prop="create_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="门店" 
                    prop="department_name"
                    min-width="80">
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
            </el-pagination>
        </section>
        <ImagePreview v-model="showImagePreview" :url="face_url" :needFillPath="false"></ImagePreview>
    </el-dialog>
</template>

<script>
    import flowingService from 'services/member/flowingService'
    import ImagePreview from 'components/dialog/ImagePreview.vue'

    export default {
        components: {
            ImagePreview
        },
        props: {
            visible: Boolean,
            title: {
                type: String,
                default: '进店详情',
            },
            id: Number
        },
        activated () {},
        created () {},
        mounted () {},
        computed: {},
        watch: {
            id (val) {
                this.fetchData()
            },
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                face_url: '',
                showImagePreview: false,
                loading: false,
                showDialog: this.visible,
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
                return flowingService.getFlowingDetail(this.id).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            preview (row) {
                this.face_url = row.face_url
                this.showImagePreview = true
            }
        },
        filters: {},
        directives: {},
    }
</script>
