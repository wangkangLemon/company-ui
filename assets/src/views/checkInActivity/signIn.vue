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
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="exports"
        v-operation="auth.com_course_create"
      >
        <i>导出</i>
      </el-button>
    </section>

    <main class="search">
      <section>
        <i>员工姓名</i>
        <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
      </section>
      <section>
        <i>门店名称</i>
        <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
      </section>
      <section>
        <i>签到状态</i>
        <el-select v-model="fetchParam.signin_effective"  placeholder="请选择状态"  @change="fetchData">
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </section>
      <section>
        <i>签退状态</i>
        <el-select v-model="fetchParam.signback_effective"  placeholder="请选择状态"  @change="fetchData">
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </section>
    </main>
    <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
      <el-table-column width="300" prop="name" label="姓名"></el-table-column>
      <el-table-column width="300" prop="com_name" label="连锁"></el-table-column>
      <el-table-column width="300" prop="dep_name" label="门店"></el-table-column>
      <el-table-column width="150" prop="signin_time_name" label="签到时间"></el-table-column>
      <el-table-column width="150" prop="signin_distance" label="签到位置(米)"></el-table-column>
      <el-table-column width="200" prop="signback_time_name" label="签退时间"></el-table-column>
      <el-table-column width="150" prop="signback_distance" label="签退位置(米)"></el-table-column>
      <el-table-column min-width="150" label="状态">
        <template slot-scope="scope">
           <el-tag type="success" v-if="scope.row.signin_effective==1 && scope.row.signback_effective==1">正常</el-tag>
           <el-tag type="danger" v-else>异常</el-tag>
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
import DepSelect from "components/select/Department.vue";
import DateRange from "components/form/DateRangePicker.vue";
import CheckInActivity from "../../services/checkInActivity";
import config from "../../utils/config";
import authUtils from "../../utils/authUtils";
function getFetchParam() {
  return {
    department_id: "",
    keyword: "",
    activity_id: "",
    sign_type: "",
    effective: "",
    page: 1,
    page_size: 15,
    signin_effective:'-1',
    signback_effective:'-1',

  };
}
export default {
  data() {
    return {
      token: "",
      loadingData: false,
      fetchParam: getFetchParam(),
      data: [],
      total: 0,
      derparmentId: "",
     
      status: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "0",
          label: "异常"
        },
        {
          value:'-1',
          label:'全部'
        }
      ]
    };
  },
  created() {
    this.fetchParam.activity_id=this.$route.query.id
    this.token = authUtils.getAuthToken();
    xmview.setContentLoading(false);
    this.fetchData();
  },
  activated() {},
  methods: {
    exports() {
    const url=`${config.apiHost}/com/${authUtils.getUserInfo().company_id}/activity/signin/lists?`
     const urlPre =`${url}_export=1&activity_id=${this.fetchParam.activity_id}&keyword=${this.fetchParam.keyword}&department_id=${this.fetchParam.department_id}&signin_effective=${this.fetchParam.signin_effective}&signback_effective=${this.fetchParam.signback_effective}&token=${this.token}`
     window.location.href=urlPre
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
      console.log(row);
    },
    fetchData(val) {
      if(val=='signin'){
        this.signin_effective
      }
      return CheckInActivity.signinList(this.fetchParam).then(res => {
        console.log(res.data);
        this.data = res.data;
        this.total = res.total;
      });
    }
  },
  components: { DateRange, DepSelect }
};
</script>
