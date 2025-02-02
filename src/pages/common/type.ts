import type { VNodeChild } from 'vue'
import type { RouteMeta } from 'vue-router'

export interface LoginParams {
  tel: string
  password: string
}

export interface LoginResultModel {
  token: string
}

export interface RoleInfo {
  roleName: string
  value: string
}

export interface DictItem {
  value: string
  text: string
  label: string
  title: string
}
export interface User {
  id: string
  username: string
  realname: string
  avatar: string
  birthday: string
  sex: number
  email: string
  phone: string
  orgCode: string
  loginTenantId: number
  orgCodeTxt: string | null
  status: number
  delFlag: number
  workNo: string
  post: string
  telephone: string | null
  createBy: string | null
  createTime: string
  updateBy: string
  updateTime: string
  activitiSync: number
  userIdentity: number
  departIds: string
  relTenantIds: string
  clientId: string | null
  homePath: string | null
  postText: string | null
  bpmStatus: string | null
  delTime: number
}

export interface GetUserInfoModel {
  roles: RoleInfo[]
  // 用户id
  userId: string | number
  // 用户名
  username: string
  // 真实名字
  realname: string
  // 头像
  avatar: string
  // 介绍
  desc?: string
  // 用户信息
  userInfo?: UserInfo
  // 缓存字典项
  sysAllDictItems?: Record<string, DictItem>
}

export type MenuData = MenuDataItem[]

export interface MenuDataItem {
  // 唯一id
  id?: string | number
  // 标题
  title: string | (() => VNodeChild)
  // 图标
  icon?: string | (() => VNodeChild)
  // 地址
  path: string
  // 绑定的哪个组件
  component?: any
  // 子集菜单
  children?: MenuDataItem[]
  // 重定向地址
  redirect?: string
  // 哪些是固定页签
  affix?: boolean
  // 父级菜单的id
  parentId?: string | number | null
  // 同路由中的name，主要是用于保活的左右
  name?: string
  // 是否隐藏当前菜单
  hideInMenu?: boolean
  // 如果使用了隐藏，那么点击当前菜单的时候，可以使用父级的key
  parentKeys?: string[]
  // 是否套用iframe
  isIframe?: boolean
  // 如果当前是iframe的模式，需要有一个跳转的url支撑，其不能和path重复，path还是为路由
  url?: string
  // 是否存在面包屑
  hideInBreadcrumb?: boolean
  // 是否需要显示所有的子菜单
  hideChildrenInMenu?: boolean
  // 是否保活
  keepAlive?: boolean
  // 这里包含所有的父级元素
  matched?: MenuDataItem[]
  // 全连接跳转模式
  target?: '_blank' | '_self' | '_parent'
  // 多语言配置
  locale?: string
  // 路由信息
  meta?: RouteMeta
  // 别名
  alias?: string | string[]
  // 路由层级
  route: number | string
}

// 先定义单个权限项的类型
interface AuthItem {
  action: string
  describe: string
  type: string
  status: string
}

// 定义所有权限项的类型
interface Auth {
  allAuth: AuthItem[]
  auth: AuthItem[]
}
// 定义系统安全模式的类型
interface SysSafeMode {
  sysSafeMode: boolean
}

export interface PermissionResultModel extends Auth, SysSafeMode {
  menu: MenuData
}

export interface UserInfo {
  id: number | string
  userNo: string
  username: string
  gender: string | null
  tel: string
  role: string
  status: string | null
  exp: number
  avatar: string
  roles?: (string | number)[]
}
export interface UserResult {
  userInfo: UserInfo
  sysAllDictItems: Record<string, DictItem[]>
}

export interface DictItem {
  label: string
  text: string
  title: string
  value: string
}
