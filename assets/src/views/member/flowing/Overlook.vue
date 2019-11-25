<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #member-flowing-overlook-container {
        @extend %content-container;
        .img--preview {
            width: 70%;
            cursor: zoom-in;
        }
    }
</style>

<template>
    <main id="member-flowing-overlook-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <DateRange 
                    title="忽略时间" 
                    :start="fetchParam.start_time" 
                    :end="fetchParam.end_time"
                    v-on:changeStart="val=>{fetchParam.start_time=val}"
                    v-on:changeEnd="val=>{fetchParam.end_time=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <section>
                <i>门店</i>               
                <Department 
                    v-model="fetchParam.department_id"
                    :change="fetchData">
                </Department>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="抓取图像" 
                    width="80">
                    <img slot-scope="{ row }" :src="row.face_url" alt="抓取的图像" @click="preview(row)" class="img--preview">
                </el-table-column>
                <el-table-column 
                    label="性别" 
                    prop="sex" 
                    min-width="80">
                    <span slot-scope="{ row }">{{row.sex === 1 ? '女' : '男'}}</span>
                </el-table-column>
                <el-table-column 
                    label="年龄" 
                    prop="age" 
                    min-width="80">
                </el-table-column>
                <el-table-column 
                    label="门店" 
                    prop="department_name" 
                    min-width="120">
                </el-table-column>
                <el-table-column 
                    label="忽略时间" 
                    prop="create_time"
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    width="80">
                    <el-button slot-scope="{ row }" type='text' @click="activate(row)">激活</el-button>
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
    </main>
</template>

<script>
    import flowingService from 'services/member/flowingService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import Department from 'components/select/Department.vue'
    import ImagePreview from 'components/dialog/ImagePreview.vue'

    export default {
        components: {
            DateRange,
            Department,
            ImagePreview
        },
        props: {},
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                face_url: '',
                showImagePreview: false,
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    department_id: '',
                    start_time: '',
                    end_time: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return flowingService.searchDenied(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            activate (row) {
                this.$confirm('是否确认要将忽略的人员重新激活？', '激活忽略人员', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    xmview.setContentLoading(true)
                    flowingService.activate(row.id).then(() => {
                        xmview.setContentLoading(false)
                        this.fetchData()
                    })
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
