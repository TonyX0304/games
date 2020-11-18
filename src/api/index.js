import http from '@/tools/index.js'

// 登录|post
export const getFolder = (params, config) => http.post('/folder', params, config)

