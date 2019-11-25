<style lang="scss">
    .phase-operation {
        cursor: pointer;
        position: fixed;
        top: 260px;
        right: 26%;
        i {
            color: orange;
            font-size: 70px;
        }
    }
</style>
<template>
    <div class="phase-operation">
        <i 
            class="el-icon-circle-plus"
            @click="addPhase"
            :title="'添加' + title">
        </i>
        <p>总{{title}}数:{{ total }}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '阶段'
            },
            total: Number
        },
        watch: {
            total (val) {
                this.total = val
            }
        },
        methods: {
            addPhase () {
                this.$emit('addPhase')
            }
        }
    }
</script>
