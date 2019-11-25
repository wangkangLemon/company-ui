<!--地区下拉选择-->

<!--使用示范:-->
<!--<Region v-on:provinceChange="val => provinceSelect = val"
        v-on:cityChange="val => citySelect = val"
        v-on:areaChange="val => areaChange = val"
        :change="fetchData"></Region>-->

<style lang='scss' rel='stylesheet/scss'>
    .region-container {
        .el-select {
            max-width: 130px !important;
        }
    }
</style>

<template>
    <section class="region-container">
        <i>{{title}}</i>
        <el-select :disabled="disabled" placeholder="全部" clearable @change="setCurrVal(0, provinceSelect)" v-model="provinceSelect">
            <el-option v-for="(item, index) in provinces"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="disabled" placeholder="全部" clearable @change="setCurrVal(1, citySelect)" v-model="citySelect">
            <el-option v-for="(item, index) in citys"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
        <el-select :disabled="disabled" placeholder="全部" clearable @change="setCurrVal(2, areaSelect)" v-model="areaSelect">
            <el-option v-for="(item, index) in areas"
                       :label="item.name"
                       :value="item.id"
                       :key="item.id">
            </el-option>
        </el-select>
    </section>
</template>

<script>
    import areaData from '../../../assets/js/area'
    import treeUtils from '../../../utils/treeUtils'
    export default{
        props: ['change', 'title', 'province', 'city', 'area', 'disabled'],
        data () {
            return {
                provinces: [],
                citys: [],
                areas: [],
                provinceSelect: this.province,
                citySelect: this.city,
                areaSelect: this.area,
                curItem: []
            }
        },
        watch: {
            province (val) {
                if (val) {
                    this.provinceSelect = val
                    this.setCurrVal(0, val)
                } else {
                    this.provinceSelect = ''
                }
            },
            city (val) {
                if (this.province && val) {
                    this.citySelect = val
                    this.setCurrVal(1, val)
                } else {
                    this.citySelect = ''
                }
            },
            area (val) {
                if (this.province && this.citySelect && val) {
                    this.areaSelect = val
                } else {
                    this.areaSelect = ''
                }
            },
            disabled (val) {
                if (val) {
                    this.provinceSelect = ''
                }
            }
        },
        created () {
            // 获取数据
            areaData.forEach((item) => {
                this.provinces.push({
                    id: item.id,
                    name: item.name
                })
            })
            this.setCurrVal(0, this.province, true)
            this.setCurrVal(1, this.city, true)
            this.setCurrVal(2, this.area, true)
        },
        methods: {
            setCurrVal (type, val, isInit) {
                let emitArr = ['provinceChange', 'cityChange', 'areaChange']
                this.$emit(emitArr[type], val)
                this.change && this.change()
                let levelPath = []
                let typeArr = ['provinceSelect', 'citySelect', 'areaSelect']
                if (!this[typeArr[type]]) return
                levelPath = [this[typeArr[type]]]
                if (type == 0) {
                    this.curItem = treeUtils.findItem(areaData, levelPath)
                    if (this.curItem.children && this.curItem.children.length > 0) {
                        this.citys = this.curItem.children
                    }
                    if (!isInit) {
                        this.citySelect = ''
                        this.areaSelect = ''
                    }
                } else if (this.provinceSelect && type == 1) {
                    if (this.citys && this.citys.length > 0) {
                        this.areas = treeUtils.findItem(this.citys, levelPath).children
                    }
                    !isInit && (this.areaSelect = '')
                }
            }
        }
    }
</script>
