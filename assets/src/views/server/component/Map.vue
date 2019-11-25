<style lang='scss' rel='stylesheet/scss'>

.search-box {
    width: 100%;
    height: 36px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-shadow: none;
}
</style>

<template>
    <div class="amap-page-container">
        <el-amap-search-box class="search-box" ref="searchBox" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amap" :center="center" :zoom="zoom" class="amap" :events="events" :plugin="plugin">
            <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        </el-amap>
        <div class="toolbar">
           <p> 定位地址: {{ address }}</p>
           <p> 打卡范围: {{range}}米内</p>
        </div>
    </div>
</template>

  <style>
.amap {
    height: 300px;
    width: 100%;
}
</style>

<script>
import clone from 'clone'

 /* eslint-disable */
    var geocoder = new AMap.Geocoder({   // 初始化 坐标转换
           radius: 1000,
           extensions: 'all'
    })
export default {
    props: {
        nowAddress: String,
        position: 0,
        nowlat: 0,
        range: {
            type: Number,
            default: 500
        },
    },
    watch: {
        'nowAddress' (val) {
            this.$refs.searchBox.keyword = this.nowAddress
        },
        'position' (val) {
            this.marker.position = this.position
        },
        'address' (val) {
            this.getPosition()
        },
        'lng' (val) {
            this.getPosition()
        },
        'lat' (val) {
            this.getPosition()
        }
    },
    data () {
        let self = this
        return {
            zoom: 17,
            center: [0, 0],
            address: '',
            lng: '',    // 经度
            lat: '',   // 纬度
            plugin: [
                {   // 插件条插件
                    pName: 'ToolBar',
                    position: 'RT',
                    liteStyle: 'true',     //  精准模式
                    locate: 'false',
                    direction: 'false',   // 是否显示方向盘
                },
                {
                    pName: 'Geolocation',
                    events: {
                        init (o) {
                            // o 是高德地图定位插件实例
                            if (!this.form.id) {
                                o.getCurrentPosition((status, result) => {
                                    if (result && result.position) {
                                        self.lng = result.position.lng
                                        self.lat = result.position.lat
                                        self.center = [self.lng, self.lat]
                                        self.marker.position = [self.lng, self.lat]
                                        self.loaded = true
                                        geocoder.getAddress([self.lng, self.lat], function (status, result) {
                                            if (status === 'complete' && result.info === 'OK') {
                                                if (result && result.regeocode) {
                                                    self.address = result.regeocode.formattedAddress
                                                    self.$nextTick()
                                                }
                                            }
                                        })
                                        self.$nextTick()
                                    }
                                })
                            }
                        }
                    }
                }
            ],
            marker: {   // 标点
                position: [116.397477, 39.909115],
                events: {
                    dragend: (e) => {    // 点标记拖拽移动结束触发事件
                        this.marker.position = [e.lnglat.lng, e.lnglat.lat]
                        let { lng, lat } = e.lnglat
                        self.lng = lng
                        self.lat = lat
                        // 这里通过高德 SDK 完成。
                        geocoder.getAddress([lng, lat], function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                if (result && result.regeocode) {
                                    self.address = result.regeocode.formattedAddress
                                    self.$nextTick()
                                }
                            }
                        })
                    }
                },
                visible: true,   // 点标记是否可见，默认为true。
                draggable: true  // 设置点标记是否可拖拽移动
            },
            events: {   //  地图点击事件
                click (e) {
                }
            },
            lng: 0,
            lat: 0
        }
    },
    mounted () {
        this.$refs.searchBox.keyword =this.nowAddress  //搜索条件
        this.onSearchResult(this.formattedPosition(this.position || this.marker.position))
    },
    methods: {
        getPosition () {        // 传给父级 数据
            this.$emit('getposition',this.lng,this.lat,this.address)
        }, 
        initMarker () {
            this.marker.position= clone(this.center)
        },
        onSearchResult (pois) {   //搜索回调
            let self = this
            let latSum = 0
            let lngSum = 0
            if (pois.length > 0) {
                pois.splice(1,pois.length-1)
                pois.forEach(poi => {
                    let { lng, lat } = poi
                    lngSum += lng
                    latSum += lat
                    this.marker.position = [poi.lng, poi.lat]  // 把搜索的地址赋值给标记
                    this.lng = lng
                    this.lat = lat
                    geocoder.getAddress([lng, lat], function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            if (result && result.regeocode) {
                                self.address = result.regeocode.formattedAddress
                                self.$nextTick()
                            }
                        }
                    })
                })
                let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                }
                this.center = [center.lng, center.lat]
            }
        },
        formattedPosition (position) {
            let posi = [{}]
            posi[0].lng = position[0]
            posi[0].lat = position[1]
            return posi
        },
    }
    
}
</script>
