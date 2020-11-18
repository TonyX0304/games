export const inBrowser = typeof window !== 'undefined'
export const dpr = window.devicePixelRatio || 1
export const UA = window.navigator.userAgent.toLowerCase()
export const isWeixin = /MicroMessenger/i.test(UA)
export const isApp = /DaDaBusPassenger/i.test(UA)
export const isAndroid = UA.indexOf('android') > 0
export const isIOS = /iphone|ipad|ipod|ios/.test(UA)
export const isIE = /msie|trident/.test(UA)
export const isIE9 = UA.indexOf('msie 9.0') > 0
export const isEdge = UA.indexOf('edge/') > 0
export const isChrome = /chrome\/\d+/.test(UA) && !isEdge
export const isAndroidApp = isApp && isAndroid
export const isIosApp = isApp && isIOS

// 如果物理像素与实际像素相等，说明返回的值可能有误（比如某些三星手机）
export let screen = window.screen
if (screen.width === document.documentElement.clientWidth) {
  screen = {
    width: screen.width * dpr,
    height: screen.height * dpr
  }
} else {
  screen = {
    width: screen.width,
    height: screen.height
  }
}

// 设备信息
export let device = {
  UA,
  ua: UA,
  dpr,
  width: screen.width,
  height: screen.height,
  inBrowser,
  isWeixin,
  isApp,
  isAndroid,
  isIOS,
  isChrome,
  isIE,
  isIE9,
  isEdge,
  isAndroidApp,
  isIosApp
}

// 根据域名判断开发环境
export let envname = 'release' // 正式环境
export let subdomain = location.hostname.split('.')[0]
switch (subdomain) {
  case 'localhost':
  case 'loc':
  case 'dev': // 本地/开发环境
    envname = 'dev'
    break
  case 'test': // 测试环境
    envname = 'test'
    break
  case 'pre': // 预发布环境
    envname = 'pre'
    break
}
export let sld = envname === 'release' ? '' : envname + '.' // 二级域名（带.）
// export let host = location.host.replace('static.', '')
export let host = location.host

// 设备与环境信息
export default Object.assign({
  name: envname,
  host,
  subdomain,
  sld
}, device)
