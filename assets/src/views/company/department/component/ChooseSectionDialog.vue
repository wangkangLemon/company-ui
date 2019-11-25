<template>
    <el-dialog title="选择上级部门" :visible.sync="department.operateTreeDialog">
        <CompanyTree 
            v-on:nodeClick="getParentTree"
            v-model="depTreeList"
            :isSelect="false"
            :operate="false"
            :isSearch="false">             
        </CompanyTree>
    </el-dialog>
</template>

<script>
    import CompanyTree from 'components/tree/CompanyTree.vue'
    export default {
        components: {
            CompanyTree,
        },
        props: {
            depTreeList: Object,
            department: Object,
        },
        methods: {
            // 获取上级部门信息
            getParentTree (data) {
                if (!data) return
                if (this.department.dialogShow) {
                    this.department.form.organization_name = data.name
                    if (data.type === 0) {
                        this.department.form.organization_id = 0
                    } else {
                        this.department.form.organization_id = data.id
                    }
                } else {
                    this.section.form.organization_name = data.name
                    if (data.type === 0) {
                        this.section.form.pid = 0
                    } else {
                        this.section.form.pid = data.id
                    }
                }
                this.department.operateTreeDialog = false
            },
        }
    }
</script>
