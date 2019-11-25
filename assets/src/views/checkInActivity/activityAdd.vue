<!--课程表单：添加/修改-->
<style lang="scss" rel="stylesheet/scss">
@import "~utils/mixins/common";
#activity-add {
  @extend %content-container;
  .search {
    margin-bottom: 10px;
  }
  .el-form {
    max-width: 700px;
  }
  .el-tabs {
    .el-tab-pane {
      .mulit-class {
        .saveBtn {
          float: right;
          margin-top: 20px;
        }
        padding: 20px 100px;
        text-align: center;
        width: 75%;
        p {
          padding: 10px;
          text-align: left;
          span {
            i {
              margin: 0 10px;
            }
          }
          .operate {
            float: right;
          }
          &.gray {
            text-align: center;
            background: #eee;
            margin-left: 50px;
            cursor: pointer;
          }
          .edit-status {
            display: block;
            margin: 10px 0 10px 50px;
            .el-input {
              width: 70%;
            }
            span {
              float: right;
            }
          }
          &.edit-status {
            text-align: left;
            > .el-input {
              outline: none;
              line-height: 30px;
              width: 70%;
            }
            > span {
              float: right;
            }
          }
        }
      }
    }
  }
  .collection {
    align-items: center;
    min-height: 36px;
    border-radius: 4px;
    padding: 3px 10px;
    border: 1px solid #bfcbd9;
    .u-course-tag {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.el-form-item__label {
  text-align: left;
}
.title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}
.code .el-textarea__inner {
  border: 0;
  padding: 0;
}
</style>
<template>
  <article id="activity-add">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <div class="title">基本信息设置</div>
        <div style="width:100%;height:1px;background-color:#e6e6e6;margin-bottom:10px;"></div>

        <el-form-item label="活动名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="活动日期" required>
          <el-col :span="11">
            <el-form-item prop="sdate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.sdate"
                style="width: 100%;"
                :picker-options="pickerOptionsStart"
                @change="dateChange"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动时间" prop="new_start_time" style="display:inline-block;">
          <el-time-picker
            v-model="ruleForm.new_start_time"
            placeholder="开始时间点"
            @change="timeStartChange"
            :picker-options="pickertimeOptionsStart"
          ></el-time-picker>
        </el-form-item>
        <el-form-item prop="new_end_time" style="display:inline-block;margin-left:-80px;">
          <el-time-picker
            @change="timeEndChange"
            v-model="ruleForm.new_end_time"
            minTime="mintime"
            placeholder="结束时间点"
            :picker-options="pickertimeOptionsEnd"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="活动类型" prop="online_type">
          <el-radio-group v-model="ruleForm.online_type">
            <el-radio label="1">线下</el-radio>
            <el-radio label="2">线上</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主讲人" prop="teacher">
          <el-input v-model="ruleForm.teacher"></el-input>
        </el-form-item>
        <el-form-item label="内容简介" prop="intr">
          <el-input type="textarea" v-model="ruleForm.intr"></el-input>
        </el-form-item>
        <el-form-item label="活动地点" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
      </div>
      <div>
        <div class="title">考勤信息设置</div>
        <div style="width:100%;height:1px;background-color:#e6e6e6;margin-bottom:10px;"></div>
        <el-form-item label="考勤范围">
          <el-radio-group v-model="ruleForm.signin_type">
            <el-radio label="1" :disabled="disabled">启用</el-radio>
            <el-radio label="2" :disabled="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考勤范围" prop="signin_range">
          <el-input
            v-model="ruleForm.signin_range"
            style="width:40%;"
            :disabled="signin_rang_disabled"
          >
            <template slot="append">米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="打卡坐标">
          <el-input v-model="ruleForm.signin_x" style="width:40%;" :disabled="true">
            <template slot="append">X</template>
          </el-input>
          <el-input v-model="ruleForm.signin_y" style="width:40%;" :disabled="true">
            <template slot="append">Y</template>
          </el-input>
          <el-button type="text" @click="setSignin" :disabled="signin_rang_disabled">设置</el-button>
        </el-form-item>
        <div class="code">
          <el-form-item label="考勤二维码：">
            <el-input type="textarea" v-model="content" :readonly="true"></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选取位置" :visible.sync="dialogVisible" width="1200px">
      <maps v-on:headCallback="headcall" :newlat="ruleForm.signin_y" :newlng="ruleForm.signin_x"></maps>
    </el-dialog>
  </article>
</template>
<script>
import maps from "./map.vue";
import CheckInActivity from "../../services/checkInActivity";
import * as timeUtils from "utils/timeUtils";
// function getTimeStr(val) {}
// function p(s) {}
let _this;
export default {
  name: "activity-add",
  components: {
    maps: maps
  },
  watch: {
    "ruleForm.online_type"(val) {
      if (val == 1) {
        this.disabled = true;
        this.ruleForm.signin_type = "1";
      } else if (val == 2) {
        this.disabled = false;
      }
    },
    "ruleForm.signin_type"(val) {
      if (val == 2) {
        this.ruleForm.signin_range = "";
        this.ruleForm.signin_x = "";
        this.ruleForm.signin_y = "";
        this.signin_rang_disabled = true;
      } else if (val == 1) {
        this.signin_rang_disabled = false;
      }
    }
  },
  computed: {},
  data() {
    var re = /^\d+(?=\.{0,1}\d+$|$)/;
    var check_signin_range = (rule, value, callback) => {
      if (this.ruleForm.signin_type == 2) {
        callback();
      } else {
        if (!value) {
          return callback(new Error("考勤范围不能为空"));
        } else if (value < 1) {
          return callback(new Error("范围必须大于0"));
        } else if (!re.test(value)) {
          return callback(new Error("只能输入数字"));
        } else {
          callback();
        }
      }
    };
    return {
      signin_rang_disabled: false,
      disabled: false,
      pickerOptionsStart: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickertimeOptionsStart: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        }
      },
      pickertimeOptionsEnd: {},
      point: {
        lat: "",
        lng: ""
      },
      dialogVisible: false,
      new_end_time: "",
      content:
        "保存活动后，系统将会为您生成本活动专属的二维码店员使用药视通APP扫码后即可完成签到或签退操作",
      ruleForm: {
        title: "",
        sdate: "",
        start_time: "",
        end_time: "",
        online_type: "1",
        intr: "",
        teacher: "",
        address: "",
        signin_type: "1",
        signin_range: "",
        signin_x: "",
        signin_y: "",
        new_start_time: "",
        new_end_time: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 0, max: 20, message: "活动名称过长", trigger: "blur" }
        ],
        teacher: [
          { required: true, message: "请输入主讲人", trigger: "blur" },
          { min: 0, max: 20, message: "主讲人名字过长", trigger: "blur" }
        ],
        sdate: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        new_start_time: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        new_end_time: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        signin_range: [
          {
            validator: check_signin_range,
            trigger: "blur"
          }
        ],
        intr: [
          { required: true, message: "请填写活动简介", trigger: "blur" },
          {
            min: 0,
            max: 200,
            message: "内容文字太多，请简洁描述",
            trigger: "blur"
          }
        ],
        address: [
          { required: true, message: "请填写活动地点", trigger: "blur" },
          { min: 0, max: 20, message: "活动名称过长", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (this.ruleForm.online_type == 1) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    xmview.setContentLoading(false);
  },
  mounted() {},
  methods: {
    getTimeStr(val) {
      const d = new Date(val);
      const resTime = this.p(d.getHours()) + ":" + this.p(d.getMinutes());

      return resTime;
    },
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    dateChange(val) {
      let newDate = new Date((val / 1000) * 1000);
      this.ruleForm.sdate =
        newDate.getFullYear() +
        "-" +
        timeUtils.fillZero(newDate.getMonth() + 1) +
        "-" +
        timeUtils.fillZero(newDate.getDate());
    },
    timeStartChange(val) {
      this.ruleForm.start_time = this.getTimeStr(val);
      this.pickertimeOptionsEnd = Object.assign({}, this.pickertimeOptionsEnd, {
        disabledDate: time => {
          return time.getTime() < this.new_end_time;
        }
      });
    },
    timeEndChange(val) {
      this.ruleForm.end_time = this.getTimeStr(val);
    },
    submitForm(formName) {
      let startTime = new Date(this.ruleForm.new_start_time).getTime();
      let endTime = new Date(this.ruleForm.new_end_time).getTime();
      if (endTime < startTime) {
         xmview.showTip("error", "活动结束时间不能在开始时间之前");
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            return CheckInActivity.createActivity(this.ruleForm).then(res => {
              if (res.code == 0) {
                xmview.showTip("success", "添加成功");
                this.$router.push({
                  name: "activity-list"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setSignin() {
      this.dialogVisible = true;
    },
    headcall(val) {
      this.point.lng = val.lng;
      this.point.lat = val.lat;
      this.$confirm(
        `本位置坐标X: ${this.point.lng}  坐标Y: ${this.point.lat}`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.ruleForm.signin_x = this.point.lng;
          this.ruleForm.signin_y = this.point.lat;
          this.dialogVisible = false;
        })
        .catch(() => {
          this.dialogVisible = false;
        });
    }
  }
};
</script>
