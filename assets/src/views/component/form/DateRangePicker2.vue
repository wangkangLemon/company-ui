<style lang="scss">
    .el-picker-panel__sidebar {
        .el-picker-panel__sidebar--activate {
            color: orange;
        }
    }
</style>
<template>
    <section>
        <span>{{title}}</span>
        <el-date-picker
            ref="datePicker"
            v-model="time"
            type="daterange"
            align="right"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="changeFn"
            @focus="focusFn">
        </el-date-picker>    
    </section>
</template>

<script>
    import * as timeUtils from 'utils/timeUtils'

    function getTimeStr (val) {
        if (!val) return val
        return timeUtils.date2Str(new Date(val))
    }

    export default {
        props: {
            title: String,
            start: {},
            end: {},
            change: Function,
        },
        created () {
        },
        watch: {
            start (val) {
                if (this.time) {
                    if (getTimeStr(this.time[0]) != val) {
                        this.$set(this.time, 0, val)
                        // 置空之后, 控件上面显示的值不会被清空  所以要自己操作dom进行操作
                        // if (!val) this.$refs.start.$el.querySelector('input').value = ''
                    }
                }
            },
            end (val) {
                if (this.time) {
                    if (getTimeStr(this.time[1]) != val) {
                        this.$set(this.time, 1, val)
                        // if (!val) this.$refs.end.$el.querySelector('input').value = ''
                    }
                }
            },
        },
        data () {
            let self = this
            return {
                first: true,
                time: [this.start, this.end],
                pickerOptions: {
                    disabledDate (time) {
                        return time ? time.getTime() > Date.now() : null
                        // debugger
                        // if (self.time) {
                        //     // debugger
                        //     if (self.time[1]) {
                        //         return (time.getTime() > new Date(self.time[1])) || (time.getTime() <= new Date(self.time[1]) - 1000 * 60 * 60 * 24 * 91)
                        //     } else if (self.time[0]) {
                        //         return (time.getTime() <= new Date(self.time[0]) - 1000 * 60 * 60 * 24) || (time.getTime() >= new Date(self.time[0]) + 1000 * 60 * 60 * 24 * 90)
                        //     }
                        //     // return (time.getTime() - 1000 * 60 * 60 * 24 >= new Date(self.time[1]).getTime() && timeUtils.compareDate(time, new Date(self.time[0])) !== 0) || (time.getTime() <= new Date(self.time[0]).getTime() && timeUtils.compareDate(time, new Date(self.time[0])) !== 0)
                        // } else {
                        // }
                    },
                    shortcuts: [
                        {
                            text: '今天',
                            onClick (picker) {
                                self.activateShortcut(0)
                                const end = new Date()
                                const start = new Date()
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '3天',
                            onClick (picker) {
                                self.activateShortcut(1)
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * (3 - 1))
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '7天',
                            onClick (picker) {
                                self.activateShortcut(2)
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * (7 - 1))
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '30天',
                            onClick (picker) {
                                self.activateShortcut(3)
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * (30 - 1))
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            text: '90天',
                            onClick (picker) {
                                self.activateShortcut(4)
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * (90 - 1))
                                picker.$emit('pick', [start, end])
                            }
                        }
                    ],
                    onPick () {
                        self.activateShortcut()
                    }
                },
            }
        },
        methods: {
            focusFn () {
                this.$nextTick(() => {
                    if (this.first) {
                        this.activateShortcut(2)
                        this.first = false
                    }
                })
            },
            changeFn (val) {
                let time = !val ? [null, null] : val
                this.$emit('changeStart', time[0])
                this.$emit('changeEnd', time[1])
                this.change && this.change()
            },
            activateShortcut (index) {
                let className = 'el-picker-panel__sidebar--activate'
                let btns = [...document.querySelector('.el-picker-panel__sidebar').children]
                btns.forEach(btn => btn.classList.contains(className) && btn.classList.remove(className))
                if (index || index === 0) {
                    btns[index].classList.add(className)
                }
            },
            handleShortcutClick (shortcut) {
                if (shortcut.onClick) {
                    shortcut.onClick(this)
                }
            },
        }
    }
</script>
