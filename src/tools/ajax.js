import cookie from './cookie'
import axios from 'axios'
// import qs from 'qs'
import store from '@/store'
import router from '@/router'
import { Message } from 'view-design'
import config from '@/config'

export const xhrs = []

// 请求超时时限单位毫秒
axios.defaults.timeout = 21000

// 请求出错后重试的次数
axios.defaults.retry = 1

// 请求出错后重试的间隙
axios.defaults.retryDelay = 1000

axios.defaults.baseURL = config.api
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// axios 默认是发送请求的时候不会带上 cookie 的，需要通过设置 withCredentials: true 来解决
// 这个时候需要注意需要后端配合设置：
// header 信息 Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin 需配置指定的地址，因为 '*' 会和 Access-Control-Allow-Credentials:true 冲突
// axios.defaults.withCredentials = true

const pendingXhrs = [] // 声明一个数组用于存储每个 ajax 请求的取消函数和标识
const removePending = (config, type) => {
  for (const n in pendingXhrs) {
    if (pendingXhrs[n].flag === config.method + ':' + config.ur) { // 当前请求在数组中时执行函数体
      type !== 'response' && pendingXhrs[n].abort() // 执行取消操作
      pendingXhrs.splice(n, 1) // 把这条记录从数组中移除
    }
  }
}

// 请求失败
const onfail = err => {
  // console.error('ajaxfail:' + err)
  const errmsg = err.message.toLocaleLowerCase()
  const isTimeout = errmsg.includes('timeout')
  const isCancel = errmsg.includes('cancel')
  const isAbort = errmsg.includes('abort')
  const config = { duration: 3 }

  if (isTimeout) {
    config.content = '请求超时，请检查网络后重试！'
  } else if (!isAbort && !isCancel) {
    config.content = '网络异常[' + errmsg + ']，请检查网络后重试'
  }

  Message.destroy()
  Message.error(config)
  // this.$stat.trackEvent('网络异常', errmsg) // 请求失败上报
}

// 添加请求拦截器
const CancelToken = axios.CancelToken
axios.interceptors.request.use(config => {
  // 请求头是添加登录验证
  config.headers.Token = cookie('token') || 'null' // 防止不传，被网关拦截，接口401

  // 格式化数据
  // if (['post', 'put'].includes(config.method)) {
  //   config.data = qs.stringify(config.data, {arrayFormat: 'brackets'})
  // }

  // 在一个 ajax 发送前取消前一个重复请求
  if (config.abortPrev) {
    removePending(config)
    config.cancelToken = new CancelToken(c => {
      // 这里的 ajax 标识我是用请求地址和请求方式拼接的字符串
      pendingXhrs.push({
        flag: config.method + ':' + config.ur,
        abort: c
      })
    })
  }

  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(res => {
  const config = res.config

  // 在一个 ajax 响应后再执行一下取消操作，把已经完成的请求从 pending 中移除
  if (config.abortPrev) {
    removePending(res.config, 'response')
  }

  return res
}, error => {
  // 请求超时的之后，抛出 error.code = ECONNABORTED 的错误..错误信息是 timeout of xxx ms exceeded
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    const config = error.config
    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= config.retry) {
      // window.location.reload()
      onfail(error)
      return Promise.reject(error)
    }

    // Increase the retry count
    config.__retryCount += 1

    // Create new promise to handle exponential backoff
    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, config.retryDelay || 1)
    })

    return backoff.then(() => {
      return axios(config)
    })
  } else {
    onfail(error)
    return Promise.reject(error)
  }
})

// Ajax 请求封装
export function ajax(opts) {
  return new Promise((resolve, reject) => {
    const cachekey = opts.cachekey
    const cacheData = cachekey ? this.session(cachekey) : null
    // 如果有缓存则使用缓存数据
    if (cacheData) {
      resolve(cacheData)
      return
    }

    const handle = res => {
      let data = res.data
      const code = (data.code + '' === '401' || data.code + '' === '10000004') ? '-1' : '0'
      const status = data.success ? '1' : data.message === '没有登录' ? '-1' : '0'
      // 未登录状态清除登录态并转到登录页
      if ((status === '-1' || code === '-1') && !opts.notCheckLogin) {
        // this.logout()
        // this.login()
        store.dispatch('handleLogOut').then(() => {
          router.push({
            name: 'login'
          })
        })
        return
      }

      // 处理二进进制流数据
      const responseType = opts.responseType || opts.dataType
      if (responseType === 'arraybuffer') {
        data = 'data:image/png;base64,' + btoa(
          new Uint8Array(data).reduce((d, byte) => d + String.fromCharCode(byte), '')
        )
      }

      // 有缓存配置则缓存数据
      if (opts.cachekey && status === '1') {
        this.session(opts.cachekey, data)
      }

      resolve(data)
    }

    const xhr = axios({
      ...opts,
      url: opts.url,
      method: opts.method || opts.type || 'get',

      // 将被添加到 url 前面，除非 url 是绝对的
      // baseURL: this.config.api,

      // 与请求一起发送的 URL 参数，必须是纯对象或 URLSearchParams 对象
      params: opts.params,

      // 作为请求主体发送的数据，仅适用于请求方法 PUT、POST 和 PATCH
      data: opts.data,

      // 服务器将响应的数据类型，包括：arraybuffer、blob、document、json、text、stream
      responseType: opts.responseType || opts.dataType || 'json',

      // headers,
      headers: opts.headers || { 'content-type': 'application/json' },

      // 文件上传进度
      onUploadProgress: opts.onUploadProgress,

      // withCredentials: opts.withCredentials || true, // 带 cookie 请求

      // 指定请求超时之前的毫秒数
      timeout: opts.timeout || axios.defaults.timeout
    }).then(handle).catch((err) => {
      // const res = err.response
      // const code = res.status
      opts.error && opts.error(err)
      // if (code === 403) { // 状态码403 跳转至登录页
      //   // 更新登录态
      //   store.dispatch('handleLogOut').then(() => {
      //     router.push({
      //       name: 'login'
      //     })
      //   })
      // }
      // console.log('网络异常: [' + err + ']')
      reject(err)
    })

    xhrs.push(xhr)
  })
}

// get 请求封装
export function get(url, params = {}, opts = {}) {
  return ajax.call(this, {
    ...opts,
    url,
    params,
    method: 'get'
  })
}

// post 请求封装
export function post(url, data = {}, opts = {}) {
  return ajax.call(this, {
    ...opts,
    url,
    // data: qs.stringify(data), // 将请求数据转换为 form-data 格式
    data: data,
    method: 'post',
    // headers: {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    headers: opts.headers || { 'content-type': 'application/json;charset=utf-8' }
  })
}
// put 请求封装
export function put(url, data = {}, opts = {}) {
  return ajax.call(this, {
    ...opts,
    url,
    // data: qs.stringify(data), // 将请求数据转换为 form-data 格式
    data: data,
    method: 'put',
    // headers: {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    headers: opts.headers || { 'content-type': 'application/json;charset=utf-8' }
  })
}

// delete 请求封装
export function del(url, data = {}, opts = {}) {
  return ajax.call(this, {
    ...opts,
    url,
    // data: qs.stringify(data), // 将请求数据转换为 form-data 格式
    data: data,
    method: 'delete',
    // headers: {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}
    headers: opts.headers || { 'content-type': 'application/json;charset=utf-8' }
  })
}

// 文件上传-支持批量上传，参数示例：{file: file/fileList}
export function upload(url, data = {}, opts = {}) {
  const fd = new FormData()

  // 将参数与文件添加到 formData 对象中
  for (const [key, value] of Object.entries(data)) {
    if (key === 'file') {
      if (Array.isArray(value)) {
        value.forEach(item => fd.append(item.name, item))
      } else {
        fd.append(value.name, value)
      }
    } else {
      fd.append(key, value)
    }
  }

  return ajax.call(this, {
    ...opts,
    url,
    // data: qs.stringify(data), // 将请求数据转换为 form-data 格式
    data: fd,
    method: 'post',
    // headers: opts.headers || {'content-type': 'multipart/multipart;charset=utf-8'}
    headers: opts.headers || { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })
}
