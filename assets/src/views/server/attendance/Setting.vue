<!-- 考勤打卡 -->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
</style>
<template>
  <article id="course-study-container">
    <el-tabs  v-model="tabName" type="border-card" >
      <el-tab-pane label="地点管理" name="local">
          <Local v-if="tabName=='local'"></Local>
      </el-tab-pane>
      <el-tab-pane label="WIFI管理" name="wifi">
            <WIFI v-if="tabName=='wifi'"></WIFI>
      </el-tab-pane>

    </el-tabs>
  </article>
</template>

<script>
import WIFI from './Wifi'
import Local from './Local'

export default {
    components: {
        WIFI,
        Local
    },
    data () {
        return {
            tabName: 'local'
        }
    },
    activated () {
        xmview.setContentLoading(false)
    }
}
</script>
