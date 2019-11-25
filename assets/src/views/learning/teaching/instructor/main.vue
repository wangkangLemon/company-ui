<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #teaching-template-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
        .btn-disabled {
            cursor: not-allowed;
            color: #c0c4cc;
        }
    }
</style>

<template>
    <main id="teaching-template-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>教员名称</i>
                <el-input
                    v-model="fetchParam.keyword"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>门店</i>
                <el-select v-model="fetchParam.department_id" placeholder="请选择" filterable @change="fetchData" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                   </el-option>
                  </el-select>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="$router.push({path: '/teaching/instructor/add'})"
                >
                添加教员
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="ID" 
                    prop="tid" 
                   min-width="250">
                </el-table-column>
                <el-table-column 
                    label="教员名称" 
                    prop="name" 
                    min-width="450">
                </el-table-column>
                <!-- <el-table-column 
                    label="创建时间" 
                    prop="create_time_name" 
                    width="570">
                </el-table-column> -->
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                   min-width="180" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="del(row)">
                            删除
                        </el-button>
                    </template>
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
    </main>
</template>

<script>
    import departmentService from 'services/company/departmentService'
    import teachingService from 'services/learning/teaching'

    export default {
        components: {
           
        },
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {
            this.getDeparment()
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                 options:[],
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    name:'',
                    title: '',
                    status: '',
                    create_start_time: '',
                    create_end_time: '',
                    page: 1,
                    page_size: 15,
                    keyword:'',
                    department_id:''
                },
                template: {
                    showDialog: false,
                },
                teachingRule: {
                    id: '',
                    showDialog: false,
                    type: ''
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return teachingService.getTeachingUserList(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            getDeparment(){
                return departmentService.departmentSearch(this.fetchParam).then((ret) => {
                   this.options=ret.data
                }).then(() => {
                    this.loading = false
                })
            },
            viewTeachingRule (row, type) {
                this.teachingRule.showDialog = true
                this.teachingRule.id = row.id
                this.teachingRule.type = type
            },
            del (row) {
                this.$confirm(`是否确认删除【${row.name}】为教员身份`, '提示', { 
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    teachingService.delTeacher(row.tid).then(() => {
                        this.fetchData()
                    })
                })
            }
        }
    }
</script>
