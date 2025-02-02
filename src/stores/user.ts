import type { DictItem, MenuData, UserInfo } from '~@/pages/common/type'
import { updateUserData } from '~@/pages/common/login.api'
import { rootRoute, routeData } from '~@/router/constant'
import { generateTreeRoutes } from '~@/router/generate-route'
import { jwtParse } from '~@/utils/tools'

export const useUserStore = defineStore('user', () => {
  const routerData = shallowRef()
  const menuData = ref<MenuData>([])
  const userInfo = ref<UserInfo>()
  const token = useAuthorization()
  const avatar = computed(() => userInfo.value?.avatar)
  const nickname = computed(() => userInfo.value?.username)
  const roles = computed(() => userInfo.value?.roles)
  const sysDictItems = shallowRef<Record<string, DictItem[]>>({})
  // 获取系统改配置的字典项
  const getDictListByCode = computed(() => (code: string) =>
    sysDictItems.value[code] ?? [],
  )
  // 根据已有系统字典项展示名称值
  const renderDict = (value: string | number, code: string) => {
    if (value === null || value === undefined || value === '')
      return value
    const dictList = sysDictItems.value[code] ?? []
    return dictList.find(item => item.value.toString() === String(value))?.text ?? value
  }

  // const filterRoutesByPermissions = (permissions: any[]) => {
  //   const filteredRoutes = routeData.map((route) => {
  //     const newRoute = { ...route }
  //     if (newRoute.children) {
  //       newRoute.children = newRoute.children.filter((child) => {
  //         const permission = permissions.find(
  //           p =>
  //             String(p.resource).toLocaleLowerCase() === String(child.name).toLocaleLowerCase()
  //             && p.action === 'GET',
  //         )
  //         return permission !== undefined
  //       })
  //     }
  //     return newRoute
  //   })
  //   return filteredRoutes.filter(route => route.children && route.children.length > 0)
  // }

  // 获取菜单路由
  const getMenuRoutes = () => {
    return Promise.resolve(generateTreeRoutes(routeData))
    // return getRouteMenusApi().then((res: any[]) => {
    //   if (userInfo.value?.name === 'admin') {
    //     return generateTreeRoutes(routeData)
    //   }
    //   if (!res)
    //     throw new Error('获取菜单失败')
    //   return generateTreeRoutes(filterRoutesByPermissions(res))
    // })
  }

  // 生成动态路由
  const generateDynamicRoutes = () =>
    getMenuRoutes().then((routes) => {
      const { menuData: treeMenuData, routeData } = routes
      menuData.value = treeMenuData
      routerData.value = { ...rootRoute, children: routeData }
      return routerData.value
    })

  // 获取用户信息
  const getUserInfo = () => {
    const token = useAuthorization()
    const info = jwtParse(token.value || '')
    if (!info) {
      throw new Error('获取用户信息失败')
    }
    console.log('info', info)
    userInfo.value = info
  }
  // getUserInfoApi().then((res) => {
  //   if (!res.result)
  //     throw new Error('获取用户信息失败')
  //   userInfo.value = res.result.userInfo as UserInfo
  //   sysDictItems.value = res.result.sysAllDictItems as any
  // })

  const router = useRouter()
  const logout = () => {
    token.value = null
    userInfo.value = undefined
    routerData.value = undefined
    menuData.value = []
    router.push('/login')
  }

  const changePassword = (params: any) => {
    return updateUserData({
      ...userInfo.value,
      password: params.newPassword,
    })
  }

  return {
    userInfo,
    roles,
    getUserInfo,
    logout,
    routerData,
    menuData,
    generateDynamicRoutes,
    avatar,
    nickname,
    getDictListByCode,
    renderDict,
    changePassword,
  }
})
