<style lang="scss">
@import "../../utils/mixins/common";
@import "../../utils/mixins/topSearch";
#score-container {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
    .top-btn {
        @extend %right-top-btnContainer;
    }

    .block {
        float: right;
        margin-top: 15px;
    }
}
</style>
<template>
    <article id="score-container">
        <el-button class="top-btn" icon="el-icon-document" type='warning'>导出</el-button>
        <article class="search">
            <section>
                <i>类型</i>
                <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="公开课" value="public"></el-option>
                    <el-option label="私有课" value="private"></el-option>
                    <el-option label="工业课" value="industry"></el-option>
                </el-select>
            </section>
            <section>
                <i>课程</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>门店</i>
                <el-select v-model="fetchParam.status" placeholder="请选择" @change="fetchData" :clearable="true">
                    <el-option v-for="item in options" label="item.name" value="item.value" :key="item.value"></el-option>
                </el-select>
            </section>
            <section>
                <i>姓名</i>
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
        </article>
    
        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
            <el-table-column min-width="300" label="课程">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.enterprise_id == 1">公开</el-tag>
                    <el-tag v-else-if="scope.row.enterprise_id == scope.row.store_id">内训</el-tag>
                    <el-tag type="warning" v-else>工业</el-tag>
                    <i>{{scope.row.course_name}}</i>
                </template>
            </el-table-column>
            <el-table-column prop="user_name" label="姓名" width="150">
            </el-table-column>
            <el-table-column prop="dep_name" width="330" label="所属门店">
            </el-table-column>
            <el-table-column prop="" label="职位" min-width="180">
            </el-table-column>
            <el-table-column prop="" label="学习进度" min-width="180">
            </el-table-column>
            <el-table-column prop="" label="考试次数" min-width="180">
            </el-table-column>
            <el-table-column width="80" prop="score" label="分数">
            </el-table-column>
            <el-table-column width="100" label="成绩">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.grade == 1" type="success">满分</el-tag>
                    <el-tag v-else-if="scope.row.grade == 2">及格</el-tag>
                    <el-tag v-else type="danger">不及格</el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="190" prop="create_time_name" label="最后考试时间">
            </el-table-column>
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
export default {
    data () {
        return {
            data: [],
            options: [{ value: '10', name: '大商店' }],
            loadingData: [],
            total: 0,
            fetchParam: {
                loadingData: false,
                status: '',
                keyword: '',
                name: '',
                page: 0,
                page_size: 0
            }
        }
    },
    methods: {
        fetchData () {
        },
    }
}
</script>
