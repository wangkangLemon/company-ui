<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/theme_leij";
    $bkg-blue: #e5f7ff;
    .store-detail-catalog-container {
        .catalog-wrapper {
            display: flex;
            width: 80%;
        }
        .catalog {
            flex-basis: 20%;
            .good-item {
                padding: 10px 20px;
                margin-right: -4px;
                margin-bottom: 5px;              
                border-right: 3px solid #fff;
                text-align: center;
                background: $bkg-blue;
                cursor: pointer;
            }
            .good-item__active {
                border-right-color: #52bff1;
                transition: border-right-color 1s cubic-bezier(0.22, 0.61, 0.36, 1);
            }
        }
        .content {
            padding: 0 30px;
            border-left: 1px solid $color-line-grey;
            flex-basis: 70%;
            .phase-info {
            }
            .phase-wrapper {
                margin-top: 10px;
                border: 1px solid $color-line-grey;
                .phase-header {
                    padding: 15px 0 15px 30px;
                    background: $bkg-blue;
                }
                .phase-body {
                    display: flex;
                    align-items: stretch;
                    border-top: 1px solid $color-line-grey;
                    .phase-body__name {
                        width: 140px;
                        border-right: 1px solid $color-line-grey;
                        padding: 30px;
                        text-align: center;
                    }
                    .phase-body__list {
                        padding-left: 20px;
                        flex: 1;
                    }
                }
                .phase-text__important {
                    font-weight: 700;
                }
            }
        }
    }
</style>

<template>
    <main class="store-detail-catalog-container">
        <section class="catalog-wrapper">
            <section class="catalog">
                <ul>
                    <li 
                        :class="[{'good-item__active': activeGoods === good.id},'good-item']"
                        v-for="good in data.goods"
                        :key="good.id"
                        @click="fetchData(good.id)">
                        <p>{{good.name}}</p>
                        <p>({{good.category}})</p>
                    </li>
                </ul>
            </section>
            <section class="content" v-loading="loading">
                <template v-if="custom">
                    <el-table 
                        class="data-table" 
                        :data="goodsData" 
                        :fit="true" 
                        border 
                        style="margin-top: 5px;">
                        <el-table-column 
                            label="类型" 
                            prop="type"
                            width="100">
                            <el-tag 
                                slot-scope="scope"
                                :type="scope.row.type | taskName | taskType('tag')">
                                {{scope.row.type | taskName | taskType('label')}}
                            </el-tag>
                        </el-table-column>
                        <el-table-column 
                            label="名称" 
                            prop="name">
                        </el-table-column>
                    </el-table>
                </template>
                <template v-else>
                    <p class="phase-info">
                        <p>带教模版名称：{{title}}</p>
                        <span>阶段数：{{total_phase}}</span>
                        <span>必修数量：{{requiredTaskCount}}</span>
                        <span>选修数量：{{unRequiredTaskCount}}</span>
                    </p>
                    <div 
                        class="phase-wrapper"
                        v-for="phase in goodsData"
                        :key="phase.id">
                        <div class="phase-header">
                            <span class="phase-text__important">
                                第{{phase.phase}}{{phase_type | phaseType}}
                            </span>
                        </div>
                        <div class="phase-body">
                            <div class="phase-body__name">
                                <p class="phase-text__important">必修课</p>
                                <p>{{phase.sequence === 1 ? '按计划顺序' : '自由顺序'}}</p>
                            </div>
                            <PhaseList 
                                class="phase-body__list"
                                :selected="phase.phase_object_list"
                                :taskType="1">
                            </PhaseList>
                        </div>
                        <div class="phase-body">
                            <div class="phase-body__name">
                                <p class="phase-text__important">选修课</p>
                            </div>
                            <PhaseList 
                                class="phase-body__list"
                                :selected="phase.phase_object_list"
                                :taskType="2">
                            </PhaseList>
                        </div>
                        <div class="phase-body">
                            <div class="phase-body__name">
                                <p class="phase-text__important">阶段考试</p>
                            </div>
                            <PhaseList 
                                class="phase-body__list"
                                :selected="phase.phase_object_list"
                                :taskType="3">
                            </PhaseList>
                        </div>
                    </div>
                </template>
            </section>
        </section>
    </main>
</template>

<script>
    import storeService from 'services/store/storeService'
    import teachingService from 'services/learning/teaching'
    import PhaseList from './PhaseList.vue'

    export default {
        components: {
            PhaseList,
        },
        props: {
            data: Object,
        },
        activated () {},
        created () {
            this.fetchData(this.data.goods[0].id)
        },
        mounted () {},
        computed: {
            requiredTaskCount () {
                if (!this.custom) {
                    let count = 0
                    this.goodsData.forEach(phase => {
                        count += phase.phase_object_list.filter(item => item.type === 1).length
                    })
                    return count
                }
            },
            unRequiredTaskCount () {
                if (!this.custom) {
                    let count = 0
                    this.goodsData.forEach(phase => {
                        count += phase.phase_object_list.filter(item => item.type === 2).length
                    })
                    return count
                }
            }
        },
        watch: {},
        data () {
            return {
                loading: false,
                goodsData: [],
                phase_type: '',
                custom: false,
                activeGoods: '',
                total_phase: '',
                title: '',
            }
        },
        methods: {
            fetchData (id) {
                if (id === this.activeGoods) return
                this.loading = true
                this.activeGoods = id
                return storeService.getGoodsDetail(id).then(ret => {
                    if (ret.data.objects.some(item => item.type === 5)) {
                        // 如果是带教,objects数组中只有一项
                        teachingService.viewTeachingTemp(ret.data.objects[0].id).then(ret => {
                            this.goodsData = ret.data.phase_list   // 阶段数据
                            this.phase_type = ret.data.phase_type  // 阶段类型
                            this.total_phase = ret.data.total_phase // 总阶段数
                            this.title = ret.data.title // 带教模版名称
                            this.custom = false
                        })
                    } else {
                        // 自定义
                        this.goodsData = ret.data.objects
                        this.custom = true
                    }
                    console.log('是否自定义素材', this.custom)
                    this.loading = false
                })
            },
        },
        filters: {
            phaseType (val) {
                let map = {
                    1: '天',
                    2: '周',
                    3: '月'
                }
                return map[val]
            },
            phaseName (val) {
                let map = {
                    1: '必修课',
                    2: '选修课',
                    3: '阶段考试'
                }
                return map[val]
            },
            taskName (val) {
                let map = {
                    0: 'undefined',
                    1: 'private',
                    2: 'exam',
                    3: 'practice',
                    4: 'public',
                    5: 'teaching',
                    6: 'live_course'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
