import type { RouteRecordRaw } from 'vue-router'
import type { MenuData } from '~@/pages/common/type'

// 默认根路由调整地址
export const ROOT_ROUTE_REDIRECT_PATH = '/'

export const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'rootPath',
  redirect: ROOT_ROUTE_REDIRECT_PATH,
  component: () => import('~/layouts/root.vue'),
  children: [],
}

export const routeData: MenuData = [
  {
    'redirect': '',
    'path': '/dashboard',
    'component': 'layouts/RouteView',
    'route': '3',
    'meta': {
      'keepAlive': false,
      'internalOrExternal': false,
      'componentName': 'RouteView',
      'title': '数据统计',
    },
    'icon': 'DesktopOutlined',
    'name': 'dashboard',
    'id': '3',
    'title': '数据统计',
    'children': [
      {
        'path': '/dashboard/analytics',
        'component': 'dashboard/analytics/index',
        'route': '31',
        'meta': {
          'keepAlive': false,
          'internalOrExternal': false,
          'componentName': 'index',
          'title': '账目分析',
        },
        'icon': 'PieChartOutlined',
        'name': 'dashboard-analytics',
        'id': '31',
        'title': '账目分析',
      },
    ],
  },
]
