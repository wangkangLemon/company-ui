<template>
  <div class="box">
    <div class="demo-input-suffix" style="float:right">
      <el-input
        v-model="address"
        placeholder="请输入搜索"
        prefix-icon="el-icon-search"
        style="width:300px;margin-bottom:20px;"
      ></el-input>
      <ul class="list">
        <li
          v-for="item in addressList"
          :key="item.uid"
          @click="selectAddress(item.title)"
        >{{item.title}}</li>
      </ul>
    </div>
    <div id="XSDFXPage" class="XSDFXPage"></div>
  </div>
</template>
<script>
export default {
  props: ["newlng", "newlat"],
  data() {
    return {
      addressList: [],
      address: "",
      point: {
        lat: "39.9152108931",
        lng: "116.4039006839"
      },
      convert:false,
    };
  },
  watch: {
    address(val) {
      if (val == "") {
        this.addressList = [];
        this.corrdinate();
      } else {
        this.searchMap(val);
      }
    },
    newlng(val) {
      this.point.lng = this.bd_encrypt(this.newlng, this.newlat).bd_lng;
      this.point.lat = this.bd_encrypt(this.newlng, this.newlat).bd_lat;
      this.corrdinate();
    },
    newlat(val) {
      this.point.lng = this.bd_encrypt(this.newlng, this.newlat).bd_lng;
      this.point.lat = this.bd_encrypt(this.newlng, this.newlat).bd_lat;
      this.corrdinate();
    }
  },
  created() {
   if (this.newlng != "" && this.newlat != "") {
      this.point.lng = this.bd_encrypt(this.newlng, this.newlat).bd_lng;
      this.point.lat = this.bd_encrypt(this.newlng, this.newlat).bd_lat;
    }
  },
  mounted() {
    console.log(this.convert)
  },
  methods: {
    selectAddress(val) {
      this.searchMap(val);
      this.address = val;
    },
    getCorrdinate() {
      function showInfo(e) {
        _this.$emit("headCallback", _this.bgps_gps(e.point.lng, e.point.lat));
      }
      map.addEventListener("click", showInfo);
    },
    corrdinate() {
      var _this = this;
      var map = new BMap.Map("XSDFXPage");
      var new_point = new BMap.Point(_this.point.lng, _this.point.lat);
      map.centerAndZoom(new_point, 16);
      map.enableScrollWheelZoom()
      var marker = new BMap.Marker(new_point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      function showInfo(e) {
        _this.$emit("headCallback", _this.bgps_gps(e.point.lng, e.point.lat));
      }
      map.addEventListener("click", showInfo);
    },
    searchMap(val) {
      var _this = this;
      let map = new BMap.Map("XSDFXPage");
      let point = new BMap.Point(this.point.lng, this.point.lat);
      let that = this;
      let options = {
        onSearchComplete: results => {
          // 判断状态是否正确
          if (local.getStatus() == 0) {
            this.addressList = results.Ar;
            this.point.lat = results.getPoi(0).point.lat;
            this.point.lng = results.getPoi(0).point.lng;
            this.theLocation();
          } else {
          }
        }
      };
      let local = new BMap.LocalSearch(map, options);
      local.search(val);
    },
    //百度地图转换高德地图坐标
    bgps_gps(bd_lng, bd_lat) {
      let X_PI = (Math.PI * 3000.0) / 180.0;
      let x = bd_lng - 0.0065;
      let y = bd_lat - 0.006;
      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
      let gg_lng = z * Math.cos(theta);
      let gg_lat = z * Math.sin(theta);
      return { lng: gg_lng, lat: gg_lat };
    },
    //高德地图坐标转换百度坐标
    bd_encrypt(gg_lng, gg_lat) {
      var X_PI = (Math.PI * 3000.0) / 180.0;
      var x = gg_lng,
        y = gg_lat;
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
      var bd_lng = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return {
        bd_lat: bd_lat,
        bd_lng: bd_lng
      };
    },
    theLocation() {
      let _this = this;
      var map = new BMap.Map("XSDFXPage");
      map.centerAndZoom(new BMap.Point(_this.point.lng, _this.point.lat), 17);
      map.enableScrollWheelZoom(true);
      map.clearOverlays();
      var new_point = new BMap.Point(_this.point.lng, _this.point.lat);
      var marker = new BMap.Marker(new_point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      map.panTo(new_point);
      function showInfo(e) {
        _this.$emit("headCallback", _this.bgps_gps(e.point.lng, e.point.lat));
      }
      map.addEventListener("click", showInfo);
    }
  },
  mounted() {
    this.corrdinate();
  }
};
</script>
<style scoped>
.XSDFXPage {
  width: 800px;
  height: 500px;
  overflow: hidden;
  margin: 0;
  font-family: "微软雅黑";
}
.list {
  width: 100%;
  overflow: auto;
}
.list li {
  width: 100%;
  padding: 10px;
}
.list li:hover {
  background-color: #e6e6e6;
}
</style>


