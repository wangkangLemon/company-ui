<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #task-statistics-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article id="task-statistics-container">
        <article class="search">
            <section>
                <i>任务标题</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>发布对象</i>
                <el-select v-model="fetchParam.type" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="全体员工" value="company"></el-option>
                    <el-option label="指定部门" value="organization"></el-option>
                    <el-option label="指定门店" value="department"></el-option>
                    <el-option label="指定用户组" value="user_group"></el-option>
                    <el-option label="指定员工" value="user"></el-option>
                </el-select>
            </section>
        </article>
        <el-table class="data-table" v-loading="loading" :data="dataList" :fit="true" border>
            <el-table-column prop="title" min-width="200" label="任务标题">
                <template slot-scope="scope">
                    <el-button @click="()=>{$router.push({name: 'server-stat-user', params: {id: scope.row.id}, query: {title: scope.row.title}})}" type="text">{{scope.row.title}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="发布对象" width="150">
                <template slot-scope="scope">
                    {{type[scope.row.type]}}
                </template>
            </el-table-column>
            <el-table-column prop="user_done" width="120" label="完成人数"></el-table-column>
            <el-table-column prop="user_count" label="未完成人数" width="120"></el-table-column>
            <el-table-column prop="create_time_name" label="创建日期" width="180"></el-table-column>
            <el-table-column prop="end_day" label="截止日期" width="180"></el-table-column>
        </el-table>
        <el-pagination class="block"
                       @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                       @current-change="val=> {fetchParam.page=val; fetchData()}"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next" :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import coursetaskService from 'services/server/coursetaskService'
    export default {
        data () {
            return {
                type: {
                    company: '全体员工', 
                    department: '指定门店', 
                    organization: '指定部门',
                    user: '指定员工', 
                    user_group: '指定用户组'
                },
                dataList: [],
                total: 0,
                loading: false,
                fetchParam: {
                    type: '',
                    keyword: '',
                    page: 1,
                    page_size: 15
                }
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created(){
             this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                return coursetaskService.courseTaskStatSearch(this.fetchParam).then((ret) => {
                    this.dataList = ret.data
                    this.total = ret.total
                })
            },
        }
    }
</script>
