<template>
    <article id="user-container">
        <el-form :inline="true" :model="fetchParam" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="fetchParam.mobile" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="门店">
                <department v-model="fetchParam.department_id" @change="fetchData"></department>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="fetchData">查询</el-button> -->
            </el-form-item>
        </el-form>
        <el-table
                border
                stripe
                :data="data">
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机">
            </el-table-column>
            <el-table-column
                    prop="staff_id"
                    label="工号">
            </el-table-column>
            <el-table-column
                    prop="job"
                    label="职位">
            </el-table-column>
            <el-table-column
                    prop="dep_name"
                    label="门店">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    width="100"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               size="small"
                               @click="$router.push({name: 'gsp-testing', params: {id: scope.row.id}, query: {name: scope.row.name}})">考试记录</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row :gutter="20" class="utils-top-15">
            <el-col :span="12" :offset="12">
                <el-pagination
                        style="text-align: right"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="sizes,total, prev, pager, next"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        :total="fetchParam.page_total">
                </el-pagination>
            </el-col>
        </el-row>
    </article>
</template>

<script>
    import userService from '@/services/company/userService'
    import Department from '@/views/component/select/Department.vue'

    export default {
        components: {Department},
        name: "user",
        data () {
            return {
                fetchParam: {
                    name: '',
                    mobile: '',
                    department_id: void 0,
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                },
                data: [],
            }
        },
        created() {
            this.fetchData()
        },
        methods: {
            fetchData () {
                userService.userSearch(this.fetchParam).then((ret) => {
                    xmview.setContentLoading(false)

                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page !== val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
        }
    }
</script>

<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/common";

    #user-container {
        @extend %content-container;
    }

</style>