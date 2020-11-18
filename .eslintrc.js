module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
// module.exports = {
//   root: true,
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
//   'extends': [
//     'plugin:vue/essential',
//     // 'plugin:vue/strongly-recommended',
//     '@vue/standard'
//   ],
//   rules: {
//     'generator-star-spacing': 'off', // allow async-await
//     'space-before-function-paren': 'off', // 关闭函数括号前的空格验证
//     'arrow-parens': 'off', // 不强制使用圆括号括住箭头函数参数
//     quotes: ['error', 'single'], // 强制使用单引号
//     semi: ['error', 'never'], // 强制结尾不使用分号
//     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'vue/no-parsing-error': [2, {
//       'x-invalid-end-tag': false
//     }],
//     'no-undef': 'off',
//     'camelcase': 'off'
//   }
// }