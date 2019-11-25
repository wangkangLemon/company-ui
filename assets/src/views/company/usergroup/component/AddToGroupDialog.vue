<style lang="scss" scoped>
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";
// .el-dialog__wrapper .el-dialog__body {
//     padding: 30px 20px 0 20px;
// }
#creategroupdialog-container {
  @extend %content-container;
  .search {
    @extend %top-search-container;
    .el-input {
      float: initial;
    }
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
  <el-dialog :title="title" :visible.sync="showDialog">
    <main id="creategroupdialog-container">
      <section class="search">
        <!-- 搜索条件 -->
        <section style="display: block;">
          <i>用户组名称:</i>
          <span>{{this.groupNode.name}}</span>
        </section>
        <section>
          <i>员工姓名:</i>
          <el-input v-model="fetchParam.name" placeholder="请输入员工姓名" @keyup.enter.native="fetchData"></el-input>
        </section>
        <section>
          <i>手机号:</i>
          <el-input
            v-model="fetchParam.mobile"
            placeholder="请输入手机号"
            @keyup.enter.native="fetchData"
          ></el-input>
        </section>
        <section>
          <i>所在门店:</i>
          <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
        </section>
        <section>
          <i>职位:</i>
          <el-input v-model="fetchParam.job" placeholder="请输入职位" @keyup.enter.native="fetchData"></el-input>
        </section>
      </section>
       <section style="margin:-10px 0px 10px 7px;">
          <DateRange
             title="入职时间"
            :start="fetchParam.join_stime"
            :end="fetchParam.join_etime"
            @changeStart="val=> {fetchParam.join_stime=val}"
            @changeEnd="val=> {fetchParam.join_etime=val}"
            :change="fetchData"
          ></DateRange>
        </section>
      <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
      <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
      <!-- 固定列通过配置fixed="right || left"-->
      <el-table
        class="data-table"
        ref="multipleTable"
        v-loading="loading"
        :data="data"
        :fit="true"
        border
        @selection-change="handleSelectionChange"
        @select="handleSelectChange"
        @select-all="handleSelecAll"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="员工姓名" prop="name" width="140"></el-table-column>
        <el-table-column label="职位" prop="job" width="100"></el-table-column>
        <el-table-column label="手机号" prop="mobile" width="150"></el-table-column>
        <el-table-column label="所在门店" prop="dep_name" min-width="80"></el-table-column>
        <el-table-column label="入职时间" prop="join_time" min-width="80"></el-table-column>
      </el-table>
      <el-pagination
        class="block"
        @size-change="sizeChange"
        @current-change="handleCurrentChange"
        :current-page="fetchParam.page"
        :page-size="fetchParam.page_size"
        :page-sizes="[15, 30, 60, 100]"
        layout="sizes, total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </main>

    <span slot="footer" class="dialog-footer" v-if="type!='detail'">
      <el-button type="primary" @click="add">加入用户组</el-button>
    </span>
  </el-dialog>
</template>
<script>
import userService from "services/company/userService";
import DepSelect from "components/select/Department.vue";
import DateRange from "components/form/DateRangePicker.vue";
import * as timeUtils from "utils/timeUtils";
export default {
  components: {
    DepSelect,
    DateRange
  },
  props: {
    title: String,
    visible: Boolean,
    type: String,
    groupNode: Object
  },
  activated() {},
  created() {
    this.fetchData();
  },
  mounted() {},
  computed: {},
  watch: {
    showDialog(val) {
      this.$emit("update:visible", val);
    }
  },
  data() {
    return {
      loading: false,
      showDialog: this.visible,
      data: [],
      userData: [],
      arr: [],
      total: 0,
      fetchParam: {
        name: "",
        job: "",
        department_id: "",
        group_id: this.groupNode.id,
        mobile: "",
        page: 1,
        page_size: 15,
        join_stime:'',
        join_etime:''

      },
      selectedUser: []
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      return userService
        .userMiniSearch(this.fetchParam)
        .then(ret => {
          this.data = ret.data;
          this.total = ret.total;
          this.setSelected();
        })
        .then(() => {
          this.loading = false;
        });
    },
    dateChange() {
      if (this.fetchParam.join_time) {
        let date = new Date(this.fetchParam.join_time);
        let date_value =
          date.getFullYear() +
          "-" +
          timeUtils.fillZero(date.getMonth() + 1) +
          "-" +
          timeUtils.fillZero(date.getDate());
        this.fetchParam.join_time = date_value;
        this.fetchData();
      } else {
        console.log(11111);
        this.fetchParam.join_time = "";
        this.fetchData();
      }
    },
    handleCurrentChange(val) {
      this.fetchParam.page = val;
      this.fetchData();
    },
    sizeChange(val) {
      this.fetchParam.page_size = val;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.selectedUser = val;
    },
    handleSelecAll(section) {
      let obj = {};
      if (section.length > 1) {
        section.forEach(item => {
          this.userData.push(item);
        });
        this.userData.forEach((item, index) => {
          if (item == undefined) {
            this.userData.splice(index, 1);
          }
        });
      } else {
        this.data.forEach(item => {
          this.userData.splice(
            this.userData.findIndex(row => {
              return row.id == item.id;
            }),
            1
          );
        });
      }
      //数组去重(利用reduce方法遍历数组，reduce第一个参数是遍历需要执行的函数，第二个参数是item的初始值)
      this.userData = this.userData.reduce((item, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && item.push(next));
        return item;
      }, []);
      console.log(this.userData);
    },
    handleSelectChange(section, row) {
      if (section.indexOf(row) > -1) {
        this.userData.push(row);
      } else {
        this.userData.splice(
          this.userData.findIndex(item => {
            return item.id === row.id;
          }),
          1
        );
      }
      console.log(this.userData);
    },
    add() {
      if (this.selectedUser.length === 0) {
        xmview.showTip("warning", "请选择员工");
        return;
      }
      let user_id = this.userData.map(item => item.id).join(",");
      userService
        .updateUserGroup({
          id: this.groupNode.id,
          user_id
        })
        .then(() => {
          xmview.showTip("success", "成功");
          this.$emit("success");
          this.showDialog = false;
        })
        .catch(ret => {
          xmview.showTip("error", ret.message || "失败");
        });
    },
    setSelected() {
      this.$nextTick(() => {
        if (!this.$refs.multipleTable) return;
        this.$refs.multipleTable.clearSelection();
        this.userData.forEach(row => {
          // console.log('左边数据',this.data)//左边数据
          let currRow = this.data.find(item => {
            return item.id == row.id;
          });
          // console.log('左边选中数据',currRow)//左边选中数据
          this.$refs.multipleTable.toggleRowSelection(currRow, true);
        });
      });
    }
  },
  filters: {}
};
</script>
