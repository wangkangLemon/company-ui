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
      ref="ruleForm"
      :rules="rules"
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
                disabled
                v-model="ruleForm.sdate"
                style="width: 100%;"
                @change="dateChange"
                :picker-options="pickerOptionsStart"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-time-picker
            v-model="time.new_start_time"
             disabled
            @change="timeStartChange"
            placeholder="开始时间点"
          ></el-time-picker>
          <el-time-picker v-model="time.new_end_time" @change="timeEndChange"  disabled placeholder="结束时间点"></el-time-picker>
        </el-form-item>
        <el-form-item label="活动类型" prop="online_type">
          <el-radio-group v-model="ruleForm.online_type">
            <el-radio :label="1" disabled>线下</el-radio>
            <el-radio :label="2" disabled>线上</el-radio>
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
            <el-radio :label="1" :disabled="disabled">启用</el-radio>
            <el-radio :label="2" :disabled="disabled">禁用</el-radio>
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
            <div style="float:left;">
              <img :src="signin_code" width="250px" height="250px">
              <div style="text-align:center;">
                签到二维码
                <a href='#' @click="dowload_signin">点击下载</a>
              </div>
            </div>
            <div style="float:left;margin-left:40px;">
              <img :src="signinback_code" width="250px" height="250px">
              <div style="text-align:center;">
                签退二维码
                <a href="#" @click="dowload_signback">点击下载</a>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选取位置" :visible.sync="dialogVisible" width="1200px">
      <maps v-on:headCallback="headcall" :newlat='ruleForm.signin_y' :newlng='ruleForm.signin_x'></maps>
    </el-dialog>
  </article>
</template>
<script>
import CheckInActivity from "../../services/checkInActivity";
import maps from "./map.vue";
import config from "../../utils/config";
import authUtils from "../../utils/authUtils";
import * as timeUtils from "utils/timeUtils";
export default {
  name: "activity-add",
  components: {
    maps
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
      token:'',
      signin_rang_disabled: false,
      disabled: false,
      point: {
        lat: "",
        lng: ""
      },
      id: "",
      dialogVisible: false,
      input1: "",
      signin_code: "",
      signinback_code: "",
      time: {
        new_start_time: "",
        new_end_time: ""
      },
      ruleForm: {
        title: "",
        sdate: "",
        start_time: "",
        end_time: "",
        online_type: "",
        teacher: "",
        intr: "",
        address: "",
        signin_type: "",
        signin_range: "",
        signin_x: "",
        signin_y: ""
      },
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        sdate: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        signin_range: [
          {
            validator: check_signin_range,
            trigger: "blur"
          }
        ],
        intr: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      pickerOptionsStart: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  watch: {
    "ruleForm.online_type"(val) {
      if (val == 1) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    "ruleForm.signin_type"(val) {
      if (val == 2) {
         this.ruleForm.signin_range=''
        this.ruleForm.signin_x=''
        this.ruleForm.signin_y=''
        this.signin_rang_disabled = true;
      } else {
        this.signin_rang_disabled = false;
      }
    }
  },
  created() {
    if (this.ruleForm.online_type == 1) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.token = authUtils.getAuthToken();
    xmview.setContentLoading(false);
    this.id = this.$route.query.id;
    this.getData(this.id);
    let url = config.apiHost;
   this.getsignin_code()
   this.getsignback_code()
    // this.signin_code = `${url}/com/activity/qrcode?id=${
    //   this.id
    // }&path=signin&token=${this.token}`;
    // this.signinback_code = `${url}/com/activity/qrcode?id=${
    //   this.id
    // }&path=signback&token=${this.token}`;
  },
  methods: {
    //获取签到二维码
    getsignin_code(){
       return CheckInActivity.sign_code({path:'signin',protocol:'base64',id:this.id}).then(res=>{
        this.signin_code=res.data
       })
    },
    //获取签退二维码
    getsignback_code(){
       return CheckInActivity.sign_code({path:'signback',protocol:'base64',id:this.id}).then(res=>{
        this.signinback_code=res.data
       })
    },
    dowload_signin(){
      let name='签到.png'
      console.log(this.id)
       return CheckInActivity.exportDownload({path:'signin',id:this.id,token:this.token},name)
    },
    dowload_signback(){
       let name='签退.png'
       console.log(this.id)
       return CheckInActivity.exportDownload({path:'signback',id:this.id,token:this.token},name)
    },
    getTimeStr(val) {
      const d = new Date(val);
      const resTime = this.p(d.getHours()) + ":" + this.p(d.getMinutes());

      return resTime;
    },
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    timeStartChange(val) {
      this.ruleForm.start_time = this.getTimeStr(val);
    },
    timeEndChange(val) {
      this.ruleForm.end_time = this.getTimeStr(val);
    },
    setSignin() {
      this.dialogVisible = true;
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          return CheckInActivity.editActivity(this.id, this.ruleForm).then(
            res => {
              if (res.code == 0) {
                xmview.showTip("success", "更新成功");
                this.$router.push({
                  name: "activity-list"
                });
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getData(id) {
      return CheckInActivity.checkList(id).then(res => {
        this.ruleForm = res.activity;
        // 截取返回日期字符串
        let time = res.activity.sdate.slice(0, 10);
        let year = res.activity.sdate.slice(0, 4);
        let month = res.activity.sdate.slice(5, 7);
        let day = res.activity.sdate.slice(8, 10);
        let start_hour = res.activity.start_time.slice(0, 2);
        let start_minutes = res.activity.start_time.slice(3, 5);
        let end_hour = res.activity.end_time.slice(0, 2);
        let end_minutes = res.activity.end_time.slice(3, 5);

        let start_new_time = new Date(
          year,
          month,
          day,
          start_hour,
          start_minutes
        );
        let end_new_time = new Date(year, month, day, end_hour, end_minutes);
        this.ruleForm.sdate = time;
        this.time.new_start_time = start_new_time;
        this.time.new_end_time = end_new_time;
      });
    },
    parserDate(date) {
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
      }
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
