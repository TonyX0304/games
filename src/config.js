import { version } from '../package'
const isProd = process.env.NODE_ENV === 'production'
const online = location.hostname === 'admin.kuagejing.com'
let api = 'https://api-admin.kuagejing.com/'
const subdomain = location.hostname.split('.')[0]
switch (subdomain) {
  case 'dev': // 开发
  case 'localhost':
    api = 'localhost:9527'
    break
  case 'test-admin': // 测试环境
    api = 'http://test-admin.kuagejing.com/api/'
    break
  case 'pre-admin': // 预发布
    api = 'https://pre-admin.kuagejing.com/japi/'
    break
}
// 接口通用请求参数
export const params = {
  version,
  // mobile: '',
  // token: '',
  source: 4 // 请求来源：1-安卓，2-IOS，3-微信，4-webapp，5-wxapp
}

export default {
  title: 'test', // 配置显示在浏览器标签的title
  version,
  isProd,
  online,
  api,
  // homeName: 'account-page', // 默认打开的首页的路由 name 值，默认为 home
  cookieExpires: 1, // token 在 cookie 中存储的天数，默认1天
  // api 请求基础路径

  // 是否使用国际化，默认为 false
  // 不使用，则需要在路由中给需要在菜单中展示的路由设置 meta: {title: 'xxx'}
  useI18n: false,

  // 需要加载的插件
  plugin: {
    'error-store': {
      showInHeader: false, // 设为 false 后不会在顶部显示错误日志徽标
      developmentOff: true // 设为 true 后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
