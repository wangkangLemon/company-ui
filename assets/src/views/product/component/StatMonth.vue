<style lang="scss">
    #statmonth-container {
        .statmonth-list {
            margin-bottom: 5px;
        }
        .inner {
            width: 180px;
            line-height: 40px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow:hidden;
        }
        .plus {
            padding: 5px;
            border-radius: 50%;
            background: #59ca59;
            cursor: pointer;
        }
        .minus {
            background: #a7a7f7;
        }
    }
</style>

<template>
    <main id="statmonth-container">
        <el-tooltip 
            v-if="statMonth.length>=3" 
            class="item" 
            effect="dark" 
            :content="statMonth.join(',')" 
            placement="top">
            <div class="el-input__inner inner" @click="open">{{statMonth.join(',')}}</div>
        </el-tooltip>
        <div 
            v-else
            class="el-input__inner inner" 
            @click="open">
            {{statMonth.join(',')}}
        </div>
        <el-dialog 
            v-if="showDialog"
            title="统计月份多选" 
            width="25%"
            :visible.sync="showDialog"
            @close="submit">
            <section 
                class="statmonth-list"
                v-for="(month,index) in statMonth"
                :key="month + index">
                <el-date-picker
                    value-format="yyyy-MM"
                    type="month"
                    v-model="statMonth[index]">
                </el-date-picker>
                <i 
                    class="el-icon-plus plus" 
                    @click="plusMonth(index)">
                </i>
                <i 
                    class="el-icon-minus plus minus" 
                    @click="minusMonth(index)" 
                    v-if="index !== 0">
                </i>
            </section>
        </el-dialog>
    </main>

</template>

<script>
    export default {
        props: {

        },
        data () {
            return {
                showDialog: false,
                statMonth: [""],
            }
        },
        methods: {
            open () {
                this.showDialog = true
            },
            plusMonth (index) {
                if (!this.statMonth[index+1]) {
                    this.$set(this.statMonth, index+1, "")
                }
            },
            minusMonth (index) {
                this.statMonth.splice(index, 1)
            },
            submit () {
                for (let i = this.statMonth.length; i > 0; i--) {
                    !this.statMonth[i] && this.statMonth.splice(i, 1)
                }
                let statMonth = this.statMonth.join(',')
                if (statMonth || (this.statMonth.length === 1 && !statMonth)) {
                    this.$emit('change', statMonth)
                }
            }
        }
    }
</script>
