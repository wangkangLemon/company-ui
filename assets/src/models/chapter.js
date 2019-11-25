/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/6
 * Time: 上午11:12
 */

class Chapter {
    constructor () {
        this.id = 0
        this.name = ''
        this.sort = 0
        this.deleted = false
        this.lessons = []
    }

    /**
     * @param Lesson lesson
     */
    addLesson (lesson) {
        this.lessons.push(lesson)
    }
}

export default Chapter
