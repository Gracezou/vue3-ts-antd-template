import { cloneDeep, get, has, isArray, isEmpty, isNumber, isObjectLike, isString } from 'lodash-es'
import type { BaseOptionType } from 'ant-design-vue/es/select'
import router from '@/router'

/**
 * 从url中获取参数的值
 * @param param 参数名
 * @param defaultVal 默认值
 * @returns 参数值
 */
export function getQueryParam(param: string | string[], defaultVal = '') {
  const query = router.currentRoute.value?.query ?? {}
  const val = get(query, param) ?? defaultVal
  return decodeURIComponent(val)
}

/**
 * 根据新对象的属性值，更新旧对象的属性值
 * @param oldObject 旧对象
 * @param newObject 新对象
 * @returns 修改后对象
 */
export function ObjectUpdateProperty<T extends object, K extends T>(oldObject: T, newObject: K) {
  for (const key in oldObject) {
    if (has(newObject, key))
      oldObject[key] = newObject[key]
  }
  return oldObject
}

/**
 * 将对象的属性值转换成对应类型的初始值，并返回新的对象
 * @param obj 目标对象 Object
 */
export function ObjectInitTransform(obj: any): any {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) => {
      switch (typeof obj[key]) {
        case 'number':
          obj[key] = 0
          break
        case 'string':
          obj[key] = ''
          break
        case 'object':
          // eslint-disable-next-line ts/no-unused-expressions
          Array.isArray(obj[key]) ? (obj[key] = []) : ObjectInitTransform(obj[key])
          break
        case 'boolean':
          obj[key] = false
          break
        default: {
          obj[key] = undefined
        }
      }
    })
  }
}

/**
 * 删除对象中的空属性
 * @param target 目标对象
 * @returns 返回删除空属性后的对象
 */
export function ObjectDeleteEmptyProperty<T>(target: T) {
  const result = cloneDeep(target)
  for (const key in result) {
    if (isObjectLike(result[key]) && isEmpty(result[key]))
      delete result[key]
    if (isString(result[key]) && result[key] === '')
      delete result[key]
    if (isNumber(result[key]) && result[key] === undefined)
      delete result[key]
    if (isArray(result[key]) && isEmpty(result[key]))
      delete result[key]
  }
  return result
}
/**
 *  将树结构数据转换成select组件需要的数据格式
 * @param list 需要转换的树结构数据
 * @param key 展示名称的字段
 * @param value 值的字段
 * @returns select组件需要的数据格式
 */
export function CovertTreeData<T extends { children?: T[] }>(list: T[], key: keyof T, value: keyof T): BaseOptionType[] {
  return list.map((item) => {
    return {
      title: item[key],
      value: item[value],
      key: item[value],
      children: item.children ? CovertTreeData<T>(item.children, key, value) : [],
    } as BaseOptionType
  })
}

/**
 *
 * @param param 手机号格式校验
 */
export function validatePhone(param: string) {
  const reg = /^1[3-9|]\d{9}$|^09\d{8}$/
  return reg.test(param)
}

/**
 * 限制输入两位小数
 * @param value
 */
export function formatNumber(value: string | number) {
  let valueKey = ''
  if (value !== null && value !== undefined) {
    valueKey = value.toString().replace(/[^0-9.]/g, '') // 去除非数字和小数点
    const parts = valueKey.split('.')
    if (parts.length > 1) {
      // 限制小数位数为两位
      parts[1] = parts[1].slice(0, 2)
    }
    valueKey = parts.join('.')
  }
  return valueKey
};

// jwt 令牌解析
export function jwtParse(token: string): any | undefined {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`
  }).join(''))

  return JSON.parse(jsonPayload)
}

export function downloadFile(data: Blob, fileName: string) {
  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
}

/**
 * 设置字符串首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 格式化数字 /100 且需要防止浮点数溢出
 * @param number 需要格式化的数字
 * @returns number
 */
export function formatPriceNumber(num: number | string) {
  return Math.round(Number(num)) / 100
}
