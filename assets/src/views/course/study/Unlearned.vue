<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/common";
    #course-highest-container {
        @extend %content-container; // 导出按钮
        position:relative;
        .export {
            position: absolute;
            right: 5px;
            top: -10px;
            i {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .note {
            margin-bottom: 10px;
            color: #F7BA2A;
        }
        .search {
            @extend %top-search-container
        }
        .pagin {
            float: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article id="course-highest-container">
        <main class="search">
            <section>
                <i>姓名</i>
                <el-input placeholder="填写姓名" v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>手机号</i>
                <el-input placeholder="填写手机号" v-model="fetchParam.mobile" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>所属门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </section>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
            <el-table-column prop="name" min-width="100" label="员工姓名">
            </el-table-column>
            <el-table-column
                prop="staff_id"
                label="工号"
                width="93">
            </el-table-column>
            <el-table-column prop="job" label="职位" min-width="150">
            </el-table-column>
            <el-table-column prop="mobile" width="125" label="手机号">
            </el-table-column>
            <el-table-column prop="dep_name" min-width="100" label="所属门店">
            </el-table-column>
            <el-table-column prop="last_login_time_name" width="170" label="最后使用时间">
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="fetchParam.page" 
            :page-size="fetchParam.page_size" 
            :page-sizes="[15, 30, 60, 100]" 
            layout="sizes,total, prev, pager, next" :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import testingService from 'services/course/testingService'
    import DepSelect from 'components/select/Department.vue'

    export default {
        components: {
            DepSelect,
        },
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    name: '',
                    mobile: '',
                    department_id: '',
                    page: 1,
                    page_size: 15
                },
            }
        },
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData () {
                this.loadingData = true
                return testingService.getUnlearnedList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
        },
    }
</script>
