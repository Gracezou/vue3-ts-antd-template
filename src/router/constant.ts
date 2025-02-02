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

  {
    'redirect': '',
    'path': '/bill',
    'component': 'layouts/RouteView',
    'route': '2',
    'meta': {
      'keepAlive': false,
      'internalOrExternal': false,
      'componentName': 'RouteView',
      'title': '账单管理',
    },
    'icon': 'DeploymentUnitOutlined',
    'name': 'bill',
    'id': '2',
    'title': '账单管理',
    'children': [
      {
        'path': '/bill/record',
        'component': 'bill/record/index',
        'route': '21',
        'meta': {
          'keepAlive': false,
          'internalOrExternal': false,
          'componentName': 'index',
          'title': '记录台账',
        },
        'icon': 'AccountBookOutlined',
        'name': 'bill-record',
        'id': '21',
        'title': '记录台账',
      },
      {
        'path': '/bill/bill',
        'component': 'bill/bill/index',
        'route': '22',
        'meta': {
          'keepAlive': false,
          'internalOrExternal': false,
          'componentName': 'index',
          'title': '账单记录',
        },
        'icon': 'FilePptOutlined',
        'name': 'bill-bill',
        'id': '22',
        'title': '账单记录',
      },
    ],
  },
  {
    'redirect': '',
    'path': '/resource',
    'component': 'layouts/RouteView',
    'route': '1',
    'meta': {
      'keepAlive': false,
      'internalOrExternal': false,
      'componentName': 'RouteView',
      'title': '资源管理',
    },
    'icon': 'CarOutlined',
    'name': 'resource',
    'id': '1',
    'title': '资源管理',
    'children': [
      {
        'path': '/resource/truck',
        'component': 'resource/truck/index',
        'route': '1',
        'meta': {
          'keepAlive': false,
          'internalOrExternal': false,
          'componentName': 'index',
          'title': '车辆台账',
        },
        'icon': 'CarOutlined',
        'name': 'resource-truck',
        'id': '11',
        'title': '车辆台账',
      },
      {
        'path': '/resource/item',
        'component': 'resource/item/index',
        'route': '1',
        'meta': {
          'keepAlive': false,
          'internalOrExternal': false,
          'componentName': 'index',
          'title': '类别台账',
        },
        'icon': 'GoldOutlined',
        'name': 'resource-item',
        'id': '12',
        'title': '类别台账',
      },
      {
        'path': '/resource/sub-account',
        'component': 'resource/sub-account/index',
        'route': '13',
        'meta': {
          'keepAlive': false,
          'internalOrExternal': false,
          'componentName': 'index',
          'title': '子账户管理',
        },
        'icon': 'GoldOutlined',
        'name': 'resource-sub-account',
        'id': '13',
        'title': '子账户管理',
      },
    ],
  },
]
