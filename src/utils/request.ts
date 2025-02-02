import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { ContentTypeEnum, RequestEnum } from '~#/http-enum'
import { REQUEST_HEADER_TOKEN_KEY, useAuthorization } from '~/composables/authorization'
import router from '~/router'
import { AxiosLoading } from './loading'
import { mockApi } from './mock-api'
import { ObjectDeleteEmptyProperty } from './tools'

export interface ResponseBody<T = any> {
  code: number
  message: string
  data?: T
  success: boolean
  timestamp: number
  error?: string
}

export interface RequestConfigExtra {
  token?: boolean
  customDev?: boolean
  loading?: boolean
}
function isMockApi(url: string) {
  if (!import.meta.env.VITE_APP_MOCK_API)
    return false
  return mockApi.includes(url)
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API ?? '/',
  timeout: 60000,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
})

const mockInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_MOCK_API,
  timeout: 60000,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
})

const axiosLoading = new AxiosLoading()
async function requestHandler(config: InternalAxiosRequestConfig & RequestConfigExtra): Promise<InternalAxiosRequestConfig> {
  const token = useAuthorization()

  if (token.value && config.token !== false)
    config.headers.set(REQUEST_HEADER_TOKEN_KEY, token.value)

  // 增加多语言的配置
  const { locale } = useI18nLocale()
  config.headers.set('Accept-Language', locale.value ?? 'zh-CN')
  if (config.loading)
    axiosLoading.addLoading()
  return config
}

function responseHandler(response: any): Promise<any> | any {
  // 导出处理
  if (response.data.size) {
    return response.data
  }
  else {
    const { code } = response.data
    if (code === 200 && response.data) {
      if (response.data.data && response.data.code === 200) {
        return response.data.data
      }
      return response.data
    }
    const notification = useNotification()
    notification?.error({
      message: '错误',
      description: response.data?.message,
      duration: 3,
    })
    return Promise.reject(response)
  }
}

function errorHandler(error: AxiosError): Promise<any> {
  const token = useAuthorization()
  const notification = useNotification()
  console.log('error', error)
  if (error.response) {
    const { data, status, statusText } = error.response as AxiosResponse<ResponseBody>

    if (status === 401) {
      notification?.error({
        message: '401',
        description: data?.message || statusText,
        duration: 3,
      })
      //  这里处理清空用户信息和token的逻辑，后续扩展
      token.value = null
      router
        .push({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        })
    }
    else if (status === 403) {
      notification?.error({
        message: '403',
        description: data?.message || statusText,
        duration: 3,
      })
    }
    else if (status === 400) {
      notification?.error({
        message: '400',
        description: data?.error || statusText,
        duration: 3,
      })
    }
    else if (status === 500) {
      notification?.error({
        message: '500',
        description: data?.message || statusText,
        duration: 3,
      })
    }
    else {
      notification?.error({
        message: '服务错误',
        description: data?.message || statusText,
        duration: 3,
      })
    }
  }
  return Promise.reject(error)
}
interface AxiosOptions<T> {
  url: string
  params?: T
  data?: T
}
instance.interceptors.request.use(requestHandler)

instance.interceptors.response.use(responseHandler, errorHandler)

mockInstance.interceptors.request.use(requestHandler)

mockInstance.interceptors.response.use(responseHandler, errorHandler)

export default instance
function instancePromise<R = any, T = any>(options: AxiosOptions<T> & RequestConfigExtra): Promise<R> {
  const { loading } = options
  const currentInstance = isMockApi(options.url) ? mockInstance : instance
  return currentInstance.request(options)
    .then(res => Promise.resolve(res as any))
    .catch((e: Error | AxiosError) => Promise.reject(e))
    .finally(() => loading && axiosLoading.closeLoading())
}
export function useGet<R = any, T = any>(url: string, params?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<R> {
  const options = {
    url,
    params: ObjectDeleteEmptyProperty(params),
    method: RequestEnum.GET,
    ...config,
  }
  return instancePromise<R, T>(options)
}

export function usePost<R = any, T = any>(url: string, data?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<R> {
  const options = {
    url,
    data,
    method: RequestEnum.POST,
    ...config,
  }
  return instancePromise<R, T>(options)
}

export function usePut<R = any, T = any>(url: string, data?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<R> {
  const options = {
    url,
    data,
    method: RequestEnum.PUT,
    ...config,
  }
  return instancePromise<R, T>(options)
}

export function usePatch<R = any, T = any>(url: string, data?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<R> {
  const options = {
    url,
    data,
    method: RequestEnum.PATCH,
    ...config,
  }
  return instancePromise<R, T>(options)
}
export function useDelete<R = any, T = any>(url: string, params?: T, data?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<R> {
  const options = {
    url,
    data,
    params,
    method: RequestEnum.DELETE,
    ...config,
  }
  return instancePromise<R, T>(options)
}

export function urlAddParam(url: string, params: Record<string, string | number | boolean>): string {
  let parameters = ''
  for (const key in params)
    parameters += `${key}=${encodeURIComponent(params[key])}&`

  parameters = parameters.replace(/&$/, '')
  return url.includes('?') ? `${url}&${parameters}` : `${url}?${parameters}`
}
