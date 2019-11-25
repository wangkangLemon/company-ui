<!--课程列表-->
<style lang='scss' rel='stylesheet/scss'>
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";

#newcourse-course-public-container {
  @extend %content-container;

  .manage-container {
    .el-dropdown {
      margin-right: 10px;
    }
    @extend %right-top-btnContainer;
    > * {
      color: #fff;
      border-radius: 5px;
    } // 添加课程
    .add {
      background: rgb(0, 204, 255);
    } // 管理栏目
    .catmange {
      background: rgb(153, 102, 204);
    }
  }

  .search {
    @extend %top-search-container;
  } // 底部的管理按钮
  .bottom-manage {
    margin-top: 15px;
  }

  .el-dialog__wrapper {
    padding-top: 15px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}
</style>

<template>
  <main id="newcourse-course-public-container">
    <section class="manage-container">
      <!-- <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({name: 'newcourse-course-add',query:{course_type:'teaching'}})"
        v-operation="auth.com_course_create"
      >
        <i>新建</i>
      </el-button>-->
    </section>

    <main class="search">
      <section>
        <i>名称</i>
        <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
      </section>
      <section>
        <i>选择状态</i>
        <el-select
          v-model="fetchParam.online_type"
          clearable
          filterable
          placeholder="请选择"
          @change="fetchData"
        >
          <el-option label="线下" :value="1"></el-option>
          <el-option label="线上" :value="2"></el-option>
        </el-select>
      </section>
      <!-- <DateRange
        title="活动日期"
        :start="fetchParam.time_start"
        :end="fetchParam.time_end"
        @changeStart="val=> {fetchParam.time_start=val}"
        @changeEnd="val=> {fetchParam.time_end=val}"
        :change="fetchData"
      ></DateRange>-->
    </main>
    <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
      <el-table-column width="100" prop="id" label="ID"></el-table-column>
      <el-table-column width="300" prop="create_time_name" label="创建时间"></el-table-column>
      <el-table-column width="300" prop="title" label="活动名称"></el-table-column>
      <el-table-column width="150" prop="sdate" label="活动日期"></el-table-column>
      <el-table-column width="100" prop="start_time" label="开始时间"></el-table-column>
      <el-table-column width="100" prop="end_time" label="结束时间"></el-table-column>
      <el-table-column width="100" prop="online_type" label="类型">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.online_type==2">线上</el-tag>
          <el-tag type="danger" v-else-if="scope.row.online_type==1">线下</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150" label="签到(有效/总数)">
        <template slot-scope="scope">
          <span>{{scope.row.user_sign_in}}/{{scope.row.user_total}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="签退(有效/总数)">
        <template slot-scope="scope">
          <span>{{scope.row.user_sign_out}}/{{scope.row.user_total}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看清单</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <!-- <el-button @click="deleted(scope.row)" type="text" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="fetchParam.page"
      :page-size="fetchParam.page_size"
      :page-sizes="[15, 30, 60, 100]"
      layout="sizes,total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </main>
</template>

<script>
import DateRange from "components/form/DateRangePicker.vue";
import CheckInActivity from "../../services/checkInActivity";
function getFetchParam() {
  return {
    keyword: "",
    page: 1,
    page_size: 15,
    online_type: "",
    signin_type: ""
  };
}
export default {
  data() {
    return {
      newData:[],
      loadingData: false,
      fetchParam: getFetchParam(),
      data: [],
      total: 0
    };
  },
  created() {
    xmview.setContentLoading(false);
    this.fetchData();
  },
  activated() {},
  methods: {
    edit(row) {
      this.$router.push({
        name: "activity-edit",
        query: {
          id: row.id
        }
      });
    },
    deleted(row) {
      console.log(111);
      return CheckInActivity.deleteActivity(row.id).then(res => {
        if (res.code == 0) {
          xmview.showTip("success", "删除成功");
          this.fetchData();
        }
      });
    },
    handleCurrentChange(val) {
      this.fetchParam.page = val;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.fetchParam.page_size = val;
      this.fetchData();
    },
    handleClick(row) {
      this.$router.push({
        name: "signIn",
        query: {
          id: row.id
        }
      });
    },
    fetchData(val) {
      return CheckInActivity.activityList(this.fetchParam).then(res => {
        this.newData=[]
        res.data.forEach(item => {
          let newSdate=item.sdate.slice(0,10)
          this.newData.push({
            address: item.address,
            company_id: item.company_id,
            create_time_name:item.create_time_name,
            create_time_unix: item.create_time_unix,
            end_time:item.end_time,
            id:item.id,
            intr:item.intr,
            online_type: item.online_type,
            sdate:newSdate,
            signin_range: item.signin_range,
            signin_type: item.signin_type,
            signin_x: item.signin_x,
            signin_y: item.signin_y,
            start_time: item.start_time,
            teacher: item.teacher,
            title: item.title,
            update_time_name: item.update_time_name,
            update_time_unix: item.update_time_unix,
            user_id: item.user_id,
            user_sign_in: item.user_sign_in,
            user_sign_out: item.user_sign_out,
            user_total: item.user_total
          });
        });
        this.data =this.newData;
        this.total = res.total;
      });
    }
  },
  components: { DateRange }
};
</script>
