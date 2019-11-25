// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // change indent to 4 spaces
        'indent': ['error', 4],
        // 不是必须为 === 可以为 ==
        'eqeqeq': 0,
        // if 后面单行可以不用{} 多行必须用{}
        'curly': [0, 'multi'],
        // 可以使用拖尾逗号
        "comma-dangle": 0,
        // 不是必须使用驼峰命名
        'camelcase': 0,
        // 不允许使用逗号运算符（无序列）
        "no-sequences": 0
    },
    globals: {
        'xmview': true,
        'xmrouter': true,
        'xmconfig': true
    }
}

// 0 随意 1 警告 2 错误
