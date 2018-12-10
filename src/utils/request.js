import axios from 'axios'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 3000 // 请求超时时间
})

service.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
service.defaults.withCredentials = true


export default service
