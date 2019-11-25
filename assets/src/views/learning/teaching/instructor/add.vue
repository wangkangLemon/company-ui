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
                <i>门店</i>
                <el-select v-model="fetchParam.organization_id" placeholder="请选择" filterable @change="fetchData" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                   </el-option>
                  </el-select>
            </section>
            <section>
                 <el-input
                   placeholder="搜索员工姓名，手机号"
                   suffix-icon="el-icon-search"
                   @keyup.enter.native="fetchData"
                   v-model="fetchParam.keyword">
                 </el-input>
            </section>
            
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="ID" 
                    prop="id" 
                    width="200">
                </el-table-column>
                <el-table-column 
                    label="员工姓名" 
                    prop="name" 
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="dep_name"
                    min-width="150"
                    label="所属门店">
                </el-table-column>
                <el-table-column 
                    label="工号" 
                    prop="staff_id" 
                    min-width="100">
                </el-table-column>
                <el-table-column 
                    label="手机号" 
                    prop="mobile" 
                    width="300">
                </el-table-column>
                <el-table-column 
                    label="职位" 
                    prop="job" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="180" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="add(row)">
                            指定教员
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
   
    import teachingService from 'services/learning/teaching'
    import userService from 'services/company/userService'
    import organizationService from 'services/company/organizationService'
    import departmentService from 'services/company/departmentService'
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
                disabled:true,
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_activity: 0,
                    keyword: '',
                    page: 1,
                    page_size: 15,
                    organization_id: '',
                    
                },
                departmentData:{
                    department_id: '',
                    page: 1,
                    page_size:999999999,
                    isdep:1
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return organizationService.getOrganizationUser(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            getDeparment(){
                return departmentService.departmentSearch(this.departmentData).then((ret) => {
                   this.options=ret.data
                }).then(() => {
                    this.loading = false
                })
            },
            add (row) {
                console.log(row)
                return teachingService.creatTeacher(row.id).then(ret=>{
                   this.$message({
                   message: '恭喜你，这是一条成功消息',
                   type: 'success'
                })
                    this.$router.push({path:'/teaching/instructor'})
                })
              
            },
            
        },
        directives: {},
    }
</script>
