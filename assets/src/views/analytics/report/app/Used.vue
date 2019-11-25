<style scoped lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
#analytics-report-app-used-container {
    @extend %content-container;
    .block {
        float: right;
        margin-top: 15px;
    }
    .export-btn{
        float:right;
        margin-top: -65px;
    }
}
</style>
<template>
    <main id="analytics-report-app-used-container">
        <el-button class="export-btn" type='warning' icon="el-icon-document" @click="fileExport">导出Excel</el-button>
        <el-form :inline="true" :model="fetchParam">
            <el-form-item label="员工姓名：">
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </el-form-item>
            <el-form-item label="员工工号：" @keyup.enter.native="fetchData">
                <el-input v-model="fetchParam.staff_id"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" @keyup.enter.native="fetchData">
                <el-input v-model="fetchParam.mobile"></el-input>
            </el-form-item>
            <el-form-item label="所属门店：">
                <department
                        v-model="fetchParam.department_id"
                        :change="fetchData">
                </department>
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="primary" @click="fetchData">查询</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="data" border v-loading="loading" :fit="true">
            <el-table-column
                    prop="name"
                    label="员工姓名">
            </el-table-column>
            <el-table-column
                    prop="staff_id"
                    label="员工工号">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    label="所属门店">
            </el-table-column>
            <el-table-column
                    prop="device"
                    label="APP启动设备">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="sizes, total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </main>

</template>
<script>
    import Department from 'components/select/Department'
    import reportService from 'services/analytics/reportService'
    export default {
        components: {
            Department
        },
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    is_used: 1,
                    is_export: 0,
                    name: '',
                    staff_id: '',
                    mobile: '',
                    create_date: '',
                    department_id: null,
                    page: 1,
                    page_size: 15,
                }
            }
        },
        created () {
            xmview.setContentTitle(this.$route.meta.title + '-' + this.$route.query.date)
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.is_export = 0
                this.fetchParam.create_date = this.$route.query.date
                return reportService.searchAppUser(this.fetchParam).then(ret => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            fileExport () {
                this.fetchParam.is_export = 1
                return reportService.searchAppUser(this.fetchParam).then(ret => {
                    xmview.showExportTip((id) => {
                        id.onclick = () => {
                            this.$router.push({name:'analytics-export'})
                        }
                    })
                })
            }
        }
    }
</script>
