import type { RouteRecordRaw } from 'vue-router'
import type { MenuData, MenuDataItem } from '~@/pages/common/type'
import { cloneDeep, truncate } from 'lodash-es'

/**
 * 生成树结构的路由
 * @param menus 树结构菜单
 * @returns route信息
 */
export function generateTreeRoutes(menus: MenuData): {
  menuData: MenuData
  routeData: RouteRecordRaw[]
} {
  try {
    let menuData = cloneDeep(menus)
    // 组件地址前加斜杠处理
    menuData = _addSlashToRouteComponent(menuData)
    // 构建后台路由菜单
    menuData = _transformRouteToMenu(menuData)
    // 删除meta.ignoreRoute项
    menuData = menuData.filter(_routeRemoveIgnoreFilter)
    // 动态引入组件
    const routeList = _transformObjToRoute(menuData)
    return {
      menuData,
      routeData: routeList.filter(item => !item.path.includes('home')),
    }
  }
  catch (error) {
    console.log('generateTreeRoutes error', error)
    return {
      menuData: [],
      routeData: [],
    }
  }
}

const IFRAME = () => import('~@/layouts/components/iframe/blank.vue')
const LAYOUT = () => import('~@/layouts/index.vue')
let dynamicViewsModules: Record<string, () => Promise<any>>
export function _transformObjToRoute(routeList: MenuData): RouteRecordRaw[] {
  try {
    if (!dynamicViewsModules)
      dynamicViewsModules = import.meta.glob('../pages/**/*.{vue,tsx}')
  }
  catch (error) {
    console.log('dynamicViewsModules import error', error)
    return []
  }
  return routeList.map((item) => {
    if (!item.component)
      item.component = 'LAYOUT'

    const route: RouteRecordRaw = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: LAYOUT,
      children: [],
    }
    const meta = route.meta || {}
    meta.single = true
    meta.affix = false
    route.meta = meta
    if (item.children)
      route.children = _asyncImportRoute(item.children)

    return route
  })
}
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()
LayoutMap.set('LAYOUT', LAYOUT)
LayoutMap.set('IFRAME', IFRAME)
export const URL_HASH_TAB = `__AGWE4H__HASH__TAG__PWHRG__`
function _asyncImportRoute(
  routes: MenuData | MenuDataItem[],
): RouteRecordRaw[] {
  if (!routes)
    return []
  return routes.map((item) => {
    const { component, meta, hideInMenu, route } = item
    const routeMeta = meta || {}
    routeMeta.single = true
    routeMeta.affix = false
    if (hideInMenu)
      routeMeta.hideMenu = truncate

    if (route === 0)
      routeMeta.ignoreRoute = true

    let path = item.path || ''
    let routeComp = component || ''
    // 适配 iframe
    if (/^\/?https?/.test(component as string))
      routeComp = component.substring(1, component.length)
    if (/^\/?https?/.test(routeComp as string)) {
      if (meta?.internalOrExternal) {
        path = component
        // author:sun---date:20220408---for: 配置外部网址打不开，原因是带了#号，需要替换一下
        path = path.replace('#', URL_HASH_TAB)
      }
      else {
        routeMeta.frameSrc = component
      }
      routeComp = 'IFRAME'
    }
    const layoutFound = LayoutMap.get(routeComp.toUpperCase())
    const routeInfo: RouteRecordRaw = {
      path,
      name: item.name,
      redirect: item.redirect,
      component: layoutFound || dynamicImport(dynamicViewsModules, routeComp),
      children: [],
    }
    routeInfo.meta = meta
    if (item.children)
      routeInfo.children = _asyncImportRoute(item.children)

    return routeInfo
  })
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<any>>,
  component: string,
) {
  try {
    const notification = useNotification()
    const keys = Object.keys(dynamicViewsModules)
    const matchKeys = keys.filter((key) => {
      const k = key.replace('../pages', '')
      const startFlag = component.startsWith('/')
      const endFlag = component.endsWith('.vue') || component.endsWith('.tsx')
      const startIndex = startFlag ? 0 : 1
      const lastIndex = endFlag ? k.length : k.lastIndexOf('.')
      return k.substring(startIndex, lastIndex) === component
    })
    if (matchKeys?.length === 1) {
      const matchKey = matchKeys[0]
      return dynamicViewsModules[matchKey]
    }
    else if (matchKeys?.length > 1) {
      notification?.error({
        message: '路由错误',
        description:
          'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
        duration: 3,
      })
      return undefined
    }
  }
  catch (error) {
    console.log('dynamicImport error', error)
    return undefined
  }
}

// 将路由转换成菜单
function _transformRouteToMenu(routeModList: MenuData, routerMapping = false) {
  return routeModList.map((item) => {
    const { meta, children } = item
    const currentRoute = {
      ...item,
      meta: meta || {},
    }
    // 批量关闭面包屑导航
    currentRoute.hideInBreadcrumb = true
    currentRoute.title = meta?.title || (currentRoute.title as string)
    // 对路由项进行修改
    if (
      routerMapping
      && currentRoute.meta?.hideChildrenInMenu
      && typeof currentRoute.redirect === 'string'
    ) {
      currentRoute.path = currentRoute.redirect
    }
    if (children && children.length > 0 && meta?.single)
      return children[0]
    return currentRoute
  })
}
// 删除meta.ignoreRoute项
function _routeRemoveIgnoreFilter(route: MenuDataItem) {
  const { meta } = route
  const { ignoreRoute } = meta || {}
  return !ignoreRoute
}
// 组件地址前加斜杠处理
function _addSlashToRouteComponent(routeList: MenuData) {
  routeList.forEach((route) => {
    const component = route.component
    if (component)
      route.component = component.startsWith('/') ? component : `/${component}`

    route.children && _addSlashToRouteComponent(route.children)
  })
  return routeList
}
