// import config, { params } from './config'
import config, { params } from '@/config'
import env, { device } from './env'
import { getParam, setParam, delParam, setParams, getQuery } from './location'
import cookie from './cookie'
import { store, session } from './storage'
// import { loading, hideLoading, alert, toast, confirm, tips, notify } from './ui'
import { ajax, get, post, put, del, upload, xhrs } from './ajax'
// import user, {logined, login, logout} from './user'
import { isLogin, login, logout, checkLogin, setLoginCookie } from './user'
import * as dom from './dom'
import * as util from './util'

// 通用工具函数库
let wjtools = {
  // 通用配置
  version: config.version,
  config,
  params,

  // 环境变量
  env,
  device,

  // 通用工具
  noop: util.noop,
  util,

  // 常用工具
  getParam,
  setParam,
  delParam,
  setParams,
  getQuery,

  // 数据存储
  cookie,
  store,
  session,

  // UI 组件
  // loading,
  // hideLoading,
  // alert,
  // toast,
  // confirm,
  // tips,
  // notify,

  // ajax
  ajax,
  get,
  post,
  put,
  del,
  upload,
  xhrs,

  // 用户相关
  isLogin,
  login,
  logout,
  checkLogin,
  setLoginCookie,

  // 微信相关
  // getWxCode,

  // hack
  // setTitle,

  // 扩展属性/方法
  extend(obj) {
    return util.deepClone(this, obj)
  }
}

// 扩展 DOM 方法
wjtools.extend(dom)

export default wjtools
