<!--药我说统计-->
<style lang="scss" rel='stylesheet/scss'>
    @import "~utils/mixins/topSearch";
    @import "~utils/mixins/common";
    #speaking-stat-container {
       @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <article id="speaking-stat-container">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @keyup.enter.native="fetchData" v-model="fetchParam.keyword" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>发布者</i>
                    <el-select v-model="fetchParam.sender_type" clearable  @change="fetchData">
                        <el-option label="系统" value="system"></el-option>
                        <el-option label="企业" value="company"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>发布对象</i>
                    <el-select clearable v-model="fetchParam.send_range" @change="fetchData">
                        <el-option label="系统药我说" value="system"></el-option>
                        <el-option label="全体员工" value="company"></el-option>
                        <el-option label="指定部门" value="organization"></el-option>
                        <el-option label="指定门店" value="department"></el-option>
                        <el-option label="指定用户组" value="user_group"></el-option>
                        <el-option label="指定员工" value="user"></el-option>
                    </el-select>
                </section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.start_time" 
                    :end="fetchParam.end_time"
                    v-on:changeStart="val=> {fetchParam.start_time=val}"
                    v-on:changeEnd="val=> {fetchParam.end_time=val}"
                    :change="fetchData">
                </DateRange>
                <el-button class="top-btn" type="warning" icon="el-icon-document" @click="fileExport">导出Excel</el-button>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="data"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="title"
                        label="标题"
                        min-width="150">
                </el-table-column>
                <el-table-column
                    prop="send_type"
                    width="120"
                    label="发布者">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.sender_type == 'system'">系统</el-tag>
                        <el-tag type="primary" v-if="scope.row.sender_type == 'company'">企业</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="send_range"
                    width="120"
                    label="发布对象">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.send_range == 'company'">全体员工</el-tag>
                        <el-tag type="primary" v-if="scope.row.send_range == 'department'">指定门店</el-tag>
                        <el-tag type="primary" v-if="scope.row.send_range == 'organization'">指定部门</el-tag>
                        <el-tag type="primary" v-if="scope.row.send_range == 'user'">指定员工</el-tag>
                        <el-tag type="primary" v-if="scope.row.send_range == 'user_group'">指定用户组</el-tag>
                        <el-tag type="error" v-if="scope.row.send_range == 'system'">系统药我说</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="num1"
                    width="180"
                    label="练习人数">
                </el-table-column>
                <el-table-column
                    prop="num2"
                    width="180"
                    label="未练习人数">
                </el-table-column>
                <el-table-column
                    prop="num3"
                    width="180"
                    label="已练习次数">
                </el-table-column>
                <el-table-column
                    prop="num4"
                    width="180"
                    label="过关分数">
                </el-table-column>
                <el-table-column
                    prop="num5"
                    width="180"
                    label="过关人数">
                </el-table-column>
                <el-table-column
                    width="180"
                    label="过关率">
                    <template slot-scope="scope">
                        <span v-if="scope.row.num5">{{(scope.row.num5 / scope.row.num1 * 100).toFixed(2)}}%</span>
                        <span v-else>0%</span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="170"
                    prop="create_time"
                    label="创建时间">
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="sizes, total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
    </article>
</template>

<script>

import speakingService from 'services/server/speakingService'
import DateRange from 'components/form/DateRangePicker.vue'

export default {
    components: {
        DateRange,
    },
    data () {
        return {
            loading: false,
            total: 0,
            data: [],
            fetchParam: {
                keyword: '',
                send_range: '',
                sender_type: '',
                start_time: '',
                end_time: '',
                page: 1,
                page_size: 15,
            }
        }
    },
    activated () {
        this.fetchData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        fetchData () {
            this.loading = true
            return speakingService.getSpeakingStat(this.fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
                this.loading = false
            })
        },
        handleSizeChange (val) {
            this.fetchParam.page_size = val
            this.fetchData()
        },
        handleCurrentChange (val) {
            this.fetchParam.page = val
            this.fetchData()
        },
        fileExport () {
            speakingService.fileExport(this.fetchParam).then((ret) => {
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
