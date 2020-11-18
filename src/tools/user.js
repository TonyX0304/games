import cookie from './cookie'
import router from '@/router'
import store from '@/store'
// import * as api from '@/api'

// 用户是否登录
export function isLogin() {
  return !!cookie('token')
  // return !!cookie('username') && !!cookie('SID')
}

// 转到登录页
// export function login(redirect = store.state.route.query.redirect, type = 'push') {
//   router[type]({
//     name: 'login',
//     query: redirect ? { redirect: redirect } : {}
//   })
// }
export function login(type = 'push') {
  router[type]({
    name: 'login'
  })
}

// 检查是否已登录
export function checkLogin(onlogin) {
  if (!isLogin()) {
    login(onlogin)
  } else {
    onlogin()
  }
}

// 清除登录态
export function logout(callback = () => {}) {
  // api.logout()
  setLoginCookie({ username: '', expires: '', token: '' })
  cookie('token', '')
  callback()
}

// 设置登录态缓存
export function setLoginCookie({ username = '', expires = '', token = '' }) {
  let opts = { expires } // 天
  cookie('token', token)
  cookie('username', username, opts)
  store.commit('upLoginState') // 更新登录态
}
