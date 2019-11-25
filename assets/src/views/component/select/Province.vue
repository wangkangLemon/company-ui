<!--省份下拉选择-->

<!--使用示范:-->
<!--<Province v-on:provinceChange="val => {provinceSelect = val}" :change="fetchData"></Province>-->

<style lang='scss' rel='stylesheet/scss'>
.province-container {
    .el-select {
        max-width: 130px !important;
    }
}
</style>

<template>
    <section class="province-container">
        <i>{{title}}</i>
        <el-select :disabled="disabled" :placeholder="curPlaceholder" filterable @change="setCurrVal(0, provinceSelect)" v-model="provinceSelect">
            <el-option v-for="(item, index) in provinces" :label="item.name" :value="item[curAttr||id]" :key="item.id">
            </el-option>
        </el-select>
    </section>
</template>

<script>
import provinceData from '../../../assets/js/province'
export default {
    props: ['change', 'title', 'placeholder', 'province', 'disabled', 'attr'],
    data () {
        return {
            provinces: [],
            provinceSelect: '',
            curAttr: this.attr,
            curPlaceholder: this.placeholder || '全部'
        }
    },
    watch: {
        province (val) {
            if (val) {
                this.provinceSelect = val
            } else {
                this.provinceSelect = ''
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
        provinceData.forEach((item) => {
            this.provinces.push({
                id: item.id,
                name: item.name
            })
        })
    },
    methods: {
        setCurrVal (type, val) {
            let emitArr = ['provinceChange']
            this.$emit(emitArr[type], val)
            this.change && this.change()
        }
    }
}
</script>
