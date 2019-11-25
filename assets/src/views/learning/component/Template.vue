<style lang="scss">
    #learning-maps-template-container {
        .temp-info {
            position: relative;
            top: -51px;
            left: 29px;
            display: flex;
            align-items: center;
            .temp-img {
                width: 160px;
                height: 100px;
                display: inline-block;
                // border: 1px dashed red;
            }
            .temp-desp {
                margin-left: 16px;
            }
            .temp-title, .temp-p1 {
                margin-bottom: 10px;
            }
            .temp-p3 {
                color: #0aa8ef;
                cursor: pointer;
            }

        }
    }
</style>

<template>
    <main id="learning-maps-template-container">
        <el-dialog 
            v-if="showDialog"
            title="选择模版" 
            width="50%"
            :visible.sync="showDialog"
            @close="cancel">
            <section>
                  <i>分类</i>
                  <el-select clearable v-model="fetchParam.category_id" @change="fetchData">
                   <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                   </el-option>
                  </el-select>
                </section>
            <section v-loading="loading">
                <ul style="margin-top:60px;">
                    <li 
                        v-for="item in data"
                        :key="item.id"
                        class="">
                        <el-radio v-model="templateRadio" :label="item.id" :disabled="!item.is_free && !item.is_buy || (!!item.is_buy && !item.unused)">
                            <div class="temp-info">
                                <img v-if="item.image" class="temp-img" :src="item.image | fillImgPath" alt="">
                                <img v-else class="temp-img" src="~@/assets/images/default.png" alt="">
                                <div class="temp-desp">    
                                    <h3 class="temp-title">{{item.title}}</h3>
                                    <p class="temp-p1">
                                        <span>周期数：{{item.total_phase}}</span>
                                        <span>周期单位: {{item.phase_unit}}</span>
                                        <span>任务数: {{item.total_object}}</span>
                                    </p>
                                    <template v-if="item.is_free">
                                        <p class="temp-p2">免费使用</p>
                                    </template>
                                    <template v-else>
                                        <span v-if="item.is_buy">
                                            <span>可发放{{item.unused}}人</span>
                                            <span>已发放{{item.used}}人</span>
                                        </span>
                                        <span
                                            class="temp-p3" 
                                            @click="$router.push({name: 'store-list', query: { id: item.id }})">
                                            {{item.is_buy ? '再次' : '立即'}}购买
                                        </span>
                                    </template>
                                </div>
                            </div>
                        </el-radio>
                    </li>
                </ul>
                <el-pagination 
                    class="block"
                    @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                    @current-change="val=> {fetchParam.page=val; fetchData()}"
                    :current-page="fetchParam.page"
                    :page-size="fetchParam.page_size"
                    :page-sizes="[3, 4, 5]"
                    layout="sizes, total, prev, pager, next" 
                    :total="total">
                </el-pagination>
            </section>
            <span slot="footer">
                <el-button type="primary" @click="submit">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    import teachingService from 'services/learning/teaching'
    export default {
        components: {},
        props: {
            visible: Boolean,
        },
        activated () {},
        created () {
            this.fetchData()
            this.getSelectData()
        },
        mounted () {},
        computed: {},
        watch: {
            visible (val) {
                this.showDialog = val
            },
            showDialog (val) {
                this.$emit('update:visible', val)
            }
        },
        data () {
            return {
                options:[],
                loading: false,
                templateRadio: '',
                showDialog: this.visible,
                data: [],
                total: 0,
                fetchParam: {
                    type: 'teaching',
                    page: 1,
                    page_size: 3,
                    category_id:''
                },
                selectData:{
                    keyword:'',
                    page:'',
                    page_size:'9999999999'
                }
            }
        },
        methods: {

            fetchData () {
                this.loading = true
                teachingService.searchTeachingTemp(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            getSelectData(){
               return teachingService.getMapTypeList(this.selectData).then(ret=>{
                   this.options=ret.data
               })
            },
            submit () {
                if (!this.templateRadio) return
                this.$emit('submit', this.templateRadio)
            },
            cancel () {
                this.showDialog = false
                this.$emit('cancel')
            }
        },
        filters: {},
        directives: {},
    }
</script>
