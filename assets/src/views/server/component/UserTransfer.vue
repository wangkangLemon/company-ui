<template>
<Transfer placeholder="搜索用户"
    @searchFn="(val)=>{page=1;users=[]; keyword = val; getAllUsers();}"
    @moreFn="()=>{page++;getAllUsers();}" 
    :total="usersTotal" 
    :data="users" 
    v-model="selectData">
</Transfer>
</template>

<script>
import {userNameList} from 'services/userService'
import Transfer from 'components/dialog/Transfer'
export default {
    props: {
        value: {
            type: Array
        },
        department_id: {
            type: [Number, String]
        },
        isdata: {
            type: Boolean
        },
    },
    watch: {
        'value' (val) {
            this.selectData = val
        },
        'department_id' (val) {
            this.page = 1
            this.users = []
            this.getAllUsers()
        },
        'selectData' (val) {
            this.selectData = val
            this.$emit('input', this.selectData)
        },
        'isdata' (val) {
            if (val) {
                this.users = []
                this.keyword = ''
                this.getAllUsers()
            }
        }
    },
    data () {
        return {
            selectData: this.value,
            usersTotal: 10,
            page: 1,
            page_size: 15,
            users: [],
            keyword: ''
        }
    },
    created () {
        this.getAllUsers()
    },
    methods: {
        getAllUsers () {   // 获取员工
            return userNameList({
                type: 2,
                department_id: this.department_id,
                page: this.page,
                page_size: this.page_size,
                keyword: this.keyword
            }).then((ret) => {
                if (this.users.length > 0 && this.users.length < ret.total) {
                    this.users.splice(-1, 1)
                }
                this.users.push(...ret.data, {id: -1})
                this.usersTotal = ret.total
            })
        }
    },
    components: {
        Transfer
    }
}
</script>
