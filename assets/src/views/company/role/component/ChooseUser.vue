<!--选择员工-->
<style lang="scss">
    @import "~utils/mixins/topSearch";
    .search {
        @extend %top-search-container;
    }
    .choose-users {
        .block {
            text-align: center !important;
            width: 50%;
            margin: 0 auto;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article>
        <el-dialog class="choose-users main-container" title="选取员工" :visible.sync="curValue">
            <section class="search">
                <section>
                    <i>名称</i>
                    <el-input @keyup.enter.native="getUsers" v-model="search.name"></el-input>
                </section>
                <section>
                    <i>门店</i>
                    <Department v-model="search.department_id" :change="()=>{page=1;getUsers();}"></Department>
                </section>
            </section>
            <el-table v-loading="loading" border :data="data" :highlight-current-row="true">
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column
                    prop="staff_id"
                    label="工号"
                    width="93">
                </el-table-column>
                <el-table-column prop="dep_name" label="所属门店" width="200"></el-table-column>
                <el-table-column prop="mobile" label="手机号" width="200"></el-table-column>
                <el-table-column prop="operate" label="类型" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="courseConfirm(scope.row)">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="(val)=>{page_size=val;getUsers()}"
                        @current-change="(val)=>{page=val;getUsers()}"
                        :total="total"
                        :current-page="page"
                        :page-size="page_size"
                        :page-sizes="[10, 15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next">
                </el-pagination>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import userService from 'services/company/userService'
    import Department from '../../../component/select/Department.vue'
    export default {
        props: ['value'],
        components: {
            Department
        },
        data () {
            return {
                curValue: this.value,
                loading: false,
                search: {
                    name: '',
                    department_id: ''
                },
                data: [],
                page: 1,
                page_size: 10,
                total: 0,
            }
        },
        watch: {
            value (val) {
                this.curValue = val
            },
            curValue (val) {
                this.curValue = val
                this.$emit('input', val)
            }
        },
        created () {
            this.getUsers()
        },
        methods: {
            courseConfirm (item) {
                this.$emit('result', item)
            },
            getUsers () {
                this.loading = true
                // 获取课程数据
                return userService.userSearch({
                    // is_activity: 1,
                    name: this.search.name,
                    department_id: this.search.department_id,
                    page: this.page,
                    page_size: this.page_size
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
        }
    }
</script>
