import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { logger } from '../utils/logger'
import { readJson } from '../utils/storage'

// 通用接口返回结构（根据你的后端规范适当调整）
export interface ApiResponse<T = unknown> {
  code?: number
  message?: string
  msg?: string
  data: T
}

// 统一错误结构，方便组件里捕获后展示
export interface HttpError extends Error {
  code?: number | string
  status?: number
  raw?: unknown
}

// 创建 Axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 在 .env 里配置 VITE_API_BASE_URL
  timeout: 10000,
  withCredentials: false,
})

// 请求拦截：统一加 token 等
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = readJson<string>('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    logger.error('请求错误：', error)
    return Promise.reject(error)
  },
)

// 响应拦截：统一处理返回数据 / 错误
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data

    // 如果你的后端有 code 约定，可以在这里统一判断
    if (typeof res.code === 'number' && res.code !== 0) {
      const msg = res.message || res.msg || '请求失败'
      logger.warn('业务错误：', res)

      const err: HttpError = new Error(msg)
      err.code = res.code
      err.raw = res
      return Promise.reject(err)
    }

    // 默认只把真正的 data 返回，调用方拿到的就是业务数据
    return (res.data ?? res) as unknown
  },
  (error) => {
    // 这里可以把网络错误 / 服务器错误也统一包装一下
    const err: HttpError = new Error('网络异常，请稍后重试')

    if (error.response) {
      err.status = error.response.status
      err.raw = error.response
    } else {
      err.raw = error
    }

    logger.error('响应错误：', error)
    return Promise.reject(err)
  },
)

// 通用请求方法：支持范型，方便推断返回类型
export function request<T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>,
): Promise<T> {
  return http.request<ApiResponse<T>, T>(config)
}

// 便捷方法：get / post / put / delete
export function get<T = unknown, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>,
): Promise<T> {
  return request<T, D>({ ...(config || {}), url, method: 'GET' })
}

export function post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
): Promise<T> {
  return request<T, D>({ ...(config || {}), url, data, method: 'POST' })
}

export function put<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
): Promise<T> {
  return request<T, D>({ ...(config || {}), url, data, method: 'PUT' })
}

export function del<T = unknown, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>,
): Promise<T> {
  return request<T, D>({ ...(config || {}), url, method: 'DELETE' })
}

export default http


