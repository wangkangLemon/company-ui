export default class Step {
    getList() {
        let arr = []
        let a = [1,2,3]
        a.forEach(item => {
            let obj = {}
            obj.status = item
            obj.user_name = '审核中'
            obj.time = '2018-5-20 15:00'
            arr.push(obj)
        })
        return arr
    }
}