import http from '@/tools/index.js'

// 登录|get
export const getFolder = (params, config) => http.get('/api/folder', params, config)

// 获取|get
export const getMemberList = (params, config) => http.get('/find', params, config)

// 新增|post
export const insertMember = (params, config) => http.post('/insert', params, config)

// 删除|post
export const deleteMember = (params, config) => http.post('/delete', params, config)

