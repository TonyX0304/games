const path = require('path')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  // 设为 false 打包时不生成 .map 文件
  productionSourceMap: !isProd,

  // 如果你不需要使用 eslint，把 lintOnSave 设为 false 即可
  // lintOnSave: false,

  css: {
    // modules: true
    // 解决 iView 在自定义主题时报 Inline JavaScript is not enabled
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  configureWebpack: config => {
    // config.externals = {
    //   // vue: 'Vue',
    //   // vuex: 'Vuex',
    //   // 'vue-router': 'VueRouter',
    //   // 'axios': 'axios'
    //   // 'AMap': 'AMap'
    // }

    // 解决 iview 在 IE10 语法错误/IE11 SCRIPT1014 无效字符错误
    // config.module.rules.push({
    //   test: /iview.src.*?js$/,
    //   loader: 'babel-loader'
    // })
    config.module.rules.push({
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('node_modules/iview/src')]
    })

    // 修复 iview date.js 文件没有使用 es6-module 方式，webpack4 编译报错问题
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /node_modules(\/|\\)iview(\/|\\)src(\/|\\)utils(\/|\\)date\.js/,
        resolve('./hack/date.js')
      )
    )

    // 正式环境开启 gzip 压缩
    if (isProd) {
      const CompressionWebpackPlugin = require('compression-webpack-plugin')
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.(js|css)$/, // 匹配文件名
          threshold: 10240 // 对超过 10K 的数据进行压缩
        })
      )
    }
  },

  chainWebpack: config => {
    config.resolve.alias
      // .set('@', resolve('src'))
      .set('nib', 'nib/index.styl')
      .set('@@', resolve('src/components'))

    // 解决 iview IE11 报错无效字符
    // config.module
    //   .rule('iview')
    //   .test(/iview.src.*?js$/)
    //   .use('babel')
    //   .loader('babel-loader')
    //   .end()

    // config.module
    //   .rule('vue')
    //   .test(/\.vue$/)
    //   .use('iview-loader')
    //   .loader('iview-loader')
    //   .options({
    //     prefix: false
    //   })
  },

  // 这里写你调用接口的基础路径，来解决跨域
  devServer: {
    // open: process.platform === 'darwin',
    // host: '0.0.0.0',
    // port: 8080,
    // https: false,
    // hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:9527',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },

      // 阿里云附件反向代理
      // '/customerfile': {
      //   target: 'https://yungehuo.oss-cn-shenzhen.aliyuncs.com',
      //   changeOrigin: true
      // },
    }
  }
}
