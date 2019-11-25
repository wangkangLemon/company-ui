/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/2
 * Time: 上午11:27
 */

class Option {
    constructor () {
        this.id = 0
        this.sort = 0
        this.description = ''
        this.correct = 0
    }

    get correctName () {
        if (this.correct == 0) {
            return '错误'
        } else {
            return '正确'
        }
    }
}

export default Option
