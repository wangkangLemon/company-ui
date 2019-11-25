<!--详情统计-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/common";

    #speaking-details-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article id="speaking-details-container">
        <section class="search">
            <i>姓名</i>
            <el-input @keyup.enter.native="fetchData" v-model="fetchParam.name" auto-complete="off"></el-input>
        </section>
        <section>
            <i>分数</i>
            <el-select clearable v-model="fetchParam.status" @change="fetchData">
                <el-option label="满分" value="0"></el-option>
                <el-option label="未满分" value="1"></el-option>
            </el-select>
        </section>
        <section>
            <i>门店</i>
            <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
        </section>
        <DateRange title="练习时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                   @changeStart="val=> fetchParam.time_start=val " @changeEnd="val=> fetchParam.time_end=val"
                   :change="fetchData">
        </DateRange>

        </section>
        <el-table
                v-loading="loading"
                border
                :data="dataList"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="title"
                    label="标题">
            </el-table-column>
            <el-table-column
                    prop="content"
                    min-width='200'
                    label="内容">
            </el-table-column>
            <el-table-column
                    prop="price_enabled"
                    width="180"
                    label="分数">
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    width="180"
                    label="员工录音">
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    width="180"
                    label="练习时间">
            </el-table-column>

        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </article>
</template>
<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import DepSelect from '../../component/select/Department.vue'

    export default {
        data () {
            return {
                fetchParam: {
                    page: 1,
                    page_size: 15,
                    keyword: '',
                    type: '',
                    time_start: '',
                    time_end: '',
                },
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            fetchData () {

            },
            handleSizeChange (val) {
                this.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                this.page = val
                this.fetchData()
            },
        },
        components: {
            DateRange,
            DepSelect,
        },
    }
</script>
