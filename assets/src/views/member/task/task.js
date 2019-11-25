export default class Task {
    constructor (options = {}) {
        this.name = ''
        this.target_department_id = ''
        this.target_money = ''
        this.start_date = ''
        this.end_date = ''
        this.medicine_id = null
        this.medicines = []
        for (let [item, value] of Object.entries(options)) {
            this[item] = value
        }
        if (this.id) {
            this.initMedicine()
        }
    }
    initMedicine () {
        this.medicines = this.sale_task_medicines.map(item => {
            return {
                id: item.medicine_id,
                name: item.name
            }
        })
        this.cache_medicines = Object.assign([], this.medicines)
        this.medicine_id = this.sale_task_medicines.map(item => item.medicine_id)
    }
}
